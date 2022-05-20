const sessions = [];
module.exports = {
    register: (username, token) => {
        sessions.push({ username, token });
    },
    find: ({ token, username }) => {
        return sessions.find(x => x.token === token || x.username === username);
    }
}