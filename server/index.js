import express from "express";
import pkg from "pg";

const { Client } = pkg;

const app = express();

// Parse JSON bodies (optional but recommended)
app.use(express.json());

// PostgreSQL Connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // חובה ל-Render
});

// Try connecting to the DB
client.connect()
    .then(() => console.log("✅ Connected to PostgreSQL Database"))
    .catch(err => console.error("❌ Database connection error:", err));

// API Test Route
app.get("/api/status", async (req, res) => {
    try {
        const result = await client.query("SELECT NOW()");
        res.json({
            status: "API & DB Connected Successfully",
            time: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({
            status: "DB Error",
            error: err.message
        });
    }
});

// Default root route
app.get("/", (req, res) => {
    res.send("OneFlow CRM API is running");
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 OneFlow CRM API running on port ${PORT}`);
});
