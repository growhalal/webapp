// Firebase Configuration
console.log("Grow Halal App v7 Loaded");
const firebaseConfig = {
    apiKey: "AIzaSyDRzQD7ZBeiBuW0mHRtUeczt47kF0qSQCM",
    authDomain: "growhalall.firebaseapp.com",
    projectId: "growhalall",
    storageBucket: "growhalall.firebasestorage.app",
    messagingSenderId: "391722870660",
    appId: "1:391722870660:web:73411811889b8c896c1fd1",
    measurementId: "G-1CP0NWCBFH"
};

// Initialize Primary Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Secondary Firebase for Creating Users (Admin Auth)
// This allows us to create new users without logging out the current admin
const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = secondaryApp.auth();

const auth = firebase.auth();
const db = firebase.firestore();

// Global Data Caches
const userNamesMap = {};
let _globalSavingsSum = 0;
let _globalProfitSum = 0;
let _approvedDepositsCache = {};

// Utility for date formatting
const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = (date instanceof Date) ? date : (date.seconds ? new Date(date.seconds * 1000) : new Date(date));
    if (isNaN(d.getTime())) return 'N/A';
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatNumber = (num) => {
    const val = parseFloat(num) || 0;
    return 'Tk ' + val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// Fee Constants
const REQUIRED_ADMISSION_FEE = 10000;
const REQUIRED_MONTHLY_FEE = 1000;
const REQUIRED_EXTRA_FEE = 1500;

// --- LANGUAGE / I18N SYSTEM ---
let currentLang = localStorage.getItem('growHalalLang') || 'en';
let currentTheme = localStorage.getItem('growHalalTheme') || 'light';

window.toggleTheme = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('growHalalTheme', currentTheme);
    applyTheme();
};

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.classList.add('theme-transition');

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = currentTheme === 'light'
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
    }

    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 400);
}

// Apply theme immediately to prevent flash
applyTheme();

const translations = {
    'en': {
        // Sidebar
        'menu-dashboard': 'Dashboard',
        'menu-add-member': 'Add Member',
        'menu-approvals': 'Approvals',
        'menu-investments': 'Investments',
        'menu-announcements': 'Announcements',
        'menu-expenses': 'Expenses',
        'menu-directory': 'Member Directory',
        'menu-permissions': 'Permissions',
        'menu-reports': 'Reports Cabinet',
        'menu-support': 'Support',
        'menu-whatsapp': 'WhatsApp Group',
        'menu-signout': 'Sign Out',
        'menu-add-fund': 'Add Fund',
        // Stats
        'welcome-sub': 'Welcome to your financial hub.',
        'stat-system-savings': 'System Savings',
        'stat-personal-balance': 'Personal Balance',
        'stat-system-profit': 'System Profit',
        'stat-active-investment': 'Active Investment',
        // Sections
        'section-projects': 'Ongoing Projects',
        'section-directory': 'Member Directory',
        'section-approvals': 'Pending Approvals',
        // Login
        'login-welcome': 'Welcome',
        'login-sub': 'Secure and Shariah-compliant financial management.',
        'login-btn': 'Login',
        'login-forgot': 'Forgot Password?',
        'login-back': 'Ã¢â€ Â Back to Home',
        'login-admission': 'Admission Form',
        // Common
        'admission-fee': 'Admission Fee',
        'monthly-deposit': 'Monthly Deposit',
        'extra-deposit': 'Extra Deposit',
        'other': 'Other',
        'submit': 'Submit',
        'cancel': 'Cancel',
        'save': 'Save Changes',
        'view-report': 'View Report',
        // Modals - Deposit
        'modal-add-fund': 'Add Fund',
        'label-date': 'Date',
        'label-month': 'Month',
        'label-type': 'Deposit Type',
        'label-year': 'Year',
        'label-amount': 'Amount',
        'label-ref': 'Reference / Note',
        'label-receipt': 'Receipt (Optional)',
        'btn-submit-deposit': 'Submit Deposit',
        'placeholder-tk': 'Tk 0.00',
        'placeholder-ref': 'Transaction ID or Tag',
        // Modals - Add Member
        'modal-add-member': 'Add Member',
        'form-note': 'Marked fields must be filled out to open your account.',
        'title-personal': 'Personal Details',
        'title-nominee': 'Nominee Details',
        'title-login': 'Login Information',
        'label-name': 'Full Name',
        'label-phone': 'Phone Number',
        'label-address': 'Full Address',
        'label-photo': 'Member Photo',
        'label-nid': 'NID / Birth Certificate',
        'label-nominee-photo': 'Nominee Photo',
        'label-relation': 'Relationship',
        'label-email': 'Email Address',
        'label-pass': 'Login Password',
        'btn-create-account': 'Create Account',
        // Reports
        'report-expense-ledger': 'Expense Ledger',
        'report-financial-audit': 'Master Financials',
        'report-investments': 'Investment Portfolio',
        'report-member-audit': 'Deep Member Audit',
        'report-deposit-ledger': 'Deposit Ledger',
        'desc-expense': 'Full registry of all system expenditures and costs.',
        'desc-financial': 'Complete audit of total savings, balances, and profits.',
        'desc-investments': 'Detailed history of all active and completed projects.',
        'desc-member': 'Full member database including Nominees and Document links.',
        'desc-deposit': 'Track all member deposits and download transaction receipts.',
        // Profile & Others
        'modal-profile': 'Member Profile',
        'btn-download-pdf': 'Download PDF',
        'modal-edit-profile': 'Edit Profile',
        'modal-withdraw': 'Withdraw Project',
        'modal-project-details': 'Project Details',
        'label-withdraw-total': 'Total Returned (Capital + Profit)',
        'label-profit': 'Calculated Profit',
        'label-category': 'Category',
        'btn-confirm-withdraw': 'Confirm Withdrawal',
        'label-join-date': 'Join Date',
        'label-total-savings': 'Total Savings',
        'label-profit-share': 'Profit Share',
        'label-status': 'Status',
        'status-dues': 'Dues Pending',
        'status-regular': 'Regular',
        'label-outstanding-breakdown': 'Outstanding Fees Breakdown',
        'label-nominee-info': 'Nominee Information',
        'label-nid-doc': 'ID Document (NID)',
        'label-authorized-sig': 'Authorized Signature',
        'label-report-date': 'Report Date',
        'label-operator': 'Operator',
        'label-member-uid': 'Member UID',
        'label-official-report': 'Official Member Comprehensive Report',
        'label-system-report': 'OFFICIAL SYSTEM REPORT',
        'report-member-statement': 'Member Statement',
        'label-history': 'Deposit History',
        'label-none': 'None',
        'label-paid': 'Paid',
        'label-project-name': 'Project Name/Sector',
        'label-medium': 'Medium',
        'label-invested-amount': 'Invested Amount',
        'label-start-date': 'Start Date',
        'label-withdraw-date': 'Withdraw Date',
        'label-completed': 'Completed',
        'label-ongoing': 'Ongoing',
        'label-total-company-share': 'Total Accrued Company Share',
        'label-sl': 'S/L',
        'label-payout': 'Payout',
        'label-description': 'Description',
        'label-member-profit': 'Member Profit',
        'label-company-share': 'Company Share',
        'label-invested': 'Invested',
        'label-member': 'Member',
        'label-share-pct': 'Share (%)'
    },
    'bn': {
        // Sidebar
        'menu-dashboard': 'ড্যাশবোর্ড',
        'menu-add-member': 'সদস্য যোগ',
        'menu-approvals': 'অনুমোদন',
        'menu-investments': 'বিনিয়োগ',
        'menu-announcements': 'ঘোষণা',
        'menu-expenses': 'খরচ',
        'menu-directory': 'সদস্য তালিকা',
        'menu-permissions': 'পারমিশন',
        'menu-reports': 'রিপোর্ট ক্যাবিনেট',
        'menu-support': 'সাপোর্ট',
        'menu-whatsapp': 'হোয়াটসঅ্যাপ গ্রুপ',
        'menu-signout': 'লগ আউট',
        'menu-add-fund': 'এ্যাড ফান্ড',
        // Stats
        'welcome-sub': 'আপনার আর্থিক হাবে স্বাগতম।',
        'stat-system-savings': 'সিস্টেম সঞ্চয়',
        'stat-personal-balance': 'ব্যক্তিগত ব্যালেন্স',
        'stat-system-profit': 'সিস্টেম প্রফিট',
        'stat-active-investment': 'চলমান বিনিয়োগ',
        // Sections
        'section-projects': 'চলমান প্রজেক্টসমূহ',
        'section-directory': 'সদস্য তালিকা',
        'section-approvals': 'অপেক্ষমান অনুমোদন',
        // Login
        'login-welcome': 'স্বাগতম',
        'login-sub': 'নিরাপদ এবং শরীয়াহ ভিত্তিক আর্থিক ব্যবস্থাপনা।',
        'login-btn': 'লগইন',
        'login-forgot': 'পাসওয়ার্ড ভুলে গেছেন?',
        'login-back': '← হোমে ফিরে যান',
        'login-admission': 'অ্যাডমিশন ফরম',
        // Common
        'admission-fee': 'ভর্তি ফি',
        'monthly-deposit': 'মাসিক জমা',
        'extra-deposit': 'অতিরিক্ত জমা',
        'other': 'অন্যান্য',
        'submit': 'জমা দিন',
        'cancel': 'বাতিল',
        'save': 'পরিবর্তন সংরক্ষণ করুন',
        'view-report': 'রিপোর্ট দেখুন',
        // Modals - Deposit
        'modal-add-fund': 'তহবিল যোগ করুন',
        'label-date': 'তারিখ',
        'label-month': 'মাস',
        'label-type': 'জমার ধরন',
        'label-year': 'বছর',
        'label-amount': 'পরিমাণ',
        'label-ref': 'রেফারেন্স / নোট',
        'label-receipt': 'রসিদ (ঐচ্ছিক)',
        'btn-submit-deposit': 'ডিপোজিট জমা দিন',
        'placeholder-tk': '৳ ০.০০',
        'placeholder-ref': 'ট্রানজেকশন আইডি বা ট্যাগ',
        // Modals - Add Member
        'modal-add-member': 'সদস্য যোগ করুন',
        'form-note': 'চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে।',
        'title-personal': 'ব্যক্তিগত বিবরণ',
        'title-nominee': 'নমিনী বিবরণ',
        'title-login': 'লগইন তথ্য',
        'label-name': 'পুরো নাম',
        'label-phone': 'ফোন নম্বর',
        'label-address': 'ঠিকানা',
        'label-photo': 'সদস্যের ছবি',
        'label-nid': 'এনআইডি / জন্ম সনদ',
        'label-nominee-photo': 'নমিনীর ছবি',
        'label-relation': 'সম্পর্ক',
        'label-email': 'ইমেইল ঠিকানা',
        'label-pass': 'লগইন পাসওয়ার্ড',
        'btn-create-account': 'অ্যাকাউন্ট তৈরি করুন',
        // Reports
        'report-expense-ledger': 'ব্যয় লেজার',
        'report-financial-audit': 'মাস্টার ফিন্যান্সিয়াল',
        'report-investments': 'বিনিয়োগ পোর্টফোলিও',
        'report-member-audit': 'সদস্য অডিট',
        'report-deposit-ledger': 'ডিপোজিট লেজার',
        'desc-expense': 'সিস্টেমের সমস্ত ব্যয় এবং খরচের সম্পূর্ণ রেজিস্ট্রি।',
        'desc-financial': 'মোট সঞ্চয়, ব্যালেন্স এবং লাভের সম্পূর্ণ অডিট।',
        'desc-investments': 'সমস্ত চলমান এবং সম্পন্ন প্রকল্পের বিস্তারিত ইতিহাস।',
        'desc-member': 'নমিনী এবং ডকুমেন্ট লিঙ্ক সহ সম্পূর্ণ সদস্য ডাটাবেস।',
        'desc-deposit': 'সদস্যদের সমস্ত জমার তথ্য এবং ট্রানজেকশন রসিদ ডাউনলোড করুন।',
        // Profile & Others
        'modal-profile': 'সদস্য প্রোফাইল',
        'btn-download-pdf': 'পিডিএফ ডাউনলোড',
        'modal-edit-profile': 'প্রোফাইল সম্পাদনা',
        'modal-withdraw': 'প্রজেক্ট উত্তোলন',
        'modal-project-details': 'প্রজেক্ট বিবরণ',
        'label-withdraw-total': 'মোট ফেরত (মূলধন + লাভ)',
        'label-profit': 'হিসাবকৃত লাভ',
        'label-category': 'ধরন/বিভাগ',
        'btn-confirm-withdraw': 'উত্তোলন নিশ্চিত করুন',
        'label-join-date': 'যোগদানের তারিখ',
        'label-total-savings': 'মোট সঞ্চয়',
        'label-profit-share': 'লভ্যাংশ',
        'label-status': 'অবস্থা',
        'status-dues': 'বকেয়া আছে',
        'status-regular': 'নিয়মিত'
    }
};

window.toggleLanguage = () => {
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    localStorage.setItem('growHalalLang', currentLang);
    applyTranslations();
};

function applyTranslations() {
    const sets = translations[currentLang];

    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (sets[key]) {
            const icon = el.querySelector('i');
            if (icon) {
                const iconHtml = icon.outerHTML;
                el.innerHTML = `${iconHtml} ${sets[key]}`;
            } else {
                el.innerText = sets[key];
            }
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (sets[key]) {
            el.placeholder = sets[key];
        }
    });
    window.waitForAssets = async (container) => {
        // 1. Wait for Fonts
        if (document.fonts) {
            await document.fonts.ready;
            // Even after ready, give it a moment for layout engine to stabilize
            await new Promise(r => setTimeout(r, 800));
        }

        // 2. Wait for Images
        const imgs = Array.from(container.querySelectorAll('img'));
        const imgPromises = imgs.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if one fails
            });
        });

        await Promise.all(imgPromises);

        // 3. Final Render Stabilizer
        // This helps complex Bengali glyphs and absolute layouts settle
        await new Promise(r => setTimeout(r, 700));
    };
    // Specialized translations for dynamic elements if necessary
    const emailInput = document.getElementById('email'); // login.html
    const passInput = document.getElementById('password'); // login.html
    if (emailInput) emailInput.placeholder = currentLang === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা';
    if (passInput) passInput.placeholder = currentLang === 'en' ? 'Password' : 'পাসওয়ার্ড';

    // Update Lang Toggle Text with Icon
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${currentLang === 'en' ? 'BN' : 'EN'}`;
    }
}

// Initial application
document.addEventListener('DOMContentLoaded', applyTranslations);

// UI Elements & State
let currentUser = null;
let userRole = 'member';

const loginForm = document.getElementById('loginForm');
const depositForm = document.getElementById('depositForm');
const depositModal = document.getElementById('depositModal');
const addMemberForm = document.getElementById('addMemberForm');
const addMemberModal = document.getElementById('addMemberModal');

const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const menuBtn = document.getElementById('menuBtn');

// --- IMAGE COMPRESSION HELPER ---
async function compressAndConvertToBase64(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if exceeds bounds
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Return as compressed Base64
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// --- FILE DOWNLOAD HELPER ---
window.downloadBase64File = (base64Data, filename) => {
    try {
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Download failed:", e);
        alert("Download failed. Please try again.");
    }
};

// --- NAVIGATION & MENU ---

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        drawerOverlay.style.display = 'block';
    });
}

window.closeMenu = () => {
    if (drawer) drawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.style.display = 'none';
};

// Unified Password Visibility Toggle Logic
document.addEventListener('click', (e) => {
    // Target common IDs or classes for password toggles
    const toggleId = e.target.id;
    if (toggleId === 'toggleAddMemberPass' || toggleId === 'togglePassword') {
        const inputId = toggleId === 'toggleAddMemberPass' ? 'memPass' : 'password';
        const passInput = document.getElementById(inputId);
        if (!passInput) return;

        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);

        // Toggle icon classes (supporting both solid and regular icons)
        e.target.classList.toggle('fa-eye');
        e.target.classList.toggle('fa-eye-slash');
        if (e.target.classList.contains('fa-regular')) {
            e.target.classList.toggle('fa-regular');
            e.target.classList.toggle('fa-solid');
        }
    }
});

window.toggleSupport = () => {
    const submenu = document.getElementById('supportSubmenu');
    const chevron = document.getElementById('supportChevron');
    if (submenu && chevron) {
        const isHidden = submenu.style.display === 'none';
        submenu.style.display = isHidden ? 'block' : 'none';
        chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
};

window.showSection = (sectionId) => {
    const sections = ['mainDashboard', 'approvalSection', 'ownerSection', 'manageInvestSection', 'annoPostSection', 'roleSection', 'expenseSection', 'reportSection', 'companyAccountSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === sectionId ? 'block' : 'none';
    });
    closeMenu();
};

window.hideSection = (sectionId) => {
    document.getElementById(sectionId).style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
};

// --- AUTH & REDIRECTION ---

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('loginError');

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        loginError.style.display = 'none';

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                checkUserRole(user.uid, user.email);
            })
            .catch((error) => {
                btn.disabled = false;
                btn.innerText = 'Login';
                loginError.style.display = 'block';
                loginError.innerText = "Login Failed: " + error.message;
            });
    });
}

async function checkUserRole(uid, email) {
    try {
        if (email === 'growhalal0@gmail.com') {
            userRole = 'owner';
            const repairBtn = document.getElementById('repairDuesBtn');
            if (repairBtn) {
                repairBtn.style.setProperty('display', 'inline-block', 'important');
            }

            await db.collection('users').doc(uid).set({ email, role: 'owner' }, { merge: true });
            return;
        }

        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            userRole = doc.data().role || 'member';
        }
    } catch (error) {
        console.error("User Role Check Failed:", error);
    } finally {
        // ALWAYS navigate away from login screen on successful authentication 
        // regardless of subsequent database query success/timeout/failure.
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// --- DASHBOARD & RBAC SYSTEM ---

// 1. RBAC UI Helper: Controls visibility based on role and explicit permissions
const handleRoleUI = (userData) => {
    const role = userData.role || 'member';
    const isOwner = (userData.email && userData.email.toLowerCase() === 'growhalal0@gmail.com') || role === 'owner';

    // Always Visible to Everyone
    ['menuInvestments', 'menuExpenses', 'menuUsers'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
    });

    // Restricted Items (Owner-Controlled)
    const restricted = {
        'menuAddMember': 'menuAddMember',
        'menuApprovals': 'menuApprovals',
        'menuAnnouncements': 'menuAnnouncements',
        'menuRoles': 'menuRoles',
        'menuReports': 'menuReports',
        'menuCompanyAccount': 'menuCompanyAccount'
    };

    Object.keys(restricted).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const hasPerm = userData.permissions && userData.permissions.includes(id);
            el.style.display = (isOwner || hasPerm) ? 'flex' : 'none';
        }
    });

    // Specialized individual sections
    const adminInv = document.getElementById('adminInvestmentControls');
    if (adminInv) adminInv.style.display = (isOwner || (userData.permissions && userData.permissions.includes('menuInvestments'))) ? 'block' : 'none';

    const addExp = document.getElementById('addExpenseBtn');
    if (addExp) addExp.style.display = (isOwner || (userData.permissions && userData.permissions.includes('menuExpenses'))) ? 'block' : 'none';

    const archiveCard = document.getElementById('reportArchiveCard');
    if (archiveCard) archiveCard.style.display = isOwner ? 'block' : 'none';

    const ownerSect = document.getElementById('ownerSection');
    if (ownerSect) ownerSect.style.display = isOwner ? 'block' : 'none';

    const repairBtn = document.getElementById('repairDuesBtn');
    if (repairBtn) repairBtn.style.display = isOwner ? 'inline-block' : 'none';

    const dueReportBtn = document.getElementById('dueReportBtn');
    if (dueReportBtn) {
        dueReportBtn.style.display = (isOwner || role === 'admin' || role === 'manager') ? 'inline-block' : 'none';
    }
};

// 2. System Stats Helpers
const fetchSystemStats = async () => {
    try {
        const doc = await db.collection('system').doc('stats').get();
        return doc.exists ? doc.data() : { totalSavings: 0, totalProfit: 0, totalInvestments: 0 };
    } catch (e) {
        console.error("Stats Fetch Error:", e);
        return { totalSavings: 0, totalProfit: 0, totalInvestments: 0 };
    }
};

// 3. Dashboard Initialization (The reactive entry point)
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        setupDashboard(user);
    } else {
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

function setupDashboard(user) {
    // A. Reactive User Profile Listener
    db.collection('users').doc(user.uid).onSnapshot((doc) => {
        if (!doc.exists) {
            if (user.email && user.email.toLowerCase() === 'growhalal0@gmail.com') {
                db.collection('users').doc(user.uid).set({ email: user.email, role: 'owner' }, { merge: true });
            }
            return;
        }

        const data = doc.data();
        userRole = data.role || 'member';
        if (user.email && user.email.toLowerCase() === 'growhalal0@gmail.com') {
            userRole = 'owner';
            // Set Owner's Join Date to 1/12/2025 if missing or incorrect
            const expectedDate = new Date('2025-12-01T00:00:00');
            if (!data.createdAt || !data.createdAt.toDate || data.createdAt.toDate().getTime() !== expectedDate.getTime()) {
                db.collection('users').doc(user.uid).update({
                    createdAt: firebase.firestore.Timestamp.fromDate(expectedDate),
                    excludedProfit: 0
                });
            }
        }

        // Update Personal Stats
        const welcomeEl = document.getElementById('welcomeUser');
        if (welcomeEl) {
            const firstName = (data.name || '').split(' ')[0] || (userRole === 'owner' ? 'Owner' : 'Member');
            welcomeEl.innerText = `Hi, ${firstName}`;
        }

        const balEl = document.getElementById('totalBalance');
        if (balEl) balEl.innerText = formatNumber(data.savings || 0);

        // Run RBAC UI Adjustments
        handleRoleUI(data);

        // Load Company Account if authorized
        if (userRole === 'owner' || (data.permissions && data.permissions.includes('menuCompanyAccount'))) {
            window.loadCompanyAccount();
        }
    }, (error) => console.error("Profile Listener Error:", error));

    // B. Reactive Global Savings Listener
    db.collection('users').onSnapshot((snapshot) => {
        let globalSavings = 0;
        snapshot.forEach(uDoc => globalSavings += (uDoc.data().savings || 0));
        _globalSavingsSum = globalSavings; // Shared for PDF report calculations
        const el = document.getElementById('totalSavings');
        if (el) el.innerText = formatNumber(globalSavings);
    });

    // C. Reactive System Profit Listener
    db.collection('system').doc('stats').onSnapshot((doc) => {
        const el = document.getElementById('totalProfit');
        if (el) {
            const total = doc.exists ? (doc.data().totalProfit || 0) : 0;
            _globalProfitSum = total; // Shared for PDF report calculations
            el.innerText = formatNumber(total);

            // Accrued Company Share Indicator (Owner/Admin only)
            if (userRole === 'owner' || userRole === 'admin') {
                updateCompanyAccruedIndicator(total);
            }
        }
    });

    // D. Reactive Active Investments Listener
    db.collection('investments').where('status', '==', 'active').onSnapshot((snapshot) => {
        let totalActive = 0;
        snapshot.forEach(iDoc => totalActive += (iDoc.data().amount || 0));
        const el = document.getElementById('totalInvestments');
        if (el) el.innerText = formatNumber(totalActive);
    });

    // E. Initial Data Load For Lists
    window.loadOngoingProjects();
    loadAllUsers();
    loadExpenses();
    window.checkAnnouncements();
}

// 4. Helper for Company Accrued Calculation
async function updateCompanyAccruedIndicator(totalSystemProfit) {
    try {
        const usersSnap = await db.collection('users').get();
        let totalSavings = 0;
        usersSnap.forEach(u => totalSavings += (u.data().savings || 0));

        // Fetch all finished investments to calculate join-date exclusions
        const finishedInvs = [];
        const invSnap = await db.collection('investments').where('status', 'in', ['completed', 'withdrawn']).get();
        invSnap.forEach(doc => finishedInvs.push(doc.data()));

        let totalAccruedCompany = 0;
        usersSnap.forEach(u => {
            const d = u.data();
            const uSavings = d.savings || 0;
            const profitPct = d.profitPercentage || 100;
            const uJoinDate = d.createdAt ? d.createdAt.toDate() : new Date();
            uJoinDate.setHours(0, 0, 0, 0);

            // Calculate dynamic excluded profit: profits of investments started before joining
            let excludedProfit = 0;
            finishedInvs.forEach(inv => {
                const sDate = inv.date ? new Date(inv.date) : new Date();
                sDate.setHours(0, 0, 0, 0);
                if (sDate < uJoinDate) {
                    excludedProfit += (inv.profitAmount || 0);
                }
            });

            if (totalSavings > 0) {
                const effectiveProfit = Math.max(0, totalSystemProfit - excludedProfit);
                const totalSlice = (uSavings / totalSavings) * effectiveProfit;
                totalAccruedCompany += totalSlice * (1 - (profitPct / 100));
            }
        });

        let indicator = document.getElementById('companyAccruedDisplay');
        if (!indicator) {
            const profitCard = document.querySelector('.stat-card i.fa-chart-line')?.closest('.stat-card');
            if (profitCard) {
                indicator = document.createElement('div');
                indicator.id = 'companyAccruedDisplay';
                indicator.style.fontSize = '0.7rem';
                indicator.style.color = 'var(--text-muted)';
                indicator.style.marginTop = '5px';
                profitCard.appendChild(indicator);
            }
        }
        if (indicator) {
            indicator.innerText = `Accrued Co. Share: ${formatNumber(totalAccruedCompany.toFixed(2))}`;
        }
    } catch (e) {
        console.error("Accrued Stats Error:", e);
    }
}

// 5. Missing Dashboard Helpers

window.loadOngoingProjects = () => {
    if (window.loadManageInvestments) window.loadManageInvestments();
};

window.checkAnnouncements = async () => {
    try {
        const snap = await db.collection('announcements').orderBy('timestamp', 'desc').limit(1).get();
        if (!snap.empty) {
            const doc = snap.docs[0].data();
            const latest = doc.timestamp ? doc.timestamp.toMillis() : 0;
            const hasSeen = localStorage.getItem('lastSeenAnno');
            const dot = document.getElementById('annoDot');
            if (dot) {
                dot.style.display = (!hasSeen || (hasSeen && parseInt(hasSeen) < latest)) ? 'block' : 'none';
            }
        }
    } catch (e) { console.error("Announcement Check Error:", e); }
};

window.loadCompanyAccount = async () => {
    const balanceEl = document.getElementById('companyTotalBalance');
    const ledgerEl = document.getElementById('companyLedgerList');
    if (!balanceEl || !ledgerEl) return;

    try {
        const snap = await db.collection('companyAccount').orderBy('timestamp', 'desc').get();
        let total = 0;
        let html = '';

        if (snap.empty) {
            html = `<p style="text-align:center; padding:20px; color:var(--text-muted);">No transactions found.</p>`;
        } else {
            snap.forEach(doc => {
                const d = doc.data();
                total += (d.amount || 0);
                const date = d.date || (d.timestamp ? formatDate(d.timestamp) : 'N/A');

                html += `
                    <div class="glass-card" style="padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px; border: 1px solid var(--border-color);">
                        <div style="flex: 1;">
                            <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-color);">${d.type || 'Transaction'}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${d.description || ''}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${date} Ã¢â‚¬Â¢ Source: ${d.sourceUser || 'System'}</div>
                        </div>
                        <div style="font-weight: 800; color: var(--primary-color); font-size: 1rem;">${formatNumber(d.amount || 0)}</div>
                    </div>
                `;
            });
        }

        balanceEl.innerText = formatNumber(total);
        ledgerEl.innerHTML = html;
    } catch (e) {
        console.error("Company Account Load Error:", e);
        ledgerEl.innerHTML = `<p style="color:red; text-align:center; padding:20px;">Error loading ledger.</p>`;
    }
};

window.openDueReport = async () => {
    const modal = document.getElementById('dueReportModal');
    const content = document.getElementById('dueReportContent');
    if (!modal || !content) return;

    modal.style.display = 'flex';
    content.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'bn' ? 'Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ÂÃ Â¦â€ºÃ Â§â€¡...' : 'Loading...'}</div>`;

    try {
        const usersSnap = await db.collection('users').get();
        const docs = usersSnap.docs.map(u => u.data());

        let html = `<table class="report-table">
            <thead>
                <tr>
                    <th>${currentLang === 'bn' ? 'Ã Â¦Â¸Ã Â¦Â¦Ã Â¦Â¸Ã Â§ÂÃ Â¦Â¯Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®' : 'Member Name'}</th>
                    <th>${currentLang === 'bn' ? 'Ã Â¦Â§Ã Â¦Â°Ã Â¦Â£' : 'Type'}</th>
                    <th>${currentLang === 'bn' ? 'Ã Â¦Â¬Ã Â¦â€¢Ã Â§â€¡Ã Â§Å¸Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â¦Â£' : 'Dues Description'}</th>
                </tr>
            </thead>
            <tbody>`;

        let hasDues = false;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonthIdx = now.getMonth();

        // Sort users by name
        docs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        docs.forEach(u => {
            if (u.email === 'growhalal0@gmail.com') return;

            const dues = u.dues || { admissionPaid: 0, monthlyPaidCount: 0, extraTermsPaid: [] };
            const joinDate = u.createdAt ? new Date(u.createdAt.seconds * 1000) : null;

            // 1. Admission Check
            const adminPaidVal = dues.admissionPaid || 0;
            if (adminPaidVal < REQUIRED_ADMISSION_FEE) {
                hasDues = true;
                html += `<tr>
                    <td><strong>${u.name || 'N/A'}</strong></td>
                    <td><span class="due-indicator due-admission"></span> Admission</td>
                    <td>Tk ${formatNumber(REQUIRED_ADMISSION_FEE - adminPaidVal)} Due</td>
                </tr>`;
            }

            // 2. Monthly Check
            if (joinDate) {
                const joinMonthIdx = joinDate.getMonth();
                const joinYear = joinDate.getFullYear();
                const totalMonthsSinceJoin = (currentYear - joinYear) * 12 + (currentMonthIdx - joinMonthIdx) + 1;
                const monthlyPaid = dues.monthlyPaidCount || 0;

                if (monthlyPaid < totalMonthsSinceJoin) {
                    hasDues = true;
                    let missingMonths = [];
                    for (let i = monthlyPaid; i < totalMonthsSinceJoin; i++) {
                        const mDate = new Date(joinYear, joinMonthIdx + i, 1);
                        if (mDate > now) break;
                        missingMonths.push(mDate.toLocaleString(currentLang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', year: 'numeric' }));
                    }

                    if (missingMonths.length > 0) {
                        html += `<tr>
                            <td><strong>${u.name || 'N/A'}</strong></td>
                            <td><span class="due-indicator due-monthly"></span> Monthly</td>
                            <td style="font-size: 0.8rem; color: var(--error);">${missingMonths.slice(0, 10).join(', ')}${missingMonths.length > 10 ? '...' : ''}</td>
                        </tr>`;
                    }
                }
            }

            // 3. Extra Check
            const currentTerm = currentMonthIdx < 6 ? `January-June ${currentYear}` : `July-December ${currentYear}`;
            if (!dues.extraTermsPaid || !dues.extraTermsPaid.includes(currentTerm)) {
                hasDues = true;
                html += `<tr>
                    <td><strong>${u.name || 'N/A'}</strong></td>
                    <td><span class="due-indicator due-extra"></span> Extra</td>
                    <td>${currentTerm}</td>
                </tr>`;
            }
        });

        if (!hasDues) {
            html += `<tr><td colspan="3" style="text-align:center; padding:20px;">No unpaid dues found! Ã°Å¸Å½â€°</td></tr>`;
        }

        html += '</tbody></table>';
        content.innerHTML = html;

    } catch (e) {
        console.error("Due Report Error:", e);
        content.innerHTML = `<p style="color:var(--error); text-align:center; padding:20px;">Error: ${e.message}</p>`;
    }
};

window.closeDueReport = () => {
    document.getElementById('dueReportModal').style.display = 'none';
};

// --- ADD MEMBER LOGIC ---

window.openAddMemberModal = () => { addMemberModal.style.display = 'flex'; closeMenu(); };
window.closeAddMemberModal = () => addMemberModal.style.display = 'none';

if (addMemberForm) {
    addMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = 'Creating Account...';

        const email = document.getElementById('memEmail').value;
        const password = document.getElementById('memPass').value;

        try {
            // 1. Create User in Secondary Auth
            const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
            const newUser = userCredential.user;

            // 2. Save detailed profile
            const joinDateStr = document.getElementById('memJoinDate').value;
            const joinDate = joinDateStr ? new Date(joinDateStr) : new Date();

            const memberData = {
                uid: newUser.uid,
                email: email,
                name: document.getElementById('memName').value,
                phone: document.getElementById('memPhone').value,
                address: document.getElementById('memAddress').value || 'N/A',
                role: 'member',
                balance: 0,
                savings: 0,
                profit: 0,
                profitPercentage: parseFloat(document.getElementById('memProfitPct').value) || 100,
                investmentsCount: 0,
                dues: {
                    admissionPaid: 0,
                    monthlyPaidCount: 0,
                    extraTermsPaid: []
                },
                nominee: {
                    name: document.getElementById('nomName').value || 'N/A',
                    relation: document.getElementById('nomRelation').value || 'N/A',
                    phone: document.getElementById('nomPhone').value || 'N/A',
                    address: document.getElementById('nomAddress').value || 'N/A'
                },
                createdAt: firebase.firestore.Timestamp.fromDate(joinDate),
                excludedProfit: 0 // Optional legacy field, now dynamic
            };

            await db.collection('users').doc(newUser.uid).set(memberData);

            // Handle File Uploads (Internal Storage)
            const fileInputs = [
                { id: 'memPhoto', field: 'memberPhoto', label: 'Member Photo' },
                { id: 'memNID', field: 'nidURL', label: 'NID' },
                { id: 'nomPhoto', field: 'nomineePhoto', label: 'Nominee Photo' }
            ];

            const photoData = {};
            const lastUpdates = [];
            for (const input of fileInputs) {
                const fileInput = document.getElementById(input.id);
                if (!fileInput || !fileInput.files[0]) continue;

                const file = fileInput.files[0];
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing ${input.label}...`;
                try {
                    const base64String = await compressAndConvertToBase64(file);
                    photoData[input.field] = base64String;
                    lastUpdates.push(input.label);
                } catch (err) {
                    console.error(`Processing error for ${input.label}:`, err);
                }
            }

            if (lastUpdates.length > 0) {
                photoData.lastUpdates = lastUpdates;
                await db.collection('users').doc(newUser.uid).update(photoData);
            }

            alert("Member account created successfully!");
            closeAddMemberModal();
            addMemberForm.reset();

            // Sign out from secondary app to cleanup
            await secondaryAuth.signOut();
        } catch (error) {
            alert("Registration failed: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-user-plus"></i> ${(translations[currentLang] || translations['en'])['btn-create-account'] || 'Create Account'}`;
        }
    });
}

// --- DEPOSIT SYSTEM ---

window.calculateDepositTotal = () => {
    let total = 0;

    // 1. Admission Fee
    const admSection = document.getElementById('admFeeSection');
    if (admSection && admSection.style.display !== 'none') {
        total += parseFloat(document.getElementById('admAmount').value) || 0;
    }

    // 2. Monthly Deposits
    const monthlyRate = parseFloat(document.getElementById('monthlyRate').value) || 0;
    const selectedMonths = document.querySelectorAll('.month-check:checked');
    total += (selectedMonths.length * monthlyRate);

    // 3. Extra Deposits
    const extraRate = parseFloat(document.getElementById('extraRate').value) || 0;
    const selectedExtras = document.querySelectorAll('.extra-check:checked');
    total += (selectedExtras.length * extraRate);

    // 4. Other
    total += parseFloat(document.getElementById('otherAmount').value) || 0;

    document.getElementById('depTotalDisplay').innerText = `Tk ${total.toLocaleString('en-IN')}.00`;
    document.getElementById('depAmount').value = total;
};

// Custom Dropdown UI Logic
window.toggleCustomDropdown = (id) => {
    // Close others
    document.querySelectorAll('.custom-dropdown-list').forEach(list => {
        if (list.id !== id) list.classList.remove('active');
    });
    const list = document.getElementById(id);
    if (list) list.classList.toggle('active');
};

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown-container')) {
        document.querySelectorAll('.custom-dropdown-list').forEach(list => {
            list.classList.remove('active');
        });
    }
});

window.updateMonthSelection = () => {
    const selected = document.querySelectorAll('.month-check:checked');
    const label = document.getElementById('monthDropdownLabel');
    if (selected.length === 0) {
        label.innerText = 'Select Months...';
    } else if (selected.length === 1) {
        label.innerText = selected[0].value;
    } else {
        label.innerText = `${selected.length} Months Selected`;
    }
    window.calculateDepositTotal();
};

window.updateExtraSelection = () => {
    const selected = document.querySelectorAll('.extra-check:checked');
    const label = document.getElementById('extraDropdownLabel');
    if (selected.length === 0) {
        label.innerText = 'Select Term...';
    } else if (selected.length === 1) {
        label.innerText = selected[0].value;
    } else {
        label.innerText = `${selected.length} Terms Selected`;
    }
    window.calculateDepositTotal();
};

// Toggle all left here just in case legacy UI is cached
window.toggleAllMonths = () => {
    const checks = document.querySelectorAll('.month-check:not(:disabled)');
    if (checks.length === 0) return;
    const allChecked = Array.from(checks).every(c => c.checked);
    checks.forEach(c => c.checked = !allChecked);
    window.updateMonthSelection();
};

let _currentUserDeposits = [];
let _currentUserJoinDate = null;

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.renderDepositOptions = () => {
    const monthList = document.getElementById('monthDropdownList');
    const extraList = document.getElementById('extraDropdownList');
    if (!monthList || !extraList) return;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Population helper
    const addYearHeader = (container, year) => {
        const header = document.createElement('div');
        header.style.cssText = "padding: 10px; font-size: 0.7rem; color: var(--primary-color); font-weight: 800; background: var(--bg-light); border-bottom: 1px solid var(--border-color); border-top: 1px solid var(--border-color);";
        header.innerText = year;
        container.appendChild(header);
    };

    const addOption = (container, type, value, text) => {
        const row = document.createElement('label');
        row.className = 'dropdown-item-row';
        row.innerHTML = `
            <input type="checkbox" class="${type}-check custom-chk" value="${value}" onchange="update${type === 'month' ? 'Month' : 'Extra'}Selection()">
            <span class="round-check"></span>
            <span class="dropdown-item-text">${text}</span>
        `;
        container.appendChild(row);
    };

    monthList.innerHTML = '';
    extraList.innerHTML = '';

    // December 2025 specifically
    addYearHeader(monthList, 2025);
    addOption(monthList, 'month', 'December 2025', 'December 2025');


    // Current and Next Year
    [currentYear, nextYear].forEach(year => {
        if (year <= 2025) return; // Already handled 2025

        addYearHeader(monthList, year);
        MONTH_NAMES.forEach(m => addOption(monthList, 'month', `${m} ${year}`, `${m} ${year}`));

        addYearHeader(extraList, year);
        addOption(extraList, 'extra', `January-June ${year}`, `January-June ${year}`);
        addOption(extraList, 'extra', `July-December ${year}`, `July-December ${year}`);
    });
};

window.applyDisabledStatusToDropdowns = () => {
    // Disable months
    const paidMonthlyStrings = _currentUserDeposits
        .filter(d => d.type === 'Monthly Deposit')
        .map(d => `${d.month} ${d.year}`);

    document.querySelectorAll('.month-check').forEach(c => {
        const parts = c.value.split(' ');
        const monthName = parts[0];
        const year = parseInt(parts[1]);
        const monthIdx = MONTH_NAMES.indexOf(monthName);

        let shouldDisable = paidMonthlyStrings.includes(c.value);

        // Also disable if before join date
        if (!shouldDisable && _currentUserJoinDate) {
            const jYear = _currentUserJoinDate.getFullYear();
            const jMonthIdx = _currentUserJoinDate.getMonth(); // 0-11

            if (year < jYear || (year === jYear && monthIdx < jMonthIdx)) {
                shouldDisable = true;
            }
        }

        if (shouldDisable) {
            c.checked = false;
            c.disabled = true;
            c.closest('.dropdown-item-row').style.opacity = '0.5';
            c.closest('.dropdown-item-row').style.cursor = 'not-allowed';
            c.closest('.dropdown-item-row').title = "Month before joining or already paid";
        } else {
            c.disabled = false;
            c.closest('.dropdown-item-row').style.opacity = '1';
            c.closest('.dropdown-item-row').style.cursor = 'pointer';
            c.closest('.dropdown-item-row').title = "";
        }
    });

    // Disable extra terms
    const paidExtraStrings = _currentUserDeposits
        .filter(d => d.type === 'Extra Deposit')
        .map(d => `${d.month} ${d.year}`);

    document.querySelectorAll('.extra-check').forEach(c => {
        if (paidExtraStrings.includes(c.value)) {
            c.checked = false;
            c.disabled = true;
            c.closest('.dropdown-item-row').style.opacity = '0.5';
            c.closest('.dropdown-item-row').style.cursor = 'not-allowed';
        } else {
            c.disabled = false;
            c.closest('.dropdown-item-row').style.opacity = '1';
            c.closest('.dropdown-item-row').style.cursor = 'pointer';
        }
    });

    // Update labels since we might have unchecked items
    window.updateMonthSelection();
    window.updateExtraSelection();
};

window.openDepositModal = async () => {
    // Populate dynamic options
    window.renderDepositOptions();

    // Reset form and custom dropdowns
    const depositFormEl = document.getElementById('depositForm');
    if (depositFormEl) depositFormEl.reset();
    document.querySelectorAll('.custom-chk').forEach(c => c.checked = false);
    document.getElementById('monthDropdownLabel').innerText = 'Select Months...';
    document.getElementById('extraDropdownLabel').innerText = 'Select Term...';

    depositModal.style.display = 'flex';
    if (currentUser) {
        try {
            // Fetch user join date
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                _currentUserJoinDate = data.createdAt ? new Date(data.createdAt.seconds * 1000) : null;
            }

            const depsSnap = await db.collection('deposits')
                .where('uid', '==', currentUser.uid)
                .get();

            _currentUserDeposits = [];
            depsSnap.forEach(doc => {
                const data = doc.data();
                if (data.status === 'approved' || data.status === 'pending') {
                    _currentUserDeposits.push(data);
                }
            });

            const totalAdmissionPaid = _currentUserDeposits
                .filter(d => d.type === 'Admission Fee')
                .reduce((sum, d) => sum + (d.amount || 0), 0);

            const admSection = document.getElementById('admFeeSection');
            if (admSection) {
                if (totalAdmissionPaid >= REQUIRED_ADMISSION_FEE) {
                    admSection.style.display = 'none';
                    document.getElementById('admAmount').value = ''; // clear value
                } else {
                    admSection.style.display = 'block';
                    // Optional: You could pre-fill the remaining amount, 
                    // but the user asked for the option to stay, so we'll just show it.
                }
            }
            window.applyDisabledStatusToDropdowns();
            window.calculateDepositTotal();
        } catch (e) {
            console.error("Checking deposits:", e);
        }
    }
};
window.closeDepositModal = () => depositModal.style.display = 'none';

// Cache receipts by deposit doc ID to avoid passing huge base64 strings in onclick
const _receiptCache = {};

window.viewReceipt = async (depositId) => {
    const modal = document.getElementById('receiptModal');
    const img = document.getElementById('receiptImage');
    const loader = document.getElementById('receiptLoading');
    if (!modal || !img) return;

    img.src = '';
    img.style.display = 'none';
    if (loader) loader.style.display = 'block';
    modal.style.display = 'flex';

    try {
        // Use cache if available to avoid re-fetching
        let src = _receiptCache[depositId];
        if (!src) {
            const doc = await db.collection('deposits').doc(depositId).get();
            if (doc.exists && doc.data().receipt) {
                src = doc.data().receipt;
                _receiptCache[depositId] = src;
            }
        }
        if (src) {
            img.src = src;
            img.alt = 'Receipt';
        } else {
            img.alt = 'No receipt image found.';
        }
    } catch (e) {
        img.alt = 'Failed to load receipt: ' + e.message;
    } finally {
        if (loader) loader.style.display = 'none';
        img.style.display = 'block';
    }
};

window.closeReceiptModal = () => {
    document.getElementById('receiptModal').style.display = 'none';
};


if (depositForm) {
    depositForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');

        const totalAmount = parseFloat(document.getElementById('depAmount').value) || 0;
        if (totalAmount <= 0) {
            alert("Please select at least one item or enter an amount.");
            return;
        }

        btn.disabled = true;
        btn.innerText = 'Submitting Batch...';

        try {
            const receiptFile = document.getElementById('depReceipt').files[0];
            let receiptBase64 = null;
            if (receiptFile) {
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Receipt...';
                receiptBase64 = await compressAndConvertToBase64(receiptFile);
            }

            const userSnap = await db.collection('users').doc(currentUser.uid).get();
            const realName = userSnap.exists ? (userSnap.data().name || currentUser.email) : (currentUser.displayName || currentUser.email);

            const batchId = `batch_${Date.now()}`;
            const date = document.getElementById('depDate').value;
            const reference = document.getElementById('depRef').value;
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            const batchDocs = [];

            // 1. Admission Fee
            const admSection = document.getElementById('admFeeSection');
            if (!admSection || admSection.style.display !== 'none') {
                const admAmount = parseFloat(document.getElementById('admAmount').value) || 0;
                if (admAmount > 0) {
                    batchDocs.push({ type: 'Admission Fee', amount: admAmount, month: 'N/A', year: 'N/A' });
                }
            }

            // 2. Monthly
            const monthlyRate = parseFloat(document.getElementById('monthlyRate').value) || 0;
            document.querySelectorAll('.month-check:checked').forEach(c => {
                const parts = c.value.split(' ');
                const month = parts[0];
                const year = parts[1];
                batchDocs.push({ type: 'Monthly Deposit', amount: monthlyRate, month: month, year: year });
            });

            // 3. Extra
            const extraRate = parseFloat(document.getElementById('extraRate').value) || 0;
            document.querySelectorAll('.extra-check:checked').forEach(c => {
                const parts = c.value.split(' ');
                const month = parts[0];
                const year = parts[1];
                batchDocs.push({ type: 'Extra Deposit', amount: extraRate, month: month, year: year });
            });

            // 4. Other
            const otherAmount = parseFloat(document.getElementById('otherAmount').value) || 0;
            if (otherAmount > 0) {
                batchDocs.push({
                    type: 'Other',
                    amount: otherAmount,
                    month: 'N/A',
                    year: 'N/A',
                    description: document.getElementById('otherNote').value || 'Other Deposit'
                });
            }

            // Write to Firestore
            const writePromises = batchDocs.map(item => {
                return db.collection('deposits').add({
                    ...item,
                    uid: currentUser.uid,
                    userName: realName,
                    userEmail: currentUser.email,
                    batchId: batchId,
                    date: date,
                    reference: reference,
                    receipt: receiptBase64,
                    status: 'pending',
                    timestamp: timestamp
                });
            });

            await Promise.all(writePromises);

            alert(`Successfully submitted ${batchDocs.length} items in one batch! Waiting for manager approval.`);
            closeDepositModal();
            depositForm.reset();
            window.calculateDepositTotal(); // Reset display
        } catch (error) {
            console.error("Batch Submission Error:", error);
            alert("Error: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${(translations[currentLang] || translations['en'])['btn-submit-deposit'] || 'Submit Deposit'}`;
        }
    });
}

// --- MANAGER APPROVALS ---

function loadPendingDeposits() {
    db.collection('deposits').where('status', '==', 'pending').onSnapshot((snapshot) => {
        const list = document.getElementById('pendingDeposits');
        if (!list) return;

        if (snapshot.empty) {
            list.innerHTML = '<p style="color: var(--text-muted);">No pending deposits.</p>';
            return;
        }

        // Group by batchId
        const batches = {};
        snapshot.forEach(doc => {
            const d = doc.data();
            const bid = d.batchId || doc.id; // Fallback to doc.id if no batchId (legacy)
            if (!batches[bid]) {
                batches[bid] = {
                    id: bid,
                    uid: d.uid,
                    userName: d.userName,
                    userEmail: d.userEmail,
                    date: d.date,
                    timestamp: d.timestamp,
                    receipt: d.receipt,
                    reference: d.reference,
                    items: [],
                    totalAmount: 0
                };
            }
            batches[bid].items.push({ id: doc.id, ...d });
            batches[bid].totalAmount += (d.amount || 0);
        });

        list.innerHTML = Object.values(batches).sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeB - timeA;
        }).map(batch => {
            const dateStr = batch.date || (batch.timestamp ? formatDate(batch.timestamp) : 'N/A');
            const displayName = userNamesMap[batch.uid] || batch.userName || batch.userEmail;

            const itemsHtml = batch.items.map(it => {
                const desc = it.type === 'Other' ? (it.description || 'Other') : (it.month === 'N/A' ? '' : `${it.month} ${it.year}`);
                return `<li style="font-size: 0.8rem; color: var(--text-main); margin-bottom: 3px; list-style-type: none;">
                    <i class="fa-solid fa-caret-right" style="font-size: 0.7rem; color: var(--primary-color); margin-right: 5px;"></i>
                    ${it.type}: <strong>Tk ${formatNumber(it.amount).replace('Tk ', '')}</strong> ${desc ? `<span style="color: var(--text-muted); font-size: 0.75rem;">(${desc})</span>` : ''}
                </li>`;
            }).join('');

            return `
                <div class="glass-card" style="padding: 15px; margin-bottom: 20px; border-radius: 15px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items:flex-start; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 0.95rem; color: var(--primary-color);">${displayName}</strong>
                            <div style="font-size: 0.7rem; color: var(--text-muted);">${batch.userEmail}</div>
                        </div>
                        <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">${dateStr}</span>
                    </div>
                    
                    <ul style="margin: 0 0 12px 0; padding: 0;">
                        ${itemsHtml}
                    </ul>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: var(--bg-light); padding: 8px 12px; border-radius: 10px;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">TOTAL</span>
                        <span style="font-size: 1rem; font-weight: 800; color: var(--primary-color);">Tk ${formatNumber(batch.totalAmount).replace('Tk ', '')}</span>
                    </div>

                    ${batch.receipt || batch.reference ? `
                        <div style="margin-bottom: 12px; font-size: 0.75rem; color: var(--text-muted);">
                           ${batch.reference ? `<div>Ref: ${batch.reference}</div>` : ''}
                           ${batch.receipt ? `
                                <button onclick="viewReceipt('${batch.items[0].id}')" class="btn btn-link" style="font-size: 0.8rem; padding: 0; color: #8b5cf6; font-weight: 700; margin-top: 5px;">
                                    <i class="fa-solid fa-image"></i> View Receipt
                                </button>
                           ` : ''}
                        </div>
                    ` : ''}

                    <div style="display: flex; gap: 10px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px;">
                        <button onclick="approveBatch('${batch.id}', '${batch.uid}', ${batch.totalAmount})" class="btn btn-primary" style="padding: 6px 15px; font-size: 0.85rem; border-radius: 8px; flex: 1;">
                            <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button onclick="rejectBatch('${batch.id}')" class="btn btn-link" style="color: var(--error); font-weight: 600; padding: 0 5px; font-size: 0.85rem;">Reject</button>
                    </div>
                </div>
            `;
        }).join('');
    });
}

window.approveBatch = async (batchId, uid, totalAmount) => {
    if (uid === currentUser.uid) {
        alert(currentLang === 'bn' ? "Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¹Ã Â¦Å“Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å“Ã Â§â€¡ Ã Â¦ÂÃ Â¦ÂªÃ Â§ÂÃ Â¦Â°Ã Â§ÂÃ Â¦Â­ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¾Ã Â¥Â¤" : "You cannot approve your own deposit.");
        return;
    }
    if (!confirm(`Are you sure you want to approve this batch payment of Tk ${formatNumber(totalAmount).replace('Tk ', '')}?`)) return;
    try {
        const userRef = db.collection('users').doc(uid);

        // Find all pending docs in this batch to process them all
        let snapshot;
        if (batchId.startsWith('batch_')) {
            snapshot = await db.collection('deposits').where('batchId', '==', batchId).where('status', '==', 'pending').get();
        } else {
            // Legacy individual approval
            const doc = await db.collection('deposits').doc(batchId).get();
            if (doc.exists && doc.data().status === 'pending') {
                snapshot = { docs: [doc] };
            }
        }

        if (!snapshot || snapshot.empty) throw new Error("Batch not found or already processed.");

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            let currentBalance = userDoc.exists ? (userDoc.data().balance || 0) : 0;
            let currentSavings = userDoc.exists ? (userDoc.data().savings || 0) : 0;

            // Update Global Stats
            const statsRef = db.collection('system').doc('stats');
            const statsDoc = await transaction.get(statsRef);
            const stats = statsDoc.exists ? statsDoc.data() : { totalSavings: 0 };
            transaction.set(statsRef, {
                totalSavings: (stats.totalSavings || 0) + totalAmount
            }, { merge: true });

            transaction.update(userRef, {
                balance: currentBalance + totalAmount,
                savings: currentSavings + totalAmount
            });

            // Update Dues Cache on User Doc
            const userData = userDoc.data() || {};
            const dues = userData.dues || { admissionPaid: 0, monthlyPaidCount: 0, extraTermsPaid: [] };

            snapshot.forEach(doc => {
                const item = doc.data();
                if (item.type === 'Admission Fee') dues.admissionPaid += (item.amount || 0);
                else if (item.type === 'Monthly Deposit') dues.monthlyPaidCount += 1;
                else if (item.type === 'Extra Deposit') {
                    const term = `${item.month} ${item.year}`;
                    if (!dues.extraTermsPaid.includes(term)) dues.extraTermsPaid.push(term);
                }
                transaction.update(doc.ref, {
                    status: 'approved',
                    approvedBy: userNamesMap[currentUser.uid] || currentUser.email
                });
            });
            transaction.update(userRef, { dues: dues });
        });

        alert("Batch approved successfully!");
    } catch (error) {
        console.error("Batch Approval Error:", error);
        alert("Approval failed: " + error.message);
    }
};

window.rejectBatch = async (batchId) => {
    if (!confirm("Are you sure you want to reject this entire batch?")) return;
    try {
        let snapshot;
        if (batchId.startsWith('batch_')) {
            snapshot = await db.collection('deposits').where('batchId', '==', batchId).get();
        } else {
            const doc = await db.collection('deposits').doc(batchId).get();
            if (doc.exists) snapshot = { docs: [doc] };
        }

        if (snapshot && !snapshot.empty) {
            const promises = snapshot.docs.map(doc => doc.ref.update({ status: 'rejected' }));
            await Promise.all(promises);
            alert("Batch rejected.");
        }
    } catch (e) {
        alert("Rejection failed: " + e.message);
    }
};

// Note: rejectBatch handles grouped rejections, but keeping original for safety if needed
window.rejectDeposit = window.rejectBatch;

// --- OWNER & AUDIT MANAGEMENT ---


// Initialize deposit listener once
db.collection('deposits').where('status', '==', 'approved').onSnapshot(snapshot => {
    _approvedDepositsCache = {};
    snapshot.forEach(doc => {
        const d = doc.data();
        const uid = d.uid;
        if (!_approvedDepositsCache[uid]) {
            _approvedDepositsCache[uid] = { monthlyMonths: [], admissionTotal: 0, extraTerms: [] };
        }
        if (d.type === 'Monthly Deposit') _approvedDepositsCache[uid].monthlyMonths.push(`${d.month} ${d.year}`);
        else if (d.type === 'Admission Fee') _approvedDepositsCache[uid].admissionTotal += (d.amount || 0);
        else if (d.type === 'Extra Deposit') _approvedDepositsCache[uid].extraTerms.push(`${d.month} ${d.year}`);
    });
});

// Helper to calculate historical missing Extra Deposit terms
window.getMissingExtraTerms = function (joinDate, extraPaidArray) {
    if (!joinDate) return [];
    const today = new Date();
    const currYear = today.getFullYear();
    const currMonIdx = today.getMonth();
    const jYear = joinDate.getFullYear();
    const jMon = joinDate.getMonth();

    let missing = [];
    for (let y = jYear; y <= currYear; y++) {
        // Term 1 (Jan-Jun) - Due from June (idx 5) onwards
        if (y < currYear || (y === currYear && currMonIdx >= 5)) {
            // If they joined in the same year, but AFTER June, they don't owe Term 1 for that year.
            if (!(y === jYear && jMon > 5)) {
                if (!extraPaidArray.some(t => t.includes('January-June') && t.includes(y.toString()))) {
                    missing.push(`Term 1 (${y})`);
                }
            }
        }
        // Term 2 (Jul-Dec) - Due from December (idx 11) onwards
        if (y < currYear || (y === currYear && currMonIdx >= 11)) {
            if (!(y === jYear && jMon > 11)) {
                if (!extraPaidArray.some(t => t.includes('July-December') && t.includes(y.toString()))) {
                    missing.push(`Term 2 (${y})`);
                }
            }
        }
    }
    return missing;
};

function loadAllUsers() {
    // 1. Listen to user changes
    db.collection('users').onSnapshot(async (snapshot) => {
        const list = document.getElementById('allUsersList');
        const countEl = document.getElementById('totalMembersCount');
        if (countEl) countEl.innerText = snapshot.size;

        // Populate global user name cache
        snapshot.forEach(doc => {
            userNamesMap[doc.id] = doc.data().name || doc.data().email;
        });

        if (snapshot.empty) {
            if (list) list.innerHTML = 'No users.';
            return;
        }

        const userStats = _approvedDepositsCache;
        const roleOrder = { 'owner': 0, 'manager': 1, 'admin': 2, 'member': 3 };
        const userDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        userDocs.sort((a, b) => {
            const roleA = a.role || 'member';
            const roleB = b.role || 'member';
            return (roleOrder[roleA] ?? 10) - (roleOrder[roleB] ?? 10);
        });

        const today = new Date();
        const currentMonthIdx = today.getMonth();
        const currentYear = today.getFullYear();

        if (!list) return;
        list.innerHTML = '';

        userDocs.forEach(u => {
            const joinDate = u.createdAt ? new Date(u.createdAt.seconds * 1000) : new Date();

            // Preference: Use the cached dues object on the user doc. 
            // Fallback: Use the (legacy) global deposits cache for users not yet migrated.
            const dues = u.dues || _approvedDepositsCache[u.id] || { admissionPaid: 0, monthlyPaidCount: 0, monthlyMonths: [], extraTermsPaid: [], extraTerms: [] };

            const monthlyPaidCount = dues.monthlyPaidCount ?? (dues.monthlyMonths ? dues.monthlyMonths.length : 0);
            const admissionTotal = dues.admissionPaid ?? (dues.admissionTotal || 0);
            const extraTerms = dues.extraTermsPaid || dues.extraTerms || [];

            // Dues Logic
            const joinYear = joinDate.getFullYear();
            const joinMonth = joinDate.getMonth();
            const totalMonthsSinceJoin = (currentYear - joinYear) * 12 + (currentMonthIdx - joinMonth) + 1;
            const monthlyDueCount = Math.max(0, totalMonthsSinceJoin - monthlyPaidCount);
            const hasMonthlyDue = monthlyDueCount > 0;
            const hasAdmissionDue = admissionTotal < REQUIRED_ADMISSION_FEE;

            let hasExtraDueIndicator = false;
            const missingExtraTerms = window.getMissingExtraTerms(joinDate, extraTerms);

            // Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦Â¶Ã Â§ÂÃ Â¦Â§Ã Â§Â Ã Â¦Å“Ã Â§ÂÃ Â¦Â¨ (idx=5) Ã Â¦â€œ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â®Ã Â§ÂÃ Â¦Â¬Ã Â¦Â° (idx=11) Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡ Ã Â¦Å“Ã Â§ÂÃ Â¦Â¬Ã Â¦Â²Ã Â¦Â¬Ã Â§â€¡ - Ã Â¦Â¯Ã Â¦Â¦Ã Â¦Â¿ extra due Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡
            if (missingExtraTerms.length > 0 && (currentMonthIdx === 5 || currentMonthIdx === 11)) {
                hasExtraDueIndicator = true;
            }

            const loggedInEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email.toLowerCase().trim() : '';
            const thisUserEmail = u.email ? u.email.toLowerCase().trim() : '';
            const isSelf = loggedInEmail === thisUserEmail;

            // SECURITY: Only Owners, Admins, and Managers can see dues indicators for others.
            // Regular members can only see their own dues.
            const canSeeDues = isSelf || ['owner', 'admin', 'manager'].includes(userRole);

            let indicatorsHTML = '';
            if (canSeeDues) {
                if (hasMonthlyDue) indicatorsHTML += '<span class="due-indicator due-monthly" title="Monthly Deposit Due"></span>';
                if (hasAdmissionDue) indicatorsHTML += '<span class="due-indicator due-admission" title="Admission Fee Due"></span>';
                if (hasExtraDueIndicator) indicatorsHTML += '<span class="due-indicator due-extra" title="Extra Deposit Due"></span>';
                if (!indicatorsHTML) indicatorsHTML = '<span style="width:10px; height:10px; border-radius:50%; background:#e2ede8; display:inline-block;"></span>';
            } else {
                indicatorsHTML = '<span style="width:10px; height:10px; border-radius:50%; background:#e2ede8; display:inline-block;"></span>';
            }

            const row = document.createElement('div');
            row.className = 'member-row';
            row.style.padding = '12px 20px';
            row.onclick = () => openMemberProfile(u.id, u, monthlyDueCount, joinDate);
            row.innerHTML = `
                <div class="member-info" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <div style="display: flex; gap: 5px; align-items: center; min-width: 10px;">
                        ${indicatorsHTML}
                    </div>
                    <h4 style="margin:0; font-size: 1rem; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${u.name || u.email || 'Unknown'}
                    </h4>
                    <div style="display: flex; gap: 5px; flex-shrink: 0;">
                        ${u.role && u.role !== 'member' ? `<span class="role-badge ${u.role}">${u.role.toUpperCase()}</span>` : ''}
                    </div>
                </div>
            `;
            list.appendChild(row);
        });
    });
}

window.openMemberProfile = async (uid, data, monthsDue = 0, joinDateParam = null) => {
    const modal = document.getElementById('memberProfileModal');
    const content = document.getElementById('memberProfileContent');
    modal.style.display = 'flex';
    content.dataset.uid = uid;

    const jDate = joinDateParam || (data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date());

    // Visibility Logic for Profile Details
    const loggedInEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email.toLowerCase().trim() : '';
    const memberEmail = data.email ? data.email.toLowerCase().trim() : '';
    const isSelf = loggedInEmail === memberEmail;
    const isRegularMember = userRole === 'member';
    const isRestricted = isRegularMember && !isSelf;

    content.innerHTML = `
        <div style="text-align:center; margin-bottom: 30px; background: #FFFFFF; padding: 25px; border-radius: 24px; border: 1px solid var(--border-color); position: relative;">
            <div style="width: 100px; height: 100px; margin: 0 auto 15px; border-radius: 50%; overflow: hidden; border: 3px solid var(--primary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: var(--bg-light); display: flex; align-items: center; justify-content: center;">
                ${data.memberPhoto ?
            `<img src="${data.memberPhoto}" style="width: 100%; height: 100%; object-fit: cover;">` :
            `<i class="fa-solid fa-user" style="font-size: 2.5rem; color: #ccc;"></i>`
        }
            </div>
            <h2 style="font-size: 1.5rem; color: var(--text-main); font-weight: 800; margin-bottom: 5px; line-height: 1.2;">${data.name || 'No Name'}</h2>
            <p class="text-break" style="color: var(--text-muted); font-weight: 500; font-size: 0.9rem;">${data.email}</p>
            <div style="margin-top: 15px;">
                ${data.role ? `<span class="role-badge ${data.role}">${data.role.toUpperCase()}</span>` : ''}
            </div>
        </div>

        <div class="form-section">
            <div class="grid-2">
                <div class="profile-info-item">
                    <label class="form-label">Phone</label>
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; padding-left: 5px;">${data.phone || 'N/A'}</p>
                </div>
                <div class="profile-info-item">
                    <label class="form-label">Join Date</label>
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; padding-left: 5px;">${formatDate(jDate)}</p>
                </div>
                <div class="profile-info-item">
                    <label class="form-label">Address</label>
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; padding-left: 5px;">${data.address || 'N/A'}</p>
                </div>
                ${(isSelf || ['owner', 'admin', 'manager'].includes(userRole)) ? `
                <div class="profile-info-item">
                    <label class="form-label">Profit Share (%)</label>
                    <p style="font-weight: 700; color: var(--primary-dark); font-size: 1.1rem; padding-left: 5px;">${data.profitPercentage || 100}%</p>
                </div>
                ` : ''}
            </div>
        </div>

        ${isRestricted ? '' : `
        <div class="form-section" style="background: var(--bg-light); border: 0;">
            <div class="grid-2">
                <div class="profile-info-item" style="margin-bottom: 20px;">
                    <label class="form-label">Total Current Savings</label>
                    <p style="color: var(--primary-color); font-weight: 800; font-size: 1.8rem; padding-left: 5px;">${formatNumber(data.savings || 0)}</p>
                </div>
            <div id="detailedDuesSection" style="border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px;">
                <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation"></i> Overdue Breakdown</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fff; border-radius: 10px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="due-indicator due-monthly"></span>
                            <span style="font-size: 0.85rem; font-weight: 600;">Monthly Deposit</span>
                        </div>
                        <span id="profMonthlyDue" style="font-weight: 700; color: #EF4444;">Calculating...</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fff; border-radius: 10px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="due-indicator due-admission"></span>
                            <span style="font-size: 0.85rem; font-weight: 600;">Admission Fee</span>
                        </div>
                        <span id="profAdmissionDue" style="font-weight: 700; color: #F59E0B;">Calculating...</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fff; border-radius: 10px; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="due-indicator due-extra"></span>
                            <span style="font-size: 0.85rem; font-weight: 600;">Extra Deposit</span>
                        </div>
                        <span id="profExtraDue" style="font-weight: 700; color: #8B5CF6;">Calculating...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Document Status Section -->
        <div class="form-section">
            <div class="form-section-title"><i class="fa-solid fa-file-invoice"></i> Documents Status</div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div class="file-status ${data.memberPhoto ? 'uploaded' : 'missing'}" ${data.memberPhoto ? `onclick="window.open('${data.memberPhoto}', '_blank')"` : ''} style="cursor: ${data.memberPhoto ? 'pointer' : 'default'}">
                    <i class="fa-solid ${data.memberPhoto ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${translations[currentLang]['label-photo']}
                </div>
                <div class="file-status ${data.nidURL ? 'uploaded' : 'missing'}" ${data.nidURL ? `onclick="window.open('${data.nidURL}', '_blank')"` : ''} style="cursor: ${data.nidURL ? 'pointer' : 'default'}">
                    <i class="fa-solid ${data.nidURL ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${translations[currentLang]['label-nid']}
                </div>
                <div class="file-status ${data.nomineePhoto ? 'uploaded' : 'missing'}" ${data.nomineePhoto ? `onclick="window.open('${data.nomineePhoto}', '_blank')"` : ''} style="cursor: ${data.nomineePhoto ? 'pointer' : 'default'}">
                    <i class="fa-solid ${data.nomineePhoto ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${translations[currentLang]['label-nominee-photo']}
                </div>
            </div>
        </div>

        <div class="form-section">
            <div class="form-section-title"><i class="fa-solid fa-user-group"></i> Nominee Information</div>
            <div class="grid-2">
                <div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Nominee Name</p>
                    <p style="font-weight: 600;">${data.nominee?.name || 'N/A'}</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Relation</p>
                    <p style="font-weight: 600;">${data.nominee?.relation || 'N/A'}</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Nominee Phone</p>
                    <p style="font-weight: 600;">${data.nominee?.phone || 'N/A'}</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Nominee Address</p>
                    <p style="font-weight: 600;">${data.nominee?.address || 'N/A'}</p>
                </div>
            </div>
        </div>
        `}
    `;

    // Async Due Calculation for Profile
    if (!isRestricted) {
        (async () => {
            try {
                let adminTotal = 0;
                let monthlyPaidCount = 0;
                let extraFound = [];

                if (data.dues) {
                    adminTotal = data.dues.admissionPaid || 0;
                    monthlyPaidCount = data.dues.monthlyPaidCount || 0;
                    extraFound = data.dues.extraTermsPaid || [];
                } else {
                    // Legacy Fallback (One-time check if dues object is missing)
                    const depsSnap = await db.collection('deposits').where('uid', '==', uid).where('status', '==', 'approved').get();
                    depsSnap.forEach(d => {
                        const doc = d.data();
                        if (doc.type === 'Admission Fee') adminTotal += (doc.amount || 0);
                        else if (doc.type === 'Monthly Deposit') monthlyPaidCount++;
                        else if (doc.type === 'Extra Deposit') extraFound.push(`${doc.month} ${doc.year}`);
                    });
                }

                const today = new Date();
                const currYear = today.getFullYear();
                const currMonIdx = today.getMonth();

                // 1. Admission Due
                const admDue = Math.max(0, REQUIRED_ADMISSION_FEE - adminTotal);
                const profAdmEl = document.getElementById('profAdmissionDue');
                if (profAdmEl) {
                    profAdmEl.innerText = admDue > 0 ? `Tk ${formatNumber(admDue).replace('Tk ', '')} Due` : 'Paid';
                    profAdmEl.style.color = admDue > 0 ? '#F59E0B' : 'var(--success)';
                }

                // 2. Monthly Due
                const jYear = jDate.getFullYear();
                const jMon = jDate.getMonth();
                const totalMonthsExpected = (currYear - jYear) * 12 + (currMonIdx - jMon) + 1;
                const mDue = Math.max(0, totalMonthsExpected - monthlyPaidCount);
                const profMonEl = document.getElementById('profMonthlyDue');
                if (profMonEl) {
                    profMonEl.innerText = mDue > 0 ? `${mDue} Months Due` : 'Paid';
                    profMonEl.style.color = mDue > 0 ? '#EF4444' : 'var(--success)';
                }

                // 3. Extra Due - getMissingExtraTerms Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â°Ã Â§â€¡Ã Â¦Â° term check Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ÂÃ Â¦â€ºÃ Â§â€¡
                const profileJoinDate = jDate instanceof Date ? jDate : new Date(jDate);
                const extraDueList = window.getMissingExtraTerms(profileJoinDate, extraFound);
                const profExtraEl = document.getElementById('profExtraDue');
                if (profExtraEl) {
                    if (extraDueList.length > 0) {
                        profExtraEl.innerText = extraDueList.join(', ') + ' Due';
                        profExtraEl.style.color = '#8B5CF6';
                    } else {
                        profExtraEl.innerText = 'Paid';
                        profExtraEl.style.color = 'var(--success)';
                    }
                }
            } catch (err) { console.error("Profile Dues Error:", err); }
        })();
    }


    // Standardized Button Container
    const btnContainer = document.getElementById('profileModalActions');
    if (btnContainer) {
        btnContainer.innerHTML = ''; // Clear old buttons

        if (!isRestricted) {
            const pdfBtn = document.createElement('button');
            pdfBtn.className = 'btn-profile-action btn-profile-statement';
            pdfBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Statement';
            pdfBtn.onclick = () => viewMemberStatement(uid, data, monthsDue, jDate);
            btnContainer.appendChild(pdfBtn);
        }

        // Show Edit button logic
        const memberRoleOnProfile = data.role || 'member';
        const isOwnerUser = userRole === 'owner';
        const isAdminUser = userRole === 'admin';
        const isManagerUser = userRole === 'manager';

        // Logic: 
        // 1. Owner can edit everyone.
        // 2. Admin/Manager can edit anyone except the Owner.
        // 3. Anyone can edit their own profile.
        let canEdit = isSelf || isOwnerUser;
        if (!canEdit && (isAdminUser || isManagerUser)) {
            if (memberRoleOnProfile !== 'owner' && memberEmail !== 'growhalal0@gmail.com') {
                canEdit = true;
            }
        }

        if (canEdit) {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-profile-action btn-profile-edit';
            editBtn.innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Profile';
            editBtn.onclick = () => openEditProfile(uid);
            btnContainer.appendChild(editBtn);
        }

        // Add Delete Button (Owner Only)
        if (isOwnerUser && memberRoleOnProfile !== 'owner' && !isSelf) {
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-profile-action';
            delBtn.style.background = 'var(--error)';
            delBtn.style.color = 'white';
            delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete Member';
            delBtn.onclick = () => initiateMemberDeletion(uid, data.savings || 0, data.profitPercentage || 100, data.excludedProfit || 0);
            btnContainer.appendChild(delBtn);
        }
    }
};

window.closeMemberProfile = () => {
    document.getElementById('memberProfileModal').style.display = 'none';
};

// Opens the currently logged-in user's own profile from the bottom nav
window.openSelfProfile = async () => {
    if (!currentUser) return;
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            const joinDate = data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date();
            const today = new Date();
            const totalMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth()) + 1;
            const depsSnap = await db.collection('deposits').where('userEmail', '==', currentUser.email).where('status', '==', 'approved').get();
            const monthsDue = Math.max(0, totalMonths - depsSnap.size);
            openMemberProfile(currentUser.uid, data, monthsDue, joinDate);
        }
    } catch (e) {
        alert('Could not load profile: ' + e.message);
    }
};


window.updateMemberRoleProfile = async () => {
    const uid = document.getElementById('memberProfileContent').dataset.uid;
    const role = document.getElementById('profileRoleSelect').value;
    try {
        await db.collection('users').doc(uid).update({ role });
        alert("Role updated to " + role);
    } catch (e) { alert(e.message); }
};

window.openEditProfile = async (uid) => {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return;
    const data = doc.data();

    document.getElementById('editUid').value = uid;
    document.getElementById('editMemName').value = data.name || '';
    document.getElementById('editMemPhone').value = data.phone || '';
    document.getElementById('editMemAddress').value = data.address || '';

    document.getElementById('editNomName').value = data.nominee?.name || '';
    document.getElementById('editNomRelation').value = data.nominee?.relation || '';
    document.getElementById('editNomPhone').value = data.nominee?.phone || '';
    document.getElementById('editNomAddress').value = data.nominee?.address || '';
    const profitInput = document.getElementById('editMemProfitPct');
    if (profitInput) {
        profitInput.value = data.profitPercentage || 100;
        profitInput.disabled = !['owner', 'admin', 'manager'].includes(userRole);
    }

    document.getElementById('editProfileModal').style.display = 'flex';
};

window.closeEditProfile = () => {
    document.getElementById('editProfileModal').style.display = 'none';
};

const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const uid = document.getElementById('editUid').value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

        // Build update object only with provided values
        const updatedData = {};
        const name = document.getElementById('editMemName').value.trim();
        const phone = document.getElementById('editMemPhone').value.trim();
        const address = document.getElementById('editMemAddress').value.trim();

        if (name) updatedData.name = name;
        if (phone) updatedData.phone = phone;
        if (address) updatedData.address = address;

        const profitPct = document.getElementById('editMemProfitPct').value;
        if (profitPct !== "") updatedData.profitPercentage = parseFloat(profitPct);

        // Nominee partial
        const nomName = document.getElementById('editNomName').value.trim();
        const nomRel = document.getElementById('editNomRelation').value.trim();
        const nomPhone = document.getElementById('editNomPhone').value.trim();
        const nomAddr = document.getElementById('editNomAddress').value.trim();

        if (nomName || nomRel || nomPhone || nomAddr) {
            updatedData.nominee = {};
            if (nomName) updatedData.nominee.name = nomName;
            if (nomRel) updatedData.nominee.relation = nomRel;
            if (nomPhone) updatedData.nominee.phone = nomPhone;
            if (nomAddr) updatedData.nominee.address = nomAddr;
        }

        try {
            // Handle File Uploads (Internal Storage)
            const fileInputs = [
                { id: 'editMemPhoto', field: 'memberPhoto', label: 'Member Photo' },
                { id: 'editMemNID', field: 'nidURL', label: 'NID' },
                { id: 'editNomPhoto', field: 'nomineePhoto', label: 'Nominee Photo' }
            ];

            const lastUpdates = [];
            for (const input of fileInputs) {
                const fileInput = document.getElementById(input.id);
                if (!fileInput || !fileInput.files[0]) continue;

                const file = fileInput.files[0];
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing ${input.label}...`;

                try {
                    const base64String = await compressAndConvertToBase64(file);
                    updatedData[input.field] = base64String;
                    lastUpdates.push(input.label);
                } catch (err) {
                    console.error(`Processing error for ${input.label}:`, err);
                }
            }

            if (lastUpdates.length > 0) {
                updatedData.lastUpdates = lastUpdates;
                updatedData.hasPendingFiles = false;
            }

            await db.collection('users').doc(uid).update(updatedData);
            alert("Profile updated successfully with photos!");
            closeEditProfile();
            closeMemberProfile();
            loadAllUsers();
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Update failed: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Save Profile Changes';
        }
    });
}

// --- MEMBER DELETION & COMPANY ACCOUNT LOGIC ---

window.initiateMemberDeletion = async (uid, totalSavings, profitPercentage = 100, excludedProfit = 0) => {
    document.getElementById('delMemberUid').value = uid;
    document.getElementById('delMemberTotalSavings').value = totalSavings;
    document.getElementById('delSavingsDisplay').innerText = formatNumber(totalSavings);

    // Calculate estimated profit map
    try {
        const statsDoc = await db.collection('system').doc('stats').get();
        const globalProfit = statsDoc.exists ? (statsDoc.data().totalProfit || 0) : 0;

        // Sum up global active savings to find ratio
        const allUsersSnap = await db.collection('users').get();
        let globalSavings = 0;
        allUsersSnap.forEach(doc => { globalSavings += (doc.data().savings || 0); });

        let estimatedProfit = 0;
        if (globalSavings > 0) {
            const effectiveProfit = Math.max(0, globalProfit - excludedProfit);
            estimatedProfit = ((totalSavings / globalSavings) * effectiveProfit) * (profitPercentage / 100);
        }

        document.getElementById('delMemberTotalProfit').value = estimatedProfit;
        document.getElementById('delProfitDisplay').innerText = formatNumber(estimatedProfit);

        document.getElementById('delDeductionPct').value = 10; // Default 10%

        document.getElementById('deleteMemberModal').style.display = 'flex';
        calculateDeletionPayout();

    } catch (e) {
        alert("Error prepping deletion: " + e.message);
    }
};

window.calculateDeletionPayout = () => {
    const savings = parseFloat(document.getElementById('delMemberTotalSavings').value) || 0;
    const profit = parseFloat(document.getElementById('delMemberTotalProfit').value) || 0;
    const pct = parseFloat(document.getElementById('delDeductionPct').value) || 0;

    const deduction = (profit * (pct / 100));
    const payout = (savings + profit) - deduction;

    document.getElementById('delDeductionAmount').innerText = formatNumber(deduction);
    document.getElementById('delFinalPayout').innerText = formatNumber(payout);
};

window.closeDeleteMemberModal = () => {
    document.getElementById('deleteMemberModal').style.display = 'none';
};

const deleteMemberForm = document.getElementById('deleteMemberForm');
if (deleteMemberForm) {
    deleteMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const uid = document.getElementById('delMemberUid').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Processing...';

        try {
            // 1. Pre-calculate global savings outside transaction (queries unsupported in client-side transactions)
            const allUsersSnap = await db.collection('users').get();
            let currentGlobalSavings = 0;
            allUsersSnap.forEach(doc => { currentGlobalSavings += (doc.data().savings || 0); });

            // Fetch finished investments to calculate dynamic exclusion
            const finishedInvs = [];
            const invSnap = await db.collection('investments').where('status', 'in', ['completed', 'withdrawn']).get();
            invSnap.forEach(doc => finishedInvs.push(doc.data()));

            await db.runTransaction(async (transaction) => {
                const userRef = db.collection('users').doc(uid);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists) throw new Error("User does not exist.");
                const userData = userDoc.data();
                const uJoinDate = userData.createdAt ? userData.createdAt.toDate() : new Date();
                uJoinDate.setHours(0, 0, 0, 0);

                // 2. Fetch system stats inside transaction for consistency
                const statsRef = db.collection('system').doc('stats');
                const statsDoc = await transaction.get(statsRef);
                const globalProfit = statsDoc.exists ? (statsDoc.data().totalProfit || 0) : 0;

                const savings = userData.savings || 0;
                const profitPercentage = userData.profitPercentage || 100;

                // Calculate dynamic excluded profit: profits of investments started before joining
                let excludedProfit = 0;
                finishedInvs.forEach(inv => {
                    const sDate = inv.date ? new Date(inv.date) : new Date();
                    sDate.setHours(0, 0, 0, 0);
                    if (sDate < uJoinDate) {
                        excludedProfit += (inv.profitAmount || 0);
                    }
                });

                let totalPotentialProfit = 0;
                if (currentGlobalSavings > 0) {
                    const effectiveProfit = Math.max(0, globalProfit - excludedProfit);
                    totalPotentialProfit = (savings / currentGlobalSavings) * effectiveProfit;
                }
                const profitShare = totalPotentialProfit * (profitPercentage / 100);
                const companyDivertedProfit = totalPotentialProfit - profitShare;

                const pct = parseFloat(document.getElementById('delDeductionPct').value) || 0;
                const deduction = (profitShare * (pct / 100));
                const payout = (savings + profitShare) - deduction;

                // 1. Create Archive Record
                const archiveRef = db.collection('archivedMembers').doc(uid);
                const archiveData = {
                    ...userData,
                    deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    finalSavings: savings,
                    finalProfitShare: profitShare,
                    deductionPercentage: pct,
                    profitDeducted: deduction,
                    finalPayout: payout
                };
                transaction.set(archiveRef, archiveData);

                // 2. Create Company Account Record for Deduction & Profit Diversion
                if (deduction > 0) {
                    const companyAccRef = db.collection('companyAccount').doc();
                    transaction.set(companyAccRef, {
                        type: 'Deletion Deduction',
                        amount: deduction,
                        sourceUser: userData.name || userData.email,
                        sourceUid: uid,
                        date: new Date().toISOString().split('T')[0],
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        description: `Deducted ${pct}% from profit share during account closure.`
                    });
                }
                if (companyDivertedProfit > 0) {
                    const diversionRef = db.collection('companyAccount').doc();
                    transaction.set(diversionRef, {
                        type: 'Profit Share Diversion',
                        amount: companyDivertedProfit,
                        sourceUser: userData.name || userData.email,
                        sourceUid: uid,
                        date: new Date().toISOString().split('T')[0],
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        description: `Company retained ${100 - profitPercentage}% share from ${userData.name}'s membership share.`
                    });
                }

                // 3. Update Global Stats (Remove savings and remove the settled profit slice from pool)
                const currentStats = statsDoc.exists ? statsDoc.data() : { totalProfit: 0, totalSavings: 0 };
                const statsUpdate = {
                    totalSavings: Math.max(0, (currentStats.totalSavings || 0) - savings)
                };
                if (totalPotentialProfit > 0) {
                    statsUpdate.totalProfit = Math.max(0, (currentStats.totalProfit || 0) - totalPotentialProfit);
                }
                transaction.set(statsRef, statsUpdate, { merge: true });

                // 4. Delete the User Document
                transaction.delete(userRef);

                // We do NOT delete their deposits or investments, they remain for historical integrity. 
            });

            alert("Member permanently deleted and data archived successfully.");
            closeDeleteMemberModal();
            closeMemberProfile();
            // loadAllUsers() will automatically re-render because of the snapshot listener

        } catch (error) {
            console.error("Deletion Error: ", error);
            alert("Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Confirm Deletion';
        }
    });
}

// --- ANNOUNCEMENT SYSTEM ---

window.openAnnouncements = () => {
    document.getElementById('announcementModal').style.display = 'flex';
    document.getElementById('annoDot').style.display = 'none';
    localStorage.setItem('lastReadAnno', Date.now());
    loadAnnouncements();
};

window.closeAnnouncements = () => {
    document.getElementById('announcementModal').style.display = 'none';
};

window.postAnnouncement = async () => {
    const text = document.getElementById('annoText').value.trim();
    if (!text) return;

    try {
        await db.collection('announcements').add({
            text,
            author: auth.currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Prepare WhatsApp Message
        let roleName = "Member";
        if (userRole === 'owner') roleName = "Owner";
        else if (userRole === 'admin') roleName = "Admin";
        else if (userRole === 'manager') roleName = "Manager";

        const waFormattedText = `*From Grow Halal Web*\n\n${text}\n\n_Send by ${roleName}_`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waFormattedText)}`;

        // Open WhatsApp (User will need to select the group unless using group ID)
        window.open(waUrl, '_blank');

        document.getElementById('annoText').value = '';
        alert('Announcement published successfully and opened in WhatsApp!');
    } catch (error) {
        console.error("Error posting announcement:", error);
    }
};

// --- EXPENSE SYSTEM ---
window.openExpenseModal = (id = null, dataStr = null) => {
    const modal = document.getElementById('expenseModal');
    const title = document.getElementById('expenseModalTitle');
    const form = document.getElementById('expenseForm');

    form.reset();
    document.getElementById('expenseId').value = '';
    title.innerText = "Add Expense";

    if (id && dataStr) {
        const data = JSON.parse(decodeURIComponent(dataStr));
        document.getElementById('expenseId').value = id;
        document.getElementById('expDate').value = data.date;
        document.getElementById('expCategory').value = data.category;
        document.getElementById('expAmount').value = data.amount;
        document.getElementById('expComment').value = data.comment || '';
        title.innerText = "Edit Expense";
    }

    modal.style.display = 'flex';
};

window.closeExpenseModal = () => {
    document.getElementById('expenseModal').style.display = 'none';
};

const expenseForm = document.getElementById('expenseForm');
if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('expenseId').value;
        const date = document.getElementById('expDate').value;
        const category = document.getElementById('expCategory').value.trim();
        const amount = parseFloat(document.getElementById('expAmount').value);
        const comment = document.getElementById('expComment').value.trim();

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = 'Saving...';

        try {
            const data = {
                date,
                category,
                amount,
                comment,
                updatedBy: auth.currentUser.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (id) {
                await db.collection('expenses').doc(id).update(data);
            } else {
                await db.collection('expenses').add(data);
            }

            closeExpenseModal();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerText = currentLang === 'bn' ? 'Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â°Ã Â¦â€¢Ã Â§ÂÃ Â¦Â·Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â§ÂÃ Â¦Â¨' : 'Save Expense';
        }
    });
}

function loadExpenses() {
    db.collection('expenses').orderBy('date', 'desc').onSnapshot(snapshot => {
        const list = document.getElementById('expenseList');
        if (!list) return;
        list.innerHTML = '';

        if (snapshot.empty) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No expenses recorded yet.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const exp = doc.data();
            const isAdmin = (userRole === 'admin' || userRole === 'manager' || userRole === 'owner');
            const dataStr = encodeURIComponent(JSON.stringify(exp));

            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '15px';
            card.style.marginBottom = '10px';
            card.style.borderRadius = '15px';
            card.style.background = 'rgba(229, 62, 62, 0.03)';
            card.style.border = '1px solid rgba(229, 62, 62, 0.1)';

            card.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div>
                        <strong style="display: block; font-size: 1rem; color: var(--text-main); margin-bottom: 2px;">${exp.category}</strong>
                        <span style="display: block; font-size: 1.1rem; font-weight: 800; color: var(--error);">${formatNumber(exp.amount)}</span>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">
                            <i class="fa-solid fa-calendar-day" style="font-size: 0.75rem;"></i> ${exp.date}
                        </p>
                        ${exp.comment ? `<p style="font-size: 0.85rem; color: var(--text-main); margin-top: 8px; font-style: italic; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px;">"${exp.comment}"</p>` : ''}
                    </div>
                    
                    ${isAdmin ? `
                    <div style="display: flex; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05); justify-content: flex-end;">
                        <button onclick="openExpenseModal('${doc.id}', '${dataStr}')" class="btn btn-primary btn-sm" style="padding: 6px 15px; background: #3b82f6; border-radius: 8px; font-size: 0.8rem;"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button onclick="deleteExpense('${doc.id}')" class="btn btn-primary btn-sm" style="padding: 6px 15px; background: var(--error); border-radius: 8px; font-size: 0.8rem;"><i class="fa-solid fa-trash"></i> Delete</button>
                    </div>
                    ` : ''}
                </div>
            `;
            list.appendChild(card);
        });
    });
}

window.deleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
        await db.collection('expenses').doc(id).delete();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

function loadAnnouncements() {
    db.collection('announcements').orderBy('timestamp', 'desc').limit(10).onSnapshot(snapshot => {
        const list = document.getElementById('announcementList');
        if (!list) return;
        list.innerHTML = '';

        if (snapshot.empty) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No announcements yet.</p>';
            return;
        }

        const canDelete = ['owner', 'admin', 'manager'].includes(userRole);

        snapshot.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'Just now';
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.innerHTML = `
                <div class="announcement-time">${time}</div>
                <div style="font-size: 0.95rem; padding-right: 25px;">${data.text}</div>
                ${canDelete ? `<button onclick="deleteAnnouncement('${doc.id}')" class="announcement-delete-btn" title="Delete Announcement"><i class="fa-solid fa-xmark"></i></button>` : ''}
            `;
            list.appendChild(card);
        });

        // Check for new ones
        const lastRead = localStorage.getItem('lastReadAnno') || 0;
        if (!snapshot.empty) {
            const newest = snapshot.docs[0].data().timestamp;
            if (newest && newest.seconds * 1000 > lastRead) {
                document.getElementById('annoDot').style.display = 'block';
            }
        }
    });
}

window.deleteAnnouncement = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
        await db.collection('announcements').doc(id).delete();
    } catch (error) {
        alert("Error deleting announcement: " + error.message);
    }
};
// Note: loadAnnouncements() is called inside openAnnouncements() Ã¢â‚¬â€ no need to run it globally on page load.

const investForm = document.getElementById('investForm');
if (investForm) {
    investForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('invDate').value;
        const sector = document.getElementById('invSector').value;
        const medium = document.getElementById('invMedium').value;
        const amount = parseFloat(document.getElementById('invAmount').value);

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = 'Creating Project...';

        try {
            await db.collection('investments').add({
                date,
                sector,
                medium,
                amount,
                status: 'active',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            await updateSystemStats({ totalInvestments: amount });
            alert("Investment project added successfully!");
            investForm.reset();
        } catch (error) {
            alert("Error adding investment: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerText = 'Add Investment';
        }
    });
}

function loadManageInvestments() {
    db.collection('investments').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        const currentList = document.getElementById('currentInvestmentsList');
        const completedList = document.getElementById('completedInvestmentsList');
        const mainList = document.getElementById('mainDashboardInvestmentList');

        let currentHTML = '';
        let completedHTML = '';
        let mainHTML = '';
        let completedCount = 0;

        snapshot.forEach(doc => {
            const inv = doc.data();
            const isAdmin = (userRole === 'admin' || userRole === 'manager' || userRole === 'owner');
            // Safely encode JSON for onclick string
            const dataStr = encodeURIComponent(JSON.stringify(inv));

            if (inv.status === 'active') {
                // Main Dashboard List (Names only, clickable)
                mainHTML += `
                    <div onclick="openProjectDetailsModal('${doc.id}', '${dataStr}')" style="border-bottom: 1px solid var(--glass-border); padding: 12px 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 5px; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.05)'" onmouseout="this.style.background='none'">
                        <div>
                            <i class="fa-solid fa-folder-open" style="color: #f97316; margin-right: 8px;"></i>
                            <strong style="font-size: 1rem; color: var(--text-main);">${inv.sector}</strong>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                    </div>
                `;

                // Drawer Current List
                currentHTML += `
                    <div class="glass-card" onclick="openProjectDetailsModal('${doc.id}', '${dataStr}')" style="padding: 15px; margin-bottom: 10px; border-radius: 12px; background: rgba(0,0,0,0.2); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.3)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                        <strong style="font-size: 1.05rem;">${inv.sector}</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;"><strong>Start Date:</strong> ${inv.date}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 3px;"><strong>Medium:</strong> ${inv.medium}</p>
                        <p style="color: var(--primary-color); font-weight: 600; margin-top: 5px; font-size: 0.95rem;">Invested: ${formatNumber(inv.amount)}</p>
                        
                        ${isAdmin ? `
                        <div style="display: flex; gap: 8px; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;" onclick="event.stopPropagation();">
                            <button onclick="openWithdrawModal('${doc.id}', ${inv.amount})" class="btn btn-primary" style="flex: 1; padding: 8px 12px; font-size: 0.85rem; background: #10b981; border-radius: 8px;"><i class="fa-solid fa-money-bill-transfer"></i> Withdraw</button>
                            <button onclick="deleteInvestment('${doc.id}')" class="btn btn-primary" style="flex: 1; padding: 8px 12px; font-size: 0.85rem; background: var(--error); border-radius: 8px;"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                        ` : ''}
                    </div>`;

            } else if (inv.status === 'completed' || inv.status === 'withdrawn') {
                completedCount++;
                completedHTML += `
                    <div class="glass-card" onclick="openProjectDetailsModal('${doc.id}', '${dataStr}')" style="padding: 15px; margin-bottom: 10px; border-radius: 12px; background: rgba(0,0,0,0.2); border-left: 4px solid var(--success); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(47, 181, 116, 0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="font-size: 1.05rem;">${completedCount}. ${inv.sector}</strong>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">Date: ${inv.date} to ${inv.withdrawDate || 'Finished'}</p>
                                <p style="color: var(--text-main); font-size: 0.85rem; margin-top: 5px;">Total Profit: <strong style="color: var(--success);">${formatNumber(inv.profitAmount || 0)}</strong></p>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.9rem;"></i>
                        </div>
                    </div>`;
            }
        });

        if (currentList) currentList.innerHTML = currentHTML || '<p style="color: var(--text-muted);">No ongoing projects.</p>';
        if (completedList) completedList.innerHTML = completedHTML || '<p style="color: var(--text-muted);">No completed projects yet.</p>';
        if (mainList) mainList.innerHTML = mainHTML || '<p style="color: var(--text-muted); padding: 5px 10px;">No ongoing projects.</p>';
    });
}

window.deleteInvestment = async (id) => {
    if (!confirm("Are you sure you want to delete this project permanently?")) return;
    try {
        await db.collection('investments').doc(id).delete();
        alert("Project deleted.");
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.openProjectDetailsModal = (id, dataStr) => {
    const inv = JSON.parse(decodeURIComponent(dataStr));
    const body = document.getElementById('projectDetailsBody');
    const actions = document.getElementById('projectDetailsActions');
    const isAdmin = (userRole === 'admin' || userRole === 'manager' || userRole === 'owner');

    let html = `
        <div style="background: rgba(45, 90, 71, 0.03); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid var(--border-color);">
            <div style="margin-bottom: 12px; display: flex; flex-direction: column;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Project Name/Sector</span>
                <strong style="font-size: 1.1rem; color: var(--primary-dark);">${inv.sector}</strong>
            </div>
            <div style="margin-bottom: 12px; display: flex; flex-direction: column;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Medium</span>
                <span style="font-size: 1rem; color: var(--text-main);">${inv.medium}</span>
            </div>
            <div style="margin-bottom: 12px; display: flex; flex-direction: column;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Invested Amount</span>
                <strong style="font-size: 1.1rem; color: var(--text-main);">Tk${inv.amount}</strong>
            </div>
            <div style="margin-bottom: 12px; display: flex; flex-direction: column;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Start Date</span>
                <span style="font-size: 1rem; color: var(--text-main);">${inv.date}</span>
            </div>
    `;

    if (inv.status === 'completed' || inv.status === 'withdrawn') {
        html += `
            <div style="margin-bottom: 12px; display: flex; flex-direction: column;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Withdraw Date</span>
                <span style="font-size: 1rem; color: var(--text-main);">${inv.withdrawDate || 'Finished'}</span>
            </div>
            <div style="margin-bottom: 12px; display: flex; flex-direction: column; background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid var(--success); margin-top: 15px;">
                <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Total Profit</span>
                <strong style="font-size: 1.2rem; color: var(--success);">Tk${inv.profitAmount || 0}</strong>
            </div>
            <div style="margin-top: 15px; text-align: right;">
                <span style="background: var(--success); color: white; padding: 4px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: bold;">Completed</span>
            </div>
        </div>`;
    } else {
        html += `
            <div style="margin-top: 15px; text-align: right;">
                <span style="background: #f97316; color: white; padding: 4px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: bold;">Ongoing</span>
            </div>
        </div>`;
    }
    body.innerHTML = html;

    actions.innerHTML = '';
    if (inv.status === 'active' && isAdmin) {
        actions.innerHTML = `
            <button onclick="closeProjectDetailsModal(); openWithdrawModal('${id}', ${inv.amount})" class="btn btn-primary" style="flex: 1; padding: 10px 15px; font-size: 0.9rem; background: #10b981; border-radius: 8px; font-weight: 500;"><i class="fa-solid fa-money-bill-transfer"></i> Withdraw</button>
            <button onclick="closeProjectDetailsModal(); deleteInvestment('${id}')" class="btn btn-primary" style="flex: 1; padding: 10px 15px; font-size: 0.9rem; background: var(--error); border-radius: 8px; font-weight: 500;"><i class="fa-solid fa-trash"></i> Delete</button>
        `;
    }

    document.getElementById('projectDetailsModal').style.display = 'flex';
};

window.closeProjectDetailsModal = () => {
    document.getElementById('projectDetailsModal').style.display = 'none';
};

window.openWithdrawModal = (id, amount) => {
    document.getElementById('withdrawInvId').value = id;
    document.getElementById('withdrawInvPrincipal').value = amount;
    document.getElementById('withdrawTotal').value = '';
    document.getElementById('withdrawProfit').value = '';
    document.getElementById('withdrawDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('withdrawModal').style.display = 'flex';
};

window.calculateWithdrawProfit = () => {
    const principal = parseFloat(document.getElementById('withdrawInvPrincipal').value) || 0;
    const total = parseFloat(document.getElementById('withdrawTotal').value) || 0;
    const profitInput = document.getElementById('withdrawProfit');
    profitInput.value = (total - principal).toFixed(2);
};

window.closeWithdrawModal = () => {
    document.getElementById('withdrawModal').style.display = 'none';
};

const withdrawForm = document.getElementById('withdrawForm');
if (withdrawForm) {
    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('withdrawInvId').value;
        const totalBack = parseFloat(document.getElementById('withdrawTotal').value);
        const profit = parseFloat(document.getElementById('withdrawProfit').value);
        const withdrawDate = document.getElementById('withdrawDate').value;

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = 'Processing...';

        try {
            await db.runTransaction(async (transaction) => {
                const statsRef = db.collection('system').doc('stats');
                const investRef = db.collection('investments').doc(id);

                const statsDoc = await transaction.get(statsRef);
                const investDoc = await transaction.get(investRef);
                const principal = investDoc.exists ? (investDoc.data().amount || 0) : 0;

                // 1. Mark investment as withdrawn
                transaction.update(investRef, {
                    status: 'withdrawn',
                    withdrawnAmount: totalBack,
                    profitAmount: profit,
                    withdrawDate: withdrawDate,
                    withdrawnAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // 2. Update global stats
                const current = statsDoc.exists ? statsDoc.data() : { totalProfit: 0, totalInvestments: 0 };
                transaction.set(statsRef, {
                    totalProfit: (current.totalProfit || 0) + profit,
                    totalInvestments: Math.max(0, (current.totalInvestments || 0) - principal)
                }, { merge: true });
            });

            alert("Project withdrawn successfully! Profit added to total system profit.");
            closeWithdrawModal();
        } catch (error) {
            alert("Withdrawal failed: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerText = (translations[currentLang] || translations['en'])['btn-confirm-withdraw'] || 'Confirm Withdrawal';
        }
    });
}

// --- PDF REPORTING ---

// --- PDF REPORTING ---
// Legacy direct jsPDF drawing functions removed for high-fidelity off-screen/visible capture.


// --- REPORTING SYSTEM ENHANCEMENTS ---

const waitForAssets = async (container) => {
    const images = Array.from(container.querySelectorAll('img'));
    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
    await Promise.all([
        fontReady,
        ...images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })
    ]);
};

window.viewMemberStatement = async (uid, data, monthsDue, joinDate, downloadOnly = false) => {
    const titleEl = document.getElementById('reportPreviewTitle');
    const contentEl = document.getElementById('reportPreviewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const modal = document.getElementById('reportPreviewModal');
    const t = translations[currentLang] || translations['en'];

    modal.style.display = 'flex';
    contentEl.innerHTML = `<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'bn' ? 'স্টেটমেন্ট লোড হচ্ছে...' : 'Loading statement...'}</div>`;

    try {
        titleEl.innerText = t['report-member-statement'] || "Member Statement";

        // Fetch system stats for profit calculation
        const statsSnap = await db.collection('system').doc('stats').get();
        const totalProfit = statsSnap.exists ? (statsSnap.data().totalProfit || 0) : 0;

        // Use cached global savings if available, otherwise fetch
        let totalSavings = _globalSavingsSum;
        if (totalSavings === 0) {
            const users = await db.collection('users').get();
            users.forEach(u => totalSavings += (u.data().savings || 0));
        }

        const userSavings = data.savings || 0;
        const profitPercentage = data.profitPercentage || 100;
        const uJoinDate = data.createdAt ? data.createdAt.toDate() : new Date();
        uJoinDate.setHours(0, 0, 0, 0);

        // Dynamic excluded profit: Profits of all finished investments started before joining
        let excludedProfit = 0;
        const invSnap = await db.collection('investments').where('status', 'in', ['completed', 'withdrawn']).get();
        invSnap.forEach(doc => {
            const inv = doc.data();
            const sDate = inv.date ? new Date(inv.date) : new Date();
            sDate.setHours(0, 0, 0, 0);
            if (sDate < uJoinDate) {
                excludedProfit += (inv.profitAmount || 0);
            }
        });

        let profitShare = 0;
        if (totalSavings > 0) {
            const effectiveProfit = Math.max(0, totalProfit - excludedProfit);
            profitShare = (userSavings / totalSavings) * effectiveProfit * (profitPercentage / 100);
        }

        // Fetch deposits for the history table
        const depsSnap = await db.collection('deposits').where('uid', '==', uid).where('status', '==', 'approved').get();
        const depsList = depsSnap.docs.map(d => d.data()).sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeB - timeA;
        });

        // Dues Calculation for Statement (Using Cache where possible)
        let adminTotal = 0;
        let monthlyPaidCount = 0;
        let extraFound = [];

        if (data.dues) {
            adminTotal = data.dues.admissionPaid || 0;
            monthlyPaidCount = data.dues.monthlyPaidCount || 0;
            extraFound = data.dues.extraTermsPaid || [];
        } else {
            // Legacy Fallback
            depsSnap.forEach(d => {
                const doc = d.data();
                if (doc.type === 'Admission Fee') adminTotal += (doc.amount || 0);
                else if (doc.type === 'Monthly Deposit') monthlyPaidCount++;
                else if (doc.type === 'Extra Deposit') extraFound.push(`${doc.month} ${doc.year}`);
            });
        }

        const today = new Date();
        const currYear = today.getFullYear();
        const currMonIdx = today.getMonth();
        const jYear = joinDate.getFullYear();
        const jMon = joinDate.getMonth();
        const totalMonthsExpected = (currYear - jYear) * 12 + (currMonIdx - jMon) + 1;
        const mDue = Math.max(0, totalMonthsExpected - monthlyPaidCount);
        const admDue = Math.max(0, REQUIRED_ADMISSION_FEE - adminTotal);

        let extraDueList = [];
        let extraDepositDue = false;
        if (currMonIdx >= 5) { // June or later
            extraDepositDue = true;
            const t1Expected = `January-June ${currYear}`;
            if (!extraFound.includes(t1Expected)) extraDueList.push('Term 1 (Jan-Jun)');
        }
        if (currMonIdx >= 11) { // December
            const t2Expected = `July-December ${currYear}`;
            if (!extraFound.includes(t2Expected)) extraDueList.push('Term 2 (Jul-Dec)');
        }

        const hasAnyDue = mDue > 0 || admDue > 0 || extraDueList.length > 0;

        // Generate Deposit History HTML for display
        let depositsHtml = '';
        if (depsList.length > 0) {
            depositsHtml = `
                <div style="margin-top: 25px;">
                    <h3 style="font-size: 1rem; color: var(--primary-color); margin-bottom: 10px; border-bottom: 2px solid var(--primary-color); padding-bottom: 5px;">${t['label-history'] || 'Deposit History'}</h3>
                    <div class="report-table-wrapper">
                        <table class="report-table">
                            <thead>
                                <tr><th>${t['label-month'] || 'Month/Year'}</th><th>${t['label-amount'] || 'Amount'}</th><th>${t['label-date'] || 'Date'}</th><th>${currentLang === 'bn' ? 'রসিদ' : 'Receipt'}</th></tr>
                            </thead>
                            <tbody>
                                ${depsList.map(d => {
                return `<tr>
                    <td>${currentLang === 'bn' ? d.month.replace('January', 'জানুয়ারি').replace('February', 'ফেব্রুয়ারি').replace('March', 'মার্চ').replace('April', 'এপ্রিল').replace('May', 'মে').replace('June', 'জুন').replace('July', 'জুলাই').replace('August', 'আগস্ট').replace('September', 'সেপ্টেম্বর').replace('October', 'অক্টোবর').replace('November', 'নভেম্বর').replace('December', 'ডিসেম্বর') : d.month} ${d.year}</td>
                    <td>Tk ${formatNumber(d.amount).replace('Tk ', '')}</td>
                    <td>${d.date}</td>
                    <td>
                        ${d.receipt ? `<img src="${d.receipt}" class="table-image-thumb" onclick="viewReceiptInStatement('${d.receipt}')">` : `<span style="color:#ccc; font-size:0.75rem;">${t['label-none'] || 'None'}</span>`}
                    </td>
                </tr>`;
            }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            depositsHtml = `<p style="margin-top:20px; color:var(--text-muted); font-size: 0.9rem;">${currentLang === 'bn' ? 'কোনো অনুমোদিত ডিপোজিট পাওয়া যায়নি।' : 'No approved deposits found.'}</p>`;
        }

        const html = `
            <div style="padding: 10px; font-family: 'Inter', 'SolaimanLipi', sans-serif;">
                <!-- Header Section with Photo -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; gap: 20px;">
                    <div style="flex: 1;">
                        <h1 style="color: var(--primary-color); margin: 0; font-size: 1.8rem;">${data.name || 'Member'}</h1>
                        <p style="color: #666; font-size: 0.95rem; margin: 5px 0;">${data.email}</p>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; margin-top: 15px; font-size: 0.9rem;">
                            <span style="color: #888;">${t['label-phone'] || 'Phone'}:</span> <strong>${data.phone || 'N/A'}</strong>
                            <span style="color: #888;">${t['label-join-date'] || 'Join Date'}:</span> <strong>${formatDate(joinDate)}</strong>
                            <span style="color: #888;">${t['label-address'] || 'Address'}:</span> <strong>${data.address || 'N/A'}</strong>
                        </div>
                    </div>
                    
                    <div style="text-align: center; min-width: 120px;">
                        ${data.memberPhoto ?
                `<img src="${data.memberPhoto}" alt="Member" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color); box-shadow: 0 4px 10px rgba(0,0,0,0.1);">` :
                `<div style="width: 100px; height: 100px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc; border: 3px solid #eee;"><i class="fa-solid fa-user fa-3x"></i></div>`
            }
                    </div>
                </div>

                <!-- Financial Summary Cards -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                    <div style="background: var(--primary-color); color: white; padding: 12px; border-radius: 15px; text-align: center;">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">${t['label-total-savings'] || 'Total Savings'}</p>
                        <p style="font-size: 1.4rem; font-weight: 800; margin: 5px 0;">${formatNumber(userSavings)}</p>
                    </div>
                    <div style="background: #10b981; color: white; padding: 12px; border-radius: 15px; text-align: center;">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">${t['label-profit-share'] || 'Profit Share'}</p>
                        <p style="font-size: 1.4rem; font-weight: 800; margin: 5px 0;">Tk ${formatNumber(profitShare.toFixed(2)).replace('Tk ', '')}</p>
                    </div>
                    <div style="background: ${hasAnyDue ? '#ef4444' : '#f0fdf4'}; color: ${hasAnyDue ? 'white' : '#166534'}; padding: 12px; border-radius: 15px; text-align: center; border: 1px solid ${hasAnyDue ? '#ef4444' : '#bbf7d0'};">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">${t['label-status'] || 'Status'}</p>
                        <p style="font-size: 1.1rem; font-weight: 700; margin: 5px 0;">${hasAnyDue ? (t['status-dues'] || 'Dues Pending') : (t['status-regular'] || 'Regular')}</p>
                    </div>
                </div>

                <!-- Outstanding Dues Detail Section -->
                <div style="margin-bottom: 15px; padding: 10px 15px; background: #fffcf2; border: 1px solid #fce7f3; border-radius: 15px;">
                    <h3 style="font-size: 0.9rem; color: #db2777; margin: 0 0 10px 0; border-bottom: 1px solid #fdf2f8; padding-bottom: 5px;">${t['label-outstanding-breakdown'] || 'Outstanding Fees Breakdown'}</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div style="padding: 10px; background: #fef2f2; border-radius: 10px; border: 1px solid #fee2e2;">
                            <p style="font-size: 0.7rem; color: #ef4444; margin: 0; font-weight: 600;">${t['monthly-deposit'] || 'Monthly Deposit'}</p>
                            <p style="font-weight: 700; margin: 3px 0; font-size: 0.9rem;">${mDue > 0 ? mDue + (currentLang === 'bn' ? ' মাস' : ' Months') : (t['label-paid'] || 'Paid')}</p>
                        </div>
                        <div style="padding: 10px; background: #fffbeb; border-radius: 10px; border: 1px solid #fef3c7;">
                            <p style="font-size: 0.7rem; color: #f59e0b; margin: 0; font-weight: 600;">${t['admission-fee'] || 'Admission Fee'}</p>
                            <p style="font-weight: 700; margin: 3px 0; font-size: 0.9rem;">${admDue > 0 ? 'Tk ' + formatNumber(admDue).replace('Tk ', '') : (t['label-paid'] || 'Paid')}</p>
                        </div>
                        <div style="padding: 10px; background: #f5f3ff; border-radius: 10px; border: 1px solid #ede9fe;">
                            <p style="font-size: 0.7rem; color: #8b5cf6; margin: 0; font-weight: 600;">${t['extra-deposit'] || 'Extra Deposit'}</p>
                            <p style="font-weight: 700; margin: 3px 0; font-size: 0.9rem;">${extraDueList.length > 0 ? extraDueList.join(', ') : (extraDepositDue ? (t['label-paid'] || 'Paid') : (currentLang === 'bn' ? 'এখনো বাকি নেই' : 'Not Due Yet'))}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                    <!-- Nominee Section -->
                    <div style="background: #fbfbfb; padding: 15px; border-radius: 15px; border: 1px solid #eee;">
                        <h3 style="font-size: 1rem; color: var(--primary-color); margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${t['label-nominee-info'] || 'Nominee Information'}</h3>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; font-size: 0.9rem;">
                            <span style="color: #888;">${t['label-name'] || 'Name'}:</span> <strong>${data.nominee?.name || 'N/A'}</strong>
                            <span style="color: #888;">${t['label-relation'] || 'Relation'}:</span> <strong>${data.nominee?.relation || 'N/A'}</strong>
                            <span style="color: #888;">${t['label-phone'] || 'Phone'}:</span> <strong>${data.nominee?.phone || 'N/A'}</strong>
                            <span style="color: #888;">${t['label-address'] || 'Address'}:</span> <strong>${data.nominee?.address || 'N/A'}</strong>
                        </div>
                        ${data.nomineePhoto ? `
                        <div style="margin-top: 10px; text-align: center;">
                            <p style="font-size: 0.75rem; color: #888; margin-bottom: 5px;">${currentLang === 'bn' ? 'নমিনীয়ার ছবি' : 'Nominee Photo'}</p>
                            <img src="${data.nomineePhoto}" alt="Nominee" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover; border: 1px solid #ddd;">
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- ID Documents Preview -->
                    <div style="background: #fbfbfb; padding: 15px; border-radius: 15px; border: 1px solid #eee;">
                        <h3 style="font-size: 1rem; color: var(--primary-color); margin-top: 0; margin-bottom: 10px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">${t['label-nid-doc'] || 'ID Document (NID)'}</h3>
                        <div style="text-align: center;">
                            ${data.nidURL ?
                `<img src="${data.nidURL}" alt="NID" style="max-width: 100%; max-height: 180px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">` :
                `<div style="padding: 40px; background: #eee; border-radius: 8px; color: #999;"><i class="fa-solid fa-address-card fa-4x"></i><p style="font-size: 0.8rem; margin-top: 10px;">${currentLang === 'bn' ? 'এনআইডি আপলোড করা হয়নি' : 'No NID Uploaded'}</p></div>`
            }
                        </div>
                    </div>
                </div>

                ${depositsHtml}
            </div>
        `;

        const contentHtml = `
            <div id="statementExportArea" data-theme="light" style="padding: 20px 40px; background: white; color: #1A2D24; width: 800px; margin: 0 auto; font-family: 'Outfit', 'Inter', 'SolaimanLipi', sans-serif;">
                <div style="text-align: center; margin-bottom: 20px; position: relative;">
                    <div style="position: absolute; top: 0; right: 0; font-size: 0.65rem; color: #ccc;">${t['label-member-uid'] || 'Member UID'}: ${uid}</div>
                        <style>@font-face {
                                font-family: 'GrowWestInline'; src: url('${new URL('GrowWestRegular-vm1qA.ttf', window.location.href).href}');
                                font-weight: normal; font-style: normal;
                            }
                        </style>
<div class="logo" style="display: flex; align-items: center; justify-content: center; gap: 6px; font-family: 'GrowWestInline', sans-serif; margin-bottom: 20px;">
<img src="${new URL('logo.png', window.location.href).href}" style="height: 80px; width: auto; object-fit: contain;">
<span style="font-size: 2.5rem; color: #1A2D24; white-space: nowrap; text-transform: lowercase;">Grow Halal</span>
</div>
                    <p style="margin: 5px 0; font-weight: 600; color: #444; letter-spacing: 1.5px; text-transform: uppercase; font-size: 0.8rem;">${t['label-official-report'] || 'Official Member Comprehensive Report'}</p>
                    <div style="width: 80px; height: 4px; background: var(--primary-color); margin: 15px auto;"></div>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 5px;">${t['label-report-date'] || 'Report Date'}: ${new Date().toLocaleString(currentLang === 'bn' ? 'bn-BD' : 'en-US')}</div>
                </div>
                
                <div class="report-table-wrapper" style="border: none;">
                    ${html}
                </div>

                <div style="margin-top: 80px; padding-top: 30px; border-top: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="text-align: left; font-size: 0.75rem; color: #999;">
                        <p style="margin: 2px 0;">${currentLang === 'bn' ? 'এই ডকুমেন্টটি গ্রো হালাল-এর একটি অফিসিয়াল রেকর্ড।' : 'This document is an official record of Grow Halal.'}</p>
                        <p style="margin: 2px 0;">${currentLang === 'bn' ? 'প্রস্তুতকারক (সিস্টেম):' : 'Generated by System:'} ${auth.currentUser.email}</p>
                    </div>
                    </div>
                </div>
            </div>
        `;

        if (downloadOnly) {
            const filename = `Statement_${data.name || 'Member'}_${new Date().toISOString().split('T')[0]}.pdf`;
            await generatePDFFromHTML(contentHtml, filename, t['report-member-audit'] || 'Member Statement');
            return;
        }

        contentEl.innerHTML = contentHtml;

        downloadBtn.onclick = async () => {
            const originalBtnText = downloadBtn.innerHTML;
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'bn' ? 'Ã Â¦ÂÃ Â¦â€¢Ã Â§ÂÃ Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ÂÃ Â¦Å¸ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ÂÃ Â¦â€ºÃ Â§â€¡...' : 'Exporting...'}`;

            const element = document.getElementById('statementExportArea');
            if (!element) return;

            // 1. Reset scroll
            const originalScroll = window.scrollY;
            window.scrollTo(0, 0);

            // Create a dedicated print iframe to bypass popup blockers
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'fixed';
            printFrame.style.right = '0';
            printFrame.style.bottom = '0';
            printFrame.style.width = '0';
            printFrame.style.height = '0';
            printFrame.style.border = '0';
            document.body.appendChild(printFrame);

            const frameDoc = printFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(`
                <html>
                <head>
                    <title>Statement_${data.name || 'Member'}</title>
                    <style>
                        @page { size: auto; margin: 10mm; }
                        body { font-family: 'SolaimanLipi', 'Inter', 'Outfit', sans-serif; padding: 20px; color: #000; }
                        .statement-container { max-width: 100%; margin: 0 auto; }
                        * { background-color: transparent !important; color: #000 !important; visibility: visible !important; box-shadow: none !important; }
                        th { background-color: #f1f5f9 !important; border: 1px solid #cbd5e1; padding: 8px; text-align: left;}
                        td { border: 1px solid #e2e8f0; padding: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <div class="statement-container">
                        ${element.innerHTML}
                    </div>
                </body>
                </html>
            `);
            frameDoc.close();

            // Wait for assets and trigger print
            setTimeout(() => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
                setTimeout(() => document.body.removeChild(printFrame), 1000);
            }, 800);

            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalBtnText;

        };
    } catch (err) {
        console.error("Statement Error:", err);
        alert("Failed to load statement: " + err.message);
    }
};

// --- NATIVE BROWSER PRINT ENGINE ---
window.generatePDFFromHTML = async (html, filename, title = "Report", orientation = 'portrait') => {
    // We use a hidden iframe native browser print API for perfect PDF rendering with Bangla fonts
    // Users can simply select "Save as PDF" in the browser dialog.

    return new Promise((resolve) => {
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const cssOrientation = orientation === 'landscape' ? 'landscape' : 'portrait';
        const frameDoc = printFrame.contentWindow.document;

        frameDoc.open();
        frameDoc.write(`
            <html>
            <head>
                <title>${filename}</title>
                <style>
                    @page { size: auto ${cssOrientation}; margin: 15mm 10mm; }
                    body { 
                        font-family: 'SolaimanLipi', 'Inter', sans-serif; 
                        margin: 0; 
                        padding: 0;
                        color: #000;
                        background: #fff;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    * { visibility: visible !important; color: #000 !important; }
                    
                    .export-header { 
                        text-align: center; 
                        margin-bottom: 25px; 
                        border-bottom: 2px solid #2D5A47; 
                        padding-bottom: 10px; 
                    }
                    .export-header h1 { color: #2D5A47 !important; font-size: 24px; }
                    .export-header p.title { margin: 5px 0; font-size: 14px; color: #333 !important; font-weight: bold; }
                    .export-header p.date { margin: 0; font-size: 10px; color: #666 !important; }
                    
                    .report-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95rem; }
                    .report-table th { background-color: #f1f5f9 !important; border: 1px solid #cbd5e1 !important; padding: 10px; text-align: left; font-weight: bold; }
                    .report-table td { border: 1px solid #e2e8f0 !important; padding: 10px; }
                    @font-face {
                        font-family: 'GrowWestInline';
                        src: url('${new URL('GrowWestRegular-vm1qA.ttf', window.location.href).href}');
                        font-weight: normal;
                        font-style: normal;
                    }
                    .logo {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        height: 60px;
                        width: auto;
                    }
                    .logo span {
                        font-family: 'GrowWestInline', sans-serif;
                        font-size: 2.2rem;
                        color: #2D5A47;
                        letter-spacing: 1px;
                        text-transform: lowercase;
                    }
                </style>
            </head>
            <body>
                <div class="export-header">
                    <div class="logo">
                        <img src="logo.png" alt="Logo">
                        <span>Grow Halal</span>
                    </div>
                    <p class="title">${title.toUpperCase()}</p>
                    <p class="date">${formatDate(new Date())}</p>
                </div>
                ${html}
            </body>
            </html>
        `);
        frameDoc.close();

        // Wait for all assets to load, then trigger print
        setTimeout(() => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(printFrame);
                resolve();
            }, 1000);
        }, 800);
    });
};

window.directDownloadReport = (type) => {
    window.viewReport(type, null, null, true);
};

window.viewReport = async (type, fromDate = null, toDate = null, downloadOnly = false) => {
    currentReportType = type;
    const titleEl = document.getElementById('reportPreviewTitle');
    const contentEl = document.getElementById('reportPreviewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const modal = document.getElementById('reportPreviewModal');
    const filterUI = document.getElementById('reportFilters');
    const t = translations[currentLang] || translations['en'];

    if (!downloadOnly && modal && contentEl) {
        modal.style.display = 'flex';
        contentEl.innerHTML = `<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'bn' ? 'Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ÂÃ Â¦â€ºÃ Â§â€¡...' : 'Loading report...'}</div>`;
    }

    if (['investments', 'expenses'].includes(type) && !downloadOnly && filterUI) {
        filterUI.style.display = 'flex';
    } else if (filterUI) {
        filterUI.style.display = 'none';
    }

    let html = '';
    let reportTitle = '';
    try {
        if (type === 'expenses') {
            reportTitle = t['report-expense-ledger'] || 'Expense Ledger';
            const snap = await db.collection('expenses').get();
            let docs = snap.docs.map(doc => doc.data());
            docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
            if (fromDate || toDate) {
                docs = docs.filter(d => {
                    const dDate = d.date || '';
                    if (fromDate && dDate < fromDate) return false;
                    if (toDate && dDate > toDate) return false;
                    return true;
                });
            }

            if (docs.length === 0) {
                html = `<p style="text-align:center; padding:20px; color:#666;">${currentLang === 'bn' ? 'Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ÂÃ Â¦Â¯ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¨Ã Â¦Â¿' : 'No records found'}</p>`;
            } else {
                html = `<table class="report-table">
                    <thead><tr><th>${t['label-date']}</th><th>${t['label-category']}</th><th>${t['label-description']}</th><th>${t['label-amount']}</th></tr></thead>
                    <tbody>${docs.map(d => `<tr><td>${d.date || '-'}</td><td>${d.category || '-'}</td><td>${d.comment || '-'}</td><td>${formatNumber(d.amount || 0)}</td></tr>`).join('')}</tbody>
                </table>`;
            }
        }
        else if (type === 'master') {
            reportTitle = t['report-financial-audit'] || 'Master Financials';
            const usersSnap = await db.collection('users').get();
            const users = usersSnap.docs.map(u => u.data());
            html = `<table class="report-table">
                <thead><tr><th>${t['label-name']}</th><th>${t['label-total-savings']}</th><th>${t['label-member-profit']}</th><th>${t['label-company-share']}</th></tr></thead>
                <tbody>${users.map(d => {
                const savings = d.savings || 0;
                const profit = (_globalSavingsSum > 0) ? (savings / _globalSavingsSum) * _globalProfitSum * (d.profitPercentage || 100) / 100 : 0;
                const companyScale = (100 - (d.profitPercentage || 100)) / 100;
                const companyShare = (_globalSavingsSum > 0) ? (savings / _globalSavingsSum) * _globalProfitSum * companyScale : 0;
                return `<tr><td>${d.name || '-'}</td><td>${formatNumber(savings)}</td><td style="color:var(--success); font-weight:700;">${formatNumber(profit)}</td><td style="color:var(--primary-color);">${formatNumber(companyShare)}</td></tr>`;
            }).join('')}</tbody>
            </table>`;
        }
        else if (type === 'investments') {
            reportTitle = t['report-investments'] || 'Investment Portfolio';
            const snap = await db.collection('investments').get();
            let docs = snap.docs.map(doc => doc.data());
            docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
            if (fromDate || toDate) {
                docs = docs.filter(d => {
                    const dDate = d.date || '';
                    if (fromDate && dDate < fromDate) return false;
                    if (toDate && dDate > toDate) return false;
                    return true;
                });
            }

            html = `<table class="report-table">
                <thead><tr><th>${t['label-project-name']}</th><th>${t['label-date']}</th><th>${t['label-status']}</th><th>${t['label-invested']}</th><th>${t['label-profit']}</th></tr></thead>
                <tbody>${docs.map(d => {
                const status = (d.status === 'withdrawn' || d.status === 'completed') ? (t['label-completed'] || 'Completed') : (t['label-ongoing'] || 'Ongoing');
                return `<tr><td>${d.sector || '-'}</td><td>${d.date || '-'}</td><td>${status}</td><td>${formatNumber(d.amount || 0)}</td><td style="color:var(--success);">${formatNumber(d.profitAmount || 0)}</td></tr>`;
            }).join('')}</tbody>
            </table>`;
        }
        else if (type === 'members') {
            reportTitle = t['report-member-audit'] || 'Member Audit';
            const snap = await db.collection('users').get();
            html = `<table class="report-table">
                <thead><tr><th>${t['label-name']}</th><th>${t['label-phone']}</th><th>${t['label-email']}</th><th>${t['label-share-pct']}</th><th>${t['label-address']}</th></tr></thead>
                <tbody>${snap.docs.map(doc => {
                const d = doc.data();
                return `<tr><td>${d.name || 'N/A'}</td><td>${d.phone || '-'}</td><td>${d.email}</td><td>${d.profitPercentage || 100}%</td><td>${d.address || '-'}</td></tr>`;
            }).join('')}</tbody>
            </table>`;
        }
        else if (type === 'archived') {
            reportTitle = currentLang === 'bn' ? 'Ã Â¦â€ Ã Â¦Â°Ã Â§ÂÃ Â¦â€¢Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­' : "Deleted Members Archive";
            const snap = await db.collection('archivedMembers').get();
            if (snap.empty) {
                html = `<p style="text-align:center; padding:20px;">Empty Archive</p>`;
            } else {
                html = `<table class="report-table">
                    <thead><tr><th>Date</th><th>Name</th><th>Payout</th></tr></thead>
                    <tbody>${snap.docs.map(doc => {
                    const d = doc.data();
                    const dt = d.deletedAt ? formatDate(d.deletedAt) : 'N/A';
                    return `<tr><td>${dt}</td><td>${d.name || 'N/A'}</td><td>${formatNumber(d.finalPayout || 0)}</td></tr>`;
                }).join('')}</tbody>
                </table>`;
            }
        }
        else if (type === 'deposits') {
            reportTitle = currentLang === 'bn' ? 'à¦¡à¦¿à¦ªà§‹à¦œà¦¿à¦Ÿ à¦²à§‡à¦œà¦¾à¦°' : 'Deposit Ledger';
            const usersSnap = await db.collection('users').get();
            const usersMap = {};
            usersSnap.forEach(u => usersMap[u.id] = u.data());
            const snap = await db.collection('deposits').where('status', '==', 'approved').orderBy('timestamp', 'desc').get();

            if (snap.empty) {
                html = `<p style="text-align:center; padding:20px;">No records</p>`;
            } else {
                const grouped = {};
                snap.forEach(doc => {
                    const d = doc.data();
                    if (!grouped[d.uid]) grouped[d.uid] = [];
                    grouped[d.uid].push(d);
                });

                if (downloadOnly) {
                    let fullHtml = '';
                    const sortedUids = Object.keys(grouped).sort((a, b) => (usersMap[a]?.name || '').localeCompare(usersMap[b]?.name || ''));
                    sortedUids.forEach(uid => {
                        const u = usersMap[uid];
                        const dList = grouped[uid];
                        fullHtml += `<div style="page-break-after:always; margin-bottom:40px;">
                            <h3>${u.name} (${u.email || ''})</h3>
                            <table class="report-table">
                                <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Approved By</th></tr></thead>
                                <tbody>${dList.map(dep => `<tr><td>${dep.date || ''}</td><td>${dep.type || ''}${dep.month ? ` (${dep.month})` : ''}</td><td>${formatNumber(dep.amount || 0)}</td><td>${dep.approvedBy || '-'}</td></tr>`).join('')}</tbody>
                            </table>
                        </div>`;
                    });
                    const filename = `Deposit_Ledger_${new Date().toISOString().split('T')[0]}.pdf`;
                    await generatePDFFromHTML(fullHtml, filename, reportTitle);
                    return;
                }

                window.DEPOSIT_LEDGER_SYSTEM = { users: usersMap, groups: grouped };

                window.renderMemberCardList = () => {
                    const { users, groups } = window.DEPOSIT_LEDGER_SYSTEM;
                    let listHtml = `<div style="padding: 10px;"><div style="display: grid; gap: 15px;">`;
                    Object.keys(groups).forEach(uid => {
                        const user = users[uid] || { name: 'Member' };
                        listHtml += `<div onclick="window.showMemberDepositDetails('${uid}')" class="glass-card" style="padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--glass-border); border-radius: 12px; background: rgba(255,255,255,0.03);">
                            <div><strong>${user.name}</strong><br><small>${user.email || ''}</small></div>
                            <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem;">${groups[uid].length} Deposits</div>
                        </div>`;
                    });
                    return listHtml + `</div></div>`;
                };

                window.showMemberDepositDetails = (uid) => {
                    const { users, groups } = window.DEPOSIT_LEDGER_SYSTEM;
                    const user = users[uid] || { name: 'Member' };
                    const deps = groups[uid];
                    const contentArea = document.getElementById('reportPreviewContent');
                    contentArea.innerHTML = `
                        <div style="padding: 10px;">
                            <button onclick="document.getElementById('reportPreviewContent').innerHTML = window.renderMemberCardList()" class="btn btn-sm" style="margin-bottom:15px;"><i class="fa-solid fa-arrow-left"></i> Back</button>
                            <h3>${user.name}</h3>
                            <table class="report-table">
                                <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Approved By</th></tr></thead>
                                <tbody>${deps.map(d => `<tr><td>${d.date}</td><td>${d.type}${d.month ? ` (${d.month})` : ''}</td><td>${formatNumber(d.amount)}</td><td>${d.approvedBy || '-'}</td></tr>`).join('')}</tbody>
                            </table>
                        </div>`;
                };

                html = window.renderMemberCardList();
            }
        }

        if (downloadOnly) {
            const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
            const orientation = (type === 'members') ? 'landscape' : 'portrait';
            await generatePDFFromHTML(html, filename, reportTitle, orientation);
            return;
        }

        if (titleEl) titleEl.innerText = reportTitle;
        if (contentEl) contentEl.innerHTML = `<div style="padding:10px;"><div class="report-table-wrapper">${html}</div></div>`;

        if (downloadBtn) {
            downloadBtn.onclick = async () => {
                const originalBtnText = downloadBtn.innerHTML;
                downloadBtn.disabled = true;
                downloadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'bn' ? 'Ã Â¦ÂÃ Â¦â€¢Ã Â§ÂÃ Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ÂÃ Â¦Å¸ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ÂÃ Â¦â€ºÃ Â§â€¡...' : 'Exporting...'}`;
                const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
                const orientation = (type === 'members') ? 'landscape' : 'portrait';
                await generatePDFFromHTML(contentEl.innerHTML, filename, reportTitle, orientation);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;
            };
        }

    } catch (error) {
        console.error("Report Error:", error);
        if (contentEl) contentEl.innerHTML = `<div style="color:red; padding:20px;">Error: ${error.message}</div>`;
    }
};


window.applyReportFilters = () => {
    const fromDate = document.getElementById('reportFromDate').value;
    const toDate = document.getElementById('reportToDate').value;
    viewReport(currentReportType, fromDate || null, toDate || null);
};

window.printCurrentReport = () => {
    const contentEl = document.getElementById('reportPreviewContent');
    const titleEl = document.getElementById('reportPreviewTitle');
    if (contentEl && titleEl) {
        const title = titleEl.innerText;
        const filename = `${currentReportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
        const orientation = (currentReportType === 'members') ? 'landscape' : 'portrait';
        generatePDFFromHTML(contentEl.innerHTML, filename, title, orientation);
    }
};

window.closeReportPreview = () => {
    document.getElementById('reportPreviewModal').style.display = 'none';
};

window.updateUserRole = async () => {
    const email = document.getElementById('targetEmail').value.trim();
    const role = document.getElementById('targetRole').value;
    if (!email) {
        alert("Please enter an email address.");
        return;
    }

    const btn = document.querySelector('#ownerSection button');
    const originalBtnText = btn ? btn.innerText : 'Update Role';
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Updating...';
    }

    try {
        const snap = await db.collection('users').where('email', '==', email).get();
        if (snap.empty) {
            alert("No user found with this email.");
            return;
        }

        const doc = snap.docs[0];
        if (doc.data().email === 'growhalal0@gmail.com') {
            alert("You cannot change the Owner's role.");
            return;
        }

        const updateData = { role };

        // Save granular permissions if role is admin or manager
        if (role === 'admin' || role === 'manager') {
            const checkboxes = document.querySelectorAll('.role-perm-checkbox:checked');
            const permissions = Array.from(checkboxes).map(cb => cb.value);
            updateData.permissions = permissions;
        } else {
            updateData.permissions = firebase.firestore.FieldValue.delete(); // Clear if demoted to member
        }

        await doc.ref.update(updateData);
        alert(`User role updated to ${role} successfully!`);
        document.getElementById('targetEmail').value = '';
    } catch (e) {
        alert("Error updating role: " + e.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = originalBtnText;
        }
    }
};

window.togglePermissionsUI = () => {
    const role = document.getElementById('targetRole').value;
    const ui = document.getElementById('permissionsUI');
    if (role === 'admin' || role === 'manager') {
        ui.style.display = 'block';
    } else {
        ui.style.display = 'none';
    }
};

window.repairAllDuesData = async () => {
    if (!confirm("This will recalculate all member dues and backfill missing 'Approved By' data. Continue?")) return;

    const btn = document.getElementById('repairDuesBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Repairing...`;
    }

    try {
        const usersSnap = await db.collection('users').get();
        const depositsSnap = await db.collection('deposits').where('status', '==', 'approved').get();

        const depositMap = {};
        const updateBatch = db.batch();
        let updateCount = 0;

        // Fetch Owner's Name for backfill (Fallback to specific name if not found)
        let ownerName = "Habibullah Foridi";
        const ownerSnap = await db.collection('users').where('email', '==', 'growhalal0@gmail.com').get();
        if (!ownerSnap.empty) ownerName = ownerSnap.docs[0].data().name || ownerName;

        depositsSnap.forEach(doc => {
            const d = doc.data();
            if (!depositMap[d.uid]) depositMap[d.uid] = [];
            depositMap[d.uid].push(d);

            // Backfill Approved By if missing
            if (!d.approvedBy) {
                updateBatch.update(doc.ref, { approvedBy: ownerName });
                updateCount++;
                if (updateCount >= 450) {
                    // Safe batching logic could be added here if needed, but we'll stick to simple 500 limit for now
                }
            }
        });

        usersSnap.forEach(userDoc => {
            const uid = userDoc.id;
            const deps = depositMap[uid] || [];

            const dues = {
                admissionPaid: 0,
                monthlyPaidCount: 0,
                extraTermsPaid: []
            };

            deps.forEach(d => {
                if (d.type === 'Admission Fee') dues.admissionPaid += (d.amount || 0);
                else if (d.type === 'Monthly Deposit') dues.monthlyPaidCount++;
                else if (d.type === 'Extra Deposit') {
                    const term = `${d.month} ${d.year}`;
                    if (!dues.extraTermsPaid.includes(term)) dues.extraTermsPaid.push(term);
                }
            });

            updateBatch.update(userDoc.ref, { dues: dues });
            updateCount++;
        });

        await updateBatch.commit();
        alert(`Success! Repaired dues for ${usersSnap.size} members and backfilled ${updateCount - usersSnap.size} deposit records.`);
    } catch (e) {
        console.error("Repair Error:", e);
        alert("Repair failed: " + e.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-screwdriver-wrench"></i> Repair Dues`;
        }
    }
};

window.logout = () => auth.signOut();
window.forgotPassword = async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        alert("Please enter your email address in the email field first.");
        return;
    }
    const btn = document.querySelector('.login-links a[onclick="forgotPassword()"]');
    const originalText = btn ? btn.innerText : 'Forgot Password?';
    if (btn) btn.innerText = 'Sending...';

    try {
        await auth.sendPasswordResetEmail(email);
        alert("A password reset link has been sent to your email address. Please check your inbox (and spam folder).");
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        if (btn) btn.innerText = originalText;
    }
};

window.viewReceiptInStatement = (src) => {
    const modal = document.getElementById('receiptModal');
    const img = document.getElementById('receiptImage');
    if (modal && img) {
        img.src = src;
        img.style.display = 'block';
        modal.style.display = 'flex';
    }
};

