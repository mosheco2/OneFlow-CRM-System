/**
 * ============================================================================
 * ONEFLOW 360 - CLIENT SIDE (app.js)
 * VERSION: V308.0 (Print Layout Fixes - Page Break Avoid)
 * ============================================================================
 */

// --- 1. Global Settings ---

let GAS_URL = localStorage.getItem('oneflow_gas_url') || ""; 
const START_DOC_NUM = 135250;
const VAT_RATE = 0.18; // מע"מ 18%
let activeClientId = null;
let quoteItems = [];        
let hoursScopeLines = [];   
let currentDashFilter = '';
let currentLogoDataUrl = '';
let dupSourceTransId = null;
let autoSyncInterval = null;
let isAutoSyncRunning = false; 

// --- CONFIG: CLIENT STATUSES ---
const CLIENT_STATUSES = ['לקוח שוטף', 'לקוח הקמה', 'ליד חם', 'הזדמנות', 'לא רלוונטי', 'מוקפא'];

function setText(id, text) { 
    const el = document.getElementById(id); 
    if(el) el.innerText = text; 
}
function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}
const cleanID = (id) => String(id || "").trim();

// Initialize data structure
let data = { clients: [], crm: [], finance: [], expenses: [] };

// --- 2. Full Content & Templates ---

const TERMS_FULL_PRODUCT = `
<div style="font-size:12px; line-height:1.5;">
    <h4>1. תהליך ההקמה והפיתוח</h4>
    <ul>
        <li><strong>אפיון ותוכנית עבודה:</strong> לאחר תשלום המקדמה, יחל תהליך אפיון צרכים מול הלקוח. בסיומו יופק מסמך אפיון לחתימת הלקוח, שיהווה את בסיס העבודה במסגרת גאנט וסבבי איטרציות מוגדרים.</li>
        <li><strong>שינויים ותוספות:</strong> כל בקשה לפיתוח ממשק או יכולות שאינן במפרט המקורי, תתומחר בנפרד ותבוצע רק לאחר אישור הצעת מחיר בכתב.</li>
        <li><strong>עיצוב:</strong> העלות כוללת עיצוב גרסה ראשונה (עד 3 סבבי תיקונים). גרסאות נוספות יתומחרו בנפרד.</li>
        <li><strong>תחילת חיוב שוטף (שלב א'):</strong> לאחר הגשת שלב א' וסיום חודש בדיקות שטח - יחל תשלום שוטף חודשי עבור תחזוקת מערכת הבסיס.</li>
        <li><strong>משתמשי המערכת - תחילת חיוב מלא (סיום ההקמה):</strong> לאחר סיום הגשת שלב א' - יחל התשלום השוטף החודשי עבור מערכת הבסיס.</li>
        <li><strong>הלקוח מתחייב להעמיד רצף פעילות נדרשת לטובת עמידה בלוחות הזמנים (סיום ההקמה):</strong> מסגרת זמן לפרויקט - שלושה חודשים מיום סיום אפיון.</li>
        <li><strong>הלקוח מתחייב להעמיד את המשאבים בצד ה -ERP.(API,הרשאות, שדות ונתונים) :</strong> תכולות פרויקט - בהתאם לאפיון.</li>
    </ul>
    <h4>2. עלויות צד ג' ותשלומים נלווים</h4>
    <ul>
        <li>באחריות הלקוח לשאת בעלויות פתיחת/חידוש חשבונות מפתחים בחנויות (כ-100$ לשנה לאפל, כ-25$ חד-פעמי/שנתי לגוגל).</li>
        <li>במידה והלקוח יבחר להשתמש בשירותי סליקה, כל התשלומים ישולמו ישירות לחברת הסליקה.</li>
        <li>עלויות שרתים ואחסון כלולות במחיר הריטיינר, עד לתעבורה סבירה (Fair Use). חריגה קיצונית תתומחר בנפרד.</li>
    </ul>
    <h4>3. שירות, תמיכה ו-SLA</h4>
    <ul>
        <li><strong>גורמים מורשים:</strong> התמיכה תינתן לאנשי קשר מורשים מטעם הלקוח בלבד.</li>
        <li><strong>שעות פעילות המוקד:</strong> ימים א'-ה' 08:00-18:00. יום ו' 08:00-13:00. בשבתות וחגי ישראל אין מענה (למעט תקלות משביתות שרת).</li>
        <li><strong>SLA:</strong> תקלות משביתות יטופלו בתוך 24 שעות (כולל ימי שישי, למעט יום כיפור וימי חג). תקלות משתמש בודד יטופלו עד 3 ימי עסקים.</li>
        <li>גיבויים מתבצעים אוטומטית אחת ל-24 שעות.</li>
    </ul>
    <h4>4. הסכם שירות ועדכון מחירים</h4>
    <ul>
        <li>הסכם השירות מתחדש אוטומטית בסוף כל שנה קלנדרית, אלא אם התקבלה הודעת ביטול רשמית במייל עד תאריך 01.09 של אותה שנה.</li>
        <li>החברה רשאית לעדכן את מחירי השירות בהודעה של 90 יום מראש.</li>
        <li><strong>מינימום משתמשים:</strong>מתחת ל-5 משתמשים, המחיר למשתמש יעלה ב-15%.</li>
    </ul>
    <h4>5. קניין רוחני, אחריות ונגישות</h4>
    <ul>
        <li><strong>קניין רוחני:</strong> OneBtn הינה הבעלים הבלעדי של הקוד, המערכת והלוגיקה. הרישיון ללקוח הוא זכות שימוש בלבד (SaaS) כל עוד משולמים דמי המנוי.</li>
        <li><strong>נגישות:</strong> המערכת נגישה טכנולוגית. האחריות התפעולית והמשפטית על תכני האתר חלה על הלקוח בלבד.</li>
    </ul>
    <h4>6. תנאי תשלום</h4>
    <ul>
        <li>המחירים בהצעה זו אינם כוללים מע"מ כחוק.</li>
        <li><strong>תנאי תשלום להקמה:</strong> מקדמה בסך 30% מסך ההצעה בחתימה. יתרת הסכום תשולם ב-4 תשלומים חודשיים שווים ועוקבים.</li>
        <li><strong>תנאי תשלום לשוטף:</strong> תשלום רבעוני.</li>
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
        { name: "ייעוץ טכנולוגי בכיר", desc: "ייעוץ ארכיטקטורה ופתרונות ענן", price: 550, isMonthly: false }
    ],
    "product_quote": [
        { name: "--- הקלדה ידנית ---", desc: "", price: 0, isMonthly: false },
        { name: "חבילת בסיס OneFlow", desc: "מערכת הזמנות B2B, אתר ניהול, ואפליקציית לקוחות בסיסית", price: 60000, isMonthly: false },
        { name: "אינטגרציה ל-ERP (פריוריטי/סאפ)", desc: "ממשק דו-כיווני: לקוחות, פריטים, מחירונים, הזמנות", price: 15000, isMonthly: false },
        { name: "מודול מכירות (סוכני שטח)", desc: "אפליקציית סוכן: ניהול תיק לקוח, היסטוריה, גבייה בשטח, יעדים", price: 10000, isMonthly: false },
        { name: "מודול שיווק ומבצעים מתקדם", desc: "מנוע מבצעים (כמותי/כספי), באנרים, פושים מתוזמנים, קופונים", price: 8500, isMonthly: false },
        { name: "מודול ליקוט ומחסן (WMS Lite)", desc: "מסופון לליקוט הזמנות, ניהול מיקומים, קבלת סחורה", price: 12000, isMonthly: false },
        { name: "מודול נהגים והפצה (POD)", desc: "ניהול מסלולי חלוקה, תעודת משלוח דיגיטלית, החתמת לקוח על זכוכית", price: 12000, isMonthly: false },
        { name: "מודול גבייה וסליקה", desc: "סליקת אשראי, הפקת חשבוניות אוטומטית (חשבונית ירוקה/משולם), התאמות בנק", price: 5000, isMonthly: false },
        { name: "תחזוקה/ארוח/שרות - מערכת בסיס", desc: "עלות חודשית עבור שרתים (AWS), גיבויים, ניטור 24/7 ותמיכה טכנית", price: 1500, isMonthly: true },
        { name: "רישיון משתמש (User License)", desc: "רישיון שימוש חודשי למשתמש ניהול/סוכן נוסף", price: 150, isMonthly: true },
        { name: "חבילת SMS ודיוור", desc: "עד 5,000 הודעות בחודש", price: 250, isMonthly: true }
    ],
    "iteration": []
};

const DOC_CONFIG = {
    'iteration': {
        intro: "<p>לקוח יקר,<br>במסמך זה מצורפת רשימת תכולות הכלולה במסגרת האיטרציה הנוכחית.<br>אשרו אותה בבקשה במייל חוזר ובחתימה על המסמך.<br><strong>שים לב:</strong> לא יתקבלו שינויים לתכולה לאחר חתימה על איטרציה זו.</p>",
        terms: "",
        closing: ""
    },
    'hours_quote': {
        intro: "<p>הננו מתכבדים להגיש הצעת מחיר עבור בנק שעות פיתוח.</p>",
        terms: `<h4>תנאים כלליים:</h4><ul><li>תוקף ההצעה: 14 יום.</li><li>תשלום: שוטף+30.</li><li>כל שעה נוספת מעבר לבנק השעות תחוייב לפי תעריף שעה רגיל.</li></ul>`,
        closing: `<p>נשמח לעמוד לרשותכם בכל שאלה או הבהרה.<br>בברכה,<br><strong>צוות OneBtn</strong></p>`
    },
    'product_quote': {
        intro: `<p>אנו מתכבדים להגיש הצעת מחיר לאפיון, פיתוח והטמעת מערכת <strong>OneFlow 360</strong>.<br>חברת OneBtn, המתמחה בפיתוח פלטפורמות מסחר וניהול תהליכים, חרטה על דגלה לספק ללקוחותיה טכנולוגיות מתקדמות ושירות אישי ומקצועי.</p>`,
        terms: TERMS_FULL_PRODUCT,
        closing: `<p>אנו מאמינים כי שיתוף פעולה זה יניב ערך משמעותי לעסק שלכם, ונשמח ללוות אתכם לאורך כל הדרך.<br>לכל שאלה או הבהרה נשמח לעמוד לרשותכם.<br>בברכה,<br><strong>צוות OneBtn</strong></p>`
    }
};

// --- TEMPLATE OVERRIDES (Editable per document type, persisted in localStorage) ---
function getTemplate(type) {
    const cfg = DOC_CONFIG[type] || {};
    const def = { intro: cfg.intro || "", terms: cfg.terms || "", closing: cfg.closing || "" };
    try {
        const saved = JSON.parse(localStorage.getItem('oneflow_tpl_' + type) || '{}');
        return {
            intro:   (saved.intro   != null) ? saved.intro   : def.intro,
            terms:   (saved.terms   != null) ? saved.terms   : def.terms,
            closing: (saved.closing != null) ? saved.closing : def.closing
        };
    } catch(e) { return def; }
}

// Renders template text for the printed doc: if the user typed plain text,
// preserve their line breaks/spacing; if they used HTML tags, respect them as-is.
function renderTemplateHtml(txt) {
    if (!txt) return "";
    if (/<[a-z!\/][^>]*>/i.test(txt)) return txt; // contains HTML markup -> keep as authored
    return txt.replace(/\n/g, '<br>');            // plain text -> keep line breaks
}

// Read/write helpers that work for both contenteditable editors and plain inputs
function tplGetValue(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if (el.getAttribute('contenteditable') !== null) {
        const html = el.innerHTML.trim();
        return (html === '<br>' || html === '<br/>') ? '' : html;
    }
    return el.value || "";
}
function tplSetValue(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getAttribute('contenteditable') !== null) el.innerHTML = renderTemplateHtml(val);
    else el.value = val || "";
}

// Loads the saved/default template text into the editors for the given type
function loadTemplateEditor(type) {
    const tpl = getTemplate(type);
    tplSetValue('tplIntro', tpl.intro);
    tplSetValue('tplTerms', tpl.terms);
    tplSetValue('tplClosing', tpl.closing);
}

// Reads template text for preview: live editor values if present, otherwise saved/default
function getActiveTemplate(type) {
    const tpl = getTemplate(type);
    if (document.getElementById('tplIntro'))   tpl.intro   = tplGetValue('tplIntro');
    if (document.getElementById('tplTerms'))   tpl.terms   = tplGetValue('tplTerms');
    if (document.getElementById('tplClosing')) tpl.closing = tplGetValue('tplClosing');
    return tpl;
}

// --- Lightweight WYSIWYG editor toolbar (no external libs) ---
function initRichEditor(id) {
    const el = document.getElementById(id);
    if (!el || el.dataset.rteReady) return;
    el.dataset.rteReady = '1';

    let savedRange = null;
    el.addEventListener('keyup', saveSel);
    el.addEventListener('mouseup', saveSel);
    el.addEventListener('blur', saveSel);
    function saveSel() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) savedRange = sel.getRangeAt(0);
    }
    function restoreSel() {
        el.focus();
        if (savedRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }
    }
    function run(cmd, val) { restoreSel(); document.execCommand(cmd, false, val || null); saveSel(); }

    const tb = document.createElement('div');
    tb.className = 'rte-toolbar';
    tb.innerHTML =
        '<button type="button" title="מודגש" data-cmd="bold" style="font-weight:bold;">B</button>' +
        '<button type="button" title="נטוי" data-cmd="italic" style="font-style:italic;">I</button>' +
        '<button type="button" title="קו תחתון" data-cmd="underline" style="text-decoration:underline;">U</button>' +
        '<span class="rte-sep"></span>' +
        '<select title="גודל טקסט" data-role="size"><option value="">גודל</option><option value="2">קטן</option><option value="3">רגיל</option><option value="5">גדול</option><option value="6">גדול מאוד</option><option value="7">ענק</option></select>' +
        '<input type="color" title="צבע טקסט" data-role="color" value="#333333">' +
        '<span class="rte-sep"></span>' +
        '<button type="button" title="כותרת" data-cmd="formatBlock" data-val="H4">כותרת</button>' +
        '<button type="button" title="רשימת תבליטים" data-cmd="insertUnorderedList">• רשימה</button>' +
        '<button type="button" title="רשימה ממוספרת" data-cmd="insertOrderedList">1. רשימה</button>' +
        '<span class="rte-sep"></span>' +
        '<button type="button" title="נקה עיצוב" data-cmd="removeFormat">נקה עיצוב</button>';

    // Prevent toolbar clicks from stealing the editor selection
    tb.addEventListener('mousedown', function(e) { e.preventDefault(); });

    tb.querySelectorAll('button[data-cmd]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            run(btn.dataset.cmd, btn.dataset.val);
        });
    });
    const sizeSel = tb.querySelector('select[data-role="size"]');
    sizeSel.addEventListener('change', function() {
        if (sizeSel.value) run('fontSize', sizeSel.value);
        sizeSel.value = '';
    });
    const colorInp = tb.querySelector('input[data-role="color"]');
    colorInp.addEventListener('input', function() { run('foreColor', colorInp.value); });

    el.parentNode.insertBefore(tb, el);
}
function initTemplateEditors() {
    ['tplIntro', 'tplTerms', 'tplClosing'].forEach(initRichEditor);
}

window.saveTemplate = function() {
    const type = document.getElementById('docType').value;
    const obj = {
        intro:   tplGetValue('tplIntro'),
        terms:   tplGetValue('tplTerms'),
        closing: tplGetValue('tplClosing')
    };
    localStorage.setItem('oneflow_tpl_' + type, JSON.stringify(obj));
    showToast("התבנית נשמרה ✓");
};

window.resetTemplate = function() {
    const type = document.getElementById('docType').value;
    if (!confirm("לאפס את תבנית המסמך לברירת המחדל? השינויים שנשמרו יימחקו.")) return;
    localStorage.removeItem('oneflow_tpl_' + type);
    loadTemplateEditor(type);
    showToast("התבנית אופסה לברירת המחדל");
};

const ITERATION_STEPS = [
    { id: 1, title: "איטרציה 1", desc: "תכולה סגורה וידועה עד שלב זה.", sla: "שבוע מיום סיכום על פעילות, הגשת מפרט ע״י הלקוח, סינון ואישור ע״י Onebtn.<br>מתן תאריך לגרסא עד 3 ימי עסקים מיום סיכום על תכולה." },
    { id: 2, title: "איטרציה 2", desc: "תכולה סגורה + תקלות של איטרציה 1.", sla: "שבוע מיום הגשת איטרציה 1, מפרט ע״י הלקוח, סינון ואישור ע״י Onebtn.<br>מתן תאריך לגרסא עד 3 ימי עסקים מיום סיכום על תכולה." },
    { id: 3, title: "איטרציה 3", desc: "תכולה סגורה + תקלות של איטרציה 2.", sla: "שבוע מיום סיכום על פעילות, הגשת מפרט ע״י הלקוח, סינון ואישור ע״י Onebtn.<br>מתן תאריך לגרסא עד 3 ימי עסקים מיום סיכום על תכולה." },
    { id: 4, title: "איטרציה 4", desc: "תקלות בלבד של איטרציות קודמות.", sla: "מענה לקוח תוך 2 ימי עסקים מיום הגשת גרסת איטרציה 3, הגשת מפרט ע״י הלקוח, סינון ואישור ע״י Onebtn.<br>מתן תאריך לתיקונים עד 3 ימי עסקים מיום סיכום על תכולה." },
    { id: 5, title: "איטרציה 5", desc: "אחרי חודש עבודת שטח - תקלות בלבד.", sla: "חודש מיום עליה לאוויר , הגשת מפרט תקלות וממצאי שטח ע״י הלקוח, סינון ואישור ע״י Onebtn.<br>מתן תאריך לגרסא עד 3 ימי עסקים מיום סיכום על תכולה." }
];

// --- 3. Helpers ---
function showLoader() { if(document.getElementById('loader')) document.getElementById('loader').style.display = 'flex'; }
function hideLoader() { if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none'; }

function parseDateISO(val) {
    if (!val) return "";
    if (typeof val === 'string' && (val.includes('/') || val.includes('.'))) {
        const parts = val.trim().split(/[\/\.]/);
        if (parts.length === 3) {
            let p1 = parseInt(parts[0]);
            let p2 = parseInt(parts[1]);
            let y = parts[2];
            if (y.length === 2) y = "20" + y;

            let d, m;
            if (p2 > 12) { 
                m = String(p1).padStart(2, '0');
                d = String(p2).padStart(2, '0');
            } else {
                d = String(p1).padStart(2, '0');
                m = String(p2).padStart(2, '0');
            }
            return `${y}-${m}-${d}`;
        }
    }
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
         if(viewId === 'generator') {
             updateFormView(); 
             populateGeneratorClients(); 
         }
         if(viewId === 'settings') { document.getElementById('settingGasUrl').value = GAS_URL; }
         if(viewId === 'dashboard') renderDashboard();

     } catch(e) { console.error("Navigation Error:", e); }
};

window.onload = async function() {
    createItemModal(); // Initialize the popup modal
    initTemplateEditors(); // Attach WYSIWYG toolbars to the template editors
    const impTxt = document.getElementById('importText');
    if(impTxt) {
        impTxt.placeholder = "הדבק כאן את הטבלה מאקסל (כולל שורת כותרות).\nהמערכת תזהה את העמודות לפי הכותרות:\nשם חברה | סטטוס | תשלום | צפי | סוג | אסמכתא | תיאור | סכום | תאריך | ח.פ";
    }

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

// --- POPUP MODAL LOGIC (New in V302.0) ---
function createItemModal() {
    if(document.getElementById('itemDetailsModal')) return;
    
    const div = document.createElement('div');
    div.id = 'itemDetailsModal';
    div.style.cssText = `
        display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; 
        overflow: auto; background-color: rgba(0,0,0,0.4);
    `;
    div.innerHTML = `
        <div style="background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 60%; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <span onclick="document.getElementById('itemDetailsModal').style.display='none'" 
                  style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <h3 id="itemModalTitle" style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">פירוט תכולה</h3>
            <div id="itemModalBody" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(div);
}

window.openItemPopup = function(transId) {
    const item = data.finance.find(f => f.TransID === transId);
    if(!item) return alert("פריט לא נמצא");
    
    const modal = document.getElementById('itemDetailsModal');
    const body = document.getElementById('itemModalBody');
    const title = document.getElementById('itemModalTitle');
    
    title.innerText = `פירוט: ${item.Description || item.DocType}`;
    
    let html = "";
    try {
        const items = JSON.parse(item.ItemsJSON || "[]");
        if(Array.isArray(items) && items.length > 0) {
            html += `<table style="width:100%; border-collapse: collapse;">
                        <tr style="background:#f0f0f0;"><th style="padding:8px; border:1px solid #ddd; text-align:right;">פריט</th><th style="padding:8px; border:1px solid #ddd;">כמות</th><th style="padding:8px; border:1px solid #ddd;">מחיר יח'</th><th style="padding:8px; border:1px solid #ddd;">סה"כ</th></tr>`;
            let total = 0;
            items.forEach(it => {
                let sum = (parseFloat(it.price)||0) * (parseFloat(it.qty)||1);
                total += sum;
                html += `<tr>
                            <td style="padding:8px; border:1px solid #ddd;">${it.name}</td>
                            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.qty}</td>
                            <td style="padding:8px; border:1px solid #ddd;">${parseFloat(it.price).toLocaleString()}</td>
                            <td style="padding:8px; border:1px solid #ddd;">${sum.toLocaleString()}</td>
                         </tr>`;
            });
            html += `<tr style="font-weight:bold; background:#e8f5e9;">
                        <td colspan="3" style="padding:8px; border:1px solid #ddd; text-align:left;">סה"כ:</td>
                        <td style="padding:8px; border:1px solid #ddd;">${total.toLocaleString()} ₪</td>
                     </tr></table>`;
        } else {
            html = `<p>אין פירוט פריטים עבור שורה זו (הזנה ידנית).</p>
                    <p><strong>תיאור מלא:</strong> ${item.Description || '-'}</p>
                    <p><strong>סכום:</strong> ${parseFloat(item.Amount).toLocaleString()} ₪</p>`;
        }
    } catch(e) {
        html = `<p>שגיאה בטעינת הנתונים.</p>`;
    }
    
    body.innerHTML = html;
    modal.style.display = 'block';
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
        switchView('dashboard');
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
        
        if (!json || typeof json !== 'object') throw new Error("תגובת שרת לא תקינה");
        if(json.status === 'error') throw new Error(json.message);
        
        let clientsList = json.clients || [];
        let rawFinance = json.finance || [];
        let validFinance = [];
        let activeClientIds = new Set(clientsList.map(c => cleanID(c.ClientID)));

        rawFinance.forEach(f => {
            f.Status = (f.Status || "").trim();
            f._isoDate = parseDateISO(f.PaymentDate); 
            validFinance.push(f);
        });

        data = { clients: clientsList, crm: json.crm||[], finance: validFinance, expenses: json.expenses||[] };
        
        if(typeof renderDashboard === 'function') renderDashboard(); 
        if(typeof renderCRMTable === 'function') renderCRMTable(); 
        
        if(activeClientId) {
            renderClientFinance(); 
            renderClientIterations(); 
            if (typeof renderClientNotes === 'function') renderClientNotes();
            if (typeof renderClientQuotes === 'function') renderClientQuotes();
            if (typeof updateQuoteLinkDropdown === 'function') updateQuoteLinkDropdown();
        }
        if(!silent) showToast("נתונים עודכנו");

    } catch(e) { 
        console.error(e);
        if(statusEl) statusEl.innerText = `שגיאה: ${e.message}. וודא שכתובת ה-GAS תקינה ושיש הרשאות (Deploy as Anyone).`; 
        if(!silent) alert(`שגיאת תקשורת: ${e.message}\nאנא בדוק את כתובת השרת בהגדרות.`);
    } finally { if(!silent) hideLoader(); }
}

async function sendToGAS(action, payload) { 
    try { 
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: action, data: payload }) }); 
        return await res.json();
    } catch(e) { return { status: 'error', message: e.message }; } 
}

// --- ACTION BUTTONS (GLOBAL) ---

window.syncClientFiles = async function() {
    if(!confirm("פעולה זו תסרוק את כל הגיליונות המקושרים בשרת. להמשיך?")) return;
    showLoader();
    try {
        const res = await sendToGAS('checkIterationStatus', { forceAll: true });
        if (res.status === 'error') throw new Error(res.message);
        await refreshData(true);
        showToast("סנכרון קבצים הושלם בהצלחה");
    } catch(e) { 
        alert("שגיאה בסנכרון: " + e.message); 
    } finally { hideLoader(); }
};

window.toggleAutoSync = function(btn) {
    isAutoSyncRunning = !isAutoSyncRunning;
    if (isAutoSyncRunning) {
        autoSyncInterval = setInterval(() => { refreshData(true); }, 5 * 60 * 1000); 
        if(btn) { 
            btn.style.backgroundColor = "#28a745"; 
            btn.style.color = "white"; 
            btn.innerText = "🔄 סנכרון אוטומטי: פעיל"; 
        }
        showToast("סנכרון אוטומטי הופעל");
    } else {
        if (autoSyncInterval) clearInterval(autoSyncInterval);
        autoSyncInterval = null;
        if(btn) { 
            btn.style.backgroundColor = ""; 
            btn.style.color = ""; 
            btn.innerText = "🔄 סנכרון אוטומטי: כבוי"; 
        }
        showToast("סנכרון אוטומטי הופסק");
    }
};

window.printPDF = function() {
    window.print();
};

// --- 6. Import Logic ---
window.processImport = async function() {
    const text = document.getElementById('importText').value;
    const logDiv = document.getElementById('importLog');
    
    // Force visibility
    logDiv.style.background = "#fff";
    logDiv.style.color = "#000";
    logDiv.style.border = "1px solid #ccc";
    logDiv.style.padding = "5px";
    logDiv.style.maxHeight = "600px";
    logDiv.style.overflowY = "auto";
    logDiv.style.display = "block";
    logDiv.innerHTML = "<b>מתחיל עיבוד טבלה...</b><br>";
    
    if(!text.trim()) { alert("אנא הדבק תוכן לייבוא"); return; }
    
    const lines = text.split('\n');
    if (lines.length < 2) { logDiv.innerHTML = "<div style='color:red;'>אין מספיק שורות</div>"; return; }

    let delimiter = lines[0].includes('\t') ? '\t' : ',';
    
    const inputStyle = "background:#fff !important; color:#000 !important; border:1px solid #999 !important; padding:4px; width:100%; box-sizing:border-box;";
    const tableStyle = "width:100%; background:#fff !important; color:#000 !important; border-collapse:collapse; font-size:12px; border:1px solid #000;";

    let tableHTML = `<table border="1" style="${tableStyle}">
        <thead style="position:sticky; top:0; background:#ddd; color:black; z-index:10; border-bottom:2px solid black;">
            <tr>
                <th style="min-width:100px; padding:5px;">תאריך</th>
                <th style="min-width:80px; padding:5px;">אסמכתא</th>
                <th style="min-width:150px; padding:5px;">תיאור</th>
                <th style="min-width:80px; padding:5px;">סכום</th>
                <th style="min-width:90px; padding:5px;">ח.פ</th>
                <th style="min-width:100px; padding:5px;">שם לקוח</th>
                <th style="min-width:100px; padding:5px;">צפי</th>
                <th style="min-width:100px; padding:5px;">סטטוס</th>
            </tr>
        </thead>
        <tbody id="importPreviewBody">`;
    
    try {
        let headerLine = lines[0].split(delimiter);
        let map = { date: -1, amount: -1, desc: -1, ref: -1, hp: -1, name: -1, forecast: -1, status: -1 };
        
        headerLine.forEach((col, idx) => {
            let c = col.trim();
            if (c.includes("תאריך") && !c.includes("צפי")) map.date = idx;
            if (c.includes("צפי")) map.forecast = idx;
            if (c.includes("סכום")) map.amount = idx;
            if (c.includes("תיאור") || c.includes("פרטים")) map.desc = idx;
            if (c.includes("אסמכתא") || c.includes("חשבונית")) map.ref = idx;
            if (c.includes("ח.פ") || c.includes("חפ")) map.hp = idx;
            if (c.includes("שם") || c.includes("חברה") || c.includes("לקוח")) map.name = idx;
            if (c.includes("סטטוס")) map.status = idx;
        });

        for (let i = 1; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;
            
            await new Promise(r => setTimeout(r, 1)); 

            const parts = line.split(delimiter); 
            
            let dateVal = map.date > -1 ? parts[map.date] : "";
            let forecastVal = map.forecast > -1 ? parts[map.forecast] : "";
            let amountVal = map.amount > -1 ? parts[map.amount] : "0";
            let descVal = map.desc > -1 ? parts[map.desc] : "ייבוא";
            let refVal = map.ref > -1 ? parts[map.ref] : "";
            let hpVal = map.hp > -1 ? parts[map.hp] : "";
            let nameVal = map.name > -1 ? parts[map.name] : "";
            let statusVal = map.status > -1 ? parts[map.status] : "שולם";

            if(!refVal) {
                 for(let part of parts) {
                      if(/^\d{4,8}$/.test(part.trim()) && part !== hpVal && parseFloat(part) !== parseFloat(amountVal)) {
                           refVal = part.trim();
                           break;
                      }
                 }
            }

            if(hpVal) hpVal = hpVal.replace(/\D/g, '');
            if(amountVal) amountVal = amountVal.replace(/[^0-9.-]/g, '');

            let date = parseDateISO(dateVal);
            let forecast = parseDateISO(forecastVal);
            let amount = parseFloat(amountVal);
            if(isNaN(amount)) amount = 0; 
            
            let existingClient = data.clients.find(c => {
                let cHP = String(c.HP || "").replace(/\D/g, '');
                let cID = String(c.ClientID || "").replace(/\D/g, '');
                return (hpVal && (cHP === hpVal || cID === hpVal)) || (nameVal && c['Company Name'] === nameVal.trim());
            });

            let finalName = existingClient ? existingClient['Company Name'] : (nameVal || "לקוח לא מזוהה");
            let finalHP = existingClient ? existingClient.HP : hpVal;

            if (!isNaN(amount) && amount !== 0) {
                tableHTML += `<tr>
                    <td><input type="date" value="${date}" class="imp-date" style="${inputStyle}"></td>
                    <td><input type="text" value="${refVal}" class="imp-ref" style="${inputStyle}"></td>
                    <td><input type="text" value="${descVal}" class="imp-desc" style="${inputStyle}"></td>
                    <td><input type="number" value="${amount}" class="imp-amt" style="${inputStyle}"></td>
                    <td><input type="text" value="${finalHP}" class="imp-hp" style="${inputStyle}"></td>
                    <td><input type="text" value="${finalName}" class="imp-name" style="${inputStyle}"></td>
                    <td><input type="date" value="${forecast}" class="imp-forecast" style="${inputStyle}"></td>
                    <td>
                        <select class="imp-status" style="${inputStyle}">
                            <option ${statusVal.includes('שולם')?'selected':''}>שולם</option>
                            <option ${statusVal.includes('ממתין')?'selected':''}>ממתין לגביה</option>
                            <option ${statusVal.includes('חשבונית')?'selected':''}>חשבונית יצאה</option>
                        </select>
                    </td>
                </tr>`;
            }
        }
        
        tableHTML += `</tbody></table>
        <div style="margin-top:15px; padding:15px; background:#f9f9f9; border-top:1px solid #ccc; position:sticky; bottom:0; text-align:left;">
            <button class="btn btn-success" style="font-size:16px; font-weight:bold; padding:10px 25px;" onclick="commitImportTable()">💾 אשר ושמור נתונים</button>
        </div>`;

        logDiv.innerHTML = tableHTML;
        document.getElementById('importText').value = ""; 

    } catch(e) { 
        logDiv.innerHTML = `<div style="color:red; font-weight:bold;">שגיאה: ${e.message}</div>`; 
    } finally {
        const btn = document.querySelector('#view-import button');
        if(btn) btn.disabled = false;
    }
};

window.commitImportTable = async function() {
    const rows = document.querySelectorAll('#importPreviewBody tr');
    if(rows.length === 0) return alert("אין נתונים לשמירה");
    
    if(!confirm(`האם לשמור ${rows.length} שורות?`)) return;

    showLoader();
    let successCount = 0;
    
    try {
        for(let tr of rows) {
             const date = tr.querySelector('.imp-date').value;
             const ref = tr.querySelector('.imp-ref').value;
             const desc = tr.querySelector('.imp-desc').value;
             const amtVal = tr.querySelector('.imp-amt').value;
             const hp = tr.querySelector('.imp-hp').value;
             const name = tr.querySelector('.imp-name').value;
             const forecast = tr.querySelector('.imp-forecast').value;
             const status = tr.querySelector('.imp-status').value;
             
             let amt = parseFloat(amtVal);
             if(isNaN(amt)) amt = 0; 

             let existingClient = data.clients.find(c => String(c.HP).trim() === hp || c['Company Name'] === name);
             const finalID = existingClient ? cleanID(existingClient.ClientID) : ("IMP_" + (hp || Date.now() + Math.floor(Math.random()*1000)));
             
             // FIX #1: SAVE REF to DocNum AND InvoiceNum
             const payload = {
                TransID: 'T' + Date.now() + Math.floor(Math.random()*1000),
                ClientID: finalID,
                ClientName: name,
                DocType: 'חשבונית מס (ייבוא)',
                DocNum: ref,          // Save here
                InvoiceNum: ref,      // AND here
                Description: desc,
                Amount: amt,
                PaymentDate: date || new Date().toISOString().split('T')[0],
                ForecastDate: forecast,
                Status: status,
                CollectionType: 'Manual',
                ItemsJSON: '[]'
            };
            
            await sendToGAS('addFinance', payload);
            successCount++;
        }
        
        await refreshData(true);
        document.getElementById('importLog').innerHTML = `<div style="color:green; font-weight:bold; padding:20px; font-size:16px; background:white;">✅ נשמרו בהצלחה ${successCount} שורות!</div>`;

    } catch(e) { alert("שגיאה בשמירה: " + e.message); } finally { hideLoader(); }
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
    try {
        document.getElementById('clientModal').style.display = 'flex';
        const statusSel = document.getElementById('inpCStatus');
        if(statusSel) {
            statusSel.innerHTML = "";
            CLIENT_STATUSES.forEach(s => statusSel.add(new Option(s, s)));
        }
        
        if (clientId === 'NEW') { 
            activeClientId = 'C' + Date.now(); 
            document.getElementById('modalTitle').innerText = "לקוח חדש"; 
            ['inpCName','inpCContact','inpCPhone','inpCEmail','inpCHP','inpCRetainer'].forEach(id => { 
                if(document.getElementById(id)) document.getElementById(id).value = ''; 
            });
            switchModalTab('details');
        } else {
            activeClientId = cleanID(clientId);
            let c = data.clients.find(x => cleanID(x.ClientID) === activeClientId); 
            
            if(!c && clientId.startsWith("IMP_")) {
                 const row = data.finance.find(f => f.ClientID === clientId);
                 let name = row ? row.ClientName : "לקוח זמני";
                 c = { 'Company Name': name, ClientID: clientId };
            }

            if(c) { 
                document.getElementById('modalTitle').innerText = "כרטיס: " + (c['Company Name'] || "ללא שם"); 
                if(document.getElementById('inpCName')) document.getElementById('inpCName').value = c['Company Name'] || "";
                if(document.getElementById('inpCContact')) document.getElementById('inpCContact').value = c['Contact Person'] || "";
                if(document.getElementById('inpCPhone')) document.getElementById('inpCPhone').value = c.Phone || "";
                if(document.getElementById('inpCEmail')) document.getElementById('inpCEmail').value = c.Email || "";
                if(document.getElementById('inpCHP')) document.getElementById('inpCHP').value = c.HP || "";
                if(document.getElementById('inpCStatus')) document.getElementById('inpCStatus').value = c.Status || "";
                if(document.getElementById('inpCRetainer')) document.getElementById('inpCRetainer').value = c.RetainerAmount || 0;
                if(document.getElementById('inpCFrozen')) document.getElementById('inpCFrozen').checked = (c.Frozen === true);
            }
            
            // --- CRITICAL FIX: SAFE FUNCTION CALLS ---
            try { if(typeof updateQuoteLinkDropdown === 'function') updateQuoteLinkDropdown(); } catch(e) { console.warn(e); }
            try { if(typeof renderClientNotes === 'function') renderClientNotes(); } catch(e) { console.warn(e); }
            try { if(typeof renderClientQuotes === 'function') renderClientQuotes(); } catch(e) { console.warn(e); }
            try { renderClientFinance(); } catch(e) { console.warn(e); }
            try { renderClientIterations(); } catch(e) { console.warn(e); }
            
            switchModalTab('details');
        }
    } catch(err) {
        console.error("Critical error in openClientModal:", err);
        alert("שגיאה בפתיחת כרטיס לקוח: " + err.message);
    }
};

window.closeModal = function() { document.getElementById('clientModal').style.display = 'none'; };

// --- IMPROVED TAB SWITCHER (FIX FOR DUPLICATE IDS) ---
window.switchModalTab = function(tabName) { 
    try {
        // 1. Reset all tabs
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active')); 
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none'; // Force hide
        });
        
        // 2. Activate Button
        // Find element that is a DIV or Button and has class 'modal-tab'
        const buttons = document.querySelectorAll('#mtab-' + tabName);
        buttons.forEach(btn => {
            if(btn.classList.contains('modal-tab')) btn.classList.add('active');
        });

        // 3. Activate Content
        // Explicitly look for the div with class tab-content and ID
        let contentDiv = document.querySelector(`.tab-content#mtab-${tabName}`);
        
        if (contentDiv) {
            contentDiv.classList.add('active');
            contentDiv.style.display = 'block'; // Force show
        } else {
            // Fallback: Try to find by index if ID matching fails
            const map = { 'details': 0, 'notes': 1, 'finance': 2, 'quotes': 3, 'iterations': 4 };
            const contents = document.querySelectorAll('.tab-content');
            if(contents[map[tabName]]) {
                contents[map[tabName]].classList.add('active');
                contents[map[tabName]].style.display = 'block';
            }
        }

        if(tabName === 'iterations') renderClientIterations();
    } catch(e) { console.error("Tab switch error:", e); }
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

window.deleteClient = async function() {
    if(!activeClientId) return;
    if(!confirm("האם אתה בטוח שברצונך למחוק לקוח זה?")) return;
    showLoader();
    try {
        await sendToGAS('deleteItem', { sheet: 'Clients', idVal: activeClientId, idCol: 'ClientID' });
        await refreshData(true);
        closeModal(); 
        renderCRMTable(); 
        showToast("לקוח נמחק בהצלחה");
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

// --- FIX: RESTORED RENDER FUNCTIONS ---

function renderClientNotes() {
    const list = document.getElementById('notesList');
    if(!list) return;
    list.innerHTML = "";
    
    const clientLogs = data.crm.filter(l => cleanID(l.ClientID) === activeClientId);
    
    // Sort logs descending (newest first)
    clientLogs.sort((a,b) => new Date(b.Date || 0) - new Date(a.Date || 0));

    if(clientLogs.length === 0) {
        list.innerHTML = "<div style='color:#999; padding:10px;'>אין הערות</div>";
        return;
    }

    clientLogs.forEach(log => {
        const dateStr = parseDateISO(log.Date);
        list.innerHTML += `
            <div style="background:white; border:1px solid #eee; padding:10px; margin-bottom:5px; border-radius:4px;">
                <div style="font-size:11px; color:#666; display:flex; justify-content:space-between;">
                    <span>${dateStr}</span>
                    <span style="font-weight:bold;">${log.Type || 'הערה'}</span>
                </div>
                <div style="margin-top:5px; white-space:pre-wrap;">${log.Content}</div>
            </div>
        `;
    });
}

// ==========================================
// פונקציה חדשה: טעינת הצעה קיימת למחולל והדפסה
// ==========================================
window.viewQuoteAsPDF = function(transId) {
    const q = data.finance.find(f => f.TransID === transId);
    if (!q) return alert("הצעה לא נמצאה במערכת");
    
    const client = data.clients.find(c => cleanID(c.ClientID) === cleanID(q.ClientID));
    if (!client) return alert("לקוח לא נמצא");

    // סגירת חלון לקוח ומעבר למחולל
    closeModal();
    switchView('generator', document.querySelector('.nav-btn[onclick*="generator"]'));

    // אתחול נתונים בסיסיים במחולל
    document.getElementById('inputClientName').value = client['Company Name'];
    fillClientFromCRM();
    document.getElementById('inputDocNum').value = q.DocNum || q.InvoiceNum || "";
    document.getElementById('inputDate').value = parseDateISO(q.PaymentDate) || new Date().toISOString().split('T')[0];

    // זיהוי סוג המסמך והתאמת התצוגה במחולל
    let dType = 'product_quote';
    if (String(q.DocType).includes('שעות') || q.DocType === 'hours_quote') dType = 'hours_quote';
    if (String(q.DocType).includes('איטרציה') || q.DocType === 'iteration') dType = 'iteration';
    document.getElementById('docType').value = dType;
    
    updateFormView();

    // פיענוח הפריטים שנשמרו
    let parsedItems;
    try {
        parsedItems = JSON.parse(q.ItemsJSON || "[]");
    } catch(e) {
        parsedItems = [];
    }

    // אם זה טקסט חופשי, עדכן את תיבת הטקסט
    if (dType === 'hours_quote') {
        quoteItems = Array.isArray(parsedItems) ? parsedItems : [];
        document.getElementById('inputPasteQuote').value = quoteItems.map(i => i.name).join('\n');
        parseQuotePaste();
    } else if (dType === 'iteration') {
        // New format: object with full text + meta. Legacy: array of line-items.
        if (parsedItems && parsedItems.__iter) {
            document.getElementById('inputPasteIter').value = parsedItems.text || "";
            if (document.getElementById('inputReleaseDate')) document.getElementById('inputReleaseDate').value = parsedItems.releaseDate || "";
            if (document.getElementById('inputIterNum')) document.getElementById('inputIterNum').value = parsedItems.iterNum || "";
        } else {
            const arr = Array.isArray(parsedItems) ? parsedItems : [];
            document.getElementById('inputPasteIter').value = arr.map(i => i.name).join('\n');
        }
        parseIterationText();
    } else {
        quoteItems = Array.isArray(parsedItems) ? parsedItems : [];
    }

    // איפוס הנחה ל-0 כברירת מחדל (ניתן לעדכון ידני אח"כ)
    if(document.getElementById('inputDiscountPercent')) {
        document.getElementById('inputDiscountPercent').value = 0;
    }

    renderBuilderTable();

    // הפעלה מיידית של חלון ההדפסה
    setTimeout(() => {
        generatePreview();
    }, 150);
};

// עדכון פונקציית הטבלה של הצעות המחיר כדי שתפעיל את התצוגה
function renderClientQuotes() {
    const tbody = document.getElementById('quotesTableBody');
    if(!tbody) return;
    tbody.innerHTML = "";
    
    const quotes = data.finance.filter(f =>
        cleanID(f.ClientID) === activeClientId &&
        ['product_quote', 'hours_quote', 'הצעת מחיר', 'iteration', 'איטרציה'].some(t => String(f.DocType).includes(t))
    );

    quotes.sort((a,b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));

    if(quotes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>אין מסמכים</td></tr>";
        return;
    }

    quotes.forEach(q => {
        const isIter = isIterationDoc(q);
        let contentSummary = "פירוט...";
        try {
            const parsed = JSON.parse(q.ItemsJSON || "[]");
            if (parsed && parsed.__iter) {
                contentSummary = (parsed.text || "").replace(/\n+/g, ' · ');
            } else if (Array.isArray(parsed)) {
                contentSummary = parsed.map(i => i.name).join(", ");
            }
            if(contentSummary.length > 50) contentSummary = contentSummary.substring(0,50) + "...";
        } catch(e) {}

        // Iterations use a documentation status; quotes use the sales pipeline statuses
        const statusCell = isIter
            ? `<span class="status-badge">${q.Status || 'תיעוד בלבד'}</span>`
            : `<select class="quote-status-sel" data-id="${q.TransID}">
                    <option ${q.Status==='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                    <option ${q.Status==='אושרה'?'selected':''}>אושרה</option>
                    <option ${q.Status==='נדחתה'?'selected':''}>נדחתה</option>
                    <option ${q.Status==='בוטל'?'selected':''}>בוטל</option>
               </select>`;

        const typeBadge = isIter
            ? `<span class="status-badge" style="background:#fff3cd; color:#856404;">איטרציה</span>`
            : `<span class="status-badge" style="background:#d1ecf1; color:#0c5460;">הצעה</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${parseDateISO(q.PaymentDate)}</td>
                <td>${typeBadge}</td>
                <td><a href="#" onclick="viewQuoteAsPDF('${q.TransID}'); return false;" title="צפה/ערוך">#${q.DocNum}</a></td>
                <td>${parseFloat(q.Amount||0).toLocaleString()} ₪</td>
                <td>${statusCell}</td>
                <td style="font-size:11px; color:#555;">${contentSummary}</td>
                <td style="white-space:nowrap;">
                    <button class="btn btn-sm btn-primary" onclick="viewQuoteAsPDF('${q.TransID}')" title="צפה / ערוך">🖨️ צפה</button>
                    <button class="btn btn-sm btn-warning" onclick="duplicateDocument('${q.TransID}')" title="שכפל ללקוח אחר">⧉ שכפל</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFinanceItem('${q.TransID}')" title="מחק">X</button>
                </td>
            </tr>
        `;
    });
}

// True if a finance record represents an iteration document
function isIterationDoc(f) {
    return String(f.DocType).includes('iteration') || String(f.DocType).includes('איטרציה');
}

window.saveQuotesChanges = async function() {
    const selects = document.querySelectorAll('.quote-status-sel');
    if(selects.length === 0) return;
    
    showLoader();
    let changed = 0;
    
    try {
        for(let sel of selects) {
            const id = sel.getAttribute('data-id');
            const newStatus = sel.value;
            const row = data.finance.find(f => f.TransID === id);
            
            if(row && row.Status !== newStatus) {
                // Update specific field only
                const newRow = { ...row, Status: newStatus };
                await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: id, idCol: 'TransID' });
                await sendToGAS('addFinance', newRow);
                changed++;
            }
        }
        await refreshData(true);
        showToast(changed > 0 ? "סטטוסים עודכנו" : "לא היו שינויים");
    } catch(e) { alert("שגיאה בשמירה: " + e.message); } finally { hideLoader(); }
};

function updateQuoteLinkDropdown() {
    const sel = document.getElementById('inpFinLinkQuote');
    const container = document.getElementById('quoteItemsSelectBox');
    if(!sel) return;
    
    sel.innerHTML = '<option value="">-- בחר הצעה לקשר --</option>';
    if(container) container.innerHTML = "";
    
    const quotes = data.finance.filter(f => 
        cleanID(f.ClientID) === activeClientId && 
        ['product_quote', 'hours_quote', 'הצעת מחיר'].some(t => String(f.DocType).includes(t))
    );

    quotes.forEach(q => {
         sel.add(new Option(`#${q.DocNum} - ${q.Description} (${q.Amount})`, q.TransID));
    });
}

// Add function to render checkboxes when a quote is selected
window.renderQuoteItemsSelection = function() {
    const quoteId = document.getElementById('inpFinLinkQuote').value;
    const container = document.getElementById('quoteItemsSelectBox');
    if(!container) return;
    
    container.innerHTML = "";
    if(!quoteId) return;

    const quote = data.finance.find(f => f.TransID === quoteId);
    if(quote && quote.ItemsJSON) {
        try {
            const items = JSON.parse(quote.ItemsJSON);
            if(Array.isArray(items) && items.length > 0) {
                 let html = `<div style="padding:5px; background:#fff; border:1px solid #ddd; max-height:100px; overflow-y:auto;">`;
                 items.forEach((item, idx) => {
                     html += `<div><input type="checkbox" class="q-item-cb" value="${item.price}" data-desc="${item.name}"> ${item.name} (${item.price})</div>`;
                 });
                 html += `<button class="btn btn-sm btn-secondary" onclick="calcSelectedItems()" style="margin-top:5px; width:100%;">החל בחירה על סכום</button></div>`;
                 container.innerHTML = html;
            }
        } catch(e) {}
    }
}

window.calcSelectedItems = function() {
    let sum = 0;
    let descArr = [];
    document.querySelectorAll('.q-item-cb:checked').forEach(cb => {
        sum += parseFloat(cb.value);
        descArr.push(cb.getAttribute('data-desc'));
    });
    
    // V303 FIX: Populate new Title field for clarity
    if(sum > 0) {
        if(document.getElementById('inpNewFinAmount')) document.getElementById('inpNewFinAmount').value = sum;
        if(document.getElementById('inpNewFinTitle')) document.getElementById('inpNewFinTitle').value = "תשלום עבור: " + descArr.join(", ");
    }
}


// --- 8. Iterations Logic (V280.0: Cycle Management & GID Sync) ---
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
        
        const btnArchive = `<button class="btn btn-sm btn-warning" onclick="archiveAndRestartIteration(${step.id})" title="סגור סבב והתחל מחדש">🔄 סיום סבב</button>`;

        let div = document.createElement('div');
        div.className = 'iter-card';
        div.setAttribute('data-status', displayStatus); 
        
        div.innerHTML = `
            <div class="iter-header">
                <div style="display:flex; align-items:center; gap:10px;">
                    <b>${step.title}</b>
                    <span class="status-badge">${displayStatus}</span>
                </div>
                <div>
                      ${btnArchive}
                      <button class="btn btn-sm btn-primary" onclick="syncIterationStatus(${step.id})">🔗 סנכרן</button>
                </div>
            </div>
            <div class="iter-body">
                <p style="font-size:12px; color:#555; margin-bottom:10px;">${step.desc}</p>
                <div style="font-size:11px; background:#f0f0f0; padding:5px; margin-bottom:10px; border-radius:4px;"><strong>SLA:</strong> ${step.sla}</div>
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                    <select id="iter_status_${step.id}" style="width:140px;">
                        <option ${displayStatus=='טרם התחיל'?'selected':''}>טרם התחיל</option>
                        <option ${displayStatus=='בתהליך'?'selected':''}>בתהליך</option>
                        <option ${displayStatus=='ממתין ללקוח'?'selected':''}>ממתין ללקוח</option>
                        <option ${displayStatus=='הושלם'?'selected':''}>הושלם</option>
                        <option ${displayStatus=='סיום'?'selected':''}>סיום</option>
                        <option ${displayStatus=='אושר ע"י לקוח'?'selected':''}>אושר ע"י לקוח</option>
                        <option ${displayStatus=='תכולה מאושרת'?'selected':''}>תכולה מאושרת</option>
                        <option ${displayStatus=='בטיפול צד אפליקציה'?'selected':''}>בטיפול צד אפליקציה</option>
                         <option ${displayStatus=='בטיפול צד ממשקים'?'selected':''}>בטיפול צד ממשקים</option>
                         <option ${displayStatus=='בטיפול'?'selected':''}>בטיפול</option>
                         <option ${displayStatus=='תכולה אושרה'?'selected':''}>תכולה אושרה</option>
                        <option ${displayStatus=='תכולה ממתינה לאישור'?'selected':''}>תכולה ממתינה לאישור</option>
                    </select>
                    <select id="iter_link_${step.id}" style="flex:1;" onchange="updateInlineContentList(${step.id})">${docOptions}</select>
                </div>
                <div id="iter_content_list_${step.id}" style="background:#f0f7ff; padding:10px; font-size:13px; margin-bottom:10px; display:none;"></div>
                <input type="text" id="iter_sheet_url_${step.id}" class="iter-link-input" placeholder="ID גיליון חיצוני (Google Sheets)" value="${(step.id==1)?(client.Iter1_Link_ID||''):saved.sheetUrl}" style="width:100%; margin-bottom:10px; padding:5px;">
                <textarea id="iter_notes_${step.id}" style="width:100%; height:50px; margin-bottom:10px;" placeholder="הערות לאיטרציה...">${saved.notes || ''}</textarea>
                <button class="btn btn-sm btn-success" onclick="saveIterationData(${step.id})">💾 שמור</button>
            </div>
        `;
        container.appendChild(div);
        if (saved.linkedDoc) updateInlineContentList(step.id);
    });
}

// Logic to Archive and Restart Cycle
window.archiveAndRestartIteration = async function(stepId) {
     if(!activeClientId) return;
     if(!confirm(`האם אתה בטוח שברצונך לסיים את הסבב הנוכחי של איטרציה ${stepId}?\nהפעולה תשמור את הסטטוס וההערות בהיסטוריה ותאפס את השדות.`)) return;
     
     showLoader();
     try {
        let client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
        let currentIterData = client && client.IterationsJSON ? JSON.parse(client.IterationsJSON) : {};
        let stepKey = `iter_${stepId}`;
        let saved = currentIterData[stepKey] || {};
        
        let oldStatus = document.getElementById(`iter_status_${stepId}`).value;
        let oldNotes = document.getElementById(`iter_notes_${stepId}`).value;

        // 1. Create Log Entry (History)
        const logContent = `סיום סבב - איטרציה ${stepId}: סטטוס אחרון [${oldStatus}]. הערות: ${oldNotes}`;
        const notePayload = { 
            LogID: 'L'+Date.now(), 
            ClientID: activeClientId, 
            Date: new Date().toISOString().split('T')[0], 
            Type: 'איטרציה', 
            Content: logContent 
        };
        await sendToGAS('saveLog', notePayload);

        // 2. Reset Data
        currentIterData[stepKey] = {
            status: 'טרם התחיל',
            linkedDoc: saved.linkedDoc || "", 
            sheetUrl: saved.sheetUrl || "",
            notes: "" 
        };
        
        // 3. Save Client
        await sendToGAS('saveClient', { 
            ClientID: activeClientId, 
            IterationsJSON: JSON.stringify(currentIterData)
        }); 

        await refreshData(true);
        showToast("סבב חדש נפתח! ההיסטוריה נשמרה בלוג.");

     } catch(e) { alert("שגיאה: " + e.message); } finally { hideLoader(); }
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
        const notesEl = document.getElementById(`iter_notes_${stepId}`);
        
        currentIterData[`iter_${stepId}`] = {
            status: statusEl?.value || 'טרם התחיל',
            linkedDoc: cleanID(linkedDocEl?.value),
            sheetUrl: sheetUrlEl?.value.trim() || "",
            notes: notesEl?.value || ""
        };
        await sendToGAS('saveClient', { 
            ClientID: activeClientId, 
            IterationsJSON: JSON.stringify(currentIterData), 
            Iter1_Link_ID: (stepId===1) ? sheetUrlEl.value.trim() : client.Iter1_Link_ID 
        }); 
        await refreshData(true);
        if(!silent) showToast("נשמר בהצלחה!");
    } catch(e) { console.error(e); } finally { if(!silent) hideLoader(); }
};

// FIX #1: Sync Logic with GID Extraction and Immediate Update (V280.0)
window.syncIterationStatus = async function(iterId) {
    showLoader();
    try {
        const urlInput = document.getElementById(`iter_sheet_url_${iterId}`);
        const urlVal = urlInput ? urlInput.value.trim() : "";
        
        if (!urlVal) {
            hideLoader();
            return alert("אנא הזן קישור לגיליון (ID או URL מלא) לפני הסנכרון.");
        }

        let gid = null;
        const gidMatch = urlVal.match(/gid=(\d+)/);
        if (gidMatch) gid = gidMatch[1];

        await saveIterationData(iterId, true); 
        
        const res = await sendToGAS('checkIterationStatus', { 
             clientId: activeClientId,
             iterId: iterId,
             sheetUrl: urlVal,
             sheetGid: gid 
        });
        
        let syncedValue = res.value || res.result || res.data;
        let sheetName = res.sheetName || "לא ידוע";

        if(res.status === 'success') {
            if (syncedValue && String(syncedValue).trim() !== "") {
                syncedValue = String(syncedValue).trim(); 
                
                const dropdown = document.getElementById(`iter_status_${iterId}`);
                if (dropdown) {
                    let exists = false;
                    for (let i = 0; i < dropdown.options.length; i++) {
                        if (dropdown.options[i].value === syncedValue) { exists = true; break; }
                    }
                    if (!exists) {
                        dropdown.add(new Option(syncedValue, syncedValue));
                    }
                    
                    dropdown.value = syncedValue; 
                    dropdown.style.backgroundColor = "#e8f5e9"; 
                    
                    let client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
                    let currentIterData = client && client.IterationsJSON ? JSON.parse(client.IterationsJSON) : {};
                    
                    if (!currentIterData[`iter_${iterId}`]) currentIterData[`iter_${iterId}`] = {};
                    currentIterData[`iter_${iterId}`].status = syncedValue;
                    currentIterData[`iter_${iterId}`].sheetUrl = urlVal;

                    await sendToGAS('saveClient', { 
                        ClientID: activeClientId, 
                        IterationsJSON: JSON.stringify(currentIterData),
                        Iter1_Link_ID: (iterId===1) ? urlVal : client.Iter1_Link_ID,
                        Iter1_Status_Live: (iterId===1) ? syncedValue : client.Iter1_Status_Live
                    });
                }
                
                await refreshData(true); 
                showToast(`עודכן לסטטוס: ${syncedValue}`);
            } else {
                if (res.isFallback) {
                      alert("⚠️ השרת לא מצא את הטאב הספציפי וקרא את הראשון. וודא שהקישור תקין.");
                }
            }
        } else {
            console.warn("Sync response:", res);
            alert("שגיאת שרת: " + (res.message || "לא התקבלה תשובה תקינה"));
        }
    } catch(e) { console.error(e); alert("שגיאה קריטית בסנכרון: " + e.message); } finally { hideLoader(); }
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
    // Load the saved logo (if any) for this client
    currentLogoDataUrl = getClientLogo(name);
    updateLogoPreviewUI();
}

// --- CLIENT LOGO (uploaded image embedded in the quote, persisted per client) ---
function logoStorageKey(name) {
    return 'oneflow_logo_' + String(name || '').trim();
}
function getClientLogo(name) {
    if (!name) return "";
    return localStorage.getItem(logoStorageKey(name)) || "";
}
function setClientLogo(name, dataUrl) {
    if (!name) return;
    if (dataUrl) localStorage.setItem(logoStorageKey(name), dataUrl);
    else localStorage.removeItem(logoStorageKey(name));
}

function updateLogoPreviewUI() {
    const wrap = document.getElementById('logoPreviewWrap');
    const img = document.getElementById('logoPreview');
    if (!wrap || !img) return;
    if (currentLogoDataUrl) {
        img.src = currentLogoDataUrl;
        wrap.style.display = 'flex';
    } else {
        img.src = "";
        wrap.style.display = 'none';
    }
}

window.handleLogoUpload = function(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
        alert("אנא בחר קובץ תמונה תקין (PNG / JPG וכו').");
        input.value = "";
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        currentLogoDataUrl = e.target.result;
        const name = document.getElementById('inputClientName').value.trim();
        if (name) {
            setClientLogo(name, currentLogoDataUrl);
            showToast("הלוגו נשמר ללקוח");
        } else {
            showToast("הלוגו נטען (בחר לקוח כדי לשמור אותו)");
        }
        updateLogoPreviewUI();
    };
    reader.readAsDataURL(file);
};

window.removeClientLogo = function() {
    const name = document.getElementById('inputClientName').value.trim();
    setClientLogo(name, "");
    currentLogoDataUrl = "";
    const fileInput = document.getElementById('inputClientLogo');
    if (fileInput) fileInput.value = "";
    updateLogoPreviewUI();
    showToast("הלוגו הוסר");
};

window.updateFormView = function() {
    const type = document.getElementById('docType').value;
    document.getElementById('areaIterFields').style.display = (type === 'iteration') ? 'block' : 'none';
    document.getElementById('areaHoursScope').style.display = (type === 'hours_quote') ? 'block' : 'none';
    document.getElementById('areaBuilder').style.display = (type !== 'iteration') ? 'block' : 'none';
    document.getElementById('builderTotals').style.display = (type !== 'iteration') ? 'block' : 'none';
    
    // Toggle General Notes area
    if(document.getElementById('areaGeneralNotes')) {
        document.getElementById('areaGeneralNotes').style.display = (type !== 'iteration') ? 'block' : 'none';
    }

    if(type === 'iteration' && !document.getElementById('cbTableMode')) {
         const container = document.getElementById('areaIterFields');
         const div = document.createElement('div');
         div.style.marginBottom = '10px';
         div.innerHTML = `<input type="checkbox" id="cbTableMode"> <label for="cbTableMode">הצג כטבלה (להדבקה מאקסל)</label>`;
         const txtArea = document.getElementById('inputPasteIter');
         container.insertBefore(div, txtArea);
    }
    const sel = document.getElementById('selItemPreset');
    if(sel && PRESETS[type]) {
        sel.innerHTML = '<option value="">-- בחר פריט --</option>';
        PRESETS[type].forEach((p, i) => sel.add(new Option(p.name, i)));
    }

    // Load the editable template (intro / terms / closing) for the selected doc type
    loadTemplateEditor(type);

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
    document.getElementById('inputItemDesc').value = '';
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

// FIX #4: Added closePreview function with full restore
window.closePreview = function() {
    document.getElementById('previewWrapper').style.display = 'none';
    document.getElementById('editorArea').style.display = 'block';
    document.querySelector('.sidebar').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
    
    // Restore buttons z-index
    const pdfButtons = document.getElementById('pdfActionButtons');
    if(pdfButtons) {
        pdfButtons.style.position = 'static';
    }
}

window.generatePreview = function() {
    const clientName = document.getElementById('inputClientName').value;
    if(!clientName) return alert("אנא בחר לקוח");
    
    document.getElementById('editorArea').style.display = 'none';
    document.getElementById('previewWrapper').style.display = 'flex'; 
    document.querySelector('.sidebar').style.display = 'none'; 
    
    // Fix Z-Index
    const pdfButtons = document.getElementById('pdfActionButtons');
    if(!pdfButtons) {
        // Create if missing
        const newBtns = document.createElement('div');
        newBtns.id = 'pdfActionButtons';
        newBtns.style.cssText = "position: fixed; top: 10px; right: 20px; z-index: 999999; display: flex; gap: 10px;";
        newBtns.innerHTML = `
            <button class="btn btn-danger" onclick="window.closePreview()">✏️ חזור לעריכה</button>
            <button class="btn btn-primary" onclick="window.printPDF()">🖨️ הדפס / שמור כ-PDF</button>
        `;
        document.getElementById('previewWrapper').appendChild(newBtns);
    } else {
         pdfButtons.style.display = 'flex'; // Ensure visible
         pdfButtons.style.position = 'fixed';
         pdfButtons.style.zIndex = '999999';
    }

    setText('pClientName', clientName);
    setText('pClientHP', document.getElementById('genClientHP').value || '-');
    setText('pContact', document.getElementById('genClientContact').value || '-');

    // Client logo in the client details row
    const logoEl = document.getElementById('pClientLogo');
    if (logoEl) {
        const logo = currentLogoDataUrl || getClientLogo(clientName);
        if (logo) {
            logoEl.src = logo;
            logoEl.alt = clientName || "לוגו";
            logoEl.style.display = 'block';
        } else {
            logoEl.src = "";
            logoEl.style.display = 'none';
        }
    }
    
    setText('pDocNum', document.getElementById('inputDocNum').value);
    setText('pDate', new Date().toLocaleDateString('he-IL'));
    
    const type = document.getElementById('docType').value;
    if(type === 'hours_quote') parseQuotePaste();

    // Use the editable template (live textarea values, falling back to saved/default)
    const tpl = getActiveTemplate(type);

    document.getElementById('pIntroText').innerHTML = renderTemplateHtml(tpl.intro);

    // טקסט סוגר את ההצעה (closing text)
    const closingEl = document.getElementById('pClosingText');
    if (closingEl) {
        closingEl.innerHTML = renderTemplateHtml(tpl.closing);
        closingEl.style.display = (tpl.closing && tpl.closing.trim()) ? 'block' : 'none';
        closingEl.style.pageBreakInside = 'avoid';
        closingEl.style.breakInside = 'avoid';
    }

    // אבטחת מניעת חיתוך של אזור התנאים
    const termsEl = document.getElementById('pTerms');
    if (termsEl) {
        const termsHtml = renderTemplateHtml(tpl.terms);
        termsEl.innerHTML = termsHtml;
        // הסתרה כשריק (למשל באיטרציה) כדי לא להשאיר קו/מרווח מיותר
        termsEl.style.display = (termsHtml && termsHtml.trim()) ? 'block' : 'none';
        termsEl.style.pageBreakInside = 'avoid';
        termsEl.style.breakInside = 'avoid';
    }
    
    const setupItems = quoteItems.filter(i => !i.isMonthly);
    const monthlyItems = quoteItems.filter(i => i.isMonthly);
    
    let html = "";
    if(type === 'hours_quote' && hoursScopeLines.length > 0) {
          html += `<div class="print-table-title" style="margin-bottom:10px; font-weight:bold; border-bottom:2px solid #0056b3; display:inline-block;">פירוט תכולה / משימות</div><table class="print-table" style="width:100%; border-collapse:collapse;"><tbody>`;
          hoursScopeLines.forEach(line => { html += `<tr style="page-break-inside: avoid; break-inside: avoid;"><td class="wrap-text" style="padding:8px; border-bottom:1px solid #eee; white-space:pre-wrap; word-break:break-word;">${line}</td></tr>`; });
          html += `</tbody></table><br>`;
    }

    // --- UPDATE 1 & 3: TEXT WRAP AND DESCRIPTIONS ---
    if (setupItems.length > 0 && type !== 'iteration') {
        html += `<h4 style="color:#28a745; border-bottom:2px solid #28a745; margin-bottom:5px;">עלויות הקמה / פיתוח (חד פעמי)</h4>`;
        html += `<table class='print-table'><thead><tr><th style="width:50%;">פריט ותיאור</th><th style="width:10%;">כמות</th><th style="width:20%;">מחיר יח'</th><th style="width:20%;">סה"כ</th></tr></thead><tbody>`;
        setupItems.forEach(it => {
            let descHtml = it.desc ? `<div style="font-size:11px; color:#555; margin-top:4px; white-space:pre-wrap; word-break:break-word;">${it.desc}</div>` : "";
            html += `<tr style="page-break-inside: avoid; break-inside: avoid;">
                <td style="white-space:pre-wrap; word-break:break-word;"><strong>${it.name}</strong>${descHtml}</td>
                <td style="text-align:center;">${it.qty}</td>
                <td>${it.price.toLocaleString()} ₪</td>
                <td style="font-weight:bold;">${(it.price*it.qty).toLocaleString()} ₪</td>
            </tr>`;
        });
        html += `</tbody></table><br>`;
    }

    if (monthlyItems.length > 0 && type !== 'iteration') {
        html += `<h4 style="color:#007bff; border-bottom:2px solid #007bff; margin-bottom:5px;">עלויות שוטפות (ריטיינר חודשי)</h4>`;
        html += `<table class='print-table'><thead><tr><th style="width:50%;">פריט ותיאור</th><th style="width:10%;">כמות</th><th style="width:20%;">מחיר יח'</th><th style="width:20%;">סה"כ</th></tr></thead><tbody>`;
        monthlyItems.forEach(it => {
            let descHtml = it.desc ? `<div style="font-size:11px; color:#555; margin-top:4px; white-space:pre-wrap; word-break:break-word;">${it.desc}</div>` : "";
            html += `<tr style="page-break-inside: avoid; break-inside: avoid;">
                <td style="white-space:pre-wrap; word-break:break-word;"><strong>${it.name}</strong>${descHtml}</td>
                <td style="text-align:center;">${it.qty}</td>
                <td>${it.price.toLocaleString()} ₪</td>
                <td style="font-weight:bold;">${(it.price*it.qty).toLocaleString()} ₪</td>
            </tr>`;
        });
        html += `</tbody></table><br>`;
    }
    
    // --- PRINT AVOID FIX: Added 'page-break-inside: avoid; break-inside: avoid; display: block;' to ensure block stays united
    const genNotesEl = document.getElementById('inputGeneralNotes');
    const genNotesVal = genNotesEl ? genNotesEl.value : "";
    if (genNotesVal.trim() && type !== 'iteration') {
        html += `<div style="margin-top:10px; margin-bottom:20px; background:#fdfdfd; padding:15px; border:1px solid #ddd; border-radius:5px; page-break-inside: avoid; break-inside: avoid; display: block;">
            <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:10px;">הערות:</h4>
            <div style="white-space:pre-wrap; font-size:13px; line-height:1.5;">${genNotesVal}</div>
        </div>`;
    }

    const freeText = (type === 'iteration') ? document.getElementById('inputPasteIter').value : "";
    if (type === 'iteration' && freeText.trim()) {
        const isTableMode = document.getElementById('cbTableMode') && document.getElementById('cbTableMode').checked;
        let contentHtml = "";

        if (isTableMode) {
             contentHtml += `<table class="print-table"><tbody>`;
             const rows = freeText.split('\n');
             rows.forEach(r => {
                 if(r.trim()) {
                     contentHtml += `<tr style="page-break-inside: avoid; break-inside: avoid;">`;
                     const cells = r.split('\t'); 
                     cells.forEach(c => contentHtml += `<td style="padding:5px; white-space:pre-wrap; word-break:break-word;">${c.trim()}</td>`);
                     contentHtml += `</tr>`;
                 }
             });
             contentHtml += `</tbody></table>`;
        } else {
             const rawLines = freeText.split(/(?:\r\n|\r|\n)/g);
             contentHtml += `<ol style="line-height:1.45; padding-right:20px; margin-top:8px;">`;
             let pendingBlank = false; // האם קדמה שורה ריקה לפריט הבא
             rawLines.forEach(line => {
                 // שורה ריקה = רווח מכוון — נוסיף רווח מתון אחד, בלי הצטברות
                 if (!line.trim()) { pendingBlank = true; return; }
                 let l = line.trim();
                 if (l.startsWith('"') && l.endsWith('"')) {
                     l = l.substring(1, l.length - 1);
                     l = l.replace(/""/g, '"');
                 }
                 const extraTop = pendingBlank ? 10 : 0; // רווח קבוע, לא מצטבר
                 contentHtml += `<li style="margin-bottom:5px; margin-top:${extraTop}px; page-break-inside:avoid; white-space:pre-wrap; word-break:break-word;">${l}</li>`;
                 pendingBlank = false;
             });
             contentHtml += `</ol>`;
        }

        const releaseDate = document.getElementById('inputReleaseDate')?.value;
        let extraInfo = "";
        if (releaseDate) extraInfo = `<div style="margin-bottom:10px;"><strong>צפי גרסה:</strong> ${parseDateISO(releaseDate)}</div>`;
        // ללא break-inside:avoid על העטיפה כדי שתוכן ארוך יזרום בין דפים ולא ישאיר חלל לבן
        html += `<div style="background:#f9f9f9; padding:15px; border-right:4px solid #555; margin-top:15px;">
            ${extraInfo}
            <strong>פירוט תוכן:</strong>
            ${contentHtml}
        </div>`;
    } 

    document.getElementById('pContentTables').innerHTML = html;
    
    const bottomSec = document.getElementById('bottomSection');
    const totalsBox = document.getElementById('pTotalsBox');
    
    // --- PRINT AVOID FIX: Set entire bottom wrapper to not split
    if (bottomSec) {
        bottomSec.style.pageBreakInside = 'avoid';
        bottomSec.style.breakInside = 'avoid';
    }

    // Tighten the signature box / footer spacing for iterations (no totals block above them)
    const approvalBox = document.querySelector('.approval-box');
    const footerWrap = document.querySelector('.footer-wrapper');
    if (type === 'iteration') {
        if (approvalBox) approvalBox.style.marginTop = '30px';
        if (footerWrap) footerWrap.style.marginTop = '25px';
    } else {
        if (approvalBox) approvalBox.style.marginTop = '60px';
        if (footerWrap) footerWrap.style.marginTop = '50px';
    }

    if(type === 'iteration') {
        if(bottomSec) bottomSec.style.display = 'none';
    } else {
        if(bottomSec) bottomSec.style.display = 'flex';
        const t = renderBuilderTable(); 
        const vat = t.setupAfterDisc * VAT_RATE;
        const totalFinal = t.setupAfterDisc + vat;
        
        // --- PRINT AVOID FIX: Added to Totals box
        let totHtml = `<div style="border:2px solid #333; padding:15px; border-radius:8px; min-width:320px; max-width:400px; background:#fff; box-sizing:border-box; page-break-inside: avoid; break-inside: avoid; display: block;">`;
        if (t.setup > 0) {
            totHtml += `<div class="total-row"><span>סה"כ הקמה:</span><span>${t.setup.toLocaleString()} ₪</span></div>`;
            if (t.discPercent > 0) totHtml += `<div class="total-row" style="color:red;"><span>הנחה (${t.discPercent}%):</span><span>-${(t.setup - t.setupAfterDisc).toLocaleString()} ₪</span></div>`;
            
            // --- VAT UPDATE SECTION START ---
            totHtml += `<div class="total-row" style="font-weight:bold; border-top:1px solid #ccc; margin-top:5px; padding-top:5px;"><span>סה"כ לפני מע"מ:</span><span>${t.setupAfterDisc.toLocaleString()} ₪</span></div>`;
            totHtml += `<div class="total-row"><span>מע"מ (${(VAT_RATE*100).toFixed(0)}%):</span><span>${vat.toLocaleString()} ₪</span></div>`;
            totHtml += `<div class="total-row" style="font-weight:bold; font-size:1.2em; border-top:2px solid #333; margin-top:5px; padding-top:5px;"><span>סה"כ לתשלום (כולל מע"מ):</span><span>${totalFinal.toLocaleString()} ₪</span></div>`;
             // --- VAT UPDATE SECTION END ---
        }
        if (t.monthly > 0) {
            const monthlyVat = t.monthly * VAT_RATE;
            const monthlyFinal = t.monthly + monthlyVat;
            totHtml += `<div style="margin-top:15px; padding-top:10px; border-top:2px dashed #007bff; color:#0056b3;">
                <div class="total-row" style="display:flex; justify-content:space-between;">
                    <span>שוטף חודשי (לפני מע"מ):</span>
                    <strong>${t.monthly.toLocaleString()} ₪</strong>
                </div>
                 <div class="total-row" style="display:flex; justify-content:space-between;">
                    <span>מע"מ (${(VAT_RATE*100).toFixed(0)}%):</span>
                    <span>${monthlyVat.toLocaleString()} ₪</span>
                </div>
                 <div class="total-row" style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #0056b3; margin-top:5px; padding-top:2px;">
                    <span>סה"כ חודשי (כולל מע"מ):</span>
                    <strong>${monthlyFinal.toLocaleString()} ₪</strong>
                </div>
            </div>`;
        }
        totHtml += `</div>`;
        if(totalsBox) totalsBox.innerHTML = totHtml;
    }

    document.title = `${clientName} - ${document.getElementById('inputDocNum').value}`;
    window.scrollTo(0,0);
};

window.saveDealFromGenerator = async function() { 
    const clientName = document.getElementById('inputClientName').value; 
    const clientObj = data.clients.find(c => String(c['Company Name']).trim() === String(clientName).trim()); 
    if(!clientObj) return alert("לקוח לא קיים"); 
    
    // FORCE PARSE ON SAVE
    const type = document.getElementById('docType').value;
    if (type === 'iteration') parseIterationText();
    if (type === 'hours_quote') parseQuotePaste();

    showLoader();
    try {
        const t = renderBuilderTable();
        const docNum = document.getElementById('inputDocNum').value;
        
        let typeName = 'הצעת מחיר';
        if(type === 'iteration') typeName = 'איטרציה';
        if(type === 'hours_quote') typeName = 'בנק שעות';
        
        const iterNum = (type === 'iteration') ? (getValue('inputIterNum') || '') : '';
        let desc = `#${docNum} - ${typeName} - ${clientName}`;
        if(type === 'iteration') desc += ` (מס' ${iterNum})`;

        // For iterations, persist the full free-text content (+ meta) so it can be edited later
        let itemsJson;
        if (type === 'iteration') {
            itemsJson = JSON.stringify({
                __iter: true,
                text: getValue('inputPasteIter') || "",
                releaseDate: getValue('inputReleaseDate') || "",
                iterNum: iterNum
            });
        } else {
            itemsJson = JSON.stringify(quoteItems);
        }

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
            ItemsJSON: itemsJson
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

// Delete a finance/document record by TransID (was referenced but never defined)
window.deleteFinanceItem = async function(transId) {
    if (!transId) return;
    if (!confirm("למחוק את המסמך/התנועה? פעולה זו אינה הפיכה.")) return;
    showLoader();
    try {
        const res = await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: transId, idCol: 'TransID' });
        if (res && res.status === 'error') throw new Error(res.message);
        await refreshData(true);
        showToast("נמחק");
    } catch(e) { alert("שגיאה במחיקה: " + e.message); } finally { hideLoader(); }
};

// Next available document number across all saved finance records
function getNextDocNum() {
    let max = START_DOC_NUM - 1;
    (data.finance || []).forEach(f => {
        const n = parseInt(f.DocNum, 10);
        if (!isNaN(n) && n > max) max = n;
    });
    return max + 1;
}

// --- DUPLICATE A DOCUMENT (quote or iteration) TO ANOTHER CLIENT ---
function createDuplicateModal() {
    if (document.getElementById('duplicateModal')) return;
    const div = document.createElement('div');
    div.id = 'duplicateModal';
    div.style.cssText = "display:none; position:fixed; z-index:10001; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5);";
    div.innerHTML = `
        <div style="background:#fff; max-width:460px; margin:12% auto; padding:20px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.25);">
            <h3 style="margin-top:0;">שכפול מסמך ללקוח אחר</h3>
            <p id="dupSourceInfo" style="font-size:13px; color:#555;"></p>
            <label style="font-weight:bold; display:block; margin-bottom:5px;">בחר לקוח יעד:</label>
            <select id="dupTargetClient" style="width:100%; padding:8px; margin-bottom:15px;"></select>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn btn-danger btn-sm" onclick="document.getElementById('duplicateModal').style.display='none'">ביטול</button>
                <button class="btn btn-success btn-sm" onclick="confirmDuplicateDocument()">⧉ שכפל</button>
            </div>
        </div>`;
    document.body.appendChild(div);
}

window.duplicateDocument = function(transId) {
    createDuplicateModal();
    dupSourceTransId = transId;
    const src = data.finance.find(f => f.TransID === transId);
    if (!src) return alert("מסמך לא נמצא");
    document.getElementById('dupSourceInfo').innerText =
        `מקור: #${src.DocNum || ''} · ${isIterationDoc(src) ? 'איטרציה' : 'הצעת מחיר'} · ${src.ClientName || ''}`;
    const sel = document.getElementById('dupTargetClient');
    sel.innerHTML = '';
    data.clients.slice()
        .sort((a,b) => String(a['Company Name']||'').localeCompare(String(b['Company Name']||''), 'he'))
        .forEach(c => sel.add(new Option(c['Company Name'], cleanID(c.ClientID))));
    document.getElementById('duplicateModal').style.display = 'block';
};

window.confirmDuplicateDocument = async function() {
    const sel = document.getElementById('dupTargetClient');
    const targetId = sel ? sel.value : "";
    if (!targetId) return alert("בחר לקוח יעד");

    const src = data.finance.find(f => f.TransID === dupSourceTransId);
    if (!src) return alert("מסמך המקור לא נמצא");
    const target = data.clients.find(c => cleanID(c.ClientID) === cleanID(targetId));
    if (!target) return alert("לקוח יעד לא נמצא");

    const isIter = isIterationDoc(src);
    const newDocNum = getNextDocNum();
    const typeName = isIter ? 'איטרציה' : (String(src.DocType).includes('hours') ? 'בנק שעות' : 'הצעת מחיר');

    let desc = `#${newDocNum} - ${typeName} - ${target['Company Name']}`;
    if (isIter) {
        try { const p = JSON.parse(src.ItemsJSON || '{}'); if (p && p.__iter && p.iterNum) desc += ` (מס' ${p.iterNum})`; } catch(e) {}
    }

    const payload = {
        TransID: 'T' + Date.now(),
        ClientID: cleanID(target.ClientID),
        ClientName: target['Company Name'],
        DocType: src.DocType,
        DocNum: newDocNum,
        Amount: src.Amount || 0,
        PaymentDate: new Date().toISOString(),
        Status: isIter ? 'תיעוד בלבד' : 'הצעת מחיר',
        Description: desc,
        ItemsJSON: src.ItemsJSON || (isIter ? '{}' : '[]')
    };

    document.getElementById('duplicateModal').style.display = 'none';
    showLoader();
    try {
        const res = await sendToGAS('addFinance', payload);
        if (res && res.status === 'error') throw new Error(res.message);
        await refreshData(true);
        showToast(`המסמך שוכפל ללקוח: ${target['Company Name']}`);
    } catch(e) { alert("שגיאה בשכפול: " + e.message); } finally { hideLoader(); }
};

function parseIterationText() {
    const text = document.getElementById('inputPasteIter').value;
    quoteItems = text.split('\n').filter(l => l.trim()).map(line => ({ name: line.trim(), qty: 1, price: 0, isMonthly: false }));
    renderBuilderTable();
}

// Restore Hours Logic
function parseQuotePaste() { 
    const text = document.getElementById('inputPasteQuote').value; 
    hoursScopeLines = text.split('\n').filter(l => l.trim() !== ''); 
}

// FIX: Helper to calculate total invoiced amount using clean IDs and ONLY Paid status
function getLinkedPaidSum(quoteId) {
    if (!quoteId) return 0;
    const cleanQ = cleanID(quoteId);
    return data.finance
        .filter(f => {
            const isLinked = cleanID(f.LinkedDoc) === cleanQ;
            const isPaid = f.Status === 'שולם';
            return isLinked && isPaid;
        })
        .reduce((sum, f) => sum + parseFloat(f.Amount || 0), 0);
}

// --- 10. CRM & Finance Display (V261.0 FIX: ASMACHTA SYNC) ---

// NEW: Function to force-render the input box correctly
function renderFinanceInputBox() {
    const container = document.getElementById('financeInputContainer');
    if(!container) return;
    
    // V304: Split Name/Desc Inputs
    container.innerHTML = `
    <div style="background:#e3f2fd; padding:10px; margin-bottom:15px; border-radius:8px; border:1px solid #90caf9;">
        <h5 style="color:#1565c0; margin-bottom:10px;">הוסף תנועה פיננסית:</h5>
        
        <div style="margin-bottom:10px;">
             <select id="inpFinLinkQuote" style="width:100%;" onchange="renderQuoteItemsSelection()">
                 <option value="">-- בחר הצעה לקשר --</option>
             </select>
             <div id="quoteItemsSelectBox"></div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <select id="inpNewFinType" style="flex:1;">
                <option value="חד פעמי">הקמה / חד פעמי</option>
                <option value="שוטף">שוטף</option>
            </select>
            <select id="inpNewFinDocType" style="flex:1;">
                <option value="חשבונית מס">חשבונית מס</option>
                <option value="חשבונית זיכוי">חשבונית זיכוי</option>
                <option value="קבלה">קבלה</option>
                <option value="הצעת מחיר">הצעת מחיר</option>
            </select>
            <input type="date" id="inpNewFinDate" style="flex:1;">
        </div>

        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <input type="number" id="inpNewFinAmount" placeholder="סכום" style="width:100px;">
            <input type="text" id="inpNewFinTitle" placeholder="שם תנועה (חובה)" style="flex:1; font-weight:bold;">
            <input type="text" id="inpNewFinDesc" placeholder="תיאור / פירוט נוסף" style="flex:1;">
        </div>
        
        <div style="display:flex; gap:10px; margin-bottom:10px;">
             <input type="text" id="inpNewFinRef" placeholder="מס' חשבונית / אסמכתא" style="flex:1;">
             <input type="date" id="inpNewFinForecast" title="צפי תשלום" style="flex:1;">
        </div>

        <button id="btnSaveNewFin" class="btn btn-success" style="width:100%;">שמור תנועה</button>
    </div>`;
    
    // Set default date
    document.getElementById('inpNewFinDate').value = new Date().toISOString().split('T')[0];
    
    // Re-populate dropdown
    updateQuoteLinkDropdown();
    
    // V305 FIX: Single clean binding using onclick to prevent duplicates
    const btn = document.getElementById('btnSaveNewFin');
    if(btn) {
        btn.onclick = window.addNewFinanceItem;
    }
}

function renderClientFinance() {
    const list = document.getElementById('financeTableBody'); if(!list) return;
    list.innerHTML = "";
    
    // Call the input box renderer (This fixes the 'Save Transaction' button issue)
    renderFinanceInputBox();
    
    // V305 FIX: Ensure single binding if re-rendering occurs
    setTimeout(() => {
        const btn = document.getElementById('btnSaveNewFin');
        if(btn) {
             btn.onclick = window.addNewFinanceItem;
        } else {
            // Fallback for older HTML structures - find by text
            const allBtns = document.getElementsByTagName("button");
            for (let b of allBtns) {
                if (b.innerText && b.innerText.includes("שמור תנועה")) {
                    b.onclick = window.addNewFinanceItem;
                }
            }
        }
    }, 500);
    
    // FIX: More relaxed matching for alphanumeric IDs (like "Client_A" vs "Client A")
    const cleanActive = cleanID(activeClientId);
    
    const fin = (data.finance || []).filter(f => {
        let fID = cleanID(f.ClientID);
        if (fID === cleanActive) return true;
        if (/\d/.test(fID) && /\d/.test(cleanActive)) {
             return fID.replace(/\D/g, '') === cleanActive.replace(/\D/g, '');
        }
        return false;
    });
    
    // --- BANNER CALCULATIONS (Updated Logic V299.0) ---

    // 1. Total Paid (Actual Revenue)
    const totalPaid = fin.filter(f => f.Status === 'שולם')
                          .reduce((sum, item) => sum + parseFloat(item.Amount || 0), 0);

    // 2. Open Debt (Invoices Only)
    const openDebt = fin.filter(f => 
        ['ממתין לגביה', 'חשבונית יצאה', 'תשלום עתידי', 'אושרה'].includes(f.Status) && 
        !String(f.DocType).includes('הצעת') && !String(f.DocType).includes('quote')
    ).reduce((sum, item) => sum + parseFloat(item.Amount || 0), 0);

    // 3. Quote Balance Calculation (Including Quotes - Paid Invoices)
    let quoteBalance = 0;
    
    // Filter Quotes: Include both "Quote" and "Approved" status
    const quotes = fin.filter(f => 
        (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote')) && 
        (f.Status === 'אושרה' || f.Status === 'הצעת מחיר')
    );
    
    quotes.forEach(q => {
        const qAmt = parseFloat(q.Amount || 0);
        // Calculate linked PAID invoices for this specific quote
        const linkedPaid = getLinkedPaidSum(q.TransID);
        quoteBalance += Math.max(0, qAmt - linkedPaid);
    });

    // Update Badge
    const badge = document.getElementById('clientRevenueBadge');
    if(badge) badge.innerText = `סה"כ שולם: ${totalPaid.toLocaleString()} ₪ | חוב פתוח: ${openDebt.toLocaleString()} ₪`;

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
        <div style="flex:1; text-align:center; border-left:1px solid #ccc;">
            <div style="font-size:12px; color:#555;">סה"כ הכנסות בפועל (שולם)</div>
            <div style="font-size:18px; font-weight:bold; color:#2e7d32;">${totalPaid.toLocaleString()} ₪</div>
        </div>
        <div style="flex:1; text-align:center; border-left:1px solid #ccc;">
            <div style="font-size:12px; color:#555;">חוב פתוח (חשבוניות)</div>
            <div style="font-size:18px; font-weight:bold; color:#d32f2f;">${openDebt.toLocaleString()} ₪</div>
        </div>
        <div style="flex:1; text-align:center;">
            <div style="font-size:12px; color:#555;">יתרת הצעות לחיוב</div>
            <div style="font-size:18px; font-weight:bold; color:#ff9800;">${quoteBalance.toLocaleString()} ₪</div>
        </div>
    `;

    // Bulk Save Buttons
    if (!document.getElementById('btnBulkActionContainer')) {
         const div = document.createElement('div');
         div.id = 'btnBulkActionContainer';
         div.style.marginTop = '10px';
         div.style.display = 'flex';
         div.style.gap = '10px';
         
         const btnSave = document.createElement('button');
         btnSave.className = 'btn btn-primary btn-sm';
         btnSave.innerText = '💾 שמור את כל השינויים בטבלה';
         btnSave.style.flex = '1';
         btnSave.onclick = saveAllFinanceChanges;
         
         const btnDel = document.createElement('button');
         btnDel.className = 'btn btn-danger btn-sm';
         btnDel.innerText = '🗑️ מחק מסומנים';
         btnDel.style.flex = '0 0 150px';
         btnDel.onclick = deleteSelectedFinanceItems;

         div.appendChild(btnSave);
         div.appendChild(btnDel);

         list.closest('#mtab-finance').insertBefore(div, document.getElementById('financeList'));
    }

    const thead = list.closest('table').querySelector('thead tr');
    if (thead && !thead.querySelector('.col-cb')) {
        const th = document.createElement('th');
        th.className = 'col-cb';
        th.innerHTML = '<input type="checkbox" onchange="toggleAllFinance(this)">';
        thead.insertBefore(th, thead.firstChild);
    }

    if(fin.length === 0) { list.innerHTML = "<tr><td colspan='11' style='text-align:center;'>אין תנועות</td></tr>"; return; }

    fin.forEach(f => {
        let displayDesc = f.Description || f.DocType;
        let asmachtaDisplay = f.DocNum || f.InvoiceNum || ""; 
        
        if(f.LinkedDoc) {
             const linkedQ = data.finance.find(q => q.TransID === f.LinkedDoc);
             if(linkedQ) displayDesc += ` <span style='color:blue; font-size:11px;'>(מקושר להצעה #${linkedQ.DocNum})</span>`;
        }
        
        let dateValue = parseDateISO(f.PaymentDate);
        let forecastValue = parseDateISO(f.ForecastDate); 

        list.innerHTML += `<tr data-id="${f.TransID}">
            <td><input type="checkbox" class="fin-row-cb" value="${f.TransID}"></td>
            <td><input type="date" class="fin-input-date" value="${dateValue}" style="width:110px;"></td>
            <td><input type="number" class="fin-input-amount" value="${f.Amount}" style="width:80px;"></td>
            <td><input type="text" class="fin-input-desc" value="${displayDesc.replace(/<[^>]*>/g, '')}" title="${displayDesc.replace(/<[^>]*>/g, '')}"></td>
            <td><input type="text" class="fin-input-inv" value="${asmachtaDisplay}" style="width:80px;"></td>
            <td><input type="date" class="fin-input-forecast" value="${forecastValue}" style="width:110px;"></td> 
            <td>
                <select class="fin-input-coltype" style="width:80px;">
                    <option value="OneTime" ${f.CollectionType=='OneTime'?'selected':''}>חד פעמי</option>
                    <option value="Recurring" ${f.CollectionType=='Recurring'?'selected':''}>שוטף</option>
                    <option value="Manual" ${f.CollectionType=='Manual'?'selected':''}>ידני</option>
                </select>
            </td>
            <td>
                <select class="fin-input-method" style="width:90px;">
                    <option ${f.PaymentMethod=='העברה בנקאית'?'selected':''}>העברה בנקאית</option>
                    <option ${f.PaymentMethod=='אשראי'?'selected':''}>אשראי</option>
                    <option ${f.PaymentMethod=='שיק'?'selected':''}>שיק</option>
                    <option ${f.PaymentMethod=='מזומן'?'selected':''}>מזומן</option>
                    <option ${f.PaymentMethod=='ביט/אפליקציה'?'selected':''}>ביט/אפליקציה</option>
                </select>
            </td>
            <td>
                <select class="fin-input-status">
                    <option ${f.Status=='שולם'?'selected':''}>שולם</option>
                    <option ${f.Status=='ממתין לגביה'?'selected':''}>ממתין לגביה</option>
                    <option ${f.Status=='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                    <option ${f.Status=='אושרה'?'selected':''}>אושרה</option>
                    <option ${f.Status=='חשבונית יצאה'?'selected':''}>חשבונית יצאה</option>
                    <option ${f.Status=='בוטל'?'selected':''}>בוטל</option>
                </select>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="saveSingleFinanceRow('${f.TransID}')">💾</button>
                <button class="btn-icon" onclick="openItemPopup('${f.TransID}')">👁️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteFinanceItem('${f.TransID}')">X</button>
            </td>
        </tr>`;
    });
}

// --- V261.0 Helper Functions ---
window.toggleAllFinance = function(el) {
    document.querySelectorAll('.fin-row-cb').forEach(cb => cb.checked = el.checked);
}

window.deleteSelectedFinanceItems = async function() {
    const selected = document.querySelectorAll('.fin-row-cb:checked');
    if(selected.length === 0) return alert("לא נבחרו שורות למחיקה");
    if(!confirm(`האם למחוק ${selected.length} שורות מסומנות?`)) return;

    showLoader();
    try {
        for(let cb of selected) {
             await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: cb.value, idCol: 'TransID' });
        }
        await refreshData(true);
        showToast("השורות נמחקו בהצלחה");
    } catch(e) { alert("שגיאה במחיקה: " + e.message); } finally { hideLoader(); }
}

// NEW FUNCTION ADDED: Add new finance item from Client Tab
window.addNewFinanceItem = async function() {
    if(!activeClientId) return alert("שגיאה: לא נבחר לקוח");
    
    // V305: Disable button to prevent double-click
    const btn = document.getElementById('btnSaveNewFin');
    if(btn) btn.disabled = true;

    // FIX: Updated to match YOUR existing HTML IDs (based on image analysis)
    // 1. Try to find the amount field
    let amountEl = document.getElementById('inpFinAmount');
    if (!amountEl) amountEl = document.getElementById('inpNewFinAmount'); // Fallback
    
    // 2. Try to find date
    let dateEl = document.getElementById('inpFinDate');
    if (!dateEl) dateEl = document.getElementById('inpNewFinDate'); // Fallback
    
    // 3. Try to find description / Title
    let titleEl = document.getElementById('inpNewFinTitle');
    let descEl = document.getElementById('inpFinDesc');
    if (!descEl) descEl = document.getElementById('inpNewFinDesc'); // Fallback
    
    // 4. Try to find Reference / InvoiceNum
    let refEl = document.getElementById('inpFinRef');
    if (!refEl) refEl = document.getElementById('inpFinInvoice');
    if (!refEl) refEl = document.getElementById('inpNewFinRef');
    
    // 5. Try to find Type
    let typeEl = document.getElementById('inpFinType');
    if (!typeEl) typeEl = document.getElementById('inpFinCollectionType');
    
    // 6. Try to find DocType
    let docTypeEl = document.getElementById('inpFinDocType');
    
    // 7. Try to find Forecast
    let forecastEl = document.getElementById('inpFinForecast');
    
    // Get values
    const amount = amountEl ? amountEl.value : "";
    const date = dateEl ? dateEl.value : "";
    
    // V304: Merge Title + Desc
    const titleVal = titleEl ? titleEl.value : "";
    const descVal = descEl ? descEl.value : "";
    let finalDesc = titleVal;
    if(descVal) finalDesc += (finalDesc ? " - " : "") + descVal;

    const ref = refEl ? refEl.value : "";
    const type = typeEl ? typeEl.value : "חד פעמי";
    const docType = docTypeEl ? docTypeEl.value : "חשבונית מס";
    const forecast = forecastEl ? forecastEl.value : "";
    
    // Check if Linked Quote
    const linkQuoteEl = document.getElementById('inpFinLinkQuote');
    const linkedDocID = linkQuoteEl ? linkQuoteEl.value : "";

    // Validation
    if(!amount || parseFloat(amount) === 0) {
         if(btn) btn.disabled = false;
         return alert("אנא הזן סכום");
    }
    if(!date) {
         if(btn) btn.disabled = false;
         return alert("אנא הזן תאריך");
    }
    if(!finalDesc) {
         if(btn) btn.disabled = false;
         return alert("אנא הזן שם תנועה");
    }

    const client = data.clients.find(c => cleanID(c.ClientID) === activeClientId);
    const clientName = client ? client['Company Name'] : "לא ידוע";

    showLoader();
    try {
        const payload = {
            TransID: 'T' + Date.now(),
            ClientID: activeClientId,
            ClientName: clientName,
            DocType: docType,
            Description: finalDesc, // Merged
            Amount: parseFloat(amount),
            PaymentDate: date,
            ForecastDate: forecast || date, 
            InvoiceNum: ref,
            DocNum: ref,
            CollectionType: (type === 'חד פעמי' || type === 'OneTime') ? 'OneTime' : 'Recurring', 
            Status: 'ממתין לגביה', 
            PaymentMethod: 'העברה בנקאית',
            LinkedDoc: linkedDocID, // Save Link
            ItemsJSON: '[]'
        };

        await sendToGAS('addFinance', payload);
        
        // Reset Inputs
        if (amountEl) amountEl.value = "";
        if (titleEl) titleEl.value = "";
        if (descEl) descEl.value = "";
        if (refEl) refEl.value = "";
        
        await refreshData(true);
        showToast("תנועה חדשה נוספה בהצלחה!");
    } catch(e) {
        alert("שגיאה בשמירה: " + e.message);
    } finally {
        if(btn) btn.disabled = false;
        hideLoader();
    }
};

// FIX #3 (V271.0): Added extra safety checks for missing 'oldRow' or 'row' elements
// V299.0 UPDATE: Optimistic Update to prevent date reset
window.saveSingleFinanceRow = async function(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if(!row) {
        console.error(`Row with ID ${id} not found in DOM.`);
        return;
    }
    
    // Check if we are in Finance Table (detailed inputs) or Dashboard (some might be missing)
    const elDate = row.querySelector('.fin-input-date');
    const elAmount = row.querySelector('.fin-input-amount');
    const elDesc = row.querySelector('.fin-input-desc');
    const elInv = row.querySelector('.fin-input-inv');
    const elForecast = row.querySelector('.fin-input-forecast');
    const elColType = row.querySelector('.fin-input-coltype');
    const elMethod = row.querySelector('.fin-input-method');
    const elStatus = row.querySelector('.fin-input-status');

    showLoader();
    try {
        const oldRow = data.finance.find(f => f.TransID === id);
        
        if(!oldRow) {
             throw new Error(`Item ${id} not found in local data. Please refresh.`);
        }

        // If element exists, take value. If not (Dashboard), keep old value.
        // FIX #4: Optional chaining to prevent "reading 'value' of null"
        const newItem = {
            ...oldRow,
            PaymentDate: elDate?.value || oldRow.PaymentDate,
            Amount: elAmount?.value || oldRow.Amount,
            Description: elDesc?.value || oldRow.Description,
            InvoiceNum: elInv?.value || oldRow.InvoiceNum,
            DocNum: elInv?.value || oldRow.DocNum, 
            ForecastDate: elForecast?.value || oldRow.ForecastDate,
            CollectionType: elColType?.value || oldRow.CollectionType,
            PaymentMethod: elMethod?.value || oldRow.PaymentMethod,
            Status: elStatus?.value || oldRow.Status
        };

        // 1. Send update to server (delete old, add new to simulate update)
        await sendToGAS('deleteItem', { sheet: 'Finance_Log', idVal: id, idCol: 'TransID' });
        // Generate new ID for the new item to avoid conflicts? No, keep ID for now or it breaks row.
        // Actually, GAS usually appends. Better to keep ID if your backend supports update.
        // Assuming Delete+Add pattern:
        newItem.TransID = 'T' + Date.now(); 
        await sendToGAS('addFinance', newItem);
        
        // 2. OPTIMISTIC UPDATE: Update local data immediately so UI doesn't revert
        const index = data.finance.findIndex(f => f.TransID === id);
        if (index !== -1) {
            data.finance[index] = newItem; // Replace in local memory
        }
        
        // 3. Re-render ONLY the specific row or do nothing (let user see change)
        // We DO NOT call refreshData(true) here to avoid the race condition reset.
        showToast("שורה עודכנה ונשמרה!");
        
        // Optional: Background refresh after 3.5 seconds (V301 Fix: Increased Timeout)
        setTimeout(() => refreshData(true), 3500);

    } catch(e) { console.error(e); alert(e.message); } finally { hideLoader(); }
};

window.saveAllFinanceChanges = async function() {
    if(!confirm("האם לשמור את כל השינויים בטבלה?")) return;
    const rows = document.querySelectorAll('#financeTableBody tr');
    showLoader();
    try {
        for(let row of rows) {
             const id = row.getAttribute('data-id');
             const oldRow = data.finance.find(f => f.TransID === id);
             if(!oldRow) continue;

             const newValAmt = row.querySelector('.fin-input-amount').value;
             const newValStatus = row.querySelector('.fin-input-status').value;
             const newValDate = row.querySelector('.fin-input-date').value;
             const newValRef = row.querySelector('.fin-input-inv').value;
             const oldDate = parseDateISO(oldRow.PaymentDate);

             if(oldRow.Amount != newValAmt || oldRow.Status != newValStatus || oldDate != newValDate || oldRow.InvoiceNum != newValRef) { 
                  await saveSingleFinanceRow(id); 
             }
        }
        hideLoader();
        showToast("תהליך שמירה הסתיים");
    } catch(e) { hideLoader(); }
}

// --- 11. Dashboard Logic (V262.0 UPDATE) ---

function renderDashboard() {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    // 1. Iterations
    let activeIterCount = 0;
    data.clients.forEach(c => {
        let isClientActive = false;
        // Check Live Column
        let liveS = c.Iter1_Status_Live || "";
        if (liveS && !['סיום', 'הושלם', 'טרם התחיל'].includes(liveS)) {
             isClientActive = true;
        }
        // Check JSON
        if (!isClientActive && c.IterationsJSON) {
            try {
                const iterData = JSON.parse(c.IterationsJSON);
                const hasActiveStep = Object.values(iterData).some(step =>
                    step.status && !['סיום', 'הושלם', 'טרם התחיל'].includes(step.status)
                );
                if(hasActiveStep) isClientActive = true;
            } catch(e) {}
        }
        if (isClientActive) activeIterCount++;
    });

    // 2. Finance Basics
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

    // 3a. Open Invoices (Fix #4: Exclude Quotes, Exclude Approved)
    const openInvoicesItems = data.finance.filter(f => 
        ['ממתין לגביה', 'חשבונית יצאה', 'תשלום עתידי', 'אושרה'].includes(f.Status) && 
        !String(f.DocType).includes('הצעת') && !String(f.DocType).toLowerCase().includes('quote')
    );
    const openInvoicesSum = openInvoicesItems.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // 3b. Quote Balance (Approved Quotes - Linked Invoices)
    const approvedQuotes = data.finance.filter(f => 
        (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote')) && 
        (f.Status === 'אושרה' || f.Status === 'הצעת מחיר') 
    );
    let totalQuoteBalance = 0;
    approvedQuotes.forEach(q => {
        const qAmt = parseFloat(q.Amount || 0);
        const linked = getLinkedPaidSum(q.TransID); // Sum ONLY paid
        totalQuoteBalance += Math.max(0, qAmt - linked);
    });

    // 4. Collection Forecast (Fix #3 & #4)
    // Fix #3: Sum only rows where Forecast Date is in CURRENT YEAR
    const openDebts = data.finance.filter(f => ['ממתין לגביה', 'חשבונית יצאה', 'תשלום עתידי'].includes(f.Status));
    
    let collectionSum = 0; // Current Year Forecast
    let nextYearSum = 0;   // Next Year Forecast
    let collMonthTotal = 0; 

    openDebts.forEach(f => {
        const d = new Date(f.ForecastDate || f.PaymentDate); 
        const amt = parseFloat(f.Amount||0);
        
        // Fix #4: Sum Unlinked Invoices + Quote Balance to avoid double count.
        const isLinked = f.LinkedDoc && f.LinkedDoc.length > 5;
        
        if (!isLinked) {
            if (d.getFullYear() === curYear) collectionSum += amt;
            if (d.getFullYear() === curYear + 1) nextYearSum += amt;
        }

        if(d.getFullYear() === curYear && d.getMonth() === curMonth) {
             collMonthTotal += amt;
        }
    });
    
    // Add Quote Balance to Forecast
    // collectionSum += totalQuoteBalance; // REMOVED as per request (Total Collection should be Open Debts only)

    // Recurring Logic
    let recurringMonthly = 0;
    data.clients.forEach(c => {
        if (c.Status === 'לקוח שוטף' && parseFloat(c.RetainerAmount) > 0) {
            recurringMonthly += parseFloat(c.RetainerAmount);
        }
    });
    const monthsLeft = 12 - curMonth; 
    const forecastYear = paidYear + collectionSum + (recurringMonthly * monthsLeft);
    nextYearSum += (recurringMonthly * 12);

    // 5. PIPE
    const quotes = data.finance.filter(f => f.Status === 'הצעת מחיר');
    const pipeSum = quotes.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // 6. Expenses
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
    
    const setupItems = data.finance.filter(f => (f.DocType.includes('הקמה') || f.Description.includes('הקמה')) && f.Status === 'שולם');
    const setupYearSum = setupItems.reduce((acc, f) => acc + parseFloat(f.Amount||0), 0);

    // Update UI (KPIs)
    setText('kpi-iter-count', activeIterCount);
    setText('kpi-open-invoices', openInvoicesSum.toLocaleString() + ' ₪'); 
    setText('kpi-quote-balance', totalQuoteBalance.toLocaleString() + ' ₪'); 
    setText('kpi-coll-month', collMonthTotal.toLocaleString() + ' ₪');

    setText('kpi-paid-year', paidYear.toLocaleString() + ' ₪');
    setText('kpi-paid-month', paidMonth.toLocaleString() + ' ₪');
    setText('kpi-forecast-total', forecastYear.toLocaleString() + ' ₪');
    setText('kpi-collection-year', collectionSum.toLocaleString() + ' ₪');
    
    setText('kpi-pipe', pipeSum.toLocaleString() + ' ₪');
    setText('kpi-last-year', lastYearSum.toLocaleString() + ' ₪');
    setText('kpi-next-year', nextYearSum.toLocaleString() + ' ₪');
    setText('kpi-setup-year', setupYearSum.toLocaleString() + ' ₪');
    
    setText('kpi-rec-year', (recurringMonthly * monthsLeft).toLocaleString() + ' ₪');
    setText('kpi-exp-month', expMonth.toLocaleString() + ' ₪');
    setText('kpi-exp-year', expYear.toLocaleString() + ' ₪');
    setText('kpi-flow-month', (paidMonth - expMonth).toLocaleString() + ' ₪');
    setText('kpi-flow-year', (paidYear - expYear).toLocaleString() + ' ₪');

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

function renderDashboardTable() {
    const tbody = document.querySelector('#dashTable tbody');
    const thead = document.querySelector('#dashTable thead');
    if(!tbody || !thead) return;
    
    let isIterationMode = (currentDashFilter === 'iteration');
    let iterHeader = isIterationMode ? `<th class="col-status">סטטוס איטרציה</th>` : ``;

    thead.innerHTML = `<tr>
        <th class="col-cb"><input type="checkbox" id="dashSelectAll" onchange="toggleAllDash(this)"></th>
        <th class="col-date">תאריך</th>
        <th class="col-hp">ח.פ</th>
        <th class="col-client">לקוח</th>
        ${iterHeader}
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

    let isClientMode = false;

    if (currentDashFilter === 'open_invoices') {
        rows = data.finance.filter(f => 
             ['ממתין לגביה', 'חשבונית יצאה', 'תשלום עתידי', 'אושרה'].includes(f.Status) && 
             !String(f.DocType).includes('הצעת') && !String(f.DocType).toLowerCase().includes('quote')
        );
    }
    else if (currentDashFilter === 'quote_balance') {
        // Corrected Logic: Only show quotes where balance > 0
        rows = data.finance.filter(f => {
            const isQuote = (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote'));
            const isApproved = (f.Status === 'אושרה' || f.Status === 'הצעת מחיר');
            if (isQuote && isApproved) {
                 const balance = parseFloat(f.Amount) - getLinkedPaidSum(f.TransID);
                 return balance > 0;
            }
            return false;
        });
    }
    else if (currentDashFilter === 'iteration' || currentDashFilter === 'recurring' || currentDashFilter === 'next_year') {
        isClientMode = true;
        if(currentDashFilter === 'iteration') {
            // FIX: Less aggressive filtering - show anyone working
            rows = data.clients.filter(c => {
                let isClientActive = false;
                // Check Live Column
                let liveS = c.Iter1_Status_Live || "";
                if (liveS && !['סיום', 'הושלם', 'טרם התחיל'].includes(liveS)) {
                     isClientActive = true;
                }
                // Check JSON for ANY active iteration
                if (!isClientActive && c.IterationsJSON) {
                    try {
                        const iterData = JSON.parse(c.IterationsJSON);
                        const hasActiveStep = Object.values(iterData).some(step =>
                            // FIX: Logic changed to INCLUDE valid working statuses
                            step.status && !['סיום', 'הושלם', 'טרם התחיל'].includes(step.status)
                        );
                        if(hasActiveStep) isClientActive = true;
                    } catch(e) {}
                }
                return isClientActive;
            });
        } else {
            rows = data.clients.filter(c => c.Status === 'לקוח שוטף');
        }
    } 
    else {
         if (currentDashFilter === 'forecast_year') {
             rows = data.finance.filter(f => {
                const y = new Date(f.PaymentDate).getFullYear();
                const s = f.Status;
                return y === curYear && ['שולם', 'אושרה', 'חשבונית יצאה', 'ממתין לגביה', 'תשלום עתידי'].includes(s);
             });
        }
        else if (currentDashFilter === 'collection_year' || currentDashFilter === 'coll_month') {
             let isMonth = currentDashFilter.includes('month');
             rows = data.finance.filter(f => {
                // FIXED: Include approved quotes in collection even if date differs, as long as balance exists
                const d = new Date(f.ForecastDate || f.PaymentDate);
                const y = d.getFullYear();
                const m = d.getMonth();
                
                const isDebt = ['חשבונית יצאה', 'ממתין לגביה', 'תשלום עתידי'].includes(f.Status);
                const isApprovedQuote = (f.Status === 'אושרה') && (String(f.DocType).includes('הצעת') || String(f.DocType).includes('quote'));
                
                // If it's a quote, check if balance > 0
                if (isApprovedQuote) {
                    const balance = parseFloat(f.Amount) - getLinkedPaidSum(f.TransID); // FIX: Balance = Quote - Paid
                    if (balance > 0) return true; // Show regardless of date if debt exists
                }

                const matchDate = (y === curYear) && (!isMonth || m === curMonth);
                return matchDate && (isDebt || isApprovedQuote);
             });
        }
        else if (currentDashFilter.includes('paid_')) {
            let isMonth = currentDashFilter.includes('month');
            rows = data.finance.filter(f => f.Status === 'שולם' && new Date(f.PaymentDate).getFullYear() === curYear && (!isMonth || new Date(f.PaymentDate).getMonth() === curMonth));
        }
        else if (currentDashFilter === 'pipe') {
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
             let iterColHtml = "";
            if (isIterationMode) {
                // FIX: Look for LATEST active iteration, not just Iteration 1
                let statusText = r.Iter1_Status_Live || "???";
                try {
                    const parsed = JSON.parse(r.IterationsJSON || "{}");
                    // Iterate 1 to 5 to find the most relevant status
                    for(let i=1; i<=5; i++) {
                        let stepData = parsed[`iter_${i}`];
                        if(stepData && stepData.status && !['טרם התחיל', 'סיום', 'הושלם'].includes(stepData.status)) {
                            statusText = stepData.status;
                        }
                    }
                } catch(e) {}
                
                iterColHtml = `<td><span style="background:#ff9800; color:white; font-size:11px; padding:4px 10px; border-radius:12px; font-weight:bold; white-space:nowrap; display:inline-block; min-width:80px; text-align:center;">${statusText}</span></td>`;
            }

            let statusOptionsHtml = CLIENT_STATUSES.map(s => 
                `<option ${r.Status === s ? 'selected' : ''}>${s}</option>`
            ).join('');

            let descContent = (currentDashFilter === 'iteration') ? '-' : (r['Contact Person']||'-');

            html = `<tr data-id="${r.ClientID}">
                ${checkbox}
                <td>-</td>
                <td><input type="text" value="${r.HP||''}" onchange="quickUpdateClient('${r.ClientID}', 'HP', this.value)" style="width:80px;"></td>
                <td style="font-weight:bold; cursor:pointer;" onclick="openClientModal('${r.ClientID}')">${r['Company Name']}</td>
                ${iterColHtml}
                <td>${descContent}</td>
                <td>-</td>
                <td><input type="number" value="${r.RetainerAmount||0}" onchange="quickUpdateClient('${r.ClientID}', 'RetainerAmount', this.value)" style="width:70px;"></td>
                <td>
                    <select onchange="quickUpdateClient('${r.ClientID}', 'Status', this.value)">
                         ${statusOptionsHtml}
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
            let asmachta = r.DocNum || r.InvoiceNum || "";
            
            // --- FIX: Display Balance for Approved Quotes ---
            let displayAmount = parseFloat(r.Amount);
            let displayStyle = "";
            let amountTitle = "סכום מקורי";
            
            // Logic: If Approved Quote, calculate remaining balance (Quote - PAID invoices)
            if (r.Status === 'אושרה' && (String(r.DocType).includes('הצעת') || String(r.DocType).includes('quote'))) {
                const linkedSum = getLinkedPaidSum(r.TransID);
                const balance = Math.max(0, displayAmount - linkedSum);
                
                if (balance < displayAmount) {
                    displayAmount = balance; // Show balance
                    displayStyle = "color:#ff9800; font-weight:bold;";
                    amountTitle = `יתרה לתשלום: ${balance.toLocaleString()} (מתוך ${parseFloat(r.Amount).toLocaleString()})`;
                }
            }

            html = `<tr data-id="${r.TransID}">
                ${checkbox}
                <td><input type="date" class="fin-input-date" value="${parseDateISO(r.PaymentDate)}" onchange="quickUpdateFinance('${r.TransID}', 'PaymentDate', this.value)"></td>
                <td><input type="text" class="fin-input-inv" value="${asmachta}" onchange="quickUpdateFinance('${r.TransID}', 'InvoiceNum', this.value)" style="width:60px;"></td>
                <td style="cursor:pointer;" onclick="openClientModal('${r.ClientID}')">${r.ClientName}</td>
                <td><input type="text" class="fin-input-desc" value="${r.Description||''}" onchange="quickUpdateFinance('${r.TransID}', 'Description', this.value)"></td>
                <td><input type="number" class="fin-input-amount" value="${displayAmount}" title="${amountTitle}" style="width:80px; ${displayStyle}" onchange="quickUpdateFinance('${r.TransID}', 'Amount', this.value)"></td>
                <td>-</td>
                <td>${r.DocType}</td>
                <td>-</td>
                <td>
                    <select class="fin-input-status" onchange="quickUpdateFinance('${r.TransID}', 'Status', this.value)">
                        <option ${r.Status=='שולם'?'selected':''}>שולם</option>
                        <option ${r.Status=='ממתין לגביה'?'selected':''}>ממתין לגביה</option>
                        <option ${r.Status=='הצעת מחיר'?'selected':''}>הצעת מחיר</option>
                        <option ${r.Status=='אושרה'?'selected':''}>אושרה</option>
                        <option ${r.Status=='חשבונית יצאה'?'selected':''}>חשבונית יצאה</option>
                        <option ${r.Status=='בוטל'?'selected':''}>בוטל</option>
                    </select>
                </td>
                <td>
                    <button class="btn-icon" onclick="saveSingleFinanceRow('${r.TransID}')" title="שמור">💾</button>
                    <button class="btn-icon" onclick="openItemPopup('${r.TransID}')">👁️</button>
                    <button class="btn-icon" style="color:red;" onclick="deleteFinanceItem('${r.TransID}')">X</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML += html;
    });
}
