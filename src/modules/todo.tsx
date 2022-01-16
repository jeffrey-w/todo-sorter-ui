export class Todo {

    private _priority: number;
    private _name: string;

    constructor(priority: number, name: string) {
        this._priority = priority;
        this._name = name;
    }

    get priority(): number {
        return this._priority;
    }

    get name(): string {
        return this._name;
    }

    increment(): Todo {
        return new Todo(this.priority + 1, this.name);
    }

}

export class TodoList {

    static listsFrom(todos: Todo[]): TodoList[] {
        const list = new TodoList(todos);
        return list.sort();
    }

    static merge(lists: TodoList[]): Todo[] {
        return lists.flatMap(list => list.todos);
    }

    private _todos: Todo[]

    constructor(todos: Todo[]) {
        this._todos = [...todos];
    }

    get todos(): Todo[] {
        return this._todos;
    }

    sort(): TodoList[] {
        return Object.values(groupBy(this.todos, todo => todo.priority))
            .map(todos => new TodoList(todos));
    }

    incrementAt(index: number) {
        const clone = [...this.todos];
        clone[index] = clone[index].increment();
        return new TodoList(clone);
    }

    getAt(index: number): Todo {
        return this.todos[index];
    }

    size(): number {
        return this._todos.length;
    }

}

function groupBy<K extends keyof any, V>(array: V[], keySelector: (v: V) => K) {
    return array.reduce((groups, element) => {
        const key = keySelector(element);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(element);
        return groups;
    }, {} as Record<K, V[]>);
}