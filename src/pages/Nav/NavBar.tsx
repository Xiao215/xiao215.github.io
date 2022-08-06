import Box from '@mui/material/Box';
import menu from "../../data/nav";
import NavItem from './NavItem';
import BottomIcons from './BottomIcons';
import "./style.css";
interface menuProps{
  label: string;
  href: string;
}
interface iconProps{
  mdiName:any;
  link:string;
}
const menuItem:menuProps[] = menu.item;
const iconItem:iconProps[] = menu.external;
function NavBar(){  
    
  return (
    <Box >
          <NavItem menuItem={menuItem}></NavItem>
          <BottomIcons data={iconItem}></BottomIcons>
    </Box>
  );
}

export default NavBar;
