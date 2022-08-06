import Icon from '@mdi/react';

interface iconProps{
    data:{
    mdiName: any;
    link: string;
    }[]
}
function BottomIcons({data}:iconProps){  
  return (
    <div className="bottomIcons">
        {data.map((item,index)=>{
            return(
            <Icon path={item.mdiName}
                title="User Profile"
                size={1}
                horizontal
                vertical
                rotate={90}
                color="red"
                spin/>
                )
            }
            )
        }
         
    </div>
  );
}

export default BottomIcons;
