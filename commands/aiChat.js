
const openAISearch = async (query, openai) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: "You are a helpful AI assistant" }, { role: "user", content: query }],
        max_tokens: 100
    });

    console.log("response.data", response);
    
    return response.choices[0].message.content;
};

module.exports = openAISearch;