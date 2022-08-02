import Box from '@mui/material/Box';
import menu from "../data/nav.json";
import NavItem from './NavItem';
import "./NavBar.css";
interface menuProps{
  label: string;
  href: string;
}
const leftMenu:menuProps[] = menu.left;
const rightMenu :menuProps[]= menu.right;
const title:string=menu.title;
function NavBar(){  
    
  return (
    <Box className="flex items-stretch px-5 text-3xl" sx={{justifyContent: 'space-between'}}>
        <Box sx={{ borderTop: 1, borderBottom: 1,borderColor: 'grey.500'}} >
          <NavItem menuItem={leftMenu}></NavItem>
        </Box>
        <Box className='title text-themeTwo-900' sx={{ alignContent: 'center' }}>{title}</Box>
        <Box sx={{ borderTop: 1, borderBottom: 1,borderColor: 'grey.500'}} >
          <NavItem menuItem={rightMenu}></NavItem>
        </Box>
    </Box>
  );
}

export default NavBar;
