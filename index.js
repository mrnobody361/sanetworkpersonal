require('dotenv').config();
const mongoose = require('mongoose');
const client = require('./bot/bot');
const app = require('./web/server');

// 1. Connect Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✈️ Star Alliance Database Connected");
        
        // 2. Start Discord Bot
        client.login(process.env.BOT_TOKEN);

        // 3. Start Dashboard Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🌐 Alliance Dashboard live on port ${PORT}`));
    })
    .catch(err => console.error("Database initialization failed:", err));