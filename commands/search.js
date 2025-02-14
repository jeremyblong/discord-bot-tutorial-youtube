const config = require("config");
const axios = require("axios");

const googleSearch = async (searchQueryTerm) => {
    const apiKey = config.get("serpaKey");

    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(searchQueryTerm)}&api_key=${apiKey}`;

    const response = await axios.get(searchUrl);
    const results = response.data.organic_results;

    console.log("results", results);

    if (!results || results.length === 0) return "No search results found";

    return `**${results[0].title}\n${results[0].link}\n${results[0].snippet}`;
};

module.exports = googleSearch;
