import React from 'react';
import NavBar from './pages/Nav/NavBar';
import Project from './pages/Project/Projects';
import {Box} from '@mui/material';
function App(): JSX.Element{
  return (
    <div className="font-raleway" >
      <Box position="static">
      <NavBar/>
      </Box>
      <Box position="static" sx={{ml:20, zIndex: 'tooltip',minWidth: 200 }}>
      <Project/>
            <Project/>

      <Project/>

      <Project/>

      <Project/>

      <Project/>


      </Box>
    </div>
  );
}

export default App;
