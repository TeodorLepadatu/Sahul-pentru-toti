var express = require('express');
var app = express();
const session = require('express-session');
const formidable = require('formidable');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Setăm engine-ul ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'database')));
app.use(express.static(path.join(__dirname, 'views/pagini')));

// Creăm o sesiune
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // use an environment variable for secret
    resave: true,
    saveUninitialized: false,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'views/pagini')));

// Funcție care caută username-ul și parola în fișierul users.json

function verifica(username, pass) {
    if(fs.existsSync("./database/users.json")) {
        var date = fs.readFileSync("./database/users.json");
        ob = JSON.parse(date);
     
        for (i in ob) {
            if (ob[i].username == username && ob[i].password == pass) {
                return username;
            }
        }
    }

    return false;
}

// La completarea formularului de login, verificăm datele introduse de utilizator
// Setăm câmpul de sesiune username și facem redirecturi corespunzătoare
app.post('/login', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).send('Internal server error');
        }
        
        let user = verifica(fields.username, fields.password);
        if(user) {
            req.session.username = user;
            res.redirect('/index'); 
        }
        else {
            req.session.username = false;
            res.redirect('/');
        }  
    });
});


app.get('/index', function(req, res) {
    res.render('index.ejs', {
        'username':  req.session.username
    });
});

// Dacă utilizatorul s-a logat, încărcăm pagina index.html
// prin care îi confirmăm loginul și afișăm un buton pentru logout
app.get('/index.ejs', function(req, res) {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'views/pagini/index.ejs'));
    } else {
        res.redirect('/');
    }
});

// Route to get the username
app.get('/get-username', function(req, res) {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.json({ username: null });
    }
});

// Dacă am dat click pe linkul 'logout',
// scoatem utilizatorul din sesiune și facem redirect către pagina inițială de login
app.get('/logout', function(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        console.log('logged out');
        res.redirect('/');
    });
});

// Serverul ascultă pe portul dat, 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.get('/', function(req, res) {
    res.render('log.ejs');
 });