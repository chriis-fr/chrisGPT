const { restart } = require("nodemon");

module.exports = async (req, res) => {
    try {
        conversationHistory = [];
        chat = null;

        await restart();
        res.json({ message: "Server reset successsful" });
    } catch (error) {
        console.error('Error during server reset:', error);
        res.status(500).json({ error: 'Server reset failed' });
    }
};