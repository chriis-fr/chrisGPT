const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const { restart } = require("nodemon");

const app = express();
const port = process.env.PORT;

// Custom CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chrisgpt-alpha.vercel.app/', 'http://localhost:3000' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GAPI_KEY);

let conversationHistory = [];
let chat = null;

app.post('/chat', async (req, res) => {
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
});

app.post('/reset', async (req, res) => {
    try {
        conversationHistory = [];
        chat = null;

        await restart()
        res.json({ message: "Server reset successsful" })
    } catch (error) {
        console.error('Error during server reset:', error);
        res.status(500).json({ error: 'Server reset failed' })
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    console.log(conversationHistory)
})

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
