import { AppBar, Toolbar, Typography } from "@mui/material";
import { SortModal } from "./components/sort-modal";
import { TodoList } from "./components/todolist";
import { set } from "./store/list-slice";
import { AppDispatch, RootState } from "./store/store";
import { useCallback, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


function App() {

  const [open, setOpen] = useState(false);

  const todos = (useSelector as TypedUseSelectorHook<RootState>)((state) => state.value);
  const dispatch = useDispatch<AppDispatch>();

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