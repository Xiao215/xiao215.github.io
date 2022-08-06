import Box from '@mui/material/Box';
import menu from "../../data/nav.json";
import NavItem from './NavItem';
import "./style.css";
interface menuProps{
  label: string;
  href: string;
}
const menuItem:menuProps[] = menu.item;
function NavBar(){  
    
  return (
    <Box >
          <NavItem menuItem={menuItem}></NavItem>
    </Box>
  );
}

export default NavBar;
