import{Task} from './task.js'; //You're importing the Task class from task.js to create new tasks.
import { saveTasks, loadTasks } from './storage.js'; //You're importing the saveTasks() and loadTasks() functions from storage.js to handle async saving/loading.

let tasks = []; //This will store all tasks that are either created or loaded.
let filteredTasks = []; // this will be displayed instead of `tasks`
let searchTerm = '';
let sortType = '';

const form = document.getElementById('task-form'); //form → the form where users enter tasks.
const taskList = document.getElementById('task-list'); //taskList → the <ul> or <div> where tasks will be displayed.

// Handle form submission
form.addEventListener('submit', async (e) => { //This listens for when the form is submitted. //e stands for event object  it holds info about what triggered the event. , async means the function can use await inside it.
  e.preventDefault();   //stops the browser from refreshing the page (default form behavior).
  alert("Form submitted");

  // get user input from the form.
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;

  const newTask = new Task(Date.now(), title, description, false, category); //Creates a new Task using the Task class. //Date.now() is used as a unique ID, completed is false by default (not done yet).
  tasks.push(newTask); //Adds the new task to the tasks array.
  alert("Task added successfully");

  await saveTasks(tasks); //Saves the updated tasks array to localStorage., Uses await because saveTasks() is asynchronous (has a Promise).
  renderTasks(); //Calls the function to display all tasks on the page.
  document.getElementById('task-form').reset();
});

//Search Function
function applySearch(taskArray, keyword) { //It takes two parameters: tasksArray: the full list of tasks (usually from tasks), keyword: the search term the user typed (e.g. "work")
  return taskArray.filter((task) => //filter() is an array method that: Loops through each item in tasksArray, Only keeps tasks that match the condition you provide, Each item in the array is called task.
  task.title.toLowerCase().includes(keyword.toLowerCase()) || //Checks if the task title contains the keyword (case-insensitive).
  task.description.toLowerCase().includes(keyword.toLowerCase()) //Checks if the task description contains the keyword (case-insensitive).
  );
}

// Sort Function
function applySort(taskArray, sortOption) { // Accepts two arguments: tasksArray: the array of task objects to sort., sortOption: a string that tells the function how to sort (e.g. 'title-asc').
  const sorted = [...taskArray]; // Uses the spread operator ... to create a shallow copy of the tasks array. , Why? So the original tasksArray is not mutated. This is a best practice when sorting.
  switch (sortOption) { //A switch statement is used to handle multiple cases based on the value of sortOption.
    case 'title-asc': //If the user chose "title-asc": Sort the tasks by their title in ascending order (A–Z)
      sorted.sort((a, b) => a.title.localeCompare(b.title)); //.localeCompare() compares strings while respecting character encoding (safer than just using < or >).
      break;
    case 'title-desc': //If the user chose "title-desc": Sort titles in reverse alphabetical order (Z–A).
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'completed':
      sorted.sort((a, b) => b.completed - a.completed); //If the user chose "completed": Sort tasks so that completed tasks come first.
      break;
    case 'incomplete':
      sorted.sort((a, b) => a.completed - b.completed); //Puts incomplete tasks first.
      break;
  }
  return sorted; //Returns the sorted array (copy), based on the selected sort option.
}


// Display all tasks in the UIs
function renderTasks() {
  taskList.innerHTML = ''; //innerHTML clears all the existing tasks from the UI

    // ✅ Apply search and sort
    filteredTasks = applySearch(tasks, searchTerm);
    filteredTasks = applySort(filteredTasks, sortType);

    const grouped = new Map();

    filteredTasks.forEach((task) => { //This loops through each task in the tasks array.
      //If the category doesn't exist in the Map, create a new array for it.
      if (!grouped.has(task.category)) { //grouped is a Map object, task.category might be something like "Work" or "Personal", grouped.has(key) checks if the Map already has that category as a key.
        grouped.set(task.category, []);
      }
      grouped.get(task.category).push(task);
              //ex:   Map {
            //  "Work" => [],
            //  "Personal" => [],
            //}
  
    });


  // Step 2: Render each group, build UI for each category
  grouped.forEach((taskArray, category) => { // Loops through every entry in the grouped Map. , taskArray: the array of tasks in that category., category: the key, like "Work", "Personal".
    //ex : Map {
    //  "Work" => [Task1, Task2],
    //  "Personal" => [Task3],
    // "General" => [Task4, Task5]
    // }
    const categoryHeader = document.createElement('h2'); //Creates an <h2> HTML element for the category title.
    categoryHeader.textContent = category; //Sets the heading text to the category name (e.g., Work).
    taskList.appendChild(categoryHeader); // Adds the <h2> to the #task-list container on the web page.

    const ul = document.createElement('ul'); //Creates a new empty unordered list (<ul>) that will contain all tasks for this category.

    taskArray.forEach((task, index) => {
  // Create task <li>
  const li = document.createElement('li');
  li.textContent = `${task.title} - ${task.completed ? "✅" : "❌"}`;

  // Toggle complete
  li.addEventListener('click', async () => {
    task.toggleComplete();
    await saveTasks(tasks);
    renderTasks();
  });

  // ✏️ Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.style.marginLeft = '10px';

  editBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const newTitle = prompt('Edit title:', task.title);
    const newDesc = prompt('Edit description:', task.description);
    const newCategory = prompt('Edit category:', task.category);

    if (newTitle !== null && newCategory !== null) {
      task.title = newTitle.trim() || task.title;
      task.description = newDesc.trim() || task.description;
      task.category = newCategory.trim() || task.category;

      await saveTasks(tasks);
      renderTasks();
    }
  });

  // 🗑️ Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.style.marginLeft = '5px';

  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const confirmDelete = confirm(`Delete task: "${task.title}"?`);
    if (confirmDelete) {
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks.splice(index, 1);
        await saveTasks(tasks);
        renderTasks();
      }
    }
  });

  // Add buttons to li
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  ul.appendChild(li);
  });




    taskList.appendChild(ul); //Adds the <ul> (which now has all tasks) to the main #task-list container
  });
  
}

// Load saved tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  // Load tasks
  const rawTasks = await loadTasks();
  tasks = rawTasks.map(t => new Task(t.id, t.title, t.description, t.completed, t.category));

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTasks();
  });

  // Sort dropdown
  sortSelect.addEventListener('change', (e) => {
    sortType = e.target.value;
    renderTasks();
  });

  renderTasks();

});

//this comment for github testing
//this comment for practice git pull request