import { set } from "./list-slice";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortModal } from "./sort-modal";
import { TodoList } from "./todolist";

function App() {

  const [open, setOpen] = useState(false);

  const todos = useSelector((state) => state.value);
  const dispatch = useDispatch();

  const handleAdd = useCallback(todo =>
    dispatch(set([...todos, todo])), [dispatch, todos]);

  const handleDelete = useCallback(todo =>
    dispatch(set(todos.filter(t =>
      t !== todo))), [dispatch, todos]);

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