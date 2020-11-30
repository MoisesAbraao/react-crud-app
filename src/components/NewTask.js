import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function NewTaskDialog(props) {

    const { openNewTask, setOpenNewTask, loadData } = props;
    const [title, setTitle] = useState();
    const [details, setDetails] = useState();
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);

    async function handleAddTask () {
        let params = {
            title: title, 
            details: details
        }
        if (title !== undefined) {
            api.post('/tasks', params)
                .then((result) => {
                    if (result.status === 201) {
                        loadData();
                        setTitle(null);
                        setDetails(null);
                        setOpenAlertSuccess(true);
                    }
                });
            setOpenNewTask(false);
        }else {
            setOpenAlertError(true);
        }
        
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlertSuccess(false);
        setOpenAlertError(false);
    };
    
    const handleCloseNewTask = () => {
        setOpenNewTask(false);
    }

    return(
        <>
        <Dialog 
            open={openNewTask} 
            onClose={handleCloseNewTask} 
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">New Task</DialogTitle>
            <DialogContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                    }}
                >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="title"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        required
                        id="details"
                        label="Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        fullWidth
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddTask} color="primary">
                    SAVE
                </Button>
                 
                <Button onClick={handleCloseNewTask} color="secondary">
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={openAlertSuccess} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="success">
                Task successfully added!
            </MuiAlert>
        </Snackbar>

        <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="error">
                The Title Field is required!!
            </MuiAlert>
        </Snackbar>
        </>
    )
}

export default NewTaskDialog;