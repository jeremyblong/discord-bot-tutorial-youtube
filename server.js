const express = require("express");
const { Connection } = require("./mongoUtil.js");
const app = express();
const config = require("config");
const cors = require("cors");
const axios = require("axios");
const { Client, GatewayIntentBits } = require("discord.js");
const { OpenAI } = require("openai");
const openAISearch = require("./commands/aiChat");
const googleSearch = require("./commands/search");
const User = require("./schemas/auth/saveNewUser.js");
 
const PORT = 8000;

app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(express.urlencoded({ limit: "500mb", extended: true }))

Connection.open();

const openAIApiKey = config.get("openAIApiKey");

const openai = new OpenAI({ apiKey: openAIApiKey });

app.get("/", (req, res) => {
    res.send(`<a href="https://discord.com/oauth2/authorize?client_id=${config.get("discordClientID")}&redirect_uri=${encodeURIComponent(config.get("redirectURI"))}&response_type=code&scope=identify%20guilds.join">Join Discord Server</a>`);
});

app.get("/auth/discord", async (req, res) => {
    console.log("req.query", req.query);

    const { code } = req.query;

    if (!code) {
        return res.send("No code provided");
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: config.get("discordClientID"),
            client_secret: config.get("discordClientSecret"),
            grant_type: "authorization_code",
            code: code,
            redirect_uri: config.get("redirectURI")
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

        const accessToken = tokenResponse.data.access_token;

        // Fetch user info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userId = userResponse.data.id;

        // Add user to Discord Server
        await axios.put(`https://discord.com/api/guilds/${config.get("discordGuildID")}/members/${userId}`, 
            { access_token: accessToken }, 
            { headers: { Authorization: `Bot ${config.get("discordBotToken")}`, "Content-Type": "application/json" } }
        );

        res.send("✅ You have joined the server!");
    } catch (error) {
        console.error("OAuth2 Error:", error.response ? error.response.data : error.message);
        res.send("❌ Error during authentication. Check the console.");
    }
})

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
})

client.login(config.get("discordBotToken"))

client.once("ready", () => {
    console.log("The client (discord) is ready...");
})

client.on("guildMemberAdd", async (member) => {
    try {
        const collection = Connection.db.db("db").collection("users");

        const existingUser = await collection.findOne({ discordId: member.id });

        if (existingUser) return;

        const newUser = new User({
            discordId: member.id,
            username: member.user.username,
            discriminator: member.user.discriminator
        })

        newUser.save();
    } catch (error) {
        console.log("error", error);
    }
})

client.on("messageCreate", async (message) => {
    const contentMsg = message.content.toLowerCase();
    const bannedWords = ["pinapple", "frog"];

    if (message.author.bot) return;
    if (bannedWords.some((word) => contentMsg.includes(word))) {
        await message.delete(); 

        message.channel.send("Please do not use foul or wrong language, try again...");
    }
    
    if (message.content.startsWith("!chat")) {
        console.log("do something");
        const query = message.content.replace("!chat", "").trim();

        const chatgptResponse = await openAISearch(query, openai);

        message.reply(chatgptResponse);
    } else if (message.content.startsWith("!search")) {
        console.log("search");

        const query = message.content.replace("!search", "").trim();
        if (!query) {
            return message.reply("Please provide a search query term!");
        }
        try {
            const searchResult = await googleSearch(query);
            message.reply(searchResult);
        } catch (error) {
            console.log("error", error);
        }
    }
})

app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
})