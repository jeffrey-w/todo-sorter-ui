import { set } from "./list-slice"
import { Sorter } from "./model/sorter"
import { Todo, TodoList } from "./model/todo";
import { Redo, Undo } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
            <Box height="32vh" width="32vw">
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
                    <Card onClick={() => handleSelect(true)} sx={{ margin: "16px 0" }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="body1">{current?.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card onClick={() => handleSelect(false)} sx={{ margin: "16px 0" }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="body1">{next?.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </DialogContent>
            </Box>
        </Dialog>
    );
}