// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRzQD7ZBeiBuW0mHRtUeczt47kF0qSQCM",
    authDomain: "growhalall.firebaseapp.com",
    projectId: "growhalall",
    storageBucket: "growhalall.firebasestorage.app",
    messagingSenderId: "391722870660",
    appId: "1:391722870660:web:73411811889b8c896c1fd1",
    measurementId: "G-1CP0NWCBFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// Login Logic
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success
                const user = userCredential.user;
                console.log("Logged in:", user.email);
                checkUserRole(user.uid);
            })
            .catch((error) => {
                loginError.style.display = 'block';
                loginError.innerText = "লগইন ব্যর্থ হয়েছে: " + error.message;
            });
    });
}

// Role Based Redirection
async function checkUserRole(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            const role = doc.data().role;
            switch (role) {
                case 'owner':
                    window.location.href = 'owner.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                case 'manager':
                case 'member':
                    window.location.href = 'dashboard.html';
                    break;
                default:
                    window.location.href = 'dashboard.html';
            }
        } else {
            // Default role or setup user
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error("Error getting user role:", error);
    }
}

// Global Auth Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname.endsWith('login.html')) {
            checkUserRole(user.uid);
        }
    } else {
        // User is signed out
        if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Logout Helper
window.logout = function () {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
};
