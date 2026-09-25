import "./style.css";
import { 
    supabase, getSession, signUpUser, signInUser, signOutUser, 
    getProducts, getMyStores, createStore 
} from "./supabase.js";

const app = document.querySelector("#app");
let cart = JSON.parse(localStorage.getItem("zomal_cart")) || [];
let session = null;

// المنتجات الافتراضية
const demo = [
    { name: "حذاء رياضي مريح", price: "129", cat: "الكترونيات", img: "ساعة لاسلكية" },
    { name: "متجر النخبة", price: "159", cat: "عطور", img: "عطر فاخر للرجال" }
];

// بناء واجهة المستخدم الرئيسية (HTML)
app.innerHTML = `
<header><div class="wrap nav"><a class="logo">💎 سوق AI</a><nav><a href="#home">الرئيسية</a><a href="#stores">المتاجر</a><button id="accountBtn">حسابي</button></nav></div></header>
<section class="hero" id="home"><div class="wrap heroGrid"><div><span>سوق ذكي يجمع المتاجر الذكية في مكان واحد</span><h1>قل لنا ماذا تريد... والـ AI يبحث لك</h1></div><button id="askAiBtn">اسأل لـ AI</button></div></section>
<section id="categories"><div class="wrap"><h2>تسوق حسب القسم</h2><div class="cats"></div></div></section>
<section id="products"><div class="wrap"><div class="head"><h2>المنتجات</h2><span id="status"></span></div><div class="grid" id="grid"></div></div></section>
<section id="merchants" class="merchant"><div class="wrap"><span class="badge">عندك متجر؟ أضف منتجاتك إلى سوق AI.</span><button id="merchantModalBtn">فتح لوحة التاجر</button></div></section>

<!-- نافذة الحساب وتسجيل الدخول -->
<div class="modal" id="authFile" style="display:none;">
    <div class="box">
        <button class="close" id="closeAuth">×</button>
        <h2 id="authTitle">تسجيل الدخول</h2>
        <form id="authForm">
            <input type="email" id="email" placeholder="البريد الإلكتروني" required />
            <input type="password" id="password" placeholder="كلمة المرور" required />
            <div id="registerFields" style="display:none;">
                <input type="text" id="fullName" placeholder="الاسم الكامل" />
                <select id="role">
                    <option value="client">عميل</option>
                    <option value="merchant">تاجر</option>
                </select>
            </div>
            <button type="submit" id="authSubmitBtn">دخول</button>
        </form>
        <p id="toggleAuth">ليس لديك حساب؟ سجل الآن</p>
    </div>
</div>

<!-- نافذة لوحة التاجر -->
<div class="modal" id="merchantModal" style="display:none;">
    <div class="box large">
        <button class="close" id="closeMerchant">×</button>
        <h2>🏪 لوحة التاجر</h2>
        <div id="merchantContent">
            <!-- سيتم شحن المحتوى ديناميكياً هنا بناءً على حالة الدخول -->
        </div>
    </div>
</div>
`;

// عناصر واجهة المستخدم
const authFile = document.getElementById("authFile");
const merchantModal = document.getElementById("merchantModal");
const authForm = document.getElementById("authForm");
const registerFields = document.getElementById("registerFields");
const authTitle = document.getElementById("authTitle");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleAuth = document.getElementById("toggleAuth");
const merchantContent = document.getElementById("merchantContent");

let authMode = "login";

// فتح وإغلاق النوافذ
document.getElementById("accountBtn").onclick = () => {
    authFile.style.display = "flex";
};
document.getElementById("closeAuth").onclick = () => {
    authFile.style.display = "none";
};
document.getElementById("closeMerchant").onclick = () => {
    merchantModal.style.display = "none";
};

// زر لوحة التاجر السفلي
document.getElementById("merchantModalBtn").onclick = () => {
    merchantModal.style.display = "flex";
    renderMerchantDashboard();
};

// التبديل بين الدخول والتسجيل
toggleAuth.onclick = () => {
    if (authMode === "login") {
        authMode = "register";
        authTitle.textContent = "حساب جديد";
        authSubmitBtn.textContent = "تسجيل";
        registerFields.style.display = "block";
        toggleAuth.textContent = "لديك حساب بالفعل؟ سجل دخولك";
    } else {
        authMode = "login";
        authTitle.textContent = "تسجيل الدخول";
        authSubmitBtn.textContent = "دخول";
        registerFields.style.display = "none";
        toggleAuth.textContent = "ليس لديك حساب؟ سجل الآن";
    }
};

// معالجة نموذج الدخول والتسجيل
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (authMode === "login") {
        const { data, error } = await signInUser(email, password);
        if (error) alert("خطأ في الدخول: " + error.message);
        else {
            alert("تم تسجيل الدخول بنجاح!");
            authFile.style.display = "none";
            location.reload();
        }
    } else {
        const fullName = document.getElementById("fullName").value;
        const role = document.getElementById("role").value;
        const { data, error } = await signUpUser(email, password, fullName, role);
        if (error) alert("خطأ في التسجيل: " + error.message);
        else {
            alert("تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيده.");
            authFile.style.display = "none";
        }
    }
};

// عرض لوحة التاجر والتحقق من الرتبة (Role)
function renderMerchantDashboard() {
    if (!session) {
        merchantContent.innerHTML = `<p style="text-align:center; color:red;">يرجى تسجيل الدخول أولاً للوصول إلى لوحة التاجر.</p>`;
        return;
    }
    
    const role = session.user?.user_metadata?.role;
    if (role !== "merchant") {
        merchantContent.innerHTML = `<p style="text-align:center; color:orange;">عذراً، هذه اللوحة مخصصة للتجار فقط وليس للعملاء.</p>`;
        return;
    }

    merchantContent.innerHTML = `
        <h3>مرحباً بك يا تاجر: ${session.user?.user_metadata?.full_name || 'الاسم غير متوفر'}</h3>
        <button id="logoutBtn" style="background:red; color:white;">تسجيل الخروج</button>
        <hr/>
        <form id="storeForm">
            <h4>إنشاء متجر جديد</h4>
            <input type="text" id="storeName" placeholder="اسم المتجر" required />
            <input type="text" id="storeDesc" placeholder="وصف المتجر" required />
            <button type="submit">تأكيد إنشاء المتجر</button>
        </form>
    `;

    document.getElementById("logoutBtn").onclick = async () => {
        await signOutUser();
        location.reload();
    };

    document.getElementById("storeForm").onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("storeName").value;
        const desc = document.getElementById("storeDesc").value;
        await createStore(session.user.id, name, desc, "");
        alert("تم إنشاء متجرك بنجاح!");
        merchantModal.style.display = "none";
    };
}

// تحميل المنتجات ومراقبة حالة الجلسة
async function init() {
    session = await getSession();
    if (session) {
        document.getElementById("accountBtn").textContent = "حسابي (نشط)";
    }
    
    // كود تحميل المنتجات والعرض في الـ Grid
    const grid = document.getElementById("grid");
    const products = await getProducts();
    const list = products.length ? products : demo;
    
    grid.innerHTML = list.map(p => `
        <article class="product">
            <div class="img">${p.img || '📦'}</div>
            <h3>${p.name}</h3>
            <span>${p.price} ر.س</span>
            <button>أضف للسلة</button>
        </article>
    `).join("");
}

init();
