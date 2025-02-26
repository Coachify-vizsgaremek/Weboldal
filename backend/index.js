import express from "express";
import cors from 'cors';
import mysql from "mysql2";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import MySQLStore from "express-mysql-session";

const MySQLSessionStore = MySQLStore(session);
const app = express();
const port = 3000;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // Add your database password here if needed
    database: "coachify",
}).promise();

const sessionStore = new MySQLSessionStore({}, db);

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use(
    session({
        key: "session_cookie_name",
        secret: "your_secret_key", // Change this to a strong secret key
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 60000 },
    })
);

// Register endpoint
app.post("/register", async (req, res) => {
    const { full_name, email, password, role, age, location, specialization, available_training_types, price_range, languages, reviews, introduction } = req.body; 
    try {
        if (!role || (role !== "trainer" && role !== "client")) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        // Ellenőrizzük, hogy létezik-e már ilyen email
        const [rows] = await db.query(
            `SELECT * FROM ${role === "trainer" ? "trainers" : "kliensek"} WHERE email = ?`,
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Jelszó hashelése
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "trainer") {
            // Edző regisztrációja
            await db.query(
                `INSERT INTO trainers (full_name, email, password, location, specialization, available_training_types, price_range, languages, reviews, introduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, email, hashedPassword, location, specialization, available_training_types, price_range, languages, reviews, introduction]
            );
        } else {
            // Kliens regisztrációja
            await db.query(
                `INSERT INTO kliensek (full_name, email, password, age) VALUES (?, ?, ?, ?)`,
                [full_name, email, hashedPassword, age]
            );
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!role || (role !== "trainer" && role !== "client")) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        const [rows] = await db.query(
            `SELECT * FROM ${role === "trainer" ? "trainers" : "kliensek"} WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = rows[0];

        let isPasswordValid = false;

        // Check if the password is bcrypt-hashed
        if (user.password.startsWith("$2b$")) {
            // Password is bcrypt-hashed, use bcrypt.compare
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Password is plain text, compare directly
            isPasswordValid = password === user.password;

            // If the password is valid, hash it and update the database
            if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.query(
                    `UPDATE ${role === "trainer" ? "trainers" : "kliensek"} SET password = ? WHERE id = ?`,
                    [hashedPassword, user.id]
                );
            }
        }

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.user = { id: user.id, full_name: user.full_name, role };
        // Válaszban visszaküldjük a felhasználó nevét is
        res.json({ message: "Login successful", full_name: user.full_name });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Protected route
app.get("/protected", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: `Welcome, ${req.session.user.full_name}` });
});

// Logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("session_cookie_name");
        res.json({ message: "Logout successful" });
    });
});

// Get all trainers
app.get("/trainers", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM trainers");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});

// Get all clients
app.get("/clients", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, full_name, email FROM kliensek");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database query failed" });
    }
});

// Get user data
app.get('/api/user', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const [rows] = await db.query(
        `SELECT * FROM ${req.session.user.role === 'trainer' ? 'trainers' : 'kliensek'} WHERE id = ?`,
        [req.session.user.id]
      );
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update user data
  app.put('/api/user', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const { full_name, email, phone, address } = req.body;
  
    try {
      await db.query(
        `UPDATE ${req.session.user.role === 'trainer' ? 'trainers' : 'kliensek'} SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?`,
        [full_name, email, phone, address, req.session.user.id]
      );
      res.json({ message: 'User data updated successfully' });
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});