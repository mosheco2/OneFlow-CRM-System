async function loadCRM() {
    document.getElementById("app").innerText = "Loading CRM...";

    try {
        const response = await fetch("https://oneflow-crm-system.onrender.com/api/status");
        const data = await response.json();

        document.getElementById("app").innerText =
            "OneFlow CRM Online → " + data.status;
    } catch (err) {
        document.getElementById("app").innerText =
            "Error loading CRM API";
    }
}

loadCRM();
