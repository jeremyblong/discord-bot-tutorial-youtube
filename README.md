# 🤖 AI-Powered Discord Bot Tutorial

Welcome to this **step-by-step educational project** where we build a powerful AI-enhanced Discord bot using modern tools like **Node.js**, **Express**, **MongoDB**, **SerpAPI**, and **OpenAI (ChatGPT)**.

🔗 **GitHub Repo**: [discord-bot-tutorial-youtube](https://github.com/jeremyblong/discord-bot-tutorial-youtube.git)  
📺 **Watch the Full Video Tutorial**: [YouTube Demo](https://youtu.be/6lc0S2d66gA)  
🧠 **Tech Stack**: Node.js • Express • MongoDB • OpenAI • SerpAPI

---

## 🚀 Features

✅ **AI-Powered Responses**  
- Real-time conversational replies via ChatGPT (OpenAI API)

✅ **Web Search Capability**  
- Uses SerpAPI to pull live Google search results into Discord

✅ **Auto-Moderation**  
- Filters and deletes inappropriate/foul language

✅ **User Join Tracker + MongoDB**  
- Saves user info when they join your server (via webhook/endpoint)

✅ **Custom AI Personalities**  
- Modify prompts to create a themed bot personality

---

## 📷 Demo Preview

[![Watch the Demo](https://blockchainsocialmedia.s3.us-east-1.amazonaws.com/Screenshot+2025-05-27+150631.png)](https://youtu.be/6lc0S2d66gA)

---

## 🛠 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/jeremyblong/discord-bot-tutorial-youtube.git
cd discord-bot-tutorial-youtube

# Install dependencies
npm install

# Edit the /config/default.json file and add relevant keys:
{
    "mongoURI": "",
    "discordClientID": "",
    "discordClientSecret": "",
    "redirectURI": "http://localhost:8000/auth/discord",
    "discordGuildID": "",
    "openAIApiKey": "",
    "serpaKey": "",
    "discordBotToken": ""
}

# Run the bot
npm start
