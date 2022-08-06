import {Button,Typography, Box} from "@mui/material/"
interface menuProps{
  menuItem:{label: string;
    href: string;
  }[],
  side:number
}
const colorOrder: string[]=[
  " hover:text-red-light text-red-default",
  " hover:text-blue-light text-blue-default",
  " hover:text-green-light text-green-default",
  " hover:text-yellow-light text-yellow-default",
]
function NavItem({menuItem, side}:menuProps){
  return(
    <Box className="h-full" sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
    {
      menuItem.map((item,index:number)=>{
        if(side){
          index=3-index;
        }
        return(
          <div className={"transition mx-2 text-4xl py-4"+colorOrder[index]} key={index} >{item.label}</div>
        )
      })
    }
  </Box>
  )
}

export default NavItem;
