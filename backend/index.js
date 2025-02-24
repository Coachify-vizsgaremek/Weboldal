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
    const { full_name, email, password, role } = req.body;

    try {
        if (!role || (role !== "trainer" && role !== "client")) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        const [rows] = await db.query(
            `SELECT * FROM ${role === "trainer" ? "trainers" : "kliensek"} WHERE email = ?`,
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword); // Debug log
        await db.query(
            `INSERT INTO ${role === "trainer" ? "trainers" : "kliensek"} (full_name, email, password) VALUES (?, ?, ?)`,
            [full_name, email, hashedPassword]
        );

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
        console.log("Input password:", password); // Debug log
        console.log("Stored hashed password:", user.password); // Debug log
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password match:", isPasswordValid); // Debug log

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.user = { id: user.id, full_name: user.full_name, role };
        res.json({ message: "Login successful" });
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});