export class Task{
    constructor(id,title,description = '',completed = false,category = 'general'){
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.category = category;
    }

    toggleComplete() {
        this.completed = !this.completed; //It toggles the task’s completed status: If completed is false → it becomes true If completed is true → it becomes false
    }
}

//export class Task {}; // <-- WRONG because it doesn't have any properties or methods.



