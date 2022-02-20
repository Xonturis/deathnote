# DeathNote
Simple discord bot that checks if new marks are available, and notifies a channel if so.

# Configuration
Create a file `config.json` in the same folder containing the project.
Example `config.json`:
```
{
    "username": "E.......",
    "password": "unicornsareawesome",
    "token": "thetokenishouldnthavepushed",
    "channel_id": "12345678910"
}
```
The `username` field requires your LDAP username (only working with Polytech Nantes, you may fork me if you want this bot for your school).\
The `password` field requires the password you use to log into univ-nantes.fr services.\
The `token` field requires your bot's token.\
The `channel_id` field requires a valid discord text channel id and that the bot can send messages in that very channel.

For the very first start of the bot, it will send a message with all subject, just once.
IIF There are marks > 0 :)
Otherwise, the bot will simply start without making any noise.

# Installation
`sudo npm install`

# Usage
`node deathnote.js`\
*You should start the bot inside a [screen](https://linux.die.net/man/1/screen) session.*

# Information
Only intended to be used by Polytech Nantes's students, u beauty.
