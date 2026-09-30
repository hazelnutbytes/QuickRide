const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("../../firebase-service-account.json");

const adminApp = initializeApp({
    credential: cert(serviceAccount)
});

const auth = getAuth(adminApp);

console.log("Firebase connected");

module.exports = {
    adminApp,
    auth
};