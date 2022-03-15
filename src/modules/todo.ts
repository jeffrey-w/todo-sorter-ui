/**
 * The `Todo` class represents a task that needs to be completed. It is characterized by a descriptive name and a
 * priority that indicates its relative importance.
 */
export class Todo {

    private static whitespacePattern: RegExp = /^\s*$/;

    /**
     * Creates a new `Todo` with the specified `name`.
     * 
     * @param {string} name A natural language characterization of the new `Todo`.
     * @returns {Todo} A new `Todo`.
     * @throws An `Error` if the specified `name` is `null` or empty.
     */
    public static create(name: string): Todo {
        return new Todo(0, name);
    }
    
    private static guardAgainstNegative(priority: number): number {
        if (priority < 0) {
            throw Error("priority cannot be less than 0.");
        }
        return priority;
    }

    private static guardAgainstNullOrEmpty(name: string): string {
        if (this.whitespacePattern.test(name)){
            throw new Error("name cannot be null or empty.");
        }
        return name;
    }

    private _priority: number;
    private _name: string;

    private constructor(priority: number, name: string) {
        this._priority = Todo.guardAgainstNegative(priority);
        this._name = Todo.guardAgainstNullOrEmpty(name);
    }

    /**
     * Provides the relative importance of this `Todo`.
     */
    get priority(): number {
        return this._priority;
    }

    /**
     * Provides a natural language characterization of this `Todo`.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Provides a new `Todo` with the same name and a priority that is one greater than this one.
     * 
     * @returns {Todo} A new `Todo` with a higher priority than this one.
     * @throws An `Error` if incrementing the priority of this `Todo` results in arithmetic overflow.
     */
    increment(): Todo {
        return new Todo(this.priority + 1, this.name);
    }

}

/**
 * The `TodoList` class represents a collection of `Todo`s to be prioritized.
 */
export class TodoList {

    /**
     * Creats a new collection of `TodoList`s each containing the subset of the specified `todos` that have the same
     * priority as each other.
     * 
     * @param {Todo[]} todos A collection of `Todo`s.
     * @returns {TodoList[]} A collection of `TodoList`s each containing `Todo`s with equal priority.
     * @throws An `Error` if the specified collection of `todos` is `null` or contains `null` elements.
     */
    static listsFrom(todos: Todo[]): TodoList[] {
        const list = new TodoList(todos);
        return list.sort();
    }

    /**
     * Creats a new collection of `Todo`s containing every element from the specified `lists`.
     * 
     * @param {TodoList[]} lists A collection of `TodoList`s.
     * @returns {Todo[]} A collection of all of the `Todo`s in each of the specified `lists`.
     * @throws An `Error` if the specified `lists` is `null` or contains `null` elements.
     */
    static merge(lists: TodoList[]): Todo[] {
        return lists.flatMap(list => list.todos);
    }

    private static guardAgainstNullTodos(todos: Todo[]): Todo[] {
        todos.forEach(todo => {
            if (todo == null) {
                throw new Error("todos cannot contain null elements.");
            }
        });
        return todos;
    }

    private _todos: Todo[]

    private constructor(todos: Todo[], copy: boolean = true) {
        if (copy) {
            this._todos = [...TodoList.guardAgainstNullTodos(todos)];
        }
        this._todos = TodoList.guardAgainstNullTodos(todos);
    }


    /**
     * Provides the `Todo`s in this `TodoList`.
     */
    get todos(): Todo[] {
        return this._todos;
    }

    /**
     * Provides a partitioning of this `TodoList` on the priority of the `Todo`s it contains.
     * 
     * @returns {TodoList[]} A collection of `TodoList`s each containing the subset of the `Todo`s in this `TodoList`
     * that have the same priority as each other.
     */
    sort(): TodoList[] {
        return Object.values(this.groupBy(this.todos, todo => todo.priority))
            .map(todos => new TodoList(todos));
    }

    private groupBy<K extends keyof any, V>(array: V[], keySelector: (v: V) => K): Record<K, V[]> {
        return array.reduce((groups, element) => {
            const key = keySelector(element);
            groups[key] = groups[key] ?? [];
            groups[key].push(element);
            return groups;
        }, {} as Record<K, V[]>);
    }
    
    /**
     * Provides a new `TodoList` with the same elements as this one except for the `Todo` at the specified `index`,
     * which is replaced with one with the same name and a priority that is one greater.
     * 
     * @param {number} index 
     * @returns {TodoList} A new `TodoList`.
     * @throws An `Error` if the specified `index` is less than zero or greater than or equal to the size of this
     * `TodoList`, or if incrementing the priority of the `Todo` at the specified `index` results in arithmetic
     * overflow.
     */
    incrementAt(index: number): TodoList {
        const clone = [...this.todos];
        clone[index] = clone[index].increment();
        return new TodoList(clone, false);
    }

    /**
     * Provides the `Todo` at the specified `index` of this `TodoList`.
     * 
     * @param {number} index The position of the `Todo` to retreive.
     * @returns {Todo} The `Todo` at the specified `index`.
     * @throws An `Error` if the specified `index` is less than zero or greater than or equal to the size of this
     * `TodoList`.
     */
    getAt(index: number): Todo {
        return this.todos[index];
    }

    /**
     * Provides the number of `Todo`s in this `TodoList`.
     * 
     * @returns {number} The size of this `TodoList`.
     */
    size(): number {
        return this.todos.length;
    }

}
