// Line below allows this to be running 24/7
const keepAlive = require("./server.js")
// Token hidden, courtesy of repl.it
const tooken = process.env['TOKEN']
const Discord = require("discord.js")
const { MessageActionRow, MessageButton } = require('discord.js');
const intents  = new Discord.Intents(32767)
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: intents});
const prefix = '*';
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: "ping", 
    description: "Ping Pong!"
  },
  {
      name: "advice", 
      description: "Life Advice"
  },
  {
    "name": "mute", 
    "description": "Mute a player",  
    "options": [
      {
        "name": "user", 
        "description": "user to mute", 
        "type": 6, 
        "required": true
      },
      {
        "name": "time", 
        "description": "How long to mute the user for", 
        "type": 3, 
        "required": true
      }
    ]
  },
  {
    "name": "calculate", 
    "description": "Divide or multiply", 
    "options":[
      {
        "name": "digit1", 
        "description": "First Digit To Multiply or Divide", 
        "type": 3, 
        "required": true
      },
      {
        "name": "type", 
        "description": "Multiply or Divide", 
        "type": 3, 
        "required": true, 
        "choices":[
          {
            "name": "Multiply",
            "value": "multiply"
          },
          {
            "name": "Divide",
            "value": "divide"
          }
        ]
      },
      {
        "name": "digit2", 
        "description": "Second Digit To Multiply or Divide", 
        "type": 3, 
        "required": true
      }
    ]
  },
  {
    "name": "kick",
    "description": "Kick a player",
    "options":[
      {
        "name": "user",
        "description": "user to kick",
        "type": 6,
        "required": true
      }
    ]
  },
  {
    "name": "ban",
    "description": "Ban a player",
    "options":[
      {
        "name": "user",
        "description": "user to ban",
        "type": 6,
        "required": true
      }
    ]
  },
  {
    "name": "unmute",
    "description": "Unmute a player",
    "options":[
      {
        "name": "user",
        "description": "user to unmute",
        "type": 6,
        "required": true
      }
    ]
  },
  {
      "name": "temp",
      "description": "temp"
  },
  {
      "name": "ssu",
      "description": "Start a SSU"
  }
]
// Place your client and guild ids here
const clientId = '898253352071229480';
const guildId = '910588851049865217';


const rest = new REST({ version: '9' }).setToken(tooken);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),{ body: commands }
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('ready', () =>{
  console.log('Authed for user', client.user.username);
  client.user.setActivity("Slash Commands");
})

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Line below allows this to be running 24/7
keepAlive()

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
  if (interaction.commandName === 'ping') {
    const ping = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('ping')
					.setLabel('Pong!')
					.setStyle('DANGER')
          .setDisabled(true)
          .setEmoji('🏓'),
			);
    await interaction.reply({ content: "Ping!", components: [ping] });
  } else if (interaction.commandName === 'advice') {
    await interaction.reply({ content: 'Don\'t eat yellow coloured snow', ephemeral: true });
  } else if (interaction.commandName === 'mute') {
    if (interaction.member.permissions.has('MUTE_MEMBERS')) {
      const user = interaction.options.getUser('user');
      const time = interaction.options.getString('time');
      try {
        if(interaction.member.permissions.has("MUTE_MEMBERS")){
        const ms = require('ms');
        const target = user
        if(target){
          let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

          let memberTarget = interaction.guild.members.cache.get(target.id);
         
       
           memberTarget.roles.add(muteRole.id);
           interaction.reply(`<@${memberTarget.user.id}> has been muted for ${ms(ms(time))}`);

           setTimeout(function () {
           memberTarget.roles.remove(muteRole.id);
           }, ms(time));

       
       
          } else{
            interaction.reply('You cannot mute that member!');
          }
        } else{
          interaction.reply('You can not mute people!');
        }
      } catch(err) {
        interaction.reply('Error');
      }
    } else {
      interaction.reply('You do not have permission to use this command')
    }
  } else if (interaction.commandName === 'calculate') {
    const choice = interaction.options.getString('type')
    const digit1 = interaction.options.getString('digit1')
    const digit2 = interaction.options.getString('digit2')
    if (choice === 'multiply') {
      let x = myFunction(digit1, digit2)
      function myFunction(a, b) {
      
        interaction.reply({ content: `${a} x ${b} = ${a * b}` })
      }
    } else if (choice === 'divide') {
      let x = myFunction(digit1, digit2)
      function myFunction(a, b) {
      
        interaction.reply({ content: `${a} ÷ ${b} = ${a / b}` })
      }
    } else {
      message.channel.send('Do =calculate number \`/ or x(x = multiply, / = divide)\` number');
    }
  } else if (interaction.commandName === 'kick') {
    if(interaction.member.permissions.has("KICK_MEMBERS")){
      const user = interaction.options.getUser('user');
      const member = user
      if(member){
       const memberTarger = interaction.guild.members.cache.get(member.id);
       memberTarger.kick();
       interaction.reply(`<@${memberTarger.user.id}> has been kicked!`);
      }else{
        interaction.reply('You cannot kick that member!');
      }
    }else{
      interaction.reply('You do not have permission to kick!')
    }
  } else if (interaction.commandName === 'ban') {
    if(interaction.member.permissions.has("BAN_MEMBERS")){
      const user = interaction.options.getUser('user');
      const member = user
      if(member){
       const memberTarger = interaction.guild.members.cache.get(member.id);
       memberTarger.kick();
       interaction.reply(`<@${memberTarger.user.id}> has been banend!`);
      }else{
        interaction.reply('You cannot ban that member!');
      }
    }else{
      interaction.reply('You do not have permission to ban!')
    }
  } else if (interaction.commandName === 'unmute') {
    if(interaction.member.permissions.has("MUTE_MEMBERS")){
     const user = interaction.options.getUser('user');
     const target = user
     if(target){
       let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

       let memberTarget = interaction.guild.members.cache.get(target.id);

       memberTarget.roles.remove(muteRole.id);
       interaction.reply(`<@${memberTarget.user.id}> has been unmuted!`);
     } else{
       interaction.reply('You cannot unmute that member!');
     }
    } else{
     interaction.reply('You can not unmute people!');
    }
  } else if(interaction.commandName === 'temp') {
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return;
      const test = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('waiting')
					.setLabel('Join the waiting list!')
					.setStyle('SUCCESS')
                    .setEmoji('✅'),
			);
    await interaction.channel.send({ content: "Click the button below to verify!", components: [ test ] })
  } else if(interaction.commandName === 'ssu') {
      if(!interaction.member.permission.has("KICK_MEMBERS")) return;
      
  }
  }

  if (interaction.isButton()) {
      if(interaction.customId == 'verify') {
    let mainRole = interaction.guild.roles.cache.find(role => role.name === 'Civilian');
    interaction.member.roles.add(mainRole)
    await interaction.reply({ ephemeral: true, content: "Welcome! You are now verified on the UK Border Police discord server.\nPlease read <#902144623718301697>, breaking any of these rules will result in a warning at minimum."})
  } else if (interaction.customId === 'waiting') {
      
      const channel1 = interaction.guild.channels.cache.find(channel => channel.name = 'apps-waiting-list')
      channel1.send({ content: `New member on the waiting list : ${interaction.guild.members.cache.find(interaction.user)}`})
      await interaction.reply({ emphemeral: true, content: `Added to the waiting list`})
  }
  }
});

client.login(tooken)