import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import NewTaskDialog from './NewTask';
import { DeleteValidation } from './DeleteValidation';


const useStyles = makeStyles((theme) => ({
    root: {
        margin: 20,
        alignItems: "center"
    },
    cardActions: {
        marginLeft: 'auto',
    },
    smallCard: {
      alignItems: "space-around",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
    },
    headerCard: {
      textAlign: "center",
      backgroundColor: "white",
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 12,
      peddingRight: 12,
      cursor: "pointer",
      border: "none",
    }
  }));

function Home() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [title, setTitle] = useState();
    const [details, setDetails] = useState();
    const [detailsTask, setDetailsTask] = useState([]);
    const [openNewTask, setOpenNewTask] = useState(false);
    const [openUpdateTask, setOpenUpdateTask] = useState(false);
    const [openDeleteValidation, setOpenDeleteValidation] = useState(false);
    const [item, setItem] = useState({});
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const [openAlertUpdateSuccess, setOpenAlertUpdateSuccess] = useState(false);
    const [openAlertUpdateError, setOpenAlertUpdateError] = useState(false);

    async function loadData(){
        try{
            const response = await api.get(`/tasks`);
            const orderData = response.data.sort((a, b) => (a.id < b.id) ? 1 : -1);
            setData(orderData || []);
        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    const handleOpenNewTask = () => {
        setOpenNewTask(true);
    }
    
    const handleOpenUpdateTask = (item) => {
        setDetailsTask(item);
        setTitle(item.title);
        setDetails(item.details);
        setOpenUpdateTask(true);
    }

    const handleCloseUpdateTask = () => {
        setDetailsTask(null);
        setOpenUpdateTask(false);
    }

    const updateItem = () => { 
        let id = detailsTask.id;

        let params = {
            title: title, 
            details: details
        };
        if (title !== '') {
            api.put(`/tasks/${id}`, params).then((result) => {
                if (result.status === 200) {
                    loadData();
                    setOpenAlertUpdateSuccess(true);
                };
            });
            setOpenUpdateTask(false);
        }else {
            setOpenAlertUpdateError(true);
        }
    }
    

    
    async function deleteTask(item) {
        setItem(item);
        setOpenDeleteValidation(true);
    }

    async function handleDelete() {
        api.delete(`/tasks/${item}`).then(res => {
            loadData();
            setOpenAlertSuccess(true);
            setOpenDeleteValidation(false);
      });
    }

    const handleCloseDeleteValidation = () => {
        setOpenDeleteValidation(false)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlertSuccess(false);
        setOpenAlertUpdateSuccess(false);
        setOpenAlertUpdateError(false);
    };

    return (
        <>  
            <div className={classes.root}>
                <Grid 
                    container
                    direction="row"
                    xs={12}
                    spacing={2}
                    alignItems="center"
                >
                    {data.length > 0 ? (
                    data.map((value) => {
                        return(
                            <Grid xs={12} sm={4} item>
                                <Card className={classes.smallCard} variant="outlined">
                                    <CardContent>
                                        <Typography className={classes.cardActions} color="textSecondary" gutterBottom>
                                            <h3>{value.title}</h3>
                                        </Typography>
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <BorderColorIcon 
                                            variant="contained" 
                                            onClick={() => handleOpenUpdateTask(value)} 
                                            style={{color: '#7A889D'}}
                                        />
                                        <Box m={1}/>
                                        <DeleteForeverIcon 
                                            variant="contained" 
                                            onClick={() => deleteTask(value.id)}
                                            style={{color: '#7A889D'}}
                                        />
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    }) ) : (
                        <Grid xs={12} sm={4} item>
                            <Card className={classes.smallCard} variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        <h3>No Tasks!</h3>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                    }
                </Grid>
            </div>
                

            <Fab style={{
                            background: '#7A889D', 
                            color: '#FFFF',
                            margin: 0,
                            top: 'auto',
                            right: 20,
                            bottom: 20,
                            left: 'auto',
                            position: "fixed"
                        }} onClick={handleOpenNewTask} aria-label="add">
                <AddIcon />
            </Fab>

            <Dialog 
                open={openUpdateTask} 
                onClose={handleCloseUpdateTask} 
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Update Task</DialogTitle>
                {detailsTask && (
                    <>
                        <DialogContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    id="details"
                                    label="Details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    fullWidth
                                />
                            </form>
                        </DialogContent>
                    
                        <DialogActions>
                            <Button onClick={updateItem} color="primary">
                                SAVE
                            </Button>
                            <Button onClick={handleCloseUpdateTask} color="secondary">
                                CANCEL
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            
            <NewTaskDialog 
                openNewTask={openNewTask} 
                setOpenNewTask={setOpenNewTask}
                loadData={loadData}
            />

            <DeleteValidation 
                openDeleteValidation={openDeleteValidation} 
                handleCloseDeleteValidation={handleCloseDeleteValidation} 
                handleDelete={handleDelete} 
            />

        <Snackbar open={openAlertUpdateSuccess} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="success">
                Task updated successfully!
            </MuiAlert>
        </Snackbar>

        <Snackbar open={openAlertUpdateError} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="error">
                Check the fields!
            </MuiAlert>
        </Snackbar>

        <Snackbar open={openAlertSuccess} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="success">
                Task successfully deleted!
            </MuiAlert>
        </Snackbar>
            
        </>
    );
}

export default Home;