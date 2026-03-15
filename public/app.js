// Firebase Configuration
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
        'login-back': '← Back to Home',
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
        'desc-expense': 'Full registry of all system expenditures and costs.',
        'desc-financial': 'Complete audit of total savings, balances, and profits.',
        'desc-investments': 'Detailed history of all active and completed projects.',
        'desc-member': 'Full member database including Nominees and Document links.',
        // Profile & Others
        'modal-profile': 'Member Profile',
        'btn-download-pdf': 'Download PDF',
        'modal-edit-profile': 'Edit Profile',
        'modal-withdraw': 'Withdraw Project',
        'modal-project-details': 'Project Details',
        'label-withdraw-total': 'Total Returned (Capital + Profit)',
        'label-profit': 'Calculated Profit',
        'label-category': 'Category',
        'btn-confirm-withdraw': 'Confirm Withdrawal'
    },
    'bn': {
        // Sidebar
        'menu-dashboard': 'ড্যাশবোর্ড',
        'menu-add-member': 'সদস্যযোগ',
        'menu-approvals': 'অনুমোদন',
        'menu-investments': 'বিনিয়োগ',
        'menu-announcements': 'ঘোষণা',
        'menu-expenses': 'খরচ',
        'menu-directory': 'সদস্য তালিকা',
        'menu-permissions': 'পারমিশন',
        'menu-reports': 'রিপোর্ট কেবিনেট',
        'menu-support': 'সাপোর্ট',
        'menu-whatsapp': 'হোয়াটসঅ্যাপ গ্রুপ',
        'menu-signout': 'লগ আউট',
        'menu-add-fund': 'এড ফান্ড',
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
        'label-type': 'জমার ধরণ',
        'label-year': 'বছর',
        'label-amount': 'পরিমাণ',
        'label-ref': 'রেফারেন্স / নোট',
        'label-receipt': 'রিসিট (ঐচ্ছিক)',
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
        'report-expense-ledger': 'ব্যয় লেজার',
        'report-financial-audit': 'মাস্টার ফিনান্সিয়াল',
        'report-investments': 'বিনিয়োগ পোর্টফোলিও',
        'report-member-audit': 'সদস্য অডিট',
        'desc-expense': 'সিস্টেমের সমস্ত ব্যয় এবং খরচের সম্পূর্ণ রেজিস্ট্রি।',
        'desc-financial': 'মোট সঞ্চয়, ব্যালেন্স এবং লাভের সম্পূর্ণ অডিট।',
        'desc-investments': 'সমস্ত চলমান এবং সম্পন্ন প্রকল্পের বিস্তারিত ইতিহাস।',
        'desc-member': 'নমিনী এবং ডকুমেন্ট লিঙ্ক সহ সম্পূর্ণ সদস্য ডাটাবেস।',
        // Profile & Others
        'modal-profile': 'সদস্য প্রোফাইল',
        'btn-download-pdf': 'পিডিএফ ডাউনলোড',
        'modal-edit-profile': 'প্রোফাইল সম্পাদনা',
        'modal-withdraw': 'প্রজেক্ট উত্তোলন',
        'modal-project-details': 'প্রজেক্ট বিবরণ',
        'label-withdraw-total': 'মোট ফেরত (মূলধন + লাভ)',
        'label-profit': 'হিসাবকৃত লাভ',
        'label-category': 'ধরণ/বিভাগ',
        'btn-confirm-withdraw': 'উত্তোলন নিশ্চিত করুন'
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
    const sections = ['mainDashboard', 'approvalSection', 'ownerSection', 'manageInvestSection', 'annoPostSection', 'roleSection', 'expenseSection', 'reportSection'];
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
    if (email === 'growhalal0@gmail.com') {
        userRole = 'owner';
        await db.collection('users').doc(uid).set({ email, role: 'owner' }, { merge: true });
        if (window.location.pathname.endsWith('login.html')) window.location.href = 'dashboard.html';
        return;
    }

    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
        userRole = doc.data().role || 'member';
        if (window.location.pathname.endsWith('login.html')) window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

// --- DASHBOARD LOGIC ---

// Utility for number formatting
const formatNumber = (num) => {
    return 'Tk ' + Number(num).toLocaleString('en-IN');
};

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
    // 1. Personal User Data
    db.collection('users').doc(user.uid).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('totalBalance').innerText = formatNumber(data.savings || 0);
            const totalInvestEl = document.getElementById('totalInvestments');
            if (totalInvestEl && data.investmentsTotal) {
                totalInvestEl.innerText = formatNumber(data.investmentsTotal);
            }

            // Set Personalized Welcome
            const firstName = (data.name || '').split(' ')[0] || 'Member';
            document.getElementById('welcomeUser').innerText = `Hi, ${firstName}`;

            userRole = data.role || 'member';
            if (user.email && user.email.toLowerCase() === 'growhalal0@gmail.com') userRole = 'owner';

            // --- STRICT RBAC LOGIC ---
            // 1. Always Visible to Everyone
            ['menuInvestments', 'menuExpenses', 'menuUsers'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'flex';
            });

            // 2. Owner-Controlled Access (Restricted Items)
            // Add Member, Approvals, Post Announcements, Permissions, Reports
            const restrictedPerms = ['menuAddMember', 'menuApprovals', 'menuAnnouncements', 'menuRoles', 'menuReports'];
            restrictedPerms.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    // Visible if Owner OR explicitly granted in data.permissions
                    const hasExplicitPerm = data.permissions && data.permissions.includes(id);
                    el.style.display = (userRole === 'owner' || hasExplicitPerm) ? 'flex' : 'none';
                }
            });

            // 3. Admin/Manager Controls inside sections
            // Show/Hide Admin Controls in Investments Section
            const invControls = document.getElementById('adminInvestmentControls');
            if (invControls) {
                // Keep access for Owner, and those with explicit Permissions menu access
                const hasInvestPerm = data.permissions && data.permissions.includes('menuInvestments');
                invControls.style.display = (userRole === 'owner' || hasInvestPerm) ? 'block' : 'none';
            }

            // Show/Hide Add Expense button
            const addExpBtn = document.getElementById('addExpenseBtn');
            if (addExpBtn) {
                // Owner has it, others need explicit "menuExpenses" permission to add
                const hasExpPerm = data.permissions && data.permissions.includes('menuExpenses');
                addExpBtn.style.display = (userRole === 'owner' || hasExpPerm) ? 'block' : 'none';
            }

            // --- END STRICT RBAC ---

            // 4. Trigger data loads
            if (userRole !== 'member') loadPendingDeposits();
            loadAllUsers(); // Directory is now public
            loadManageInvestments();
            loadExpenses();
        } else {
            // Fallback: If Owner logs in but profile is missing, create it.
            if (user.email && user.email.toLowerCase() === 'growhalal0@gmail.com') {
                const ownerData = {
                    uid: user.uid,
                    email: user.email,
                    name: 'Owner',
                    role: 'owner',
                    savings: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                db.collection('users').doc(user.uid).set(ownerData);
                document.getElementById('welcomeUser').innerText = "Hi, Owner";
            } else {
                document.getElementById('welcomeUser').innerText = "Hi, Member";
            }
        }
    }, (error) => {
        console.error("User profile listener error:", error);
    });

    // 2. Global Totals (Aggregated Savings)
    db.collection('users').onSnapshot((snapshot) => {
        let globalSavings = 0;
        snapshot.forEach(doc => {
            globalSavings += (doc.data().savings || 0);
        });
        document.getElementById('totalSavings').innerText = formatNumber(globalSavings);
    });

    // 3. Global System Profit
    db.collection('system').doc('stats').onSnapshot((doc) => {
        const el = document.getElementById('totalProfit');
        if (el) {
            el.innerText = formatNumber(doc.exists ? (doc.data().totalProfit || 0) : 0);
        }
    });

    // 4. Global Current Investments Stat (Sum of active investments)
    db.collection('investments').where('status', '==', 'active').onSnapshot((snapshot) => {
        let totalActive = 0;
        snapshot.forEach(doc => {
            totalActive += (doc.data().amount || 0);
        });
        const el = document.getElementById('totalInvestments');
        if (el) el.innerText = formatNumber(totalActive);
    });
}

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
            // 1. Create User in Secondary Auth (so we don't log out)
            const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
            const newUser = userCredential.user;

            // 2. Save detailed profile to Firestore
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
                investmentsCount: 0,
                nominee: {
                    name: document.getElementById('nomName').value || 'N/A',
                    relation: document.getElementById('nomRelation').value || 'N/A',
                    phone: document.getElementById('nomPhone').value || 'N/A',
                    address: document.getElementById('nomAddress').value || 'N/A'
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
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

window.openDepositAmount = () => {
    const type = document.getElementById('depType').value;
    const amountInput = document.getElementById('depAmount');
    if (type === 'Admission Fee') amountInput.value = 10000;
    else if (type === 'Monthly Deposit') amountInput.value = 1000;
    else if (type === 'Extra Deposit') amountInput.value = 1500;
    else amountInput.value = '';
};
// updateDepositAmount is identical — single function handles both
window.updateDepositAmount = window.openDepositAmount;

window.openDepositModal = () => depositModal.style.display = 'flex';
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
        btn.disabled = true;
        btn.innerText = 'Submitting...';

        try {
            const receiptFile = document.getElementById('depReceipt').files[0];
            let receiptBase64 = null;
            if (receiptFile) {
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Receipt...';
                receiptBase64 = await compressAndConvertToBase64(receiptFile);
            }

            const depositData = {
                uid: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                userEmail: currentUser.email,
                date: document.getElementById('depDate').value,
                month: document.getElementById('depMonth').value,
                year: document.getElementById('depYear').value,
                type: document.getElementById('depType').value,
                amount: parseFloat(document.getElementById('depAmount').value),
                reference: document.getElementById('depRef').value,
                receipt: receiptBase64,
                status: 'pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('deposits').add(depositData);
            alert("Deposit submitted! Waiting for manager approval.");
            closeDepositModal();
            depositForm.reset();
        } catch (error) {
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
        if (snapshot.empty) {
            list.innerHTML = '<p style="color: var(--text-muted);">No pending deposits.</p>';
            return;
        }

        list.innerHTML = snapshot.docs.map(doc => {
            const d = doc.data();
            return `
                <div class="glass-card" style="padding: 15px; margin-bottom: 10px; border-radius: 12px; background: rgba(0,0,0,0.2);">
                    <p><strong>${d.userName}</strong> requested <span style="color:var(--primary-color);">Tk${d.amount}</span></p>
                    <p style="font-size: 0.75rem; margin-top: 5px;">Type: ${d.type || 'N/A'} | Ref: ${d.reference || 'N/A'} | ${d.month} ${d.year}</p>
                    ${d.receipt ? `
                        <div style="margin-top: 10px;">
                            <button onclick="viewReceipt('${doc.id}')" class="btn btn-link" style="font-size: 0.75rem; padding: 0; color: #fbbf24; text-decoration: underline;">
                                <i class="fa-solid fa-image"></i> View Receipt
                            </button>
                        </div>
                    ` : ''}
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button onclick="approveDeposit('${doc.id}', '${d.uid}', ${d.amount})" class="btn btn-primary" style="padding: 5px 15px; font-size: 0.8rem;">Approve</button>
                        <button onclick="rejectDeposit('${doc.id}')" class="btn btn-link" style="color: var(--error);">Reject</button>
                    </div>
                </div>
            `;
        }).join('');
    });
}

window.approveDeposit = async (id, uid, amount) => {
    if (!confirm("Are you sure you want to approve this deposit?")) return;
    try {
        const userRef = db.collection('users').doc(uid);
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            let currentBalance = userDoc.exists ? (userDoc.data().balance || 0) : 0;
            let currentSavings = userDoc.exists ? (userDoc.data().savings || 0) : 0;
            transaction.update(userRef, {
                balance: currentBalance + amount,
                savings: currentSavings + amount
            });
            transaction.update(db.collection('deposits').doc(id), { status: 'approved' });
        });
        alert("Deposit approved!");
    } catch (error) {
        alert("Approval failed: " + error.message);
    }
};

window.rejectDeposit = async (id) => {
    if (confirm("Reject?")) await db.collection('deposits').doc(id).update({ status: 'rejected' });
};

// --- OWNER & AUDIT MANAGEMENT ---

function loadAllUsers() {
    db.collection('users').onSnapshot(async (snapshot) => {
        const list = document.getElementById('allUsersList');
        const countEl = document.getElementById('totalMembersCount');
        if (countEl) countEl.innerText = snapshot.size;

        if (snapshot.empty) { list.innerHTML = 'No users.'; return; }

        const depositsSnapshot = await db.collection('deposits').where('status', '==', 'approved').get();
        const depositsByEmail = {};
        depositsSnapshot.forEach(doc => {
            const d = doc.data();
            if (!depositsByEmail[d.userEmail]) depositsByEmail[d.userEmail] = 0;
            depositsByEmail[d.userEmail]++;
        });

        // Role Priority for sorting
        const roleOrder = { 'owner': 0, 'manager': 1, 'admin': 2, 'member': 3 };

        // Convert to array for sorting
        const userDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        userDocs.sort((a, b) => {
            const roleA = a.role || 'member';
            const roleB = b.role || 'member';
            return (roleOrder[roleA] ?? 10) - (roleOrder[roleB] ?? 10);
        });

        list.innerHTML = '';
        userDocs.forEach(u => {
            const email = u.email;
            const joinDate = u.createdAt ? new Date(u.createdAt.seconds * 1000) : new Date();

            // Dues logic: Simple months since joined check
            const today = new Date();
            const joinYear = joinDate.getFullYear();
            const joinMonth = joinDate.getMonth();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();

            const totalMonthsJoined = (currentYear - joinYear) * 12 + (currentMonth - joinMonth) + 1;
            const depositsCount = depositsByEmail[email] || 0;
            const monthsDue = Math.max(0, totalMonthsJoined - depositsCount);
            const hasDues = monthsDue > 0;

            // Visibility Logic: Hide dues indicator if current user is a regular member and this is NOT their own record
            const isRegularMember = userRole === 'member';
            const isOwnerEmail = email === 'growhalal0@gmail.com';
            const loggedInEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email.toLowerCase().trim() : '';
            const thisUserEmail = email ? email.toLowerCase().trim() : '';
            const isSelf = loggedInEmail === thisUserEmail;

            const showDueIndicator = !isRegularMember || isSelf;

            const row = document.createElement('div');
            row.className = 'member-row';
            row.style.padding = '12px 20px';
            row.onclick = () => openMemberProfile(u.id, u, monthsDue, joinDate);
            row.innerHTML = `
                <div class="member-info" style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    ${(hasDues && showDueIndicator) ? '<span class="due-indicator pulse" title="Payment Due"></span>' : '<span style="width:10px; height:10px; border-radius:50%; background:#e2ede8; display:inline-block;"></span>'}
                    <h4 style="margin:0; font-size: 1rem; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${u.name || 'Unknown'}
                    </h4>
                    <div style="display: flex; gap: 5px; flex-shrink: 0;">
                        ${u.role && u.role !== 'member' ? `<span class="role-badge ${u.role}">${u.role.toUpperCase()}</span>` : ''}
                        ${isOwnerEmail && u.role !== 'owner' ? '<span class="role-badge owner">OWNER</span>' : ''}
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
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; padding-left: 5px;">${jDate.toLocaleDateString()}</p>
                </div>
                <div class="profile-info-item">
                    <label class="form-label">Address</label>
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; padding-left: 5px;">${data.address || 'N/A'}</p>
                </div>
            </div>
        </div>

        ${isRestricted ? '' : `
        <div class="form-section" style="background: var(--bg-light); border: 0;">
            <div class="grid-2">
                <div class="profile-info-item">
                    <label class="form-label">Total Savings</label>
                    <p style="color: var(--primary-color); font-weight: 800; font-size: 1.5rem; padding-left: 5px;">${formatNumber(data.savings || 0)}</p>
                </div>
                <div class="profile-info-item">
                    <label class="form-label">Overdue Months</label>
                    <p style="color: ${monthsDue > 0 ? '#E53E3E' : '#38A169'}; font-weight: 800; font-size: 1.5rem; padding-left: 5px;">${monthsDue} Months</p>
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
            btn.innerText = currentLang === 'bn' ? 'খরচ সংরক্ষণ করুন' : 'Save Expense';
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
// Note: loadAnnouncements() is called inside openAnnouncements() — no need to run it globally on page load.

const investForm = document.getElementById('investForm');
if (investForm) {
    investForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('invDate').value;
        const sector = document.getElementById('invSector').value;
        const medium = document.getElementById('invMedium').value;
        const amount = parseFloat(document.getElementById('invAmount').value);

        try {
            await db.collection('investments').add({
                date,
                sector,
                medium,
                amount,
                status: 'active',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("Investment project added successfully!");
            investForm.reset();
        } catch (error) {
            alert("Error adding investment: " + error.message);
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
                const currentTotalProfit = statsDoc.exists ? (statsDoc.data().totalProfit || 0) : 0;

                // 1. Mark investment as withdrawn
                transaction.update(investRef, {
                    status: 'withdrawn',
                    withdrawnAmount: totalBack,
                    profitAmount: profit,
                    withdrawDate: withdrawDate,
                    withdrawnAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // 2. Update global stats
                if (!statsDoc.exists) {
                    transaction.set(statsRef, { totalProfit: profit });
                } else {
                    transaction.update(statsRef, { totalProfit: currentTotalProfit + profit });
                }
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

window.viewMemberStatement = async (uid, data, monthsDue, joinDate) => {
    const titleEl = document.getElementById('reportPreviewTitle');
    const contentEl = document.getElementById('reportPreviewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const modal = document.getElementById('reportPreviewModal');

    modal.style.display = 'flex';
    contentEl.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading statement...</div>';

    try {
        titleEl.innerText = "Member Statement";

        // Fetch system stats for profit calculation
        const statsSnap = await db.collection('system').doc('stats').get();
        const totalProfit = statsSnap.exists ? (statsSnap.data().totalProfit || 0) : 0;

        const users = await db.collection('users').get();
        let totalSavings = 0;
        users.forEach(u => totalSavings += (u.data().savings || 0));

        const userSavings = data.savings || 0;
        let profitShare = 0;
        if (totalSavings > 0) {
            profitShare = (userSavings / totalSavings) * totalProfit;
        }

        // Fetch deposits (Sorted in memory to avoid index requirement)
        const depsSnap = await db.collection('deposits').where('uid', '==', uid).where('status', '==', 'approved').get();
        const depsList = depsSnap.docs.map(d => d.data()).sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeB - timeA;
        });

        let depositsHtml = '';
        if (depsList.length > 0) {
            depositsHtml = `
                <div style="margin-top: 25px;">
                    <h3 style="font-size: 1rem; color: var(--primary-color); margin-bottom: 10px; border-bottom: 2px solid var(--primary-color); padding-bottom: 5px;">Deposit History</h3>
                    <div class="report-table-wrapper">
                        <table class="report-table">
                            <thead>
                                <tr><th>Month/Year</th><th>Amount</th><th>Date</th><th>Receipt</th></tr>
                            </thead>
                            <tbody>
                                ${depsList.map(d => {
                return `<tr>
                    <td>${d.month} ${d.year}</td>
                    <td>Tk ${formatNumber(d.amount).replace('Tk ', '')}</td>
                    <td>${d.date}</td>
                    <td>
                        ${d.receipt ? `<img src="${d.receipt}" class="table-image-thumb" onclick="viewReceiptInStatement('${d.receipt}')">` : '<span style="color:#ccc; font-size:0.75rem;">None</span>'}
                    </td>
                </tr>`;
            }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            depositsHtml = '<p style="margin-top:20px; color:var(--text-muted); font-size: 0.9rem;">No approved deposits found.</p>';
        }

        const html = `
            <div style="padding: 10px; font-family: 'Inter', sans-serif;">
                <!-- Header Section with Photo -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; gap: 20px;">
                    <div style="flex: 1;">
                        <h1 style="color: var(--primary-color); margin: 0; font-size: 1.8rem;">${data.name || 'Member'}</h1>
                        <p style="color: #666; font-size: 0.95rem; margin: 5px 0;">${data.email}</p>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; margin-top: 15px; font-size: 0.9rem;">
                            <span style="color: #888;">Phone:</span> <strong>${data.phone || 'N/A'}</strong>
                            <span style="color: #888;">Join Date:</span> <strong>${joinDate instanceof Date ? joinDate.toLocaleDateString() : 'N/A'}</strong>
                            <span style="color: #888;">Address:</span> <strong>${data.address || 'N/A'}</strong>
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
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                    <div style="background: var(--primary-color); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">Total Savings</p>
                        <p style="font-size: 1.4rem; font-weight: 800; margin: 5px 0;">${formatNumber(userSavings)}</p>
                    </div>
                    <div style="background: #10b981; color: white; padding: 20px; border-radius: 15px; text-align: center;">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">Profit Share</p>
                        <p style="font-size: 1.4rem; font-weight: 800; margin: 5px 0;">Tk ${formatNumber(profitShare.toFixed(2)).replace('Tk ', '')}</p>
                    </div>
                    <div style="background: ${monthsDue > 0 ? '#ef4444' : '#f0fdf4'}; color: ${monthsDue > 0 ? 'white' : '#166534'}; padding: 20px; border-radius: 15px; text-align: center; border: 1px solid ${monthsDue > 0 ? '#ef4444' : '#bbf7d0'};">
                        <p style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; margin: 0;">Status</p>
                        <p style="font-size: 1.1rem; font-weight: 700; margin: 5px 0;">${monthsDue > 0 ? `${monthsDue} Months Pending` : 'Regular Member'}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <!-- Nominee Section -->
                    <div style="background: #fbfbfb; padding: 20px; border-radius: 15px; border: 1px solid #eee;">
                        <h3 style="font-size: 1rem; color: var(--primary-color); margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Nominee Information</h3>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; font-size: 0.9rem;">
                            <span style="color: #888;">Name:</span> <strong>${data.nominee?.name || 'N/A'}</strong>
                            <span style="color: #888;">Relation:</span> <strong>${data.nominee?.relation || 'N/A'}</strong>
                            <span style="color: #888;">Phone:</span> <strong>${data.nominee?.phone || 'N/A'}</strong>
                            <span style="color: #888;">Address:</span> <strong>${data.nominee?.address || 'N/A'}</strong>
                        </div>
                        ${data.nomineePhoto ? `
                        <div style="margin-top: 15px; text-align: center;">
                            <p style="font-size: 0.75rem; color: #888; margin-bottom: 5px;">Nominee Photo</p>
                            <img src="${data.nomineePhoto}" alt="Nominee" style="width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 1px solid #ddd;">
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- ID Documents Preview -->
                    <div style="background: #fbfbfb; padding: 20px; border-radius: 15px; border: 1px solid #eee;">
                        <h3 style="font-size: 1rem; color: var(--primary-color); margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">ID Document (NID)</h3>
                        <div style="text-align: center;">
                            ${data.nidURL ?
                `<img src="${data.nidURL}" alt="NID" style="max-width: 100%; max-height: 250px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">` :
                `<div style="padding: 40px; background: #eee; border-radius: 8px; color: #999;"><i class="fa-solid fa-address-card fa-4x"></i><p style="font-size: 0.8rem; margin-top: 10px;">No NID Uploaded</p></div>`
            }
                        </div>
                    </div>
                </div>

                ${depositsHtml}
            </div>
        `;

        const contentHtml = `
            <div id="statementExportArea" style="padding: 40px; background: white; width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 40px; position: relative;">
                    <div style="position: absolute; top: 0; right: 0; font-size: 0.65rem; color: #ccc;">Member UID: ${uid}</div>
                    <h1 style="color: var(--primary-color); margin: 0; text-transform: uppercase; letter-spacing: 4px; font-size: 2.5rem; font-weight: 800;">GROW HALAL</h1>
                    <p style="margin: 5px 0; font-weight: 600; color: #444; letter-spacing: 1.5px; text-transform: uppercase; font-size: 0.8rem;">Official Member Comprehensive Report</p>
                    <div style="width: 80px; height: 4px; background: var(--primary-color); margin: 15px auto;"></div>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 5px;">Report Date: ${new Date().toLocaleString()}</div>
                </div>
                
                <div class="report-table-wrapper" style="border: none;">
                    ${html}
                </div>

                <div style="margin-top: 80px; padding-top: 30px; border-top: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="text-align: left; font-size: 0.75rem; color: #999;">
                        <p style="margin: 2px 0;">This document is an official record of Grow Halal.</p>
                        <p style="margin: 2px 0;">Generated by System: ${auth.currentUser.email}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="width: 150px; border-top: 1px solid #333; margin-bottom: 5px;"></div>
                        <p style="font-size: 0.8rem; font-weight: 700; margin: 0;">Authorized Signature</p>
                    </div>
                </div>
            </div>
        `;
        contentEl.innerHTML = contentHtml;

        downloadBtn.onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            });

            const originalBtnText = downloadBtn.innerHTML;
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';

            try {
                // Header
                doc.setTextColor(45, 90, 71);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(24);
                doc.text("GROW HALAL", 105, 20, { align: 'center' });

                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                doc.text("OFFICIAL MEMBER COMPREHENSIVE REPORT", 105, 26, { align: 'center' });
                doc.setDrawColor(45, 90, 71);
                doc.setLineWidth(1);
                doc.line(80, 28, 130, 28);

                // Meta Info
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`UID: ${uid}`, 190, 15, { align: 'right' });
                doc.text(`Report Date: ${new Date().toLocaleString()}`, 105, 34, { align: 'center' });

                // Section: Personal Details
                doc.setFontSize(12);
                doc.setTextColor(45, 90, 71);
                doc.text("Member Information", 15, 45);
                doc.setDrawColor(230, 230, 230);
                doc.line(15, 47, 195, 47);

                doc.setFontSize(9);
                doc.setTextColor(50, 50, 50);
                doc.setFont("helvetica", "bold");
                doc.text("Full Name:", 15, 55);
                doc.text("Phone:", 15, 62);
                doc.text("Email:", 15, 69);
                doc.text("Address:", 15, 76);

                doc.setFont("helvetica", "normal");
                doc.text(data.name || 'N/A', 40, 55);
                doc.text(data.phone || 'N/A', 40, 62);
                doc.text(data.email || 'N/A', 40, 69);
                doc.text(data.address || 'N/A', 40, 76);

                doc.setFont("helvetica", "bold");
                doc.text("Total Savings:", 110, 55);
                doc.text("Monthly Due:", 110, 62);
                doc.text("Profit Share:", 110, 69);
                doc.text("Status:", 110, 76);

                doc.setFont("helvetica", "normal");
                doc.text(`Tk ${formatNumber(userSavings)}`, 140, 55);
                doc.text(`Tk ${formatNumber(data.monthlyTarget || 1000)}`, 140, 62);
                doc.text(`Tk ${formatNumber(profitShare.toFixed(2))}`, 140, 69);
                doc.text(`${monthsDue > 0 ? 'Pending' : 'Active'}`, 140, 76);

                // Section: Deposit History (Table)
                const tableEl = contentEl.querySelector('table');
                if (tableEl) {
                    doc.autoTable({
                        html: tableEl,
                        startY: 85,
                        theme: 'striped',
                        headStyles: { fillColor: [45, 90, 71], textColor: [255, 255, 255], fontSize: 10 },
                        styles: { fontSize: 8, cellPadding: 2.5 },
                        margin: { left: 15, right: 15 }
                    });
                }

                // Footer
                const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 120) + 20;
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Operator: Habibullah Foridi`, 15, finalY);
                doc.text(`Security Code: GH-MBR-${Date.now().toString(36).toUpperCase()}`, 15, finalY + 4);

                doc.setDrawColor(180, 180, 180);
                doc.line(140, finalY + 5, 190, finalY + 5);
                doc.setTextColor(100, 100, 100);
                doc.text("Authorized Signature", 165, finalY + 10, { align: 'center' });

                doc.save(`Statement_${data.name || 'Member'}.pdf`);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;

            } catch (err) {
                console.error("PDF Export Error:", err);
                alert("Download failed. The system reverted to standard mode.");
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;
            }
        };

    } catch (error) {
        contentEl.innerHTML = `<div style="color:red; padding:20px;">Error: ${error.message}</div>`;
    }
};

let currentReportType = '';

window.viewReport = async (type, fromDate = null, toDate = null) => {
    currentReportType = type;
    const titleEl = document.getElementById('reportPreviewTitle');
    const contentEl = document.getElementById('reportPreviewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const modal = document.getElementById('reportPreviewModal');
    const filterUI = document.getElementById('reportFilters');

    modal.style.display = 'flex';
    contentEl.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading report...</div>';

    if (['investments', 'expenses'].includes(type)) {
        filterUI.style.display = 'flex';
    } else {
        filterUI.style.display = 'none';
    }

    let html = '';
    try {
        if (type === 'expenses') {
            titleEl.innerText = "Expense Ledger";
            let query = db.collection('expenses').orderBy('date', 'desc');
            if (fromDate) query = query.where('date', '>=', fromDate);
            if (toDate) query = query.where('date', '<=', toDate);
            const snap = await query.get();
            html = `
                <table class="report-table">
                    <thead>
                        <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                        ${snap.docs.map(doc => {
                const d = doc.data();
                return `<tr><td>${d.date}</td><td>${d.category}</td><td>${d.comment || '-'}</td><td>Tk ${formatNumber(d.amount).replace('Tk ', '')}</td></tr>`;
            }).join('')}
                    </tbody>
                </table>
            `;
        }
        else if (type === 'master') {
            titleEl.innerText = "Master Financials";
            const statsSnap = await db.collection('system').doc('stats').get();
            const totalProfit = statsSnap.exists ? (statsSnap.data().totalProfit || 0) : 0;
            const users = await db.collection('users').get();
            let totalSavings = 0;
            users.forEach(u => totalSavings += (u.data().savings || 0));
            html = `
                <table class="report-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Savings</th><th>Profit Share</th></tr>
                    </thead>
                    <tbody>
                        ${users.docs.map(u => {
                const d = u.data();
                const userSavings = d.savings || 0;
                let profitShare = 0;
                if (totalSavings > 0) profitShare = (userSavings / totalSavings) * totalProfit;
                return `<tr>
                                <td>${d.name || 'N/A'}</td>
                                <td>${d.email}</td>
                                <td>${d.phone || 'N/A'}</td>
                                <td>Tk ${formatNumber(userSavings).replace('Tk ', '')}</td>
                                <td style="color: #2D5A47; font-weight: 600;">Tk ${formatNumber(profitShare.toFixed(2)).replace('Tk ', '')}</td>
                            </tr>`;
            }).join('')}
                    </tbody>
                </table>
            `;
        }
        else if (type === 'investments') {
            titleEl.innerText = "Investment Portfolio";
            let query = db.collection('investments').orderBy('date', 'desc');
            if (fromDate) query = query.where('date', '>=', fromDate);
            if (toDate) query = query.where('date', '<=', toDate);
            const snap = await query.get();
            html = `
                <table class="report-table">
                    <thead>
                        <tr><th>Project</th><th>Date</th><th>Status</th><th>Invested</th><th>Profit</th></tr>
                    </thead>
                    <tbody>
                        ${snap.docs.map(doc => {
                const d = doc.data();
                const status = (d.status === 'withdrawn' || d.status === 'completed') ? 'Completed' : 'Ongoing';
                return `<tr><td>${d.sector}</td><td>${d.date}</td><td>${status}</td><td>Tk ${d.amount}</td><td>Tk ${d.profitAmount || 0}</td></tr>`;
            }).join('')}
                    </tbody>
                </table>
            `;
        }
        else if (type === 'members') {
            titleEl.innerText = "Member Audit";
            const users = await db.collection('users').get();
            html = `
                <table class="report-table">
                    <thead>
                        <tr><th>Name</th><th>Phone</th><th>Address</th><th>Nominee</th><th>Photos/NID</th></tr>
                    </thead>
                    <tbody>
                        ${users.docs.map(u => {
                const d = u.data();
                const docs = (d.memberPhoto ? '✅ ' : '❌ ') + (d.nidURL ? '🆔 ' : '💨 ');
                return `<tr><td>${d.name || 'N/A'}</td><td>${d.phone || 'N/A'}</td><td>${d.address || 'N/A'}</td><td>${d.nominee?.name || '-'}</td><td>${docs}</td></tr>`;
            }).join('')}
                    </tbody>
                </table>
            `;
        }

        const dateRangeText = (fromDate || toDate) ? `
            <div style="font-size: 0.9rem; margin-bottom: 15px; color: #2D5A47; font-weight: 600;">
                Filtered From: ${fromDate || 'Start'} To: ${toDate || 'Present'}
            </div>
        ` : '';

        const displayHtml = `
            <div style="padding: 20px;">
                <h2 style="color: #2D5A47; text-align: center; margin-bottom: 10px;">${titleEl.innerText}</h2>
                <div style="font-size: 0.8rem; color: #666; text-align: center; margin-bottom: 20px;">Generated on: ${new Date().toLocaleString()}</div>
                ${dateRangeText}
                <div class="report-table-wrapper">
                    ${html}
                </div>
            </div>
        `;

        contentEl.innerHTML = displayHtml;

        downloadBtn.onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: type === 'members' ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const originalBtnText = downloadBtn.innerHTML;
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';

            try {
                // Header
                doc.setTextColor(45, 90, 71);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(26);
                const centerX = type === 'members' ? 148.5 : 105;
                doc.text("GROW HALAL", centerX, 20, { align: 'center' });

                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text("OFFICIAL SYSTEM REPORT", centerX, 26, { align: 'center' });

                // Report Title
                doc.setFontSize(16);
                doc.setTextColor(30, 30, 30);
                doc.text(titleEl.innerText, centerX, 40, { align: 'center' });

                doc.setFontSize(9);
                doc.text(`Generated: ${new Date().toLocaleString()}`, centerX, 46, { align: 'center' });

                const tableEl = contentEl.querySelector('table');
                if (tableEl) {
                    doc.autoTable({
                        html: tableEl,
                        startY: 55,
                        theme: 'grid',
                        headStyles: { fillColor: [45, 90, 71], textColor: [255, 255, 255] },
                        styles: { fontSize: 8, cellPadding: 2 },
                        margin: { left: 15, right: 15 }
                    });
                }

                // Footer
                const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 100) + 15;
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Operator: Habibullah Foridi`, 15, finalY);
                doc.text(`Security ID: GH-RPT-${Date.now().toString(36).toUpperCase()}`, 15, finalY + 4);

                doc.save(`${type}_report_${new Date().toISOString().split('T')[0]}.pdf`);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;

            } catch (err) {
                console.error("PDF Error:", err);
                alert("Download failed. Standard export failed.");
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;
            }
        };

    } catch (error) {
        contentEl.innerHTML = `<div style="color:red; padding:20px;">Error: ${error.message}</div>`;
    }
};

window.applyReportFilters = () => {
    const fromDate = document.getElementById('reportFromDate').value;
    const toDate = document.getElementById('reportToDate').value;
    viewReport(currentReportType, fromDate || null, toDate || null);
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

window.logout = () => auth.signOut();
window.forgotPassword = async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        alert("Please enter your email address in the email field first.");
        return;
    }
    try {
        await auth.sendPasswordResetEmail(email);
        alert("A password reset link has been sent to your email address. Please check your inbox (and spam folder).");
    } catch (error) {
        alert("Error: " + error.message);
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

