async function loadCRM() {
    document.getElementById("app").innerText = "Loading CRM...";

    try {
        const res = await fetch("https://oneflow-crm-system.onrender.com/api");
        const txt = await res.text();

        document.getElementById("app").innerText =
            "OneFlow CRM Online → " + txt;
    } catch (err) {
        document.getElementById("app").innerText += "\nError loading CRM API";
    }
}

loadCRM();
