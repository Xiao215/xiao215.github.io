import React from 'react';
import NavBar from './pages/Nav/NavBar';
import Projects from './pages/Project/Projects';
import {Box} from '@mui/material';
function App(): JSX.Element{
  const headingColorOrder: string[]=[
  "red-default",
  "blue-default",
  "green-default",
  "yellow-default",
]
  return (
    <div className="font-raleway" >
      <Box position="static">
        <NavBar/>
      </Box>
      <Box position="static" sx={{ml:20, zIndex: 'tooltip',minWidth: 200 }}>
        <Projects color={headingColorOrder[0]}/>
      </Box>
    </div>
  );
}

export default App;
