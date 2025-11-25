import express from "express";
import pg from "pg";
import fs from "fs";
import path from "path";
import cors from "cors";

// ENV from Render
const connectionString = process.env.DATABASE_URL;

// Create DB client
const db = new pg.Client({ connectionString });

// App
const app = express();
app.use(express.json());
app.use(cors());

// Load SQL schema on startup
async function initDatabase() {
    try {
        const schemaPath = path.join(process.cwd(), "server", "db.sql");
        const schema = fs.readFileSync(schemaPath, "utf-8");
        await db.query(schema);
        console.log("Database initialized ✔️");
    } catch (err) {
        console.error("Error loading DB schema:", err);
    }
}

// Routes
app.get("/api", (req, res) => {
    res.send("OneFlow CRM API is running");
});

// Create account
app.post("/api/register", async (req, res) => {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const result = await db.query(
            "INSERT INTO users (email, password, full_name) VALUES ($1,$2,$3) RETURNING id,email,full_name",
            [email, password, full_name || null]
        );

        res.json({ success: true, user: result.rows[0] });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const q = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (q.rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
    }

    const user = q.rows[0];

    if (user.password !== password) {
        return res.status(400).json({ error: "Wrong password" });
    }

    res.json({ success: true, user: { id: user.id, email: user.email, full_name: user.full_name } });
});

// Start server
app.listen(10000, async () => {
    await db.connect();
    await initDatabase();
    console.log("OneFlow CRM API is running on port 10000");
});
