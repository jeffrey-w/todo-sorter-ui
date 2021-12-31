import { Add, Check, Clear, Sort } from "@mui/icons-material";
import { Box, Grid, IconButton, Input, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { useState } from "react";

const enter = 13;
const escape = 27;

export function TodoList(props) {

    const [showInput, setShowInput] = useState(false);
    const [todo, setTodo] = useState();

    const handleAdd = (event) => {
        if (event.keyCode === enter) {
            if (event.target.value !== "") {
                props.onAdd(event.target.value);
            }
            toggleInput();
        }
        else if (event.keyCode === escape) {
            toggleInput();
        }
    }
    
    const toggleInput = () => {
        setShowInput(!showInput)
        setTodo("");
    };

    return ( 
        <Box margin="auto" marginTop="16vh" width="32vw">
            <Grid container padding="4px">
                <Grid item xs={10}>
                    <Typography variant="h5">Todos</Typography>
                </Grid>
                <Grid container item justifyContent="flex-end" xs={2}>
                    <IconButton onClick={toggleInput}><Add/></IconButton>
                    <IconButton onClick={() => props.onOpenDialog(true)}
                        disabled={props.todos?.length < 2}>
                            <Sort/>
                    </IconButton>
                </Grid>
            </Grid>
            {
                showInput || (props.todos?.length) ? 
                    <Paper sx={{ maxHeight: "384px", overflow: "auto" }}>
                        <List>
                            {props.todos.map((todo, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Check/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {todo}
                                    </ListItemText>
                                    <IconButton onClick={() => props.onDelete(index)}>
                                        <Clear/>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                        {
                            showInput ?
                                <Box margin="16px">
                                    <Input 
                                        autoFocus
                                        fullWidth
                                        onBlur={toggleInput}
                                        onChange={(e) => setTodo(e.target.value)}
                                        onKeyDown={handleAdd}
                                        value={todo}
                                    />
                                </Box> : null
                        }
                    </Paper> : null
            }
        </Box>
    );
}