import Card from './ProjectCard';
import data from '../../data/projects';
import './style.css';
const colorOrder=[
  "#e53e41",
  "#0077b6",
  "#388e3c",
  "#f9a825",
]
function Projects({color, id}:{color:string, id:string}){
  return (
    <div>
      <p className={"underline underline-offset-8 text-4xl pl-10 font-bold text-"+color}>Projects</p>
      <div className="snap-x pl-6 overflow-scroll flex scroll-pl-6 ml-5 no-scrollbar py-5">
          {data.map((item, index) => (
            <div className="snap-start mr-10" key={index}>
            <Card
              key={index}
              hexa={colorOrder[index%4]}
              title={item.title}
              description={item.description}
              image={item.image}
              link={item.link}
            />
            </div>
          ))}
        </div>
      </div>
  );
}

export default Projects;
