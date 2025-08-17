require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const db = mongoose.connection;

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect(process.env.DB_URL);

db.on("error",(error) => console.error(error));
db.once("open",() => {
    console.log("Connected to Database....")
})

app.use(express.json());

// 2. Add Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// 3. Configure Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users")
const adminRouter = require("./routes/admin");


app.use("/", authRouter);
app.use("/users",usersRouter)
app.use("/admin", adminRouter);

app.listen(8000,()=>{
    console.log("Server Started...")
})