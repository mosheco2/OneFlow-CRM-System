import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

// -------------------------
// DB INIT – יצירת טבלאות
// -------------------------
async function initDB() {
    console.log("🔧 Initializing database...");

    // יצירת טבלת LEADS
    await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log("✅ Leads table is ready");
}

// -------------------------
// API ROUTES
// -------------------------

// בסיס – לבדוק שהAPI עובד
app.get("/api", (req, res) => {
    res.send("OneFlow CRM API is running");
});

// בדיקת סטטוס
app.get("/api/status", async (req, res) => {
    try {
        const test = await pool.query("SELECT NOW()");
        res.json({
            status: "Connected",
            time: test.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ status: "DB Error", error: err.message });
    }
});

// קבלת כל הלידים
app.get("/api/leads", async (req, res) => {
    const result = await pool.query("SELECT * FROM leads ORDER BY id DESC");
    res.json(result.rows);
});

// הוספת ליד חדש
app.post("/api/leads", async (req, res) => {
    const { full_name, email, phone } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO leads (full_name, email, phone)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [full_name, email, phone]
        );

        res.json({ success: true, lead: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// -------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    await initDB(); // ⬅️ פה נבנית הטבלה אוטומטית
});
