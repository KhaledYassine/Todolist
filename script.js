// Initialize Firebase
const firebaseConfig = {
<<<<<<< HEAD
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
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Variable to hold the secret key

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
    return bytes.toString(CryptoJS.enc .Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// Function to fetch tasks from Firestore
async function fetchTasks() {
  const tasksSnapshot = await db.collection('todos').get();
  const tasks = [];
  tasksSnapshot.forEach(doc => {
    const taskData = doc.data();
    let taskText = taskData.task;

    // Decrypt if the task is private
    if (taskData.task_ownership === 'private') {
      taskText = decryptData(taskData.task);
      if (!taskText) {
        taskText = "Hidden-task"; // Fallback for decryption failure
      }
    }

    tasks.push({ id: doc.id, task: taskText, completed: taskData.completed, ownership: taskData.task_ownership });
  });
  return tasks;
}

// Function to add a new task to Firestore
// Function to add a new task to Firestore
async function addTask(taskText, taskOwnership) {
  let taskToSave = taskText;

  // Encrypt the task if it is private
  if (taskOwnership === 'private') {
      taskToSave = encryptData(taskText);
  }

  const timestamp = new Date().toISOString(); // Get the current timestamp

  await db.collection('todos').add({
      task_ownership: taskOwnership,
      task: taskToSave, // Save the task (encrypted if private)
      completed: false,
      user_id: currentUser_Id, // Save the current user's ID with the task
      created_at: timestamp // Add the timestamp
  });
}

// Function to delete a task from Firestore
async function deleteTask(taskId) {
  await db.collection('todos').doc(taskId).delete();
}

// Function to update a task in Firestore
async function updateTask(taskId, updates) {
  await db.collection('todos').doc(taskId).update(updates);
}

// Load tasks when the page loads
window.onload = async () => {
  await loadTasks();
};

// Function to display tasks in the table
// Function to display tasks in the table
async function loadTasks() {
  const tasks = await fetchTasks();
  taskList.innerHTML = ''; // Clear the list before adding new tasks

  tasks.forEach(task => {
      const tr = document.createElement('tr');

      // Create cells for task details
      const taskCell = document.createElement('td');
      taskCell.textContent = task.task;

      const ownershipCell = document.createElement('td');
      ownershipCell.textContent = task.ownership === 'private' ? 'Private' : 'Public';

      const statusCell = document.createElement('td');
      statusCell.textContent = task.completed ? 'Completed' : 'Pending';

      const timestampCell = document.createElement('td');
      timestampCell.textContent = new Date(task.created_at).toLocaleString(); // Format the timestamp

      // Create actions cell
      const actionsCell = document.createElement('td');

      // Create a delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'btn btn-danger btn-sm';

      deleteBtn.onclick = async () => {
          await deleteTask(task.id);
          loadTasks(); // Refresh the task list
      };

      // Create a complete button
      const completeBtn = document.createElement('button');
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.className = 'btn btn-success btn-sm';
      completeBtn.onclick = async () => {
          await updateTask(task.id, { completed: !task.completed });
          loadTasks(); // Refresh the task list
      };

      actionsCell.appendChild(deleteBtn);
      actionsCell.appendChild(completeBtn);

      // Append cells to the row
      tr.appendChild(taskCell);
      tr.appendChild(ownershipCell);
      tr.appendChild(statusCell);
      tr.appendChild(timestampCell); // Append the timestamp cell
      tr.appendChild(actionsCell);

      // Append the row to the task list
      taskList.appendChild(tr);
  });
}

// Event listener for adding a task
addTaskBtn.addEventListener('click', async () => {
  const taskText = taskInput.value.trim();
  const taskOwnership = document.querySelector('input[name="taskOwnership"]:checked').value;

  if (taskText) {
    await addTask(taskText, taskOwnership);
    taskInput.value = ''; // Clear the input field
    loadTasks(); // Refresh the task list
  }
});
=======
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
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  
  // Function to fetch tasks from Firestore
  async function fetchTasks() {
    const tasksSnapshot = await db.collection('todos').get();
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  }
  
  // Function to add a new task to Firestore
  async function addTask(taskText) {
    await db.collection('todos').add({
      task: taskText,
      completed: false
    });
  }
  
  // Function to delete a task from Firestore
  async function deleteTask(taskId) {
    await db.collection('todos').doc(taskId).delete();
  }
  
  // Function to update a task in Firestore
  async function updateTask(taskId, updates) {
    await db.collection('todos').doc(taskId).update(updates);
  }
  
  // Load tasks when the page loads
  window.onload = async () => {
    await loadTasks();
  };
  
  // Function to display tasks in the list
  async function loadTasks() {
    const tasks = await fetchTasks();
    taskList.innerHTML = ''; // Clear the list before adding new tasks
  
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.task;
  
      // Create a delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = async () => {
        await deleteTask(task.id);
        loadTasks(); // Refresh the task list
      };
  
      // Create a complete button
      const completeBtn = document.createElement('button');
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.onclick = async () => {
        await updateTask(task.id, { completed: !task.completed });
        loadTasks(); // Refresh the task list
      };
  
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
  
  // Add task button event listener
  addTaskBtn.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      await addTask(taskText);
      loadTasks(); // Refresh the task list
      taskInput.value = ''; // Clear the input field
    } else {
      alert('Please enter a task!');
    }
  });
  
>>>>>>> 5d1c5578e5bcc154448428f650aa8f9ce8a16a3a
