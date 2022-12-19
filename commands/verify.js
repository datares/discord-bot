const { readSheet } = require('./read_sheet');
const { getDb } = require('./db')

const getRoles = async (email) => {
    const members = await readSheet();
    const user = members.find((value) => {
        return value.email == email
    });
    console.log(user)
    return user.status
}

const getMember = (client, userId) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const member = guild.members.cache.get(userId);
    return member;
}


const verify = async (code, user_id, client, interaction) => {
    const db = getDb();
    
    db.findOne({user_id: user_id, verification_code: code}, async (err, docs) => {
        if (!docs) {
            await interaction.reply('You entered an incorrect verification code, please try again');
            return;
        }
        if (err) {
            return;
        }
        console.log(docs)
        const verification_code = Number(docs.verification_code);
        console.log(code, verification_code);

        const email = docs.email
        const role_to_assign = await getRoles(email);

        const member = getMember(client, user_id);
        const role = member.guild.roles.cache.find(role => role.name === role_to_assign);
        member.roles.add(role);
        await interaction.reply('Successfully verified email address and applied any team-specific roles based on your team listing on our directory.  Please double check that any added roles are correct and message @ColinCurtis for any help');
    })
};

module.exports = { verify };
