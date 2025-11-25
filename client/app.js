async function loadCRM() {
    document.getElementById("app").innerText = "Loading CRM...";

    try {
        const response = await fetch("https://oneflow-crm-system.onrender.com/api/status");
        const text = await response.text();

        document.getElementById("app").innerText =
            "OneFlow CRM Online → " + text;
    } catch (err) {
        document.getElementById("app").innerText =
            "Error loading CRM API";
    }
}

loadCRM();
