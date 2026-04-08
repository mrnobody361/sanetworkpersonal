require('dotenv').config();
const mongoose = require('mongoose');
const client = require('./bot'); // Removed '/bot' folder path
const app = require('./server'); // Removed '/web' folder path

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✈️ Star Alliance Database Connected (Flat Mode)");
        client.login(process.env.BOT_TOKEN);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🌐 Dashboard active on port ${PORT}`));
    })
    .catch(err => console.error("Database connection failed", err));
