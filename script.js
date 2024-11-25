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
  