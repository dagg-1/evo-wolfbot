// Wolfbot

const token = require("./token.json")
const prefixConfig = require("./prefix.json")

const Discord = require("discord.js")
const request = require("request")
const randomcolour = require('randomcolor')

const client = new Discord.Client()
const prefix = prefixConfig.prefix

const wolfPhrase = [
    "A wolf wanders towards you",
    "A wolf leaps in",
    "You spot a wolf",
    "A wolf spots you",
    "A wolf finds you",
    "You find a wolf",
    "A wolf flies in",
    "What's this? A wolf?",
    "A wolf has manifested",
    "Wolf#" + Math.floor(Math.random() * 10000) + " has joined your party"
]

client.login(token.token)

client.on("ready",  z => { console.log("Logged in.") })

client.on("message", message => {
    const arguments = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmdContent = arguments.shift().toLowerCase();

    const filter = (reaction, user) => { return reaction.emoji.name == '▶' && user.id == message.author.id || reaction.emoji.name == '⏹' && user.id == message.author.id}
    switch(cmdContent)
    {
        case "wolf":
            wolf()
            function wolf()
            {
                request("https://dagg.xyz/randomwolf", { json: true }, (error, response, body) => {
                    let embed = new Discord.RichEmbed()
                    .setImage(body.link)
                    .setColor(randomcolour())
                    .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL)
                    .setDescription(wolfPhrase[Math.floor(Math.random() * wolfPhrase.length)])
                    message.channel.send(embed)
                    .then(message => {
                        const collector = message.createReactionCollector(filter, { time: 60000 })
                        collector.on('collect', reaction => {
                            switch (reaction.emoji.name)
                            {
                                case "▶":
                                    message.delete()
                                    wolf()
                                    break
                                case "⏹":
                                    message.delete()
                                    break
                            }
                        })
                        message.react("▶")
                        .then(z => {
                            message.react("⏹")
                        })
                    })
                })
            }
            break
        case "fox":
            message.channel.send("You're lucky I can't ban you.")
            break
    }
})