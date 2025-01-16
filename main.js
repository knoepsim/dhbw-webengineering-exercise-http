const fs = require('fs');
const datapath = "data.json"

var express = require("express");
var app = express();
app.listen(8080, () => {
    console.log("Listening on port 8080");
});


app.get('/', (req, res) => {
    res.status(200)
    res.json({ message: "Server Running." })
})

app.get("/example", (req, res, next) => {
    res.json({ message: "This is an example endpoint." });
});


// - `/users`: Gibt eine Liste von Benutzerobjekten mit Benutzername, Name, Id und Geburtsdatum zurück.
// - `/users/:id`: Gibt die Details eines Benutzers basierend auf der ID zurück.
app.get("/users", async (req, res, next) => {
    let data = await readData();
    if (req.query.id) {
        const user = data.filter(u => u.id == req.query.id)
        if (user.length != 1) {
            res.status(404);
            res.json({ "message": "couldnt find user" });
        } else {
            res.status(200);
            res.json({ "message": "found user", "data": user[0] });
        }
    } else {
        res.status(200);
        res.json({ "message": "success", "data": data });
    }
});

// - `/users`: Fügt einen neuen Benutzer hinzu. Die erforderlichen Daten sollen aus dem Request übermittelt werden.
app.post('/users', async (req, res) => {
    if (!req.query.name || !req.query.username || !req.query.birthday) {
        res.status(400);
        res.json({ "message": "provide name, username, birthday" });
        return;
    }
    const data = await readData();
    const id = data[data.length - 1].id + 1;
    let newUser = {
        name: req.query.name,
        username: req.query.username,
        birthday: req.query.birthday,
        id: id
    }
    data.push(newUser);
    writeData(data);
    res.status(201);
    res.json({ "message": `created user with id ${id}`, "data": newUser });
});


// - `/users/:id`: Löscht einen Benutzer basierend auf der ID.
app.delete('/users', async (req, res) => {
    if (req.query.id) {
        let data = await readData();
        const user = data.filter(u => u.id == req.query.id)
        if (user.length != 1) {
            res.status(404);
            res.json({ "message": `couldnt find user with id ${req.query.id}` });
        } else {
            const newList = data.filter(u => u !== user[0]);
            writeData(newList);
            res.status(200);
            res.json({ "message": "deleted user", "data": user[0] });
        }
    } else {
        res.status(400);
        res.json({ "message": "please provide id" });
    }
});


// - `/users/:id`: Aktualisiert die Informationen eines Benutzers basierend auf der ID. Die erforderlichen Daten sollen aus dem Request übermittelt werden.
// - `/users/:id`: Aktualisiert einen Teil der Informationen eines Benutzers basierend auf der ID. Die zu aktualisierenden Daten sollen aus dem Request übermittelt werden.
app.patch('/users', async (req, res) => {
    if (req.query.id) {
        if (!req.query.name && !req.query.username && !req.query.birthday) {
            res.status(400);
            res.json({ "message": "please provide something to update" });
            return;
        }
        let data = await readData();
        const userIndex = data.indexOf(e => e.id == req.query.id)
        const user = data.filter(u => u.id == req.query.id)
        if (user.length != 1) {
            res.status(404);
            res.json({ "message": `couldnt find user with id ${req.query.id}` });
        } else {
            data[0].name = req.query.name ?? user[0].name;
            data[0].username = req.query.username ?? user[0].username;
            data[0].birthday = req.query.birthday ?? user[0].birthday;
            data[0].id = req.query.id ?? user[0].id;
            writeData(data);
            res.status(200);
            res.json({ "message": `updated user witdh id ${data[0].id}`, "data": data[userIndex], "old_data": user });
        }
    } else {
        res.status(400);
        res.json({ "message": "please provide id" });
    }
});


async function readData() {
    let rawdata = await fs.readFileSync(datapath);
    let data = JSON.parse(rawdata);
    console.log("[LOG][readData]", data);
    if (!Array.isArray(data)) return [];
    return data;
}

async function writeData(data) {
    let d = JSON.stringify(data);
    fs.writeFileSync(datapath, d);
}