const API_URL = "https://oneflow-crm-system-1.onrender.com";

// מציג שהקליינט עלה
document.getElementById("app").innerText = "OneFlow CRM – Client Loaded";

// פונקציה שבודקת קשר לשרת
async function checkConnection() {
    try {
        const response = await fetch(`${API_URL}/ping`);
        const data = await response.json();

        console.log("API Response:", data);

        document.getElementById("status").innerText =
            "API Status: " + data.message;
    } catch (error) {
        console.error("Error connecting to API:", error);
        document.getElementById("status").innerText =
            "API Status: ❌ Failed to connect";
    }
}

// הפעלה
checkConnection();
