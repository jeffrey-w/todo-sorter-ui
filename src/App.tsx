import { AppBar, Toolbar, Typography } from "@mui/material";
import { SortModal } from "./components/sort-modal";
import { TodoList } from "./components/todolist";
import { set } from "./store/list-slice";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useCallback, useState } from "react";

function App() {

  const [open, setOpen] = useState(false);

  const todos = useAppSelector((state) => state.value);
  const dispatch = useAppDispatch();

  const handleAdd = useCallback(todo =>
    dispatch(set([...todos, todo])), [dispatch, todos]);

  const handleDelete = useCallback(index =>
    dispatch(set(todos.filter((_: string, i: number) =>
      i !== index))), [dispatch, todos]);

  const handleOpenDialog = useCallback(open => setOpen(open), []);

  return (
    <div>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h4">TODOsorter</Typography>
        </Toolbar>
      </AppBar>
      <TodoList todos={todos} onAdd={handleAdd} onDelete={handleDelete} onOpenDialog={handleOpenDialog} />
      <SortModal todos={todos} open={open} setOpen={setOpen} />
    </div>
  );
}

export default App;