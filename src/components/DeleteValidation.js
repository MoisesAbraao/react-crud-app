import React from "react";
import { Dialog, DialogTitle, DialogContentText, DialogContent, Button, DialogActions } from "@material-ui/core";

export const DeleteValidation = (props) => {

	const { openDeleteValidation, handleCloseDeleteValidation, handleDelete } = props;

	return (
		<Dialog
			open={openDeleteValidation}
			onClose={handleCloseDeleteValidation}
		>
			<DialogTitle>Delete Task</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to delete this task?
					</DialogContentText>
			</DialogContent>
			<DialogActions style={{ justifyContent: 'space-around' }}>
				<Button onClick={handleCloseDeleteValidation} color="secondary">
					No
        		</Button>
				<Button onClick={handleDelete} color="primary" autoFocus>
					Yes, I am
        		</Button>
			</DialogActions>
		</Dialog>
	)
}