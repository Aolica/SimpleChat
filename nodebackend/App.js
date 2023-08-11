const serverlessExpress = require('@vendia/serverless-express');
const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3");

var dbset;
if(process.env.NODE_ENV === 'develop') {
    dbset = new sqlite3.Database("db/chat.db");
}else {
    dbset = new sqlite3.Database("/mnt/db/chat.db");
}
const db = dbset;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: "https://aolica.github.io",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3005;
if(process.env.NODE_ENV === 'develop') {
    const server = app.listen(port, () => {
        console.log("listening... Port:" + server.address().port);
    });
}
const getLogSQL = "select name,message from (select * from chats order by created_at desc limit 20) as a order by created_at asc";

app.get("/api/ping", (req, res, next) => {
    console.log("GET /api/ping request arrived");
    res.send("Hello World!");
});

app.get("/api/chat/log", (req, res, next) => {
    console.log("GET /api/chat/log request arrived");
    db.serialize(() => {
        db.all(getLogSQL, (err, rows) => {
            console.log(rows);
            res.json(rows);
        });
    });
});

app.get("/api/db/create", (req, res, next) => {
    console.log("GET /api/db/create request arrived");
    db.serialize(() => {
        db.run("create table if not exists chats(id integer primary key autoincrement, name text, message text, created_at datetime default (datetime('now', 'localtime')))");
    });
    res.json({ "message": "created" });
});

// request should be take a content-type: application/x-www-form-urlencoded or application/json
app.post("/api/chat/add", (req, res, next) => {
    console.log("POST /api/chat/add request arrived");
    console.log(req.body);
    if(!req.body.name || !req.body.message) {
        res.status(400).json({ "Error": "name or message is empty" });
    }else{
        db.serialize(() => {
            // automatically sanitize request body
            db.run("insert into chats(name, message) values(?,?)", req.body.name, req.body.message);
            db.all(getLogSQL, (err, rows) => {
                console.log(rows);
                res.json(rows);
            });
        });
    }
});

exports.handler = serverlessExpress({ app });