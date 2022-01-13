export class Todo {

    constructor(priority, name) {
        this._priority = priority;
        this._name = name;
    }

    get priority() {
        return this._priority;
    }

    get name() {
        return this._name;
    }

    increment() {
        return new Todo(this.priority + 1, this.name);
    }

}

export class TodoList {

    static listsFrom(todos) {
        const list = new TodoList([...todos]);
        return list.sort();
    }

    static merge(lists) {
        return lists.flatMap(list => list.todos);
    }

    constructor(todos) {
        this._todos = todos;
    }

    get todos() {
        return this._todos;
    }

    sort() {
        return Object.values(groupBy(this._todos, "_priority"))
            .map(todos => new TodoList(todos));
    }

    incrementAt(index) {
        const todos = [...this._todos];
        todos[index] = todos[index].increment();
        return new TodoList(todos);
    }

    getAt(index) {
        return this._todos[index];
    }

    size() {
        return this._todos.length;
    }

}

function groupBy(array, key) {
    return array.reduce((groups, element) => {
        groups[element[key]] = groups[element[key]] ?? [];
        groups[element[key]].push(element);
        return groups;
    }, {})
}