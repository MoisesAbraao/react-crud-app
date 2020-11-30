import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography
} from '@material-ui/core';
import Home from './components/Home';

function App() {
  return (
    <>
      <AppBar position="fixed" style={{background: '#7A889D'}}>
          <Toolbar>
              <Typography variant="h6">
                  Task Manager
              </Typography>
          </Toolbar>
      </AppBar>

      <Box mt={10} />
      
      <Home />
    </>
  );
}

export default App;