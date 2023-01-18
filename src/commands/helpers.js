const readSheet = require('./read_sheet');

const getRoles = async (email) => {
    const members = await readSheet();
    const user = members.find((value) => {
        return value.email == email
    });
    if (!user) {
        return null;
    }
    return user.status
}

const getMember = (client, userId) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const member = guild.members.cache.get(userId);
    return member;
}

const updateUserRoles = async (email, user_id, client) => {
    const role_to_assign = await getRoles(email);
    if (!role_to_assign) {
        return null;
    }
    const member = getMember(client, user_id);
    const role = member.guild.roles.cache.find(r => r.name === role_to_assign);
    member.roles.add(role);
    return role_to_assign;
}

module.exports = { updateUserRoles };
