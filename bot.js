const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!";
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

    
client.on("message", (message) => {
    
   if (message.content.startsWith("#new")) {
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`لا يوجد رتبة Support Team`);
        if (message.guild.channels.exists("name", "ticket-{message.author.id}" + message.author.id)) return message.channel.send(`لديك تكت بالفعل.`);
        message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
            let role = message.guild.roles.find("name", "Support Team");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: تم صنع التكت, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`هلا ${message.author.username}!`, `تم صنع التكت يرجى الانتظار.`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); 
    }


  if (message.content.startsWith("اغلاق")) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`لا يمكنك استخدام هذا الامر خارج التكت.`);

        message.channel.send(`هل انت متأكد من انك تريد حذف التكت؟ اكتب `نعم` لاغلاق التكت.`)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === 'نعم', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('انتهى الوقت, لن تنغلق التكت').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

});



client.login(process.env.BOT_TOKEN);
