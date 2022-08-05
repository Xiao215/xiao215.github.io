import styled from 'styled-components';
import Card from './ProjectCard';
import data from '../data/projects';
import './style.css';
const Grid = styled.div`
  display: flex;
  flex-wrap: nowrap;

  /* Fake padding-right */
  &::after {
    content: '';
    position: relative;
    display: block;
    flex-shrink: 0;
    height: 1px;
  }

  > button {
    margin-right: 40px;
  }

  /* Hide the others cards */
  > button:not(:first-child) {
    visibility: visible; /* switch to 'visible' */
  }
`;
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
   <Grid className="overflow-auto no-scrollbar py-10 px-10">
        {data.map((item, index) => (
          <Card
            key={index}
            hexa={colorOrder[index%4]}
            title={item.title}
            description={item.description}
            image={item.image}
            link={item.link}
          />
        ))}
      </Grid>
  );
}

export default Projects;
