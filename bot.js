const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const User = require('./User'); // Points to User.js in the same folder

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const commands = [
    new SlashCommandBuilder().setName('passport').setDescription('View your status card.'),
    new SlashCommandBuilder()
        .setName('log-flight')
        .setDescription('Staff: Log a member flight')
        .addUserOption(o => o.setName('passenger').setDescription('User').setRequired(true))
        .addStringOption(o => o.setName('flight').setDescription('Flight #').setRequired(true))
        .addIntegerOption(o => o.setName('dist').setDescription('Distance (miles)').setRequired(true))
        .addStringOption(o => o.setName('class').setDescription('Cabin').setRequired(true)
            .addChoices(
                { name: 'Economy (100%)', value: '1' },
                { name: 'Business (200%)', value: '2' },
                { name: 'First (300%)', value: '3' }
            ))
];

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'passport') {
        const u = await User.findOne({ discordId: interaction.user.id });
        if (!u) return interaction.reply("Join the alliance by booking your first flight!");

        const embed = new EmbedBuilder()
            .setTitle(`Star Alliance Passport: ${u.tier}`)
            .setDescription(`**Award Miles:** ${u.awardMiles}\n**Status Miles:** ${u.statusMiles}`)
            .setColor(u.tier === 'GOLD' ? 0xd4af37 : 0x002b5c);
        interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === 'log-flight') {
        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) return interaction.reply("Staff only.");

        const multiplier = parseInt(interaction.options.getString('class'));
        const earned = interaction.options.getInteger('dist') * multiplier;

        let user = await User.findOneAndUpdate(
            { discordId: interaction.options.getUser('passenger').id },
            { 
                $inc: { awardMiles: earned, statusMiles: earned },
                $set: { username: interaction.options.getUser('passenger').username },
                $push: { flightHistory: { airline: interaction.guild.name, flightNo: interaction.options.getString('flight'), milesEarned: earned } }
            },
            { upsert: true, new: true }
        );

        if (user.statusMiles >= 50000) user.tier = 'GOLD';
        else if (user.statusMiles >= 20000) user.tier = 'SILVER';
        await user.save();

        interaction.reply(`Success. ${user.username} is now **${user.tier}** with ${user.statusMiles} Status Miles.`);
    }
});

module.exports = client;
