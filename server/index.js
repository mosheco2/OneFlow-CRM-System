import express from "express";
import pkg from "pg";
const { Client } = pkg;

const app = express();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => console.log("Connected to OneFlow CRM Database"))
    .catch(err => console.error("DB Connection Error:", err));

app.get("/", (req, res) => {
    res.send("OneFlow CRM API is running");
});

app.get("/api", async (req, res) => {
    res.send("API Connected Successfully");
});

// check DB status
app.get("/api/db-status", async (req, res) => {
    try {
        const result = await client.query("SELECT NOW()");
        res.json({ ok: true, time: result.rows[0].now });
    } catch (err) {
        res.json({ ok: false, error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
