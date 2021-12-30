import { TodoList } from "./todo";

export class Sorter {

    constructor(todos) {
        this._lists = TodoList.listsFrom(todos);
        this._cursor = 0;
        this._outer = 0;
        this._inner = 1;
    }

    getCurrent() {
        return this._lists[this._cursor].getAt(this._outer);
    }

    getNext() {
        return this._lists[this._cursor].getAt(this._inner);
    }

    getLists() {
        return this._lists;
    }

    getTodos() {
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
                } while (this.hasNext() && this._lists[this.cursor].size() === 1);
                this._outer = 0;
                this._inner = 1;
            }
        }
    }

    hasNext() {
        return this._cursor < this._lists.length;
    }

    isSorted() {
        return this._lists.every(list => list.size() === 1);
    }

    save() {
        return new Memento(this._lists, this._cursor, this._outer, this._inner);
    }

    restore(memento) {
        this._lists = memento.lists;
        this._cursor = memento.cursor;
        this._outer = memento.outer;
        this._inner = memento.inner;
    }

}

function incrementAt(lists, cursor, index) {
    const clone = [...lists];
    clone[cursor] = clone[cursor].incrementAt(index);
    return clone;
}

export class Memento {

    constructor(lists, cursor, outer, inner) {
        this._lists = lists;
        this._cursor = cursor;
        this._outer = outer;
        this._inner = inner;
    }

    get lists() {
        return this._lists;
    }

    get cursor() {
        return this._cursor;
    }

    get outer() {
        return this._outer;
    }

    get inner() {
        return this._inner;
    }

}