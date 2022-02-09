const cUsers = []

//joins the user to the specified chat room
function join_user(id, username, room) {
    const pUser = { id, username, room }

    c_users.push(pUser)
    console.log(cUsers, "users")

    return pUser
}

console.log("user out", cUsers)

//get a particular user id to return the current user
function getCurrentUser(id) {
    return cUsers.find( pUser => pUser.id === id)
}

//called when the user leaves the chat and it's user object is deleted from the array
function userDisconnect(id) {
    const index = cUsers.findIndex( pUser => pUser.id === id)

    if(index !== -1) {
        cUsers.splice(index, 1)[0]
    }
}

module.exports = {
    join_user,
    getCurrentUser,
    userDisconnect,
}