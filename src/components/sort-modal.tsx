import { Box } from "@mui/system";
import { Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import { Memento, Sorter } from "../modules/sorter"
import { Redo, Undo } from "@mui/icons-material";
import { Todo, TodoList } from "../modules/todo";
import { set } from "../store/list-slice"
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";

var sorter: Sorter;
var undo: Memento[];
var redo: Memento[];

type Props = {
    open: boolean,
    todos: string[],
    setOpen: (flag: boolean) => void,
};

export function SortModal(props: Props) {

    const [current, setCurrent] = useState<Todo>();
    const [next, setNext] = useState<Todo>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        undo = [];
        redo = [];
        if (props.open) {
            sorter = new Sorter(props.todos.map(todo =>
                Todo.create(todo)));
            setCurrent(sorter.getCurrent());
            setNext(sorter.getNext());
        }
    }, [props.open, props.todos]);

    const handleSelect = (flag: boolean) => {
        undo.push(sorter.save());
        redo = [];
        if (flag) {
            sorter.incrementCurrent();
        } else {
            sorter.incrementNext();
        }
        sorter.advance()
        if (sorter.hasNext()) {
            setCurrent(sorter.getCurrent());
            setNext(sorter.getNext());
        } else {
            sorter = new Sorter(TodoList.merge(sorter.lists));
            if (sorter.isSorted()) {
                dispatch(set(sorter.getTodos().map(todo => todo.name)));
                props.setOpen(false);
            }
        }
    }

    const handleUndo = () => {
        transfer(undo, redo);
    }

    const handleRedo = () => {
        transfer(redo, undo);
    }

    const transfer = (from: Memento[], to: Memento[]) => {
        const memento = from.pop();
        if (memento) {
            to.push(sorter.save());
            sorter.restore(memento);
            setCurrent(sorter.getCurrent());
            setNext(sorter.getNext());
        }
    }

    return (
        <Dialog maxWidth="xl" onClose={() => props.setOpen(false)} open={props.open}>
            <Box height="54vh" width="32vw">
                <DialogActions>
                    <IconButton disabled={props.open && !undo.length} onClick={handleUndo}>
                        <Undo />
                    </IconButton>
                    <IconButton disabled={props.open && !redo.length} onClick={handleRedo}>
                        <Redo />
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <Typography variant="h5">
                        Would you rather...
                    </Typography>
                    <Card onClick={() => handleSelect(true)} sx={{ margin: "48px 0" }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography color="primary" variant="h6">{current?.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Typography variant="h5">
                        Or
                    </Typography>
                    <Card onClick={() => handleSelect(false)} sx={{ margin: "48px 0" }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography color="primary" variant="h6">{next?.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </DialogContent>
            </Box>
        </Dialog>
    );
}
