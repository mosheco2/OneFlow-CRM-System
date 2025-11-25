async function loadCRM() {
    const app = document.getElementById("app");
    app.innerText = "Loading CRM...";

    try {
        const res = await fetch("https://oneflow-crm-system.onrender.com/api");
        const txt = await res.text();

        app.innerText = "OneFlow CRM Online → " + txt;
    } catch (err) {
        app.innerText = "Error loading CRM API";
    }
}

loadCRM();
