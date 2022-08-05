import {Button,Typography, Box} from "@mui/material/"
interface menuProps{
  menuItem:{label: string;
    href: string;
  }[]
}
function NavItem({menuItem}:menuProps){
  return(
    <Box className="h-full" sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
    {
      menuItem.map((item,index:number)=>{
        return(
          <div className="mx-2 text-4xl py-4 hover:bg-themeTwo-900 hover:bg-opacity-10" >{item.label}</div>
        )
      })
    }
  </Box>
  )
}

export default NavItem;
