import color from "../../data/color";
function BottomIcons({ data }) {
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="flex flex-col gap-5">
      {data.map((item, index) => {
        return (
          <div className="flex gap-5" key={index}>
            {item.map((icon, index) => {
              return (
                <div
                  className={
                    "m-auto mt-3 cursor-pointer hover:scale-125 transition duration-300"
                  }
                  key={index}
                  onClick={() => openInNewTab(icon.link)}
                >
                  {icon.logo}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default BottomIcons;
