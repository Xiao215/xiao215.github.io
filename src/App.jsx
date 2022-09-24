
import Projects from './pages/Project/Projects';
import Academic from './pages/Academic/Academic';
import {Box} from '@mui/material';
import color from './data/color';

function App(){
  return (
    <div className="font-raleway" >
      <Box position="static" sx={{ml:20, zIndex: 'tooltip',minWidth: 200 }}>
        <Projects color={color[0]} id="Projects"/>
        <Academic color={color[1]} id="Academic"/>
      </Box>
    </div>
  );
}

export default App;
