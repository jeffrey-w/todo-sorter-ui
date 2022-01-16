import { Todo, TodoList } from "./todo";

export class Sorter {

    private _lists: TodoList[];
    private _cursor: number;
    private _outer: number;
    private _inner: number;

    constructor(todos: Todo[]) {
        this._lists = TodoList.listsFrom(todos);
        this._cursor = 0;
        this._outer = 0;
        this._inner = 1;
    }
    
    get lists(): TodoList[] {
        return [...this._lists];
    }

    getCurrent(): Todo {
        return this._lists[this._cursor].getAt(this._outer);
    }

    getNext(): Todo {
        return this._lists[this._cursor].getAt(this._inner);
    }

    getTodos(): Todo[] {
        return this._lists.flatMap(list =>
            list.todos).sort((one, two) =>
                two.priority - one.priority);
    }

    incrementOuter() {
        this._lists = incrementAt(this._lists, this._cursor, this._outer);
    }

    incrementInner() {
        this._lists = incrementAt(this._lists, this._cursor, this._inner);
    }

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

    hasNext(): boolean {
        return this._cursor < this._lists.length;
    }

    isSorted(): boolean {
        return this._lists.every(list => list.size() === 1);
    }

    save(): Memento {
        return new Memento(this._lists, this._cursor, this._outer, this._inner);
    }

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

export class Memento {

    private _lists: TodoList[];
    private _cursor: number;
    private _outer: number;
    private _inner: number;

    constructor(lists: TodoList[], cursor: number, outer: number, inner: number) {
        this._lists = lists;
        this._cursor = cursor;
        this._outer = outer;
        this._inner = inner;
    }

    get lists(): TodoList[] {
        return this._lists;
    }

    get cursor(): number {
        return this._cursor;
    }

    get outer(): number {
        return this._outer;
    }

    get inner(): number {
        return this._inner;
    }

}