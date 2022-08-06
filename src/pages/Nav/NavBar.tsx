import Box from '@mui/material/Box';
import menu from "../../data/nav.json";
import NavItem from './NavItem';
interface menuProps{
  label: string;
  href: string;
}
const leftMenu:menuProps[] = menu.left;
const rightMenu :menuProps[]= menu.right;
const title:string=menu.title;
function NavBar(){  
    
  return (
    <Box className="flex items-stretch text-3xl" sx={{justifyContent: 'space-between'}}>
        <Box sx={{ borderTop: 1, borderBottom: 1,borderColor: 'grey.500', mx:10}} >
          <NavItem menuItem={leftMenu} side={0}></NavItem>
        </Box>
        <img src="../assets/images/icon.png" alt="Title"/>
        <Box sx={{ borderTop: 1, borderBottom: 1,borderColor: 'grey.500',mx:10}} >
          <NavItem menuItem={rightMenu} side={1}></NavItem>
        </Box>
    </Box>
  );
}

export default NavBar;
