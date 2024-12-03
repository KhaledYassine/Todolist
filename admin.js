// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCrfC2qCwwb2P0o3H-kd5BA1ceOTvl9_To",
    authDomain: "todolist-cd6e4.firebaseapp.com",
    projectId: "todolist-cd6e4",
    storageBucket: "todolist-cd6e4.firebasestorage.app",
    messagingSenderId: "868566633542",
    appId: "1:868566633542:web:c24a84c188bdfa64a74e47",
    databaseURL: "todolist-cd6e4.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get references to HTML elements
const usernameInput = document.getElementById('usernameInput');
const addUser_Btn = document.getElementById('addUser Btn');
const userList = document.getElementById('userList');
const secretKeyInput = document.getElementById('secretKey');

// Function to fetch users from Firestore
async function fetchUsers() {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
        users.push({ id: doc.id, username: doc.data().username, secretKey: doc.data().secretKey });
    });
    return users;
}

// Function to add a new user to Firestore
async function addUser (username, secretKey) {
    const encryptedUsername = encryptData(username); // Encrypt the username
    const encryptedSecretKey = encryptData(secretKey); // Encrypt the secret key
    await db.collection('users').add({
        username: encryptedUsername,
        secretKey: encryptedSecretKey,
        true_username: username, // Optional: Store the true username
        true_secretKey: secretKey // Optional: Store the true secret key
    });
}

// Function to delete a user from Firestore
async function deleteUser (userId) {
    await db.collection('users').doc(userId).delete();
}

// Function to load users when the page loads
window.onload = async () => {
    await loadUsers();
};

// Function to display users in the table
async function loadUsers() {
    const users = await fetchUsers();
    userList.innerHTML = ''; // Clear the list before adding new users

    users.forEach(user => {
        const tr = document.createElement('tr');

        // Create cells for user details
        const usernameCell = document.createElement('td');
        usernameCell.textContent = decryptData(user.username); // Decrypt the username
        
        const secretKeyCell = document.createElement('td');
        secretKeyCell.textContent = decryptData(user.secretKey); // Decrypt the secret key
        
        

        // Create actions cell
        const actionsCell = document.createElement('td');

        // Create a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.onclick = async () => {
            await deleteUser (user.id);
            loadUsers(); // Refresh the user list
        };

        actionsCell.appendChild(deleteBtn);

        // Append cells to the row
        tr.appendChild(usernameCell);
        tr.appendChild(secretKeyCell);
        tr.appendChild(actionsCell);

        // Append the row to the user list
        userList.appendChild(tr);
    });
}

// Add event listener to the add user button
addUser_Btn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const secretKey = secretKeyInput.value.trim();
    if (username && secretKey) { // Ensure both fields are filled
        await addUser (username, secretKey);
        usernameInput.value = ''; // Clear the input field
        secretKeyInput.value = ''; // Clear the input field
        loadUsers(); // Refresh the user list
    }
});

// Function to encrypt data using CryptoJS
function encryptData(data) {
    const encrypted = CryptoJS.AES.encrypt(data, 'your_secret_key'); // Replace with your actual secret key
    return encrypted.toString();
}

// Function to decrypt data using CryptoJS
function decryptData(encrypted) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, 'your_secret_key'); // Replace with your actual secret key
    return decrypted.toString(CryptoJS.enc.Utf8);
}