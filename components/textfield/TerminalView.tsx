import Typewriter from "typewriter-effect";
const TerminalView = () => {
  const currentDate = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const pagesTerminal = [
    ".",
    "├── xiao215.tsx",
    "├── resume.tsx",
    "└── contact.tsx",
  ];
  return (
    <div className="md:w-1/2 w-5/6 mx-auto z-10">
      <div className="w-full shadow-2xl subpixel-antialiased rounded-lg h-72 bg-black border-black mx-auto">
        <div
          className="flex items-center h-6 rounded-t-lg bg-gray-100 border-b border-gray-500 text-center text-black"
          id="headerTerminal"
        >
          <div
            className="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
            id="closebtn"
          ></div>
          <div
            className="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
            id="minbtn"
          ></div>
          <div
            className="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
            id="maxbtn"
          ></div>
          <div className="mx-auto pr-16" id="terminaltitle">
            <p className="text-center text-md text-lg">Xiao's Terminal</p>
          </div>
        </div>
        <div
          className="pl-1 pt-1 h-auto  text-atompurple font-mono text-md bg-black"
          id="console"
        >
          <p className="pb-1">Last login: {currentDate} on ttys000</p>
          <p className="pb-1 flex flex-wrap">
            xiao215-MacBook-Pro:
            <span className="text-emerald-300">~&nbsp;</span>
            <span className="text-atomgray">cd Portfolio</span>
          </p>
          <p className="pb-1 flex flex-wrap">
            xiao215-MacBook-Pro:
            <span className="text-emerald-300">Portfolio&nbsp;</span>
            <span className="text-atomgray">tree</span>
          </p>
          {pagesTerminal.map((page, index) => (
            <p className="pb-1 text-atomred" key={index}>
              {page}
            </p>
          ))}
          <div className="flex flex-wrap pb-1">
            xiao215-MacBook-Pro:
            <span className="text-emerald-300">Portfolio&nbsp;</span>
            <div className=" text-atomgray">
              <Typewriter
                options={{
                  cursorClassName: "Typewriter__cursor text-atompurple",
                  delay: 60,
                  loop: true,
                  autoStart: true,
                  deleteSpeed: 30,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("Welcome to Xiao's Tea Pot!")
                    .pauseFor(2000)
                    .deleteAll()
                    .typeString("I am a software engineer.")
                    .pauseFor(2000)
                    .deleteChars(18)
                    .typeString("math enthusiast.")
                    .pauseFor(2000)
                    .deleteChars(16)
                    .typeString("weeb.")
                    .pauseFor(2000)
                    .start();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TerminalView;
