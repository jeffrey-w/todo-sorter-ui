import { Todo, TodoList } from "./todo";

/**
 * The `Sorter` class provides services for priortizing the `Todo`s in a `TodoList`.
 */
export class Sorter {

    private _lists: TodoList[];
    private _cursor: number;
    private _outer: number;
    private _inner: number;

    /**
     * Creates a new `Sorter` with the specified `todos`.
     * 
     * @param todos A collection of `Todo`s.
     * @throws An `Error` if the specified collection of `todos` is `null` or contains `null` elements.
     */
    constructor(todos: Todo[]) {
        this._lists = TodoList.listsFrom(todos);
        this._cursor = 0;
        this._outer = 0;
        this._inner = 1;
    }
    
    /**
     * Provides the `Todo`s being prioritized by this `Sorter`, partitioned on the rank they exhibit.
     */
    get lists(): TodoList[] {
        return [...this._lists];
    }

    /**
     * Provides the `Todo` presently being prioritized by this `Sorter`.
     * 
     * @returns {Todo} The `Todo` that is currently being prioritized.
     */
    getCurrent(): Todo {
        return this._lists[this._cursor].getAt(this._outer);
    }
    
    /**
     * Provides the next `Todo` to rank against the one currently being prioritized by this `Sorter`.
     * 
     * @returns {Todo} The next `Todo` to rank agains the current one.
     */
    getNext(): Todo {
        return this._lists[this._cursor].getAt(this._inner);
    }

    /**
     * Privides the `Todo`s being prioritized by this `Sorter`.
     * 
     * @returns {Todo[]} The `Todo`s that this `Sorter` is prioritizing.
     */
    getTodos(): Todo[] {
        return this._lists.flatMap(list =>
            list.todos).sort((one, two) =>
                two.priority - one.priority);
    }

    /**
     * Induces this `Sorter` to increment the rank of the `Todo` presently being prioritized.
     * 
     * @throws An `Error` if incrementing the priority of the current `Todo` results in arithmetic overflow.
     */
    incrementCurrent() {
        this._lists = incrementAt(this._lists, this._cursor, this._outer);
    }

    /**
     * Induces this `Sorter` to increment the rank of the `Todo` that is being ranked against the one currently being
     * prioritized.
     * 
     * @throws An `Error` if incrementing the priority of the next `Todo` results in arithmetic overflow.
     */
    incrementNext() {
        this._lists = incrementAt(this._lists, this._cursor, this._inner);
    }

    /**
     * Induces this `Sorter` to increment its position such that the next `Todo` becomes the current one.
     */
    advance() {
        this._inner++;
        if (this._inner >= this._lists[this._cursor].size()) {
            this._outer++;
            this._inner = this._outer + 1;
            if (this._outer >= this._lists[this._cursor].size() - 1) {
                do {
                    this._cursor++;
                } while (this.hasNext() && this._lists[this._cursor].size() === 1);
                this._outer = 0;
                this._inner = 1;
            }
        }
    }

    /**
     * Determines whether this `Sorter` has another `Todo` to prioritize.
     * 
     * @returns {boolean} `true` if this `Sorter` has another `Todo` to prioritize.
     */
    hasNext(): boolean {
        return this._cursor < this._lists.length;
    }

    /**
     * Determines whether this `Sorter` has prioritized every `Todo` under consideration.
     * 
     * @returns `true` if every `Todo` under consideration has been prioritized.
     */
    isSorted(): boolean {
        return this._lists.every(list => list.size() === 1);
    }

    /**
     * Preserves the state of this `Sorter`.
     * 
     * @returns {Memento} A new `Memento` capturing the current state of this `Sorter`.
     */
    save(): Memento {
        return new Memento(this._lists, this._cursor, this._outer, this._inner);
    }

    /**
     * Returns the state of this `Sorter` to that captured by the specified `memento`.
     * 
     * @param {Memento} memento A `Memento` that holds some previous state of this `Sorter`.
     */
    restore(memento: Memento) {
        this._lists = memento.lists;
        this._cursor = memento.cursor;
        this._outer = memento.outer;
        this._inner = memento.inner;
    }

}

function incrementAt(lists: TodoList[], cursor: number, index: number) {
    const clone = [...lists];
    clone[cursor] = clone[cursor].incrementAt(index);
    return clone;
}

/**
 * The `Memento` class represents a snapshot of the state of a `Sorter`.
 */
export class Memento {

    private _lists: TodoList[];
    private _cursor: number;
    private _outer: number;
    private _inner: number;

    /**
     * Creates a new `Memento` with the specified `lists`, `cursor`, and `outer` and `inner` pointers.
     * 
     * @param {TodoList[]} lists A collection of `TodoList`s being prioritized by the `Sorter` creating this `Memento`.
     * @param {number} cursor The index of the `TodoList` currently being prioritized by the `Sorter` creating this
     * `Memento`.
     * @param {number} outer The index of the `Todo` presently being prioritized by the `Sorter` creating this
     * `Memento`.
     * @param {number} inner The index of the `Todo` being ranked against the one currently being prioritized by the
     * `Sorter` creating this `Memento`.
     */
    constructor(lists: TodoList[], cursor: number, outer: number, inner: number) {
        this._lists = lists;
        this._cursor = cursor;
        this._outer = outer;
        this._inner = inner;
    }

    /**
     * Provides the collection of `TodoList`s being prioritized by the `Sorter` that created this `Memento`.
     */
    get lists(): TodoList[] {
        return this._lists;
    }

    /**
     * Provides the index of the `TodoList` currently being prioritized by the `Sorter` that created this `Memento`.
     */
    get cursor(): number {
        return this._cursor;
    }

    /**
     * Provides the index of the `Todo` presently being prioritized by the `Sorter` that created this `Memento`.
     */
    get outer(): number {
        return this._outer;
    }

    /**
     * Provides the index of the `Todo` being ranked against the one currently being prioritized by the `Sorter` that
     * created this `Memento`.
     */
    get inner(): number {
        return this._inner;
    }

}