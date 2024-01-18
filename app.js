const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jscats'
});

connection.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
    } else {
        console.log('Połączenie z bazą danych udane!');
    }
});

// trasa dla pliku CSS
app.use(express.static(path.join(__dirname, '/')));

// trasa dla strony głównej
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// trasa dla strony logowania
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

// trasa dla strony rejestracji
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/register.html'));
});

// Obsługa rejestracji
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Haszowanie hasła przed zapisaniem go do bazy danych
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(query, [username, hashedPassword], (err, result) => {
            if (err) throw err;

            // Ustawienie sesji, że użytkownik jest zalogowany
            req.session.loggedIn = true;
            req.session.username = username;

            res.redirect('/cats'); // Przekieruj na /cats po udanej rejestracji
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Obsługa logowania
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const storedPassword = result[0].password;

            // Porównywanie hasła z hasłem w bazie danych
            const passwordMatch = await bcrypt.compare(password, storedPassword);

            if (passwordMatch) {
                // Ustawienie sesji, że użytkownik jest zalogowany
                req.session.loggedIn = true;
                req.session.username = username;

                res.redirect('/cats'); // Przekieruj na /cats po udanym logowaniu
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Middleware sprawdzające, czy użytkownik jest zalogowany
const checkLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        next(); // Kontynuuj, jeśli użytkownik jest zalogowany
    } else {
        res.redirect('/login'); // Przekieruj na stronę logowania, jeśli nie jest zalogowany
    }
};

// trasa dla strony /cats
app.get('/cats', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '/cats.html'));
});

// trasa dla skryptu cats.js
app.get('/cats.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/cats.js'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

