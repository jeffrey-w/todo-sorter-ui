import { Box } from "@mui/system";
import { Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import { Redo, Undo } from "@mui/icons-material";
import { set } from "../store/list-slice"
import { Sorter } from "../modules/sorter"
import { Todo, TodoList } from "../modules/todo";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

var sorter;
var undo;
var redo;

export function SortModal(props) {

    const [current, setCurrent] = useState();
    const [next, setNext] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        undo = [];
        redo = [];
        if (props.open) {
            sorter = new Sorter(props.todos.map(todo =>
                new Todo(0, todo)));
            setCurrent(sorter.getCurrent());
            setNext(sorter.getNext());
        }
    }, [props.open, props.todos]);

    const handleSelect = flag => {
        undo.push(sorter.save());
        redo = [];
        if (flag) {
            sorter.incrementOuter();
        } else {
            sorter.incrementInner();
        }
        sorter.advance()
        if (sorter.hasNext()) {
            setCurrent(sorter.getCurrent());
            setNext(sorter.getNext());
        } else {
            sorter = new Sorter(TodoList.merge(sorter.getLists()));
            if (sorter.isSorted()) {
                dispatch(set(sorter.getTodos().map(todo => todo.name)));
                props.setOpen(false);
            }
        }
    }

    const handleUndo = () => {
        const memento = undo.pop();
        redo.push(sorter.save());
        sorter.restore(memento);
        setCurrent(sorter.getCurrent());
        setNext(sorter.getNext());
    }

    const handleRedo = () => {
        const memento = redo.pop();
        undo.push(sorter.save());
        sorter.restore(memento);
        setCurrent(sorter.getCurrent());
        setNext(sorter.getNext());
    }

    return (
        <Dialog maxWidth="32vw" onClose={() => props.setOpen(false)} open={props.open}>
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