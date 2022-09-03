const fs = require("fs")
const express = require("express");
const morgan = require("morgan");
const dbPool = require("./dbconfig");
const { nanoid } = require("nanoid")
const app = express();


app.use(morgan("dev"));
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index")

})
app.get("/:id", (req, res) => {
    let id = req.params.id
    console.log(id)
    dbPool.query(`SELECT url,visit FROM shortit WHERE shrturl = '${id}';`, (err, q) => {
        console.log(q)
        if (err) {
            return res.status(400).send("No such page")
        }
        else {
            dbPool.query(`UPDATE shortit SET visit = ${Number(q.rows[0].visit) + 1} WHERE shrturl = '${id}';`, (err, q) => {
                console.log(err, q)
            })
            console.log("here", q)
            res.redirect(q.rows[0].url)
        }
    })

})
app.post("/shortIt", (req, res) => {
    const orignalUrl = req.body.url
    dbPool.query(`SELECT shrturl FROM shortit WHERE url = '${orignalUrl}';`, (err, q) => {
        console.log(q)
        if (q.rows.length===0) {
            console.log("here")
            const newUrl = nanoid(6)
            dbPool.query(`INSERT INTO shortit(url ,shrturl ,visit) VALUES('${orignalUrl}' ,'${newUrl}' ,0);`)
            return res.render("shortenedUrl", { orignalUrl: orignalUrl, newUrl: newUrl })
        }
        else {
            console.log(orignalUrl)
           return res.render("shortenedUrl", { orignalUrl: orignalUrl, newUrl: q.rows[0].shrturl })
        }
    })
})
app.listen(process.env.PORT || 8000)