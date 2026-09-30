const admin = require("firebase-admin");

let bucket = null;

const firebaseConfigured =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET;

if (firebaseConfigured) {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    bucket = admin.storage().bucket();

    console.log("Firebase connected");
} else {
    console.log("Firebase credentials not configured");
}

module.exports = {
    admin,
    bucket
};