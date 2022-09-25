import menu from "../../data/nav";
import NavItem from "./NavItem";
import BottomIcons from "./BottomIcons";
import Screen from "../../Component/Screen/Screen";
import "./style.css";
const menuItem = menu.item;
const iconItem = menu.external;
function NavBar() {
  const { width } = Screen();
  return (
    <div className="font-raleway fixed h-full overflow-y-scroll no-scrollbar justify-between">
      <div>
        <NavItem menuItem={menuItem}></NavItem>
      </div>
      <div className="absolute w- bottom-8 left-8">
        <BottomIcons data={iconItem}></BottomIcons>
      </div>
    </div>
  );
}

export default NavBar;
