import React from 'react';
import NavBar from './Nav/NavBar';
import Project from './Project/Projects';

function App(): JSX.Element{
  return (
    <div className="font-raleway" >
      <NavBar/>
      <Project/>
    </div>
  );
}

export default App;
