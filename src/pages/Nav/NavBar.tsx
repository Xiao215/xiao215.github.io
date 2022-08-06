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
    <div className="fixed h-full overflow-auto">
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
