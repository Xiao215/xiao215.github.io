import {ReactComponent as UoftLogo} from "../../assets/logo-svg/uoft.svg";
import {Box} from '@mui/material';
import "./style.css";
function Academic({color, id}){
  return(
    <div>
    <p className={"underline underline-offset-8 text-4xl pl-10 font-bold text-"+color}>Academic</p>
    <Box sx={{width: 240}}>
      <UoftLogo className=""/>
    </Box>
  </div>
  )
}
export default Academic;
