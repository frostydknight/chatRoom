const express = require("express")
const app = express()
const socket = require("socket.io")
const color = require("colors")
const cors = require("cors")
const { joinUser, getCurrentUser, userDisconnect } = require("./user.js")

const port = 8000
app.use(express())

app.use(cors())

let sever = app.listen(
    port, 
    console.log(`Server is running on port: ${port}`
        .green
    )
)

const io = socket(server)

//initialize the socket server
io.on("connection", (socket) => {
    //for a new user joining the room
    socket.on("joinRoom", ({ username, roomname }) =>{
        const pUser = joinUser(socket.id, username, roomname)
        console.log(socket.id, "=id")
        socket.join(pUser.room)

        //display a welcome message to the user that joins
        socket.emit("message", {
            userID: pUser.id,
            username: pUser.username,
            text: `Welcome ${pUser.username}`,
        })

        //displays a joined room message to all other users in the room except the user who joined
        socket.broadcast.to(pUser.room).emit("message", {
            userID: pUser.id,
            username: pUser.username,
            text: `${pUser.username} has joined the chat`,
        })
    })

    socket.on("chat", (text) => {
        //gets the room user and message sent
        const pUser = getCurrentUser(socket.id)

        io.to(pUser.room).emit("message", {
            userID: pUser.id,
            username: pUser.username,
            text: text,
        })
    })

    //when the user exits the room
    socket.on("disconnect", () => {
        //the user is deleted from the array and the left room message is displayed
        const pUser = userDisconnect(socket.id)

        if (pUser){
            io.to(pUser.room).emit("message", {
                userID: pUser.id,
                username: pUser.username,
                text: `${pUser.username} has left the room`
            })
        }
    })
})