/**
 * Created by Arthur on 4/1/2017.
 */
var api;
var commandArgs;

function handleCommands(data) {
    commandArgs = data;

    var guildId = api._discord.channels[data.channelID].guild_id;
    var server = api._discord.servers[guildId];

    if (!server) {
        api.Messages.send(data.channelID, "Couldn't find origin server");
        return;
    }

    switch(data.cmd)
    {
       case "findbyrole": {
           if (data.args.length == 0)
           {
               api.Messages.send(data.channelID, "No role to find");
               return;
           }

            var desiredRole = data.args[0];
            var role = null;

            var matchedRole = /(?:<@&)?(\d+)>?/.exec(desiredRole);
            if (matchedRole) {
                desiredRole = matchedRole[1];
                role = server.roles[desiredRole];
            } else {
                for (var roleId in server.roles) {
                    var currentRole = api._discord.servers[guildId].roles[roleId];
                    if (currentRole.name === desiredRole) {
                        role = currentRole;
                        break;
                    }
                }
            }

            if (role)
            {
                var users = [];
                for(var id in server.members)
                {
                    var member = server.members[id], user = api._discord.users[id];
                    if (member.roles.indexOf(role.id) != -1)
                    {
                        users.push(id);
                    }
                }
                if (users.length > 0)
                    api.Messages.send(data.channelID, `I found ${users.length} users with the role '${role.name}'. They are: <@${users.join(">, <@")}>`);
                else
                    api.Messages.send(data.channelID, `I found no users with the role '${role.name}'.`);
            }
            else
            {
                api.Messages.send(data.channelID, `No role found. I searched for '${data.args[0]}'`);
            }
            break;
       }
        case "addnorolesto":
        case "addnoroleto":
        {
            if (data.args.length == 0)
            {
                api.Messages.send(data.channelID, "No role to add");
                return;
            }

            var desiredRole = data.args[0];
            var role = null;

            var matchedRole = /(?:<@&)?(\d+)>?/.exec(desiredRole);
            if (matchedRole) {
                desiredRole = matchedRole[1];
                role = server.roles[desiredRole];
            }
            else {
                for (var roleId in server.roles)
                {
                    var currentRole = api._discord.servers[guildId].roles[roleId];
                    if (currentRole.name === desiredRole)
                    {
                        role = currentRole;
                        break;
                    }
                }
            }

            if (role)
            {
                var users = [];
                for(var id in server.members)
                {
                    var member = server.members[id], user = api._discord.users[id];
                    if (member.roles.length == 0)
                    {
                        api._discord.addToRole({
                            "serverID": guildId,
                            "userID": id,
                            "roleID": role.id
                        }, function(info1, info2) {
                            console.log(info1, info2);
                        });
                        users.push(id);
                    }
                }
                if (users.length > 0)
                    api.Messages.send(data.channelID, `I added ${users.length} users to the role '${role.name}'. They are: <@${users.join(">, <@")}>`);
                else
                    api.Messages.send(data.channelID, `I found no users to add to the role '${role.name}'.`);
            }
            else
            {
                api.Messages.send(data.channelID, `No role found. I searched for '${data.args[0]}'`);
            }
            break;
        }
        case "listnorole":
        case "listnoroles":
        {
            var users = [];
            for(var id in server.members)
            {
                var member = server.members[id], user = api._discord.users[id];
                if (member.roles.length == 0)
                {
                    users.push(id);
                }
            }
            if (users.length > 0)
                api.Messages.send(data.channelID, `I found ${users.length} with no roles. They are: <@${users.join(">, <@")}>`);
            else
                api.Messages.send(data.channelID, `I found no users without any roles.`);
            break;
        }
       default: {;
            console.log(data);
            break;
        }
    }
}

function log(data)
{
    api.Messages.send(commandArgs.channelID, data.toString());
    console.log(data);
}

function findByRole(roleName)
{

}

module.exports = {
    meta_inf: {
        name: "Sharlayan Commands",
        version: "1.0",
        description: "Sharlayan Package",
        author: "Emraell"
    },
    load: function (_api) {
        api = _api;
    },
    start: function () {
        api.Events.on("chatCmd", handleCommands);
    },
    stop: function () {
        api.Events.removeListener("chatCmd", handleCommands);
    }
}