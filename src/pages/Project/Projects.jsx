import styled from 'styled-components';
import Card from './ProjectCard';
import data from '../../data/projects';
import './style.css';
const colorOrder=[
  "#e53e41",
  "#0077b6",
  "#388e3c",
  "#f9a825",
]
const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
function Projects(){
  return (
   <div className="snap-x overflow-scroll flex pl-6 scroll-pl-6 ml-5 no-scrollbar py-5">
        {data.map((item, index) => (
          <div 
            className="snap-start mr-10">
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
  );
}

export default Projects;
