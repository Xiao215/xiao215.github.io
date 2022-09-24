import menu from "../../data/nav";
import NavItem from './NavItem';
import BottomIcons from './BottomIcons';
import "./style.css";
const menuItem = menu.item;
const iconItem= menu.external;
function NavBar(){  
    
  return (
    <div className="font-raleway fixed h-full overflow-y-scroll no-scrollbar">
      <div className="justify-start">
          <NavItem menuItem={menuItem} ></NavItem>
          </div>
      <div className="bottom-0">
          <BottomIcons data={iconItem} ></BottomIcons>
          </div>
    </div>
  );
}

export default NavBar;
