/**
 * ============================================================================
 * ONEFLOW 360 - V253.1 (FINAL LOGIC & PRINT FIX)
 * 1. Base: V253.0.
 * 2. Fix: generatePreview uses 'flex' to align with new centered CSS.
 * 3. Content: Full product presets retained.
 * ============================================================================
 */

// --- 1. Global Settings ---
let GAS_URL = localStorage.getItem('oneflow_gas_url') || ""; 
const START_DOC_NUM = 135250;
const VAT_RATE = 0; 
let activeClientId = null;
let quoteItems = [];       
let hoursScopeLines = [];  
let currentDashFilter = ''; 
let autoSyncInterval = null;

function setText(id, text) { 
    const el = document.getElementById(id); 
    if(el) el.innerText = text; 
}
function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}
const cleanID = (id) => String(id || "").trim();

let data = { clients: [], crm: [], finance: [], expenses: [] };

// --- 2. Full Content ---

const TERMS_FULL_PRODUCT = `
<div style="font-size:12px; line-height:1.5; color:#333; font-family:Arial, sans-serif;">
    <h4 style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">1. תהליך ההקמה והפיתוח</h4>
    <ul>
        <li><strong>אפיון ותוכנית עבודה:</strong> לאחר תשלום המקדמה, יחל תהליך אפיון צרכים מול הלקוח. בסיומו יופק מסמך אפיון לחתימת הלקוח, שיהווה את בסיס העבודה במסגרת גאנט וסבבי איטרציות מוגדרים.</li>
        <li><strong>שינויים ותוספות:</strong> כל בקשה לפיתוח ממשק או יכולות שאינן במפרט המקורי (Change Request), תתומחר בנפרד ותבוצע רק לאחר אישור הצעת מחיר בכתב.</li>
        <li><strong>עיצוב:</strong> העלות כוללת עיצוב גרסה ראשונה (עד 3 סבבי תיקונים ל-UI/UX). גרסאות נוספות יתומחרו בנפרד.</li>
        <li><strong>תחילת חיוב שוטף (שלב א'):</strong> לאחר הגשת שלב א' וסיום חודש בדיקות שטח - יחל תשלום שוטף חודשי עבור תחזוקת מערכת הבסיס והשרתים.</li>
        <li><strong>תחילת חיוב מלא (סיום הקמה):</strong> לאחר סיום ההקמה בהתאם לאפיון - יחל התשלום השוטף החודשי המלא עבור מערכת הבסיס ומשתמשי המערכת.</li>
    </ul>

    <h4 style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">2. עלויות צד ג' ותשלומים נלווים</h4>
    <ul>
        <li>באחריות הלקוח לשאת בעלויות פתיחת/חידוש חשבונות מפתחים בחנויות (כ-99$ לשנה לאפל, כ-25$ חד-פעמי לגוגל).</li>
        <li>במידה והלקוח יבחר להשתמש בשירותי סליקה (Credit Card Clearing), כל התשלומים והעמלות ישולמו ישירות לחברת הסליקה/המסוף.</li>
        <li>עלויות שרתים ואחסון (Cloud Hosting) כלולות במחיר הריטיינר, עד לתעבורה סבירה (Fair Use Policy). חריגה קיצונית בנפח תעבורה תתומחר בנפרד.</li>
    </ul>

    <h4 style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">3. שירות, תמיכה ו-SLA</h4>
    <ul>
        <li><strong>גורמים מורשים:</strong> התמיכה הטכנית תינתן לאנשי קשר מורשים (מנהלי מערכת) מטעם הלקוח בלבד.</li>
        <li><strong>שעות פעילות המוקד:</strong> ימים א'-ה' 09:00-17:00. יום ו' וערבי חג - ללא מענה (למעט מקרי חירום).</li>
        <li><strong>SLA (אמנת שירות):</strong> תקלות משביתות (מערכת למטה) יטופלו בתוך 4-24 שעות (כולל סופ"ש). תקלות משתמש בודד או באגים שאינם קריטיים יטופלו עד 3 ימי עסקים.</li>
        <li>גיבויים למסד הנתונים מתבצעים אוטומטית אחת ל-24 שעות.</li>
    </ul>

    <h4 style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">4. הסכם שירות וקניין רוחני</h4>
    <ul>
        <li>הסכם השירות מתחדש אוטומטית, אלא אם התקבלה הודעת ביטול רשמית במייל 60 יום מראש.</li>
        <li><strong>קניין רוחני:</strong> חברת OneBtn הינה הבעלים הבלעדי של קוד המקור, המנוע, הלוגיקה והעיצובים של המערכת. הרישיון ללקוח הוא זכות שימוש בלבד (SaaS) כל עוד משולמים דמי המנוי.</li>
        <li>הנתונים (Data) שהוזנו למערכת הם רכושו הבלעדי של הלקוח.</li>
    </ul>

    <h4 style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">5. תנאי תשלום</h4>
    <ul>
        <li>המחירים בהצעה זו אינם כוללים מע"מ כחוק.</li>
        <li><strong>תנאי תשלום להקמה:</strong> מקדמה בסך 30% מסך ההצעה בחתימה. יתרת הסכום תשולם ב-4 תשלומים חודשיים שווים ועוקבים.</li>
        <li><strong>תנאי תשלום לשוטף:</strong> יבוצעו בהוראת קבע בנקאית / כרטיס אשראי בכל 1 לחודש עבור החודש העוקב.</li>
        <li>פיגור בתשלום מעל 14 יום יאפשר לחברה להשהות את מתן השירותים וגישת המשתמשים למערכת.</li>
        <li>תוקף ההצעה: 14 ימים מיום הפקתה.</li>
    </ul>
</div>
`;

const PRESETS = {
    "hours_quote": [
        { name: "--- הקלדה ידנית ---", desc: "", price: 0, isMonthly: false },
        { name: "בנק 10 שעות", desc: "פיתוח וליווי", price: 3500, isMonthly: false },
        { name: "בנק 25 שעות", desc: "פיתוח וליווי (הנחה)", price: 8250, isMonthly: false },
        { name: "בנק 50 שעות", desc: "פיתוח וליווי (הנחה)", price: 15000, isMonthly: false },
        { name: "שעת פיתוח", desc: "Full Stack", price: 350, isMonthly: false },
        { name: "שעת אפיון", desc: "ניתוח צרכים", price: 350, isMonthly: false },
        { name: "ניהול פרויקט", desc: "ניהול ובקרה", price: 350, isMonthly: false },
        { name: "עיצוב UI/UX", desc: "עיצוב מסכים", price: 400, isMonthly: false },
        { name: "ייעוץ טכנולוגי", desc: "CTO as Service", price: 550, isMonthly: false }
    ],
    "product_quote": [
        { name: "--- הקלדה ידנית ---", desc: "", price: 0, isMonthly: false },
        { name: "חבילת בסיס OneFlow", desc: "מערכת B2B", price: 60000, isMonthly: false },
        { name: "תחזוקה/ארוח/שרות", desc: "שרתים ותמיכה", price: 1500, isMonthly: true },
        { name: "מודול סוכני שטח", desc: "אפליקציית סוכן", price: 10000, isMonthly: false },
        { name: "מודול ליקוט", desc: "WMS Lite", price: 12000, isMonthly: false },
        { name: "מודול נהגים", desc: "POD", price: 12000, isMonthly: false }
    ],
    "iteration": []
};

const DOC_CONFIG = {
    'iteration': { intro: "<p>לקוח יקר,<br>מצ\"ב תכולת האיטרציה לאישור.</p>", terms: "" },
    'hours_quote': { intro: "<p>הצעת מחיר לבנק שעות.</p>", terms: "<h4>תנאים:</h4><ul><li>תוקף 14 יום</li></ul>" },
    'product_quote': { intro: "<p>הצעת מחיר למערכת OneFlow 360.</p>", terms: TERMS_FULL_PRODUCT }
};

const ITERATION_STEPS = [
    { id: 1, title: "איטרציה 1", desc: "תכולה סגורה" },
    { id: 2, title: "איטרציה 2", desc: "פיתוח" },
    { id: 3, title: "איטרציה 3", desc: "בדיקות" },
    { id: 4, title: "איטרציה 4", desc: "סגירות" },
    { id: 5, title: "איטרציה 5", desc: "עליה לאוויר" }
];

// --- 3. Helpers ---
function showLoader() { if(document.getElementById('loader')) document.getElementById('loader').style.display = 'flex'; }
function hideLoader() { if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none'; }
function parseDateISO(val) {
    if (!val) return "";
    try { 
        let d = new Date(val); 
        if(isNaN(d.getTime())) return "";
        const offset = d.getTimezoneOffset();
        d = new Date(d.getTime() - (offset*60*1000));
        return d.toISOString().split('T')[0]; 
    } catch(e) { return ""; }
}
function showToast(msg) {
    const box = document.getElementById('toast-container');
    if(box) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        box.appendChild(t);
        setTimeout(() => { t.remove(); }, 3000);
    }
}

// --- 4. Navigation ---
window.switchView = function(viewId, btn) { 
     try {
         document.getElementById('previewWrapper').style.display = 'none'; 
         let editor = document.getElementById('editorArea');
         if(editor) editor.style.display = 'block'; 
         document.querySelector('.sidebar').style.display = 'flex';
         document.querySelector('.main-content').style.display = 'block';

         document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active')); 
         let target = document.getElementById('view-' + viewId);
         if(target) target.classList.add('active'); 
         
         document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
         if(btn) btn.classList.add('active'); 
         
         if(viewId === 'crm') renderCRMTable(); 
         if(viewId === 'generator') updateFormView(); 
         if(viewId === 'settings') { document.getElementById('settingGasUrl').value = GAS_URL; }
         if(viewId === 'dashboard') renderDashboard();

     } catch(e) { console.error("Navigation Error:", e); }
};

window.onload = async function() {
    let savedUrl = localStorage.getItem('oneflow_gas_url');
    setupDefaultDates();
    try { updateFormView(); } catch(e) {}
    if(savedUrl) { 
        GAS_URL = savedUrl; 
        document.getElementById('settingGasUrl').value = savedUrl; 
        await refreshData();
    } else {
        switchView('settings');
        hideLoader();
    }
};

window.saveSettings = async function() {
    const input = document.getElementById('settingGasUrl');
    let newUrl = input.value.trim();
    if (!newUrl) return alert("אנא הזן כתובת");
    showLoader();
    if(document.getElementById('connectionStatusMain')) document.getElementById('connectionStatusMain').innerText = "בודק חיבור...";
    GAS_URL = newUrl;
    localStorage.setItem('oneflow_gas_url', newUrl);
    await refreshData(true); 
    hideLoader();
    if (document.getElementById('connectionStatusMain') && document.getElementById('connectionStatusMain').innerText === '') {
        alert("מחובר בהצלחה!");
        switchView('dashboard');
    } else {
        alert("שגיאת חיבור.");
    }
};

function setupDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    ['inpNoteDate','inpFinDate','expDate','inputDate'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = today;
    });
    document.getElementById('inputDocNum').value = localStorage.getItem('oneflow_last_doc_num') || START_DOC_NUM;
}

// --- 5. Data Sync ---
async function refreshData(silent = false) {
    if(!silent) showLoader();
    const statusEl = document.getElementById('connectionStatusMain');
    if(statusEl) statusEl.innerText = ''; 
    try {
        if(!GAS_URL) throw new Error("חסרה כתובת שרת");
        const res = await fetch(GAS_URL + "?action=getAllData&t=" + new Date().getTime());
        const json = await res.json();
        if(json.status === 'error') throw new Error(json.message);
        
        let clientsList = json.clients || [];
        let rawFinance = json.finance || [];
        let validFinance = [];
        let activeClientIds = new Set(clientsList.map(c => cleanID(c.ClientID)));

        rawFinance.forEach(f => {
            if(activeClientIds.has(cleanID(f.ClientID))) {
                f.Status = (f.Status || "").trim();
                f._isoDate = parseDateISO(f.PaymentDate); 
                validFinance.push(f);
            }
        });

        data = { clients: clientsList, crm: json.crm||[], finance: validFinance, expenses: json.expenses||[] };
        
        if(typeof renderDashboard === 'function') renderDashboard(); 
        if(typeof renderCRMTable === 'function') renderCRMTable(); 
        if(typeof populateGeneratorClients === 'function') populateGeneratorClients(); 

        if(activeClientId) {
            renderClientFinance(); 
            renderClientIterations(); 
            renderClientNotes();
            renderClientQuotes();
            updateQuoteLinkDropdown();
        }
        if(!silent) showToast("נתונים עודכנו");

    } catch(e) { 
        console.error(e);
        if(statusEl) statusEl.innerText = `תקלה: ${e.message}`; 
    } finally { if(!silent) hideLoader(); }
}

async function sendToGAS(action, payload) { 
    try { 
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: action, data: payload }) }); 
        return await res.json();
    } catch(e) { return { status: 'error', message: e.message }; } 
}

// --- 6. Import Logic ---
window.processImport = async function() {
    const text = document.getElementById('importText').value;
    const logDiv = document.getElementById('importLog');
    logDiv.innerHTML = "מתחיל עיבוד...<br>";
    if(!text.trim()) { alert("אנא הדבק תוכן לייבוא"); return; }
    
    const lines = text.split('\n');
    let successCount = 0;
    try {
        for (let line of lines) {
            if (!line.trim()) continue;
            const parts = line.trim().split(/\t|\s{2,}/); 
            let clientId = "", date = "", amount = 0, docNum = "", desc = "";

            for (let p of parts) {
                p = p.trim().replace(/,/g, '');
                if (!clientId && /^\d{9}$/.test(p)) clientId = p;
                else if (!date && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(p)) {
                    const [d, m, y] = p.split('/');
                    date = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
                }
                else if (amount === 0 && !isNaN(parseFloat(p.replace(/,/g, ''))) && parseFloat(p.replace(/,/g, '')) > 100 && p.length < 9 && !p.includes('/')) {
                    amount = parseFloat(p.replace(/,/g, ''));
                }
                else if (!docNum && /^\d{4,6}$/.test(p) && p !== clientId) docNum = p;
                else if (p.length > 3 && isNaN(parseFloat(p))) desc += (desc ? " - " : "") + p;
            }
            if (!desc) desc = "ייבוא אוטומטי";

            const client = data.clients.find(c => c.HP == clientId || c.ClientID == clientId);
            if (client && amount > 0) {
                const payload = {
                    TransID: 'T' + Date.now() + Math.floor(Math.random()*1000),
                    ClientID: cleanID(client.ClientID),
                    ClientName: client['Company Name'],
                    DocType: 'הכנסה (ייבוא)',
                    DocNum: docNum,
                    Description: desc.substring(0, 150),
                    Amount: amount,
                    PaymentDate: date || new Date().toISOString().split('T')[0],
                    Status: 'שולם',
                    CollectionType: 'Manual',
                    ItemsJSON: '[]'
                };
                sendToGAS('addFinance', payload).then(res => {
                     if(res.status === 'success') logDiv.innerHTML += `<span style="color:lightgreen">✔ ${client['Company Name']}: ${amount.toLocaleString()} ₪</span><br>`;
                     else logDiv.innerHTML += `<span style="color:orange">⚠ שגיאה: ${client['Company Name']}</span><br>`;
                });
                successCount++;
            } else {
                logDiv.innerHTML += `<span style="color:red">❌ נכשל: ${line.substring(0,30)}...</span><br>`;
            }
        }
        setTimeout(() => refreshData(true), 3000);
    } catch(e) { logDiv.innerHTML += `<span style="color:red; font-weight:bold;">שגיאה קריטית: ${e.message}</span>`; }
};

// --- 7. CRM & Modal ---
function renderCRMTable() {
    const tbody = document.querySelector('#crmTable tbody'); 
    if(!tbody) return; 
    tbody.innerHTML = "";
    const term = document.getElementById('crmSearch') ? document.getElementById('crmSearch').value.toLowerCase() : "";
    data.clients.forEach((c) => {
        const textToSearch = (c['Company Name'] + (c['Contact Person']||'') + (c.Phone||'') + (c.HP||'')).toLowerCase();
        if (term && !textToSearch.includes(term)) return;
        tbody.innerHTML += `<tr><td><strong>${c['Company Name']}</strong></td><td>${c['Contact Person']||''}</td><td>${c.Status}</td><td>${c.Phone||''}</td><td>${c.HP||''}</td><td><button class="btn btn-sm btn-primary" onclick="openClientModal('${c.ClientID}')">ערוך</button></td></tr>`;
    });
}

window.openClientModal = function(clientId) {
    document.getElementById('clientModal').style.display = 'flex';
    if (clientId === 'NEW') { 
        activeClientId = 'C' + Date.now(); 
        document.getElementById('modalTitle').innerText = "לקוח חדש"; 
        ['inpCName','inpCContact','inpCPhone','inpCEmail','inpCHP','inpCRetainer'].forEach(id => { document.getElementById(id).value = ''; });
        switchModalTab('details');
    } else {
        activeClientId = cleanID(clientId);
        let c = data.clients.find(x => cleanID(x.ClientID) === activeClientId); 
        if(c) { 
            document.getElementById('modalTitle').innerText = "כרטיס: " + c['Company Name']; 
            document.getElementById('inpCName').value = c['Company Name'] || "";
            document.getElementById('inpCContact').value = c['Contact Person'] || "";
            document.getElementById('inpCPhone').value = c.Phone || "";
            document.getElementById('inpCEmail').value = c.Email || "";
            document.getElementById('inpCHP').value = c.HP || "";
            document.getElementById('inpCStatus').value = c.Status || "";
            document.getElementById('inpCRetainer').value = c.RetainerAmount || 0;
            if(document.getElementById('inpCFrozen')) document.getElementById('inpCFrozen').checked = (c.Frozen === true);
        }
        updateQuoteLinkDropdown(); 
        renderClientNotes(); 
        renderClientFinance(); 
        renderClientIterations(); 
        renderClientQuotes();
        switchModalTab('details');
    }
};

window.closeModal = function() { document.getElementById('clientModal').style.display = 'none'; };
window.switchModalTab = function(tabName) { 
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active')); 
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active')); 
    document.getElementById('mtab-' + tabName).classList.add('active'); 
    if(tabName === 'iterations') renderClientIterations();
};

window.saveClientDetails = async function() { 
    if(!activeClientId) return alert("בחר לקוח");
    showLoader();
    try {
        const clientObj = { 
            ClientID: activeClientId, 
            'Company Name': document.getElementById('inpCName').value, 
            'Contact Person': document.getElementById('inpCContact').value, 
            Phone: document.getElementById('inpCPhone').value, 
            Email: document.getElementById('inpCEmail').value, 
            HP: document.getElementById('inpCHP').value, 
            Status: document.getElementById('inpCStatus').value, 
            RetainerAmount: document.getElementById('inpCRetainer').value, 
            'Last Update': new Date().toISOString()
        }; 
        await sendToGAS('saveClient', clientObj); 
        await refreshData(true); 
        showToast("נשמר!"); 
    } catch(e) { alert(e.message); } finally { hideLoader(); }
};

window.addNote = async function() {
    const content = document.getElementById('inpNoteContent').value;
    if(!content) return;
    showLoader();
    try {
        const note = { LogID: 'L'+Date.now(), ClientID: activeClientId, Date: document.getElementById('inpNoteDate').value, Type: 'הערה', Content: content }; 
        await sendToGAS('saveLog', note); 
        document.getElementById('inpNoteContent').value = ''; 
        await refreshData(true);
        showToast("נשמר!");
    } catch(e) { alert("שגיאה"); } finally { hideLoader(); }
};

// --- 8. Iterations Logic ---

function renderClientIterations() {
    const container = document.getElementById('iterationsContainer'); if(!container) return;
    container.innerHTML = "";
    
    let client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
    let iterData = {};
    if(client && client.IterationsJSON) { try { iterData = JSON.parse(client.IterationsJSON); } catch(e) {} }
    
    let liveStatus = client ? (client.Iter1_Status_Live || 'טרם התחיל') : 'טרם התחיל'; 
    const clientDocs = (data.finance || []).filter(f => 
        cleanID(f.ClientID) === activeClientId && 
        ['iteration', 'איטרציה'].some(t => String(f.DocType).toLowerCase().includes(t))
    );

    ITERATION_STEPS.forEach(step => {
        let stepKey = `iter_${step.id}`;
        let saved = iterData[stepKey] || { status: 'טרם התחיל', notes: '', linkedDoc: '', sheetUrl: '' };
        
        let docOptions = `<option value="">-- בחר מסמך --</option>`;
        clientDocs.forEach(doc => {
            const isSelected = cleanID(saved.linkedDoc) === cleanID(doc.TransID) ? 'selected' : '';
            docOptions += `<option value="${doc.TransID}" ${isSelected}>#${doc.DocNum}</option>`;
        });
        
        let displayStatus = (step.id === 1 && liveStatus && liveStatus !== 'טרם התחיל') ? liveStatus : saved.status;

        let div = document.createElement('div');
        div.className = 'iter-card';
        div.setAttribute('data-status', displayStatus);
        div.innerHTML = `
            <div class="iter-header">
                <b>${step.title}</b> 
                <div style="display:flex; gap:10px; align-items:center;">
                    <span class="status-badge">${displayStatus}</span>
                    <button class="btn btn-sm btn-primary" onclick="syncIterationStatus(${step.id})">🔗 סנכרן</button>
                </div>
            </div>
            <div class="iter-body">
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                    <select id="iter_status_${step.id}" style="width:140px;">
                        <option ${displayStatus=='טרם התחיל'?'selected':''}>טרם התחיל</option>
                        <option ${displayStatus=='בתהליך'?'selected':''}>בתהליך</option>
                        <option ${displayStatus=='ממתין ללקוח'?'selected':''}>ממתין ללקוח</option>
                        <option ${displayStatus=='הושלם'?'selected':''}>הושלם</option>
                        <option ${displayStatus=='סיום'?'selected':''}>סיום</option>
                        <option ${displayStatus=='אושר ע"י לקוח'?'selected':''}>אושר ע"י לקוח</option>
                        <option ${displayStatus=='תכולה מאושרת'?'selected':''}>תכולה מאושרת</option>
                        <option ${displayStatus=='תכולה ממתינה לאישור'?'selected':''}>תכולה ממתינה לאישור</option>
                    </select>
                    <select id="iter_link_${step.id}" style="flex:1;" onchange="updateInlineContentList(${step.id})">${docOptions}</select>
                </div>
                <div id="iter_content_list_${step.id}" style="background:#f0f7ff; padding:10px; font-size:13px; margin-bottom:10px; display:none;"></div>
                <input type="text" id="iter_sheet_url_${step.id}" class="iter-link-input" placeholder="ID גיליון חיצוני" value="${(step.id==1)?(client.Iter1_Link_ID||''):saved.sheetUrl}" style="width:100%; margin-bottom:10px; padding:5px;">
                <button class="btn btn-sm btn-success" onclick="saveIterationData(${step.id})">💾 שמור</button>
            </div>
        `;
        container.appendChild(div);
        if (saved.linkedDoc) updateInlineContentList(step.id);
    });
}

window.updateInlineContentList = function(stepId) {
    const select = document.getElementById(`iter_link_${stepId}`);
    const div = document.getElementById(`iter_content_list_${stepId}`);
    if (!select || !div) return;
    const transId = cleanID(select.value);
    
    if (!transId) { div.style.display = 'none'; return; }
    
    const doc = data.finance.find(f => cleanID(f.TransID) === transId);
    
    if (doc && doc.ItemsJSON) {
        try {
            const items = JSON.parse(doc.ItemsJSON);
            if (Array.isArray(items) && items.length > 0) {
                let html = "<strong>תכולת מסמך:</strong><ul style='margin:0; padding-right:20px;'>";
                items.forEach(it => html += `<li>${it.name || "פריט ללא שם"}</li>`);
                html += "</ul>";
                div.innerHTML = html;
                div.style.display = 'block';
            } else {
                div.innerHTML = "<em>מסמך ללא פריטים</em>";
                div.style.display = 'block';
            }
        } catch(e) { 
            div.innerHTML = "<em>שגיאה בטעינת פריטים</em>";
            div.style.display = 'block'; 
        }
    } else {
        div.style.display = 'none';
    }
}

window.saveIterationData = async function(stepId, silent = false) {
    if(!activeClientId) return;
    if(!silent) showLoader();
    try {
        let client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
        let currentIterData = client && client.IterationsJSON ? JSON.parse(client.IterationsJSON) : {};
        const statusEl = document.getElementById(`iter_status_${stepId}`);
        const linkedDocEl = document.getElementById(`iter_link_${stepId}`);
        const sheetUrlEl = document.getElementById(`iter_sheet_url_${stepId}`);
        
        currentIterData[`iter_${stepId}`] = {
            status: statusEl?.value || 'טרם התחיל',
            linkedDoc: cleanID(linkedDocEl?.value),
            sheetUrl: sheetUrlEl?.value.trim() || ""
        };
        await sendToGAS('saveClient', { ClientID: activeClientId, IterationsJSON: JSON.stringify(currentIterData), Iter1_Link_ID: (stepId===1)?sheetUrlEl.value.trim():client.Iter1_Link_ID }); 
        await refreshData(true);
        if(!silent) showToast("נשמר בהצלחה!");
    } catch(e) { console.error(e); } finally { if(!silent) hideLoader(); }
};

window.syncIterationStatus = async function(iterId) {
    if (iterId !== 1) return showToast("סנכרון פעיל רק לאיטרציה 1.");
    showLoader();
    try {
        await saveIterationData(1, true); 
        const res = await fetch(GAS_URL + "?action=checkIterationStatus&t=" + Date.now());
        const json = await res.json();
        if(json.status === 'success') { await refreshData(true); showToast("סונכרן!"); }
    } catch(e) { console.error(e); } finally { hideLoader(); }
};

// --- 9. Generator & PDF Logic ---

function populateGeneratorClients() { 
    const dl = document.getElementById('dlClientsGen'); if (!dl) return;
    dl.innerHTML = ''; 
    data.clients.forEach(c => dl.appendChild(new Option(c['Company Name'], c['Company Name']))); 
}

function fillClientFromCRM() { 
    const name = document.getElementById('inputClientName').value.trim(); 
    const c = data.clients.find(x => x['Company Name'] === name); 
    if(c) { 
        document.getElementById('genClientHP').value = c.HP||''; 
        document.getElementById('genClientContact').value = c['Contact Person']||''; 
        document.getElementById('genClientEmail').value = c.Email||''; 
    }
}

window.updateFormView = function() {
    const type = document.getElementById('docType').value;
    document.getElementById('areaIterFields').style.display = (type === 'iteration') ? 'block' : 'none';
    document.getElementById('areaHoursScope').style.display = (type === 'hours_quote') ? 'block' : 'none';
    document.getElementById('areaBuilder').style.display = (type !== 'iteration') ? 'block' : 'none';
    document.getElementById('builderTotals').style.display = (type !== 'iteration') ? 'block' : 'none';

    const sel = document.getElementById('selItemPreset');
    if(sel && PRESETS[type]) {
        sel.innerHTML = '<option value="">-- בחר פריט --</option>';
        PRESETS[type].forEach((p, i) => sel.add(new Option(p.name, i)));
    }
    quoteItems = []; renderBuilderTable();
}

window.fillItemDetails = function() { 
    let type = document.getElementById('docType').value; 
    let idx = document.getElementById('selItemPreset').value; 
    if(idx !== "" && PRESETS[type][idx]) { 
        let p = PRESETS[type][idx]; 
        document.getElementById('inputItemName').value = p.name.includes("---")?"":p.name; 
        document.getElementById('inputItemPrice').value = p.price; 
        document.getElementById('inputItemDesc').value = p.desc || ""; 
        document.getElementById('cbIsMonthly').checked = (p.isMonthly === true);
    } 
}

window.addItemRow = function() { 
    let name = document.getElementById('inputItemName').value; if(!name) return; 
    quoteItems.push({ 
        name: name, 
        price: parseFloat(document.getElementById('inputItemPrice').value)||0, 
        qty: parseFloat(document.getElementById('inputItemQty').value)||1, 
        desc: document.getElementById('inputItemDesc').value, 
        isMonthly: document.getElementById('cbIsMonthly').checked 
    }); 
    renderBuilderTable(); 
    document.getElementById('inputItemName').value = ''; 
    document.getElementById('inputItemPrice').value = 0; 
    document.getElementById('cbIsMonthly').checked = false;
}

function renderBuilderTable() {
    const tbody = document.getElementById('builderTableBody'); if(!tbody) return { setup: 0, monthly: 0 };
    tbody.innerHTML = ''; let setup = 0, monthly = 0;
    const discPercent = parseFloat(document.getElementById('inputDiscountPercent').value) || 0;

    quoteItems.forEach((item, i) => {
        const total = item.price * item.qty;
        if(item.isMonthly) monthly += total; else setup += total;
        tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price.toLocaleString()}</td><td>${total.toLocaleString()}</td><td><span class="badge ${item.isMonthly?'badge-info':'badge-warning'}">${item.isMonthly?'שוטף':'הקמה'}</span></td><td><button class="btn-danger" onclick="removeItem(${i})">X</button></td></tr>`;
    });

    const setupAfterDisc = setup * (1 - discPercent/100);
    document.getElementById('dispSetup').innerText = setupAfterDisc.toLocaleString();
    document.getElementById('dispMonthly').innerText = monthly.toLocaleString();
    
    return { setup, monthly, setupAfterDisc, discPercent };
}

window.removeItem = function(i) { quoteItems.splice(i, 1); renderBuilderTable(); }

window.generatePreview = function() {
    const clientName = document.getElementById('inputClientName').value;
    if(!clientName) return alert("אנא בחר לקוח");
    
    document.getElementById('editorArea').style.display = 'none';
    document.getElementById('previewWrapper').style.display = 'flex'; // Fix: Flex ensures centering
    document.querySelector('.sidebar').style.display = 'none';
    
    setText('pClientName', clientName);
    setText('pClientHP', document.getElementById('genClientHP').value || '-');
    setText('pContact', document.getElementById('genClientContact').value || '-');
    
    setText('pDocNum', document.getElementById('inputDocNum').value);
    setText('pDate', new Date().toLocaleDateString('he-IL'));
    
    const type = document.getElementById('docType').value;
    document.getElementById('pIntroText').innerHTML = DOC_CONFIG[type].intro;
    document.getElementById('pTerms').innerHTML = DOC_CONFIG[type].terms;
    
    const setupItems = quoteItems.filter(i => !i.isMonthly);
    const monthlyItems = quoteItems.filter(i => i.isMonthly);
    
    let html = "";

    if (setupItems.length > 0 && type !== 'iteration') {
        html += `<h4 style="color:#28a745; border-bottom:2px solid #28a745; margin-bottom:5px;">עלויות הקמה / פיתוח (חד פעמי)</h4>`;
        html += `<table class='print-table'><thead><tr><th>פריט</th><th>כמות</th><th>מחיר יח'</th><th>סה"כ</th></tr></thead><tbody>`;
        setupItems.forEach(it => {
            html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>${it.price.toLocaleString()}</td><td>${(it.price*it.qty).toLocaleString()} ₪</td></tr>`;
        });
        html += `</tbody></table><br>`;
    }

    if (monthlyItems.length > 0 && type !== 'iteration') {
        html += `<h4 style="color:#007bff; border-bottom:2px solid #007bff; margin-bottom:5px;">עלויות שוטפות (ריטיינר חודשי)</h4>`;
        html += `<table class='print-table'><thead><tr><th>פריט</th><th>כמות</th><th>מחיר יח'</th><th>סה"כ</th></tr></thead><tbody>`;
        monthlyItems.forEach(it => {
            html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>${it.price.toLocaleString()}</td><td>${(it.price*it.qty).toLocaleString()} ₪</td></tr>`;
        });
        html += `</tbody></table><br>`;
    }

    const freeText = (type === 'iteration') ? document.getElementById('inputPasteIter').value : (type === 'hours_quote' ? document.getElementById('inputPasteQuote').value : "");
    
    let extraInfo = "";
    if (type === 'iteration') {
        const releaseDate = document.getElementById('inputReleaseDate')?.value;
        if (releaseDate) extraInfo = `<div style="margin-bottom:10px;"><strong>צפי גרסה:</strong> ${parseDateISO(releaseDate)}</div>`;
    }

    if (freeText.trim() || extraInfo) {
        html += `<div style="background:#f9f9f9; padding:15px; border-left:4px solid #555; margin-top:20px;">
            ${extraInfo}
            <strong>פירוט תוכן:</strong><br>${freeText.replace(/\n/g, '<br>')}
        </div>`;
    }

    document.getElementById('pContentTables').innerHTML = html;
    
    const bottomSec = document.getElementById('bottomSection');
    const totalsBox = document.getElementById('pTotalsBox');
    
    if(type === 'iteration') {
        bottomSec.style.display = 'none';
    } else {
        bottomSec.style.display = 'flex';
        const t = renderBuilderTable(); 
        const vat = t.setupAfterDisc * VAT_RATE;
        const totalFinal = t.setupAfterDisc + vat;
        
        let totHtml = `<div style="border:2px solid #333; padding:15px; border-radius:8px; min-width:320px; max-width:400px; background:#fff; box-sizing:border-box;">`;
        if (t.setup > 0) {
            totHtml += `<div class="total-row"><span>סה"כ הקמה:</span><span>${t.setup.toLocaleString()} ₪</span></div>`;
            if (t.discPercent > 0) totHtml += `<div class="total-row" style="color:red;"><span>הנחה (${t.discPercent}%):</span><span>-${(t.setup - t.setupAfterDisc).toLocaleString()} ₪</span></div>`;
            totHtml += `<div class="total-row"><span>מע"מ (18%):</span><span>${vat.toLocaleString()} ₪</span></div>`;
            totHtml += `<div class="total-row" style="font-weight:bold; font-size:1.2em; border-top:1px solid #ccc; margin-top:5px; padding-top:5px;"><span>סה"כ לתשלום:</span><span>${totalFinal.toLocaleString()} ₪</span></div>`;
        }
        if (t.monthly > 0) {
            const monthlyVat = t.monthly * VAT_RATE;
            const monthlyFinal = t.monthly + monthlyVat;
            totHtml += `<div style="margin-top:15px; padding-top:10px; border-top:2px dashed #007bff; color:#0056b3;">
                <div class="total-row" style="display:flex; justify-content:space-between;">
                    <span>+ שוטף חודשי (כולל מע"מ):</span>
                    <strong>${monthlyFinal.toLocaleString()} ₪</strong>
                </div>
            </div>`;
        }
        totHtml += `</div>`;
        totalsBox.innerHTML = totHtml;
    }

    document.title = `${clientName} - ${document.getElementById('inputDocNum').value}`;
    window.scrollTo(0,0);
};

window.downloadPDF = function() { window.print(); };
window.editMode = function() { 
    document.getElementById('editorArea').style.display = 'block';
    document.getElementById('previewWrapper').style.display = 'none';
    document.querySelector('.sidebar').style.display = 'flex';
};

window.saveDealFromGenerator = async function() { 
    const clientName = document.getElementById('inputClientName').value; 
    const clientObj = data.clients.find(c => String(c['Company Name']).trim() === String(clientName).trim()); 
    if(!clientObj) return alert("לקוח לא קיים"); 
    
    // FORCE PARSE ON SAVE
    const type = document.getElementById('docType').value;
    if (type === 'iteration') parseIterationText();

    showLoader();
    try {
        const t = renderBuilderTable();
        const docNum = document.getElementById('inputDocNum').value;
        
        let typeName = 'הצעת מחיר';
        if(type === 'iteration') typeName = 'איטרציה';
        if(type === 'hours_quote') typeName = 'בנק שעות';
        
        let desc = `#${docNum} - ${typeName} - ${clientName}`;
        if(type === 'iteration') desc += ` (מס' ${document.getElementById('inputIterNum').value})`;

        const payload = { 
            TransID: 'T' + Date.now(), 
            ClientID: cleanID(clientObj.ClientID), 
            ClientName: clientName, 
            DocType: type, 
            DocNum: docNum, 
            Amount: (type === 'iteration') ? 0 : t.setupAfterDisc, 
            PaymentDate: new Date().toISOString(), 
            Status: (type === 'iteration') ? 'תיעוד בלבד' : 'הצעת מחיר', 
            Description: desc,
            ItemsJSON: JSON.stringify(quoteItems) 
        };
        await sendToGAS('addFinance', payload);
        await refreshData(true); 
        showToast("נשמר ביומן!"); 
    } catch(e) { console.error(e); } finally { hideLoader(); }
};

window.createNewQuoteFromClient = function() {
    if (!activeClientId) return alert("בחר לקוח");
    const client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
    if (!client) return;
    document.getElementById('clientModal').style.display = 'none';
    switchView('generator', document.querySelector('.nav-btn[onclick*="generator"]'));
    document.getElementById('inputClientName').value = client['Company Name'];
    fillClientFromCRM(); 
};

function parseIterationText() {
    const text = document.getElementById('inputPasteIter').value;
    quoteItems = text.split('\n').filter(l => l.trim()).map(line => ({ name: line.trim(), qty: 1, price: 0, isMonthly: false }));
    renderBuilderTable();
}

function parseQuotePaste() { /* Placeholder */ }

// --- 10. CRM & Finance Display (V250 - TABLE & LOGIC FIX) ---

function renderClientFinance() {
    const list = document.getElementById('financeTableBody'); if(!list) return;
    list.innerHTML = "";
    
    // Filter finance for this client
    const fin = (data.finance || []).filter(f => cleanID(f.ClientID) === activeClientId);
    
    // 1. Calculate Summary Metrics
    const totalRevenue = fin.filter(f => f.Status === 'שולם').reduce((a, b) => a + parseFloat(b.Amount||0), 0);
    const totalApprovedQuotes = fin.filter(f => 
        f.Status === 'אושרה' && 
        (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote'))
    ).reduce((a, b) => a + parseFloat(b.Amount||0), 0);
    
    const balance = totalApprovedQuotes - totalRevenue;

    // Update Badge
    const badge = document.getElementById('clientRevenueBadge');
    if(badge) badge.innerText = `סה"כ הכנסות: ${totalRevenue.toLocaleString()} ₪ | יתרה: ${balance.toLocaleString()} ₪`;

    // Inject Summary Header inside the tab
    let summaryDiv = document.getElementById('financeSummaryHeader');
    if (!summaryDiv) {
        summaryDiv = document.createElement('div');
        summaryDiv.id = 'financeSummaryHeader';
        summaryDiv.style.display = 'flex';
        summaryDiv.style.gap = '15px';
        summaryDiv.style.marginBottom = '15px';
        summaryDiv.style.padding = '10px';
        summaryDiv.style.background = '#f0f4c3';
        summaryDiv.style.borderRadius = '6px';
        const parent = list.closest('#mtab-finance');
        if(parent) parent.insertBefore(summaryDiv, parent.firstChild);
    }
    
    summaryDiv.innerHTML = `
        <div style="flex:1; text-align:center;">
            <div style="font-size:12px; color:#555;">סה"כ הכנסות בפועל (שולם)</div>
            <div style="font-size:18px; font-weight:bold; color:#2e7d32;">${totalRevenue.toLocaleString()} ₪</div>
        </div>
        <div style="flex:1; text-align:center; border-right:1px solid #ccc;">
            <div style="font-size:12px; color:#555;">יתרה לתשלום (פתוח)</div>
            <div style="font-size:18px; font-weight:bold; color:${balance > 0 ? '#d32f2f' : 'green'};">${balance.toLocaleString()} ₪</div>
        </div>
    `;

    if(fin.length === 0) { list.innerHTML = "<tr><td colspan='10' style='text-align:center;'>אין תנועות</td></tr>"; return; }

    fin.forEach(f => {
        let displayDesc = f.Description || f.DocType;
        if(f.DocNum) displayDesc += ` (#${f.DocNum})`;
        
        // V250: Updated to populate all columns defined in HTML
        list.innerHTML += `<tr>
            <td><input type="date" value="${parseDateISO(f.PaymentDate)}" onchange="quickUpdateFinance('${f.TransID}', 'PaymentDate', this.value)" style="width:110px;"></td>
            <td><input type="number" value="${f.Amount}" onchange="quickUpdateFinance('${f.TransID}', 'Amount', this.value)" style="width:80px;"></td>
            <td><input type="text" value="${displayDesc}" onchange="quickUpdateFinance('${f.TransID}', 'Description', this.value)"></td>
            <td>${f.InvoiceNum || '-'}</td>
            <td>${parseDateISO(f.ForecastDate)}</td>
            <td>${f.CollectionType || '-'}</td>
            <td>${f.PaymentMethod || '-'}</td>
            <td>
                <select onchange="quickUpdateFinance('${f.TransID}', 'Status', this.value)">
                    <option ${f.Status=='שולם'?'selected':''}>שולם</option>
                    <option ${f.Status=='ממתין לגביה'?'selected':''}>ממתין לגביה</option>
                    <option ${f.Status=='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                    <option ${f.Status=='אושרה'?'selected':''}>אושרה</option>
                    <option ${f.Status=='חשבונית יצאה'?'selected':''}>חשבונית יצאה</option>
                    <option ${f.Status=='בוטל'?'selected':''}>בוטל</option>
                </select>
            </td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteFinanceItem('${f.TransID}')">X</button></td>
        </tr>`;
    });
}

// V244 Restore: Populating Quote Link Dropdown
window.updateQuoteLinkDropdown = function() {
    const sel = document.getElementById('inpFinLinkQuote');
    const container = document.getElementById('quoteItemsSelectBox');
    if (!sel || !container) return;
    
    sel.innerHTML = '<option value="">-- בחר הצעה לקשר --</option>';
    
    const clientQuotes = data.finance.filter(f => cleanID(f.ClientID) === activeClientId && (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote')));
    clientQuotes.forEach(q => {
        sel.add(new Option(`#${q.DocNum} - ${q.Description} (${q.Amount} ₪)`, q.TransID));
    });
}

window.renderQuoteItemsSelection = function() {
    const sel = document.getElementById('inpFinLinkQuote');
    const box = document.getElementById('quoteItemsSelectBox');
    if (!sel.value) { box.style.display = 'none'; return; }
}

// V244 Restore: Add Finance Item (Full Fields)
window.addFinanceItem = async function() {
    const amt = document.getElementById('inpFinAmount').value;
    if(!amt) return alert("חובה סכום");
    
    let desc = document.getElementById('inpFinDesc').value;
    const invNum = document.getElementById('inpFinInvNum').value;
    if(invNum) desc += ` | חשבונית #${invNum}`;
    
    showLoader();
    try {
        const item = { 
            TransID: 'T'+Date.now(), 
            ClientID: activeClientId, 
            ClientName: document.getElementById('inpCName').value, 
            DocType: document.getElementById('inpFinType').value, 
            Description: desc, 
            Amount: amt, 
            PaymentDate: document.getElementById('inpFinDate').value, 
            Status: document.getElementById('inpFinStatus').value,
            CollectionType: document.getElementById('inpFinCollectionType').value, 
            PaymentMethod: document.getElementById('inpFinMethod').value, 
            LinkedDoc: document.getElementById('inpFinLinkQuote').value, 
            InvoiceNum: invNum,
            ForecastDate: document.getElementById('inpFinForecast').value,
            ItemsJSON: '[]'
        }; 
        await sendToGAS('addFinance', item); 
        await refreshData(true); 
        showToast("נשמר!"); 
        
        document.getElementById('inpFinAmount').value = '';
        document.getElementById('inpFinDesc').value = '';
        document.getElementById('inpFinInvNum').value = '';
    } catch(e) { alert(e.message); } finally { hideLoader(); }
};

// V244 Restore: Quotes Tab Table
function renderClientQuotes() {
    const tbody = document.getElementById('quotesTableBody');
    if(!tbody) return;
    tbody.innerHTML = "";
    
    const quotes = (data.finance || []).filter(f => cleanID(f.ClientID) === activeClientId && (String(f.DocType).toLowerCase().includes('quote') || String(f.DocType).includes('הצעת')));
    
    if (quotes.length === 0) { tbody.innerHTML = "<tr><td colspan='6'>אין הצעות מחיר</td></tr>"; return; }

    quotes.forEach(q => {
        let content = "ללא פירוט";
        try {
             if(q.ItemsJSON) {
                 const items = JSON.parse(q.ItemsJSON);
                 content = items.map(i => i.name).join(", ");
             }
        } catch(e) {}

        tbody.innerHTML += `<tr>
            <td>${parseDateISO(q.PaymentDate)}</td>
            <td>${q.DocNum || '-'}</td>
            <td>${parseFloat(q.Amount).toLocaleString()} ₪</td>
            <td>
                <select onchange="quickUpdateFinance('${q.TransID}', 'Status', this.value)">
                     <option ${q.Status=='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                     <option ${q.Status=='אושרה'?'selected':''}>אושרה</option>
                     <option ${q.Status=='בוטלה'?'selected':''}>בוטלה</option>
                </select>
            </td>
            <td style="font-size:11px; color:#555;">${content.substring(0,50)}...</td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteFinanceItem('${q.TransID}')">X</button></td>
        </tr>`;
    });
}

function renderClientNotes() { 
    const list = document.getElementById('notesList'); if(!list) return; list.innerHTML = ""; 
    const notes = (data.crm || []).filter(n => cleanID(n.ClientID) === activeClientId).sort((a,b) => new Date(b.Date) - new Date(a.Date)); 
    notes.forEach(n => list.innerHTML += `<div class='list-item' style='border-bottom:1px solid #eee; padding:5px;'><div><small>${parseDateISO(n.Date)}</small></div><div>${n.Content}</div></div>`); 
}

function renderExpTable() {
    const tbody = document.querySelector('#expTable tbody');
    if(!tbody) return;
    tbody.innerHTML = "";
    (data.expenses || []).forEach(exp => {
        tbody.innerHTML += `<tr><td>${exp.Type}</td><td>${exp.Description}</td><td>${exp.Amount}</td><td>${exp.Date}</td><td><button>מחק</button></td></tr>`;
    });
}

// --- 11. Dashboard Logic (FULL) ---

function renderDashboard() {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    // 1. Iterations
    let activeIterCount = 0;
    data.clients.forEach(c => {
        if (c.IterationsJSON) {
            try {
                const iterData = JSON.parse(c.IterationsJSON);
                if (Object.values(iterData).some(it => 
                    it.status !== 'סיום' && it.status !== 'הושלם' && it.status !== 'טרם התחיל'
                )) activeIterCount++;
            } catch(e) {}
        }
    });

    // 2. Finance (Paid)
    const paidFin = data.finance.filter(f => f.Status === 'שולם');
    let paidMonth = 0, paidYear = 0, lastYearSum = 0;
    paidFin.forEach(f => {
        const d = new Date(f.PaymentDate);
        const amt = parseFloat(f.Amount||0);
        if (d.getFullYear() === curYear) {
            paidYear += amt;
            if (d.getMonth() === curMonth) paidMonth += amt;
        } else if (d.getFullYear() === curYear - 1) {
            lastYearSum += amt;
        }
    });

    // 3. Forecast Logic
    let recurringMonthly = 0;
    data.clients.forEach(c => {
        if (c.Status === 'לקוח שוטף' && parseFloat(c.RetainerAmount) > 0) {
            recurringMonthly += parseFloat(c.RetainerAmount);
        }
    });
    
    const openFuture = data.finance.filter(f => f.Status === 'תשלום עתידי' || f.Status === 'ממתין לגביה');
    let futureSum = openFuture.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);
    
    const monthsLeft = 12 - curMonth; 
    const forecastYear = paidYear + futureSum + (recurringMonthly * monthsLeft);

    // 4. PIPE
    const quotes = data.finance.filter(f => f.Status === 'הצעת מחיר');
    const pipeSum = quotes.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // 5. Expenses
    const exps = data.expenses || [];
    let expMonth = 0, expYear = 0;
    exps.forEach(e => {
        const d = new Date(e.Date);
        const amt = parseFloat(e.Amount||0);
        if (d.getFullYear() === curYear) {
            expYear += amt;
            if (d.getMonth() === curMonth) expMonth += amt;
        }
    });

    // 6. Setup Year
    const setupItems = data.finance.filter(f => (f.DocType.includes('הקמה') || f.Description.includes('הקמה')) && f.Status === 'שולם');
    const setupYearSum = setupItems.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // 7. Collection This Year (Open Invoices)
    const collectionItems = data.finance.filter(f => {
        const y = new Date(f.PaymentDate).getFullYear();
        return y === curYear && (f.Status === 'חשבונית יצאה' || f.Status === 'ממתין לגביה');
    });
    const collectionSum = collectionItems.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // Update UI (KPIs)
    setText('kpi-iter-count', activeIterCount);
    setText('kpi-coll-month', paidMonth.toLocaleString() + ' ₪');
    setText('kpi-paid-year', paidYear.toLocaleString() + ' ₪');
    setText('kpi-paid-month', paidMonth.toLocaleString() + ' ₪');
    setText('kpi-forecast-total', forecastYear.toLocaleString() + ' ₪');
    
    setText('kpi-pipe', pipeSum.toLocaleString() + ' ₪');
    setText('kpi-last-year', lastYearSum.toLocaleString() + ' ₪');
    
    setText('kpi-next-year', (recurringMonthly * 12).toLocaleString() + ' ₪');
    setText('kpi-rec-year', (recurringMonthly * monthsLeft).toLocaleString() + ' ₪');
    setText('kpi-setup-year', setupYearSum.toLocaleString() + ' ₪');
    setText('kpi-count-quotes', quotes.length);
    
    setText('kpi-exp-month', expMonth.toLocaleString() + ' ₪');
    setText('kpi-exp-year', expYear.toLocaleString() + ' ₪');
    setText('kpi-flow-month', (paidMonth - expMonth).toLocaleString() + ' ₪');
    setText('kpi-flow-year', (paidYear - expYear).toLocaleString() + ' ₪');

    // New KPI UI Update
    setText('kpi-collection-year', collectionSum.toLocaleString() + ' ₪');
}

window.filterDash = function(type, cardEl) {
    document.querySelectorAll('.kpi-card').forEach(c => c.style.borderBottom = 'none');
    if(cardEl) cardEl.style.borderBottom = '4px solid #333';
    currentDashFilter = type;
    renderDashboardTable();
    const tableContainer = document.getElementById('dashTableContainer') || document.getElementById('dashTable');
    if(tableContainer) tableContainer.scrollIntoView({behavior: 'smooth'});
}

// 12. Interactive Dashboard Table (V250 Fix: Client Row Editing)
function renderDashboardTable() {
    const tbody = document.querySelector('#dashTable tbody');
    const thead = document.querySelector('#dashTable thead');
    if(!tbody || !thead) return;
    
    thead.innerHTML = `<tr>
        <th class="col-cb"><input type="checkbox" id="dashSelectAll" onchange="toggleAllDash(this)"></th>
        <th class="col-date">תאריך</th>
        <th class="col-hp">ח.פ</th>
        <th class="col-client">לקוח</th>
        <th class="col-desc">תיאור/נושא</th>
        <th class="col-amount">סכום (נטו)</th>
        <th class="col-amount">ריטיינר</th>
        <th class="col-type">סוג הכנסה</th>
        <th class="col-method">אמצעי תשלום</th>
        <th class="col-status">סטטוס</th>
        <th class="col-action">פעולות</th>
    </tr>`;

    tbody.innerHTML = "";
    
    let rows = [];
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    // Determine Mode
    let isClientMode = false;
    
    if (currentDashFilter === 'iteration' || currentDashFilter === 'recurring' || currentDashFilter === 'next_year') {
        isClientMode = true;
        if(currentDashFilter === 'iteration') {
            rows = data.clients.filter(c => {
                try { const i = JSON.parse(c.IterationsJSON); return Object.values(i).some(x => x.status !== 'סיום' && x.status !== 'הושלם' && x.status !== 'טרם התחיל'); } catch(e){return false;}
            });
        } else {
            rows = data.clients.filter(c => c.Status === 'לקוח שוטף');
        }
    } 
    else {
        // Finance Filters logic (Same as V247)
        if (currentDashFilter === 'forecast_year') {
             rows = data.finance.filter(f => {
                const y = new Date(f.PaymentDate).getFullYear();
                const s = f.Status;
                return y === curYear && ['שולם', 'אושרה', 'חשבונית יצאה', 'ממתין לגביה', 'תשלום עתידי'].includes(s);
             });
        }
        else if (currentDashFilter === 'collection_year') {
             rows = data.finance.filter(f => {
                const y = new Date(f.PaymentDate).getFullYear();
                return y === curYear && (f.Status === 'חשבונית יצאה' || f.Status === 'ממתין לגביה');
             });
        }
        else if (currentDashFilter.includes('paid_') || currentDashFilter.includes('coll_')) {
            let isMonth = currentDashFilter.includes('month');
            rows = data.finance.filter(f => f.Status === 'שולם' && new Date(f.PaymentDate).getFullYear() === curYear && (!isMonth || new Date(f.PaymentDate).getMonth() === curMonth));
        }
        else if (currentDashFilter === 'pipe' || currentDashFilter === 'open_quotes') {
            rows = data.finance.filter(f => f.Status === 'הצעת מחיר');
        }
        else if (currentDashFilter === 'setup_year') {
             rows = data.finance.filter(f => (f.DocType.includes('הקמה') || f.Description.includes('הקמה')) && f.Status === 'שולם');
        }
    }

    rows.forEach(r => {
        let id = isClientMode ? r.ClientID : r.TransID;
        let checkbox = `<td><input type="checkbox" class="dash-cb" value="${id}"></td>`;
        let html = "";

        if (isClientMode) {
            html = `<tr data-id="${r.ClientID}">
                ${checkbox}
                <td>-</td>
                <td><input type="text" value="${r.HP||''}" onchange="quickUpdateClient('${r.ClientID}', 'HP', this.value)" style="width:80px;"></td>
                <td style="font-weight:bold; cursor:pointer;" onclick="openClientModal('${r.ClientID}')">${r['Company Name']}</td>
                <td>${r['Contact Person']||'-'}</td>
                <td>-</td>
                <td><input type="number" value="${r.RetainerAmount||0}" onchange="quickUpdateClient('${r.ClientID}', 'RetainerAmount', this.value)" style="width:70px;"></td>
                <td>
                    <select onchange="quickUpdateClient('${r.ClientID}', 'Status', this.value)">
                         <option ${r.Status=='לקוח שוטף'?'selected':''}>לקוח שוטף</option>
                         <option ${r.Status=='לקוח הקמה'?'selected':''}>לקוח הקמה</option>
                         <option ${r.Status=='ליד חם'?'selected':''}>ליד חם</option>
                    </select>
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                    <button class="btn-icon" onclick="quickUpdateClient('${r.ClientID}', 'Status', document.querySelector('tr[data-id=\\'${r.ClientID}\\'] select').value)" title="שמור">💾</button>
                    <button class="btn-icon" onclick="openClientModal('${r.ClientID}')">📂</button>
                </td>
            </tr>`;
        } 
        else {
            html = `<tr data-id="${r.TransID}">
                ${checkbox}
                <td><input type="date" value="${parseDateISO(r.PaymentDate)}" onchange="quickUpdateFinance('${r.TransID}', 'PaymentDate', this.value)"></td>
                <td>-</td>
                <td style="cursor:pointer;" onclick="openClientModal('${r.ClientID}')">${r.ClientName}</td>
                <td><input type="text" value="${r.Description||''}" onchange="quickUpdateFinance('${r.TransID}', 'Description', this.value)"></td>
                <td><input type="number" value="${r.Amount}" onchange="quickUpdateFinance('${r.TransID}', 'Amount', this.value)" style="width:80px;"></td>
                <td>-</td>
                <td>${r.DocType}</td>
                <td>-</td>
                <td>
                    <select onchange="quickUpdateFinance('${r.TransID}', 'Status', this.value)">
                        <option ${r.Status=='שולם'?'selected':''}>שולם</option>
                        <option ${r.Status=='ממתין לגביה'?'selected':''}>ממתין לגביה</option>
                        <option ${r.Status=='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                        <option ${r.Status=='אושרה'?'selected':''}>אושרה</option>
                        <option ${r.Status=='חשבונית יצאה'?'selected':''}>חשבונית יצאה</option>
                        <option ${r.Status=='בוטל'?'selected':''}>בוטל</option>
                    </select>
                </td>
                <td>
                    <button class="btn-icon" onclick="quickUpdateFinance('${r.TransID}', 'Status', document.querySelector('tr[data-id=\\'${r.TransID}\\'] select').value)" title="שמור">💾</button>
                    <button class="btn-icon" style="color:red;" onclick="deleteFinanceItem('${r.TransID}')">X</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML += html;
    });
}

// 13. Inline Editing Helpers
window.quickUpdateClient = async function(id, field, value) {
    let payload = { ClientID: id };
    payload[field] = value;
    await sendToGAS('saveClient', payload);
    refreshData(true); 
};

window.quickUpdateFinance = async function(id, field, value) {
    const row = data.finance.find(f => f.TransID === id);
    if (!row) return;
    let newRow = {...row};
    newRow[field] = value;
    await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: id, idCol: 'TransID' });
    newRow.TransID = 'T' + Date.now();
    await sendToGAS('addFinance', newRow);
    showToast("עודכן!");
    await refreshData(true);
};

window.deleteFinanceItem = async function(id) {
    if(!confirm("למחוק שורה זו?")) return;
    await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: id, idCol: 'TransID' });
    await refreshData(true);
};

window.toggleAllDash = function(el) {
    document.querySelectorAll('.dash-cb').forEach(cb => cb.checked = el.checked);
}