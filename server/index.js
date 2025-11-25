import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ברירת מחדל
app.get("/", (req, res) => {
  res.send("OneFlow CRM API is running");
});

// נתיב ה־API שהקליינט שלך מבקש
app.get("/api", (req, res) => {
  res.send("API Connected Successfully");
});

// נתיב פינג (אופציונלי)
app.get("/ping", (req, res) => {
  res.json({ status: "ok", message: "API Connected Successfully" });
});

// סטטוס API
app.get("/api/status", (req, res) => {
  res.json({ status: "API Connected Successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
