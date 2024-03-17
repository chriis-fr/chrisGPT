const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');

const genAI = new GoogleGenerativeAI(process.env.GAPI_KEY);
let conversationHistory = [];
let chat = null;

module.exports = async (req, res) => {
    console.log(req.body);
    try {
        let userMsg = req.body.message;

        if (!chat) {
            // Create a new chat session if it doesn't exist
            chat = await createChat();
        }

        const result = await chat.sendMessage(userMsg, { role: "user" });
        const response = await result.response;
        const currentResponseText = await response.text();

        const responseId = uuidv4();
        conversationHistory.push({ role: 'user', content: userMsg });
        conversationHistory.push({ id: responseId, role: 'assistant', content: currentResponseText });

        res.json({ text: currentResponseText, id: responseId });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" })
    }
};

async function createChat() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: conversationHistory,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });

    return chat;
}
