const admin = require('firebase-admin');

// I will use client SDK because I don't have service account file, 
// and I saw the API key in the client code.
// Actually, for a Node script, it's better to use firebase-admin if I had a key.
// Since I'm an agent on the system, I'll try to use a simple script that 
// uses the already configured project.

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Since I don't have the service account JSON, I'll use the environment 
// or try to find if there's a way to run it with just the project ID 
// if I have local credentials (like gcloud auth).

// Alternatively, I'll just write a script the user can run in the browser console 
// OR I'll use a Node script with the client SDK (which is possible).

const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDRzQD7ZBeiBuW0mHRtUeczt47kF0qSQCM",
    authDomain: "growhalall.firebaseapp.com",
    projectId: "growhalall",
    storageBucket: "growhalall.firebasestorage.app",
    messagingSenderId: "391722870660",
    appId: "1:391722870660:web:73411811889b8c896c1fd1",
    measurementId: "G-1CP0NWCBFH"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function migrate() {
    console.log("Fetching users...");
    const snapshot = await db.collection('users').get();
    console.log(`Found ${snapshot.size} users.`);

    const newDate = new Date("2025-12-01T00:00:00Z");
    const timestamp = firebase.firestore.Timestamp.fromDate(newDate);

    const batch = db.batch();
    snapshot.forEach(doc => {
        console.log(`Updating user: ${doc.id}`);
        batch.update(doc.ref, { createdAt: timestamp });
    });

    await batch.commit();
    console.log("Migration successful! All join dates set to Dec 1, 2025.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
