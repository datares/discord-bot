const iam = require('./iam');
const updateRoles = require('./update_roles');
const verify = require('./verify');
const whoami = require('./whoami');

module.exports = {
    iam, verify, updateRoles, whoami
}
