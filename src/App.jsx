import Projects from "./pages/Project/Projects";
import Academic from "./pages/Academic/Academic";
import Skill from "./pages/Skill/Skill";
import About from "./pages/About/About";
import { Box } from "@mui/material";
import color from "./data/color";

function App() {
  return (
    <div className="font-raleway">
      <Box position="static" sx={{ ml: 20, zIndex: "tooltip", minWidth: 200 }}>
        <About color={color[0]} id="About" />
        <Skill color={color[1]} id="Skill" />
        <Projects color={color[2]} id="Projects" />
        <Academic color={color[3]} id="Academic" />
      </Box>
    </div>
  );
}

export default App;
