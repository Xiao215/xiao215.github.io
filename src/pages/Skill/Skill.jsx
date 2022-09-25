import { ReactComponent as React } from "../../assets/logo-svg/react.svg";
import { ReactComponent as Node } from "../../assets/logo-svg/nodejs.svg";
import { ReactComponent as Firebase } from "../../assets/logo-svg/firebase.svg";
import { ReactComponent as Electron } from "../../assets/logo-svg/electronjs.svg";
import { ReactComponent as Tailwind } from "../../assets/logo-svg/tailwind.svg";
import { ReactComponent as Flask } from "../../assets/logo-svg/flask.svg";
import { ReactComponent as Bootstrap } from "../../assets/logo-svg/bootstrap.svg";
import { ReactComponent as Heroku } from "../../assets/logo-svg/heroku.svg";

import { ReactComponent as JS } from "../../assets/logo-svg/js.svg";
import { ReactComponent as TS } from "../../assets/logo-svg/ts.svg";
import { ReactComponent as Java } from "../../assets/logo-svg/java.svg";
import { ReactComponent as C } from "../../assets/logo-svg/c.svg";
import { ReactComponent as CPP } from "../../assets/logo-svg/cpp.svg";
import { ReactComponent as Matlab } from "../../assets/logo-svg/matlab.svg";
import { ReactComponent as Python } from "../../assets/logo-svg/python.svg";
import "./style.css";

function Skill({ color, id }) {
  return (
    <div className="pl-10">
      <p
        className={
          "underline underline-offset-8 text-4xl font-bold text-" + color
        }
      >
        Skill
      </p>
      <div className="flex flex-wrap gap-2 container">
        {language.map((item, index) => {
          return <div key={index}>{item.component}</div>;
        })}
      </div>
      <div className="second ml-11 flex flex-wrap gap-2 container">
        {tool.map((item, index) => {
          return <div key={index}>{item.component}</div>;
        })}
      </div>
    </div>
  );
}
export default Skill;
const size = 11;
const language = [
  {
    name: "JavaScript",
    component: (
      <div className="hexagon color-js">
        <JS className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "TypeScript",
    component: (
      <div className="hexagon color-ts">
        <TS className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Python",
    component: (
      <div className="hexagon color-python">
        <Python className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "C++",
    component: (
      <div className="hexagon color-cpp">
        <CPP className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "C",
    component: (
      <div className="hexagon color-c">
        <C className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Java",
    component: (
      <div className="hexagon color-java">
        <Java className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Matlab",
    component: (
      <div className="hexagon color-matlab">
        <Matlab className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
];
const tool = [
  {
    name: "React",
    component: (
      <div className="hexagon color-react">
        <React className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "ElectronJS",
    component: (
      <div className="hexagon color-electron">
        <Electron className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "NodeJS",
    component: (
      <div className="hexagon color-nodejs">
        <Node className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Firebase",
    component: (
      <div className="hexagon color-firebase">
        <Firebase className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Tailwind",
    component: (
      <div className="hexagon color-tailwind">
        <Tailwind className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Heroku",
    component: (
      <div className="hexagon color-heroku">
        <Heroku className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  {
    name: "Bootstrap",
    component: (
      <div className="hexagon color-bootstrap">
        <Bootstrap className={"h-" + size + " w-" + size} />
      </div>
    ),
  },
  // {
  //   name: "Flask",
  //   component: (
  //     <div className="hexagon color-flask">
  //       <Flask className={"h-" + size + " w-" + size} />
  //     </div>
  //   ),
  // },
];
