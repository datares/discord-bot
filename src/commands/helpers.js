const readSheet = require("./read_sheet");

const getMember = (client, userId) => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const member = guild.members.cache.get(userId);
  return member;
};

const addRoleToUser = async (client, user_id, role_to_assign) => {
  if (!role_to_assign) {
    return null;
  }
  const member = getMember(client, user_id);
  const role = member.guild.roles.cache.find((r) => r.name === role_to_assign);
  member.roles.add(role);
  return role_to_assign;
};

async function updateUserFromSheet(email, user_id, client) {
  const members = await readSheet();
  const user = members.find((value) => value.email === email);

  // If we could not find user
  if (!user) {
    return null;
  }

  // Give user respective team role
  const member = getMember(client, user_id);
  const role = member.guild.roles.cache.find((r) => r.name === user.status);
  member.roles.add(role);

  // Set user's name
  try {
    member.setNickname(user.name);
  } catch (err) {
    console.error(`Failed to set ${user.name}'s nickname: `, err);
  }

  return user.status;
}

module.exports = { updateUserFromSheet, addRoleToUser };
