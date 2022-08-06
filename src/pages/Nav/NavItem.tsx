import {Box} from "@mui/material/"
interface menuProps{
  menuItem:{label: string;
    href: string;
  }[]
}
const colorOrder: string[]=[
  " hover:bg-red-light text-red-default",
  " hover:text-blue-light text-blue-default ",
  " hover:text-green-light text-green-default",
  " hover:text-yellow-light text-yellow-default",
]
function NavItem({menuItem}:menuProps){
  return(
    <Box className="leftNav">
    {
      menuItem.map((item,index:number)=>{
        return(
          <div className={"duration-700 transition navItem mx-2 text-2xl py-4"+colorOrder[index]} key={index}>
            {item.label}</div>
        )
      })
    }
  </Box>
  )
}

export default NavItem;
