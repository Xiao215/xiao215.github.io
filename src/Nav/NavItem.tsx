interface menuProps{
  menuItem:{label: string;
    href: string;
  }[]
}
function NavItem({menuItem}:menuProps){
  return(
    <p>{menuItem[0].label}</p>
  )
}

export default NavItem;
