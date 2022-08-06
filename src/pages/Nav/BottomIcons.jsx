import Icon from '@mdi/react';
import {color} from '../../data/color';
function BottomIcons({data}){  
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="flex flex-col ml-4">
        {data.map((item,index)=>{
            return(
            <Icon path={item.mdiName}
                onClick={()=>openInNewTab(item.link)}
                key={index}
                size={2}
                color={color[(index+1)%4]}
                className="mt-3 cursor-pointer hover:scale-125 transition duration-300"
                />
                )
            }
            )
        }
    </div>
  );
}

export default BottomIcons;
