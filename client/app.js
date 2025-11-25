// כתובת השרת ב-Render
const API_URL = "https://oneflow-crm-system.onrender.com";

// פונקציה לבדוק שהשרת חי
async function checkServer() {
    try {
        const res = await fetch(API_URL);
        const text = await res.text();

        document.getElementById("app").innerHTML = `
            <h1>OneFlow CRM Loaded Successfully ✔</h1>
            <p>השרת מחובר ועובד:</p>
            <pre>${text}</pre>
        `;
    } catch (err) {
        document.getElementById("app").innerHTML = `
            <h1>❌ שגיאה בחיבור לשרת</h1>
            <p>המערכת לא הצליחה להתחבר ל-API</p>
            <p>${err.message}</p>
        `;
    }
}

// הפעלה
checkServer();
