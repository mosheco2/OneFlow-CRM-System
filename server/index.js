import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// TEST API
app.get("/", (req, res) => {
    res.send("OneFlow CRM API is running");
});

// GET ALL USERS
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// CREATE USER (REGISTER)
app.post("/api/register", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Missing name or email" });
        }

        const insert = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );

        res.json({
            message: "User registered successfully",
            user: insert.rows[0]
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
