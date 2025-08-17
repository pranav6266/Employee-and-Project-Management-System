require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
const app = express();

db.on("error",(error) => console.error(error));
db.once("open",() => {
    console.log("Connected to Database....")
})

app.use(express.json())
const usersRouter = require("./routes/users")
app.use("/users",usersRouter)

app.listen(3000,()=>{
    console.log("Server Started...")
})