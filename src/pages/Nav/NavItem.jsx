const colorOrder=[
  " hover:text-red-dark text-red-default",
  " hover:text-blue-dark text-blue-default ",
  " hover:text-green-dark text-green-default",
  " hover:text-yellow-dark text-yellow-default",
]
function NavItem({menuItem}){
  return(
    <div>
    {
      menuItem.map((item,index)=>{
        return(
          <div className={"font-bold duration-700 cursor-pointer transition navItem mx-2 text-2xl py-4"+colorOrder[index]} 
            onClick={()=>window.location.replace(item.href)}key={index}>
            {item.label}
            </div>
        )
      })
    }
  </div>
  )
}

export default NavItem;
