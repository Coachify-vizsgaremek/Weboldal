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

// Database configuration with connection pool
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "", // Add your database password here if needed
    database: "coachify",
    port: 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000 // 10 seconds timeout
};

const db = mysql.createPool(dbConfig).promise();

// Test database connection
db.getConnection()
    .then(connection => {
        console.log("Successfully connected to MySQL database");
        connection.release();
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// Session store configuration
const sessionStoreOptions = {
    ...dbConfig,
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes
    expiration: 86400000, // 1 day
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const sessionStore = new MySQLSessionStore(sessionStoreOptions, db);

// Enhanced CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'], // Add Cache-Control here
    exposedHeaders: ['Set-Cookie']
  };
  
  app.use(cors(corsOptions));

// Middleware setup
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
// Session konfig frissítése
app.use(session({
    key: "session_cookie_name",
    secret: "your_secret_key_should_be_more_complex_than_this",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS esetén true
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: 'localhost' // Fontos fejlesztés közben
    },
    rolling: true
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

// Database health check endpoint
app.get('/api/db-check', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS test');
        res.json({ success: true, message: 'Database connection successful', data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});

// Register endpoint
app.post("/register", async (req, res) => {
    const { full_name, email, password, role, age, location, specialization, available_training_types, price_range, languages, reviews, introduction } = req.body;
    
    try {
        if (!full_name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (role !== "trainer" && role !== "client") {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        // Check if email already exists
        const [rows] = await db.query(
            `SELECT * FROM ${role === "trainer" ? "trainers" : "kliensek"} WHERE email = ?`,
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "trainer") {
            // Register trainer
            await db.query(
                `INSERT INTO trainers (full_name, email, password, location, specialization, available_training_types, price_range, languages, reviews, introduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, email, hashedPassword, location, specialization, available_training_types, price_range, languages, reviews, introduction]
            );
        } else {
            // Register client
            await db.query(
                `INSERT INTO kliensek (full_name, email, password, age) VALUES (?, ?, ?, ?)`,
                [full_name, email, hashedPassword, age]
            );
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password and role are required" });
    }

    try {
        if (role !== "trainer" && role !== "client") {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        const tableName = role === "trainer" ? "trainers" : "kliensek";
        
        const [rows] = await db.query(
            `SELECT id, full_name, email, password FROM ${tableName} WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = rows[0];
        let isPasswordValid = false;

        // Check password
        if (user.password.startsWith("$2b$")) {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Backward compatibility for plain text passwords
            isPasswordValid = password === user.password;
            if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.query(
                    `UPDATE ${tableName} SET password = ? WHERE id = ?`,
                    [hashedPassword, user.id]
                );
            }
        }

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create session
        req.session.user = { 
            id: user.id, 
            full_name: user.full_name, 
            email: user.email,
            role 
        };

        res.json({ 
            message: "Login successful", 
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

// Javított /protected endpoint
app.get("/protected", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const tableName = req.session.user.role === 'trainer' ? 'trainers' : 'kliensek';
        const [rows] = await db.query(
            `SELECT full_name, email FROM ${tableName} WHERE id = ?`,
            [req.session.user.id]
        );

        if (rows.length === 0) {
            // Session exists but user not found in DB - clear session
            req.session.destroy();
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: `Welcome, ${rows[0].full_name}`,
            user: {
                id: req.session.user.id,
                full_name: rows[0].full_name,
                email: rows[0].email,
                role: req.session.user.role
            }
        });
    } catch (error) {
        console.error("Protected route error:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

// Javított logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("session_cookie_name");
        res.json({ 
            message: "Logout successful",
            loggedOut: true // Explicit flag
        });
    });
});

// Public trainers endpoint (no auth required)
app.get("/edzok", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id, 
                full_name, 
                location, 
                specialization, 
                available_training_types, 
                price_range, 
                languages, 
                introduction,
                reviews
            FROM trainers
        `);
        
        const validatedTrainers = rows.map(trainer => ({
            id: trainer.id,
            full_name: trainer.full_name || 'Név nélküli edző',
            location: trainer.location || '',
            specialization: trainer.specialization || '',
            available_training_types: trainer.available_training_types || '',
            price_range: trainer.price_range || '',
            languages: trainer.languages || '',
            introduction: trainer.introduction || '',
            reviews: trainer.reviews || ''
        }));

        res.json(validatedTrainers);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ 
            error: "Database query failed",
            details: error.message
        });
    }
});

// Protected trainers endpoint (requires auth)
app.get("/api/trainers", requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id, 
                full_name, 
                location, 
                specialization, 
                available_training_types, 
                price_range, 
                languages, 
                introduction
            FROM trainers
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message
        });
    }
});

// Get all clients
app.get("/clients", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, full_name, email, age FROM kliensek");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ 
            error: "Database query failed",
            details: error.message
        });
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
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Update user data
app.put('/api/user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { full_name, email, location, specialization, available_training_types, price_range, languages, introduction, age } = req.body;

    try {
        if (req.session.user.role === 'trainer') {
            await db.query(
                `UPDATE trainers SET full_name = ?, email = ?, location = ?, specialization = ?, available_training_types = ?, price_range = ?, languages = ?, introduction = ? WHERE id = ?`,
                [full_name, email, location, specialization, available_training_types, price_range, languages, introduction, req.session.user.id]
            );
        } else {
            await db.query(
                `UPDATE kliensek SET full_name = ?, email = ?, age = ? WHERE id = ?`,
                [full_name, email, age, req.session.user.id]
            );
        }
        res.json({ message: 'User data updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Update password 
app.put('/api/user/password', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const [rows] = await db.query(
            `SELECT password FROM ${req.session.user.role === 'trainer' ? 'trainers' : 'kliensek'} WHERE id = ?`,
            [req.session.user.id]
        );

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            `UPDATE ${req.session.user.role === 'trainer' ? 'trainers' : 'kliensek'} SET password = ? WHERE id = ?`,
            [hashedPassword, req.session.user.id]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user role
app.get('/api/user/role', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Check if user is trainer
        const [trainerRows] = await db.query(
            `SELECT id FROM trainers WHERE id = ?`,
            [req.session.user.id]
        ); 

        if (trainerRows.length > 0) {
            return res.json({ role: 'trainer' });
        }

        // Check if user is client
        const [clientRows] = await db.query(
            `SELECT id FROM kliensek WHERE id = ?`,
            [req.session.user.id]
        );

        if (clientRows.length > 0) {
            return res.json({ role: 'client' });
        }
    
        // If user not found
        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
    try {
        const products = [
            {
                id: 1,
                name: "Póló",
                price: 4990,
                tokens: 50,
                images: ["/src/images/polo.png", "/src/images/polo2.png"],
                description: "Kényelmes edzős póló, jó szellőzőképességgel."
            },
            {
                id: 2,
                name: "Trikó",
                price: 5990,
                tokens: 60,
                images: ["/src/images/triko.png", "/src/images/triko2.png"],
                description: "Minőségi anyagból készült trikó, kiváló viselet."
            },
            {
                id: 3,
                name: "Sapka",
                price: 2990,
                tokens: 30,
                images: ["/src/images/sapka.png", "/src/images/sapka2.png"],
                description: "Stílusos baseball sapka, több színben elérhető."
            },
            {
                id: 4,
                name: "Gallérós Póló",
                price: 6990,
                tokens: 70,
                images: ["/src/images/galleros.png", "/src/images/galleros2.png"],
                description: "Melegítő felső gallérral, kényelmes viselet."
            },
            {
                id: 5,
                name: "Női Top",
                price: 5490,
                tokens: 55,
                images: ["/src/images/noifelso.png", "/src/images/noifelso2.png"],
                description: "Női edzőfelső, kiváló anyagminőség."
            },
            {
                id: 6,
                name: "Női Póló",
                price: 4590,
                tokens: 45,
                images: ["/src/images/noipolo.png", "/src/images/noipolo2.png"],
                description: "Női edzőpóló, kényelmes és divatos."
            }
        ];
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user cart
app.get('/api/cart', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [rows] = await db.query(
            `SELECT cart FROM user_carts WHERE user_id = ?`,
            [req.session.user.id]
        );
        
        if (rows.length > 0) {
            res.json(JSON.parse(rows[0].cart));
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Save user cart
app.post('/api/cart', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { cart } = req.body;

    try {
        // Check if user already has a cart
        const [existingCart] = await db.query(
            `SELECT id FROM user_carts WHERE user_id = ?`,
            [req.session.user.id]
        );

        if (existingCart.length > 0) {
            // Update existing cart
            await db.query(
                `UPDATE user_carts SET cart = ? WHERE user_id = ?`,
                [JSON.stringify(cart), req.session.user.id]
            );
        } else {
            // Create new cart
            await db.query(
                `INSERT INTO user_carts (user_id, cart) VALUES (?, ?)`,
                [req.session.user.id, JSON.stringify(cart)]
            );
        }

        res.json({ message: 'Cart saved successfully' });
    } catch (error) {
        console.error('Error saving cart:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user tokens
app.get('/api/user/tokens', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [rows] = await db.query(
            `SELECT tokens FROM user_tokens WHERE user_id = ?`,
            [req.session.user.id]
        );
        
        if (rows.length > 0) {
            res.json({ tokens: rows[0].tokens });
        } else {
            // Initialize with 0 tokens if not found
            await db.query(
                `INSERT INTO user_tokens (user_id, tokens) VALUES (?, 0)`,
                [req.session.user.id]
            );
            res.json({ tokens: 0 });
        }
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Update user tokens
app.put('/api/user/tokens', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { tokens } = req.body;

    try {
        // Check if user already has a token record
        const [existingRecord] = await db.query(
            `SELECT id FROM user_tokens WHERE user_id = ?`,
            [req.session.user.id]
        );

        if (existingRecord.length > 0) {
            // Update existing tokens
            await db.query(
                `UPDATE user_tokens SET tokens = ? WHERE user_id = ?`,
                [tokens, req.session.user.id]
            );
        } else {
            // Create new token record
            await db.query(
                `INSERT INTO user_tokens (user_id, tokens) VALUES (?, ?)`,
                [req.session.user.id, tokens]
            );
        }

        res.json({ message: 'Tokens updated successfully' });
    } catch (error) {
        console.error('Error updating tokens:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get coupons
app.get('/api/coupons', async (req, res) => {
    try {
        const coupons = [
            {
                id: 1,
                name: "10% kedvezmény",
                tokensRequired: 100,
                description: "10% kedvezmény bármely szolgáltatásra"
            },
            {
                id: 2,
                name: "Ingyenes edzés",
                tokensRequired: 200,
                description: "Egy ingyenes csoportos edzés"
            },
            {
                id: 3,
                name: "25% kedvezmény",
                tokensRequired: 300,
                description: "25% kedvezmény bármely edzőre"
            }
        ];
        res.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});