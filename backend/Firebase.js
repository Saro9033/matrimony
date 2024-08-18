const admin = require('firebase-admin');
var serviceAccount = require("./Firebase-admin-sdk.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET_NAME
});

const storage = admin.storage();
const bucket = storage.bucket();

module.exports = bucket;
