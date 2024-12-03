// auth.js

// Variable to hold the secret key
let secretKey = prompt("Please enter your secret key:"); // Prompt for the secret key
let currentUser_Id = "currently non"; // Placeholder for the current user's ID

// Encrypt data
function encryptData(data) {
    try {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
}

// Decrypt data
function decryptData(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

// Function to authenticate user and set currentUser Id
async function authenticateUser () {
    const username = prompt("Please enter your username:");
    const encryptedUsername = encryptData(username);

    const usersSnapshot = await db.collection('users').where('username', '==', encryptedUsername).get();
    if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        currentUser_Id = userDoc.id; // Set the current user ID
        console.log("User  authenticated:", username);
    } else {
        alert("Authentication failed. Please check your username.");
    }
}

// Call authenticateUser  when the script loads
window.onload = async () => {
    await authenticateUser ();
};