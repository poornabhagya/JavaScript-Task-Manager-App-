//. Simulate Saving and Loading Tasks (storage.js)
//Create a function to save tasks into localStorage.
//Create another function to load tasks from localStorage.
//Make them asynchronous by returning Promises (use setTimeout to simulate network delay).
//Export both functions so they can be used in main.js.

export function saveTasks (tasks){ //This defines and exports a function called saveTasks. and The tasks parameter is expected to be an array of task objects.
    return new Promise((resolve) => { //This function returns a Promise, The callback (resolve) => { ... } gets called when the async work is done., resolve() is a function that tells JavaScript: “I’m done!”
        setTimeout(() => { //setTimeout is used to simulate delay, This creates a delay of 500ms before running the inner code.
            localStorage.setItem('tasks', JSON.stringify(tasks)); // localStorage.setItem(key, value) stores something in the browser permanently., 'tasks' is the key — you’ll use this to get the value later., JSON.stringify(tasks) turns the JavaScript array into a string (because localStorage can only store strings).
            resolve(true); //This tells the Promise: ✅ "All done!"
         }, 500); // Simulated delay
     });
}

export function loadTasks() {
    return new Promise((resolve) => { //This function also returns a Promise.
        setTimeout(() => { //Again, setTimeout simulates a delay.
            const raw = localStorage.getItem('tasks'); //Reads the string from localStorage saved under the key 'tasks'.
            const parsed = raw ? JSON.parse(raw) : []; //If raw has data, it’s converted from a JSON string → JavaScript array using JSON.parse(raw).
            resolve(parsed); //Return the loaded tasks (array) from the Promise.
        },500); // Simulated delay)
  
}); 
}