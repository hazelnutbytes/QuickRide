const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

const adminApp = initializeApp({
    credential: cert(serviceAccount)
});

const auth = getAuth(adminApp);

console.log("Firebase connected");

module.exports = {
    adminApp,
    auth
};