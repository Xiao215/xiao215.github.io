import { Link } from "react-router-dom";
const colorOrder = [
  " hover:text-red-dark text-red-default",
  " hover:text-blue-dark text-blue-default ",
  " hover:text-green-dark text-green-default",
  " hover:text-yellow-dark text-yellow-default",
];
const lineOrder = [
  " bg-red-default group-hover:w-5 group-hover:bg-red-dark",
  " bg-blue-default group-hover:w-5 group-hover:bg-blue-dark",
  " bg-green-default group-hover:w-5 group-hover:bg-green-dark",
  " bg-yellow-default group-hover:w-5 group-hover:bg-yellow-dark",
];
function NavItem({ menuItem }) {
  return (
    <div>
      {menuItem.map((item, index) => {
        return (
          <Link to={item.link} className="no-underline" key={index}>
            <div
              className={
                "flex items-center group font-bold duration-700 cursor-pointer transition mx-2 py-4"
              }
            >
              <div
                className={
                  "w-0 h-0.5 translate duration-700" + lineOrder[index % 4]
                }
              ></div>
              <div
                className={
                  "text-2xl translate duration-700" + colorOrder[index % 4]
                }
              >
                {item.label}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default NavItem;
