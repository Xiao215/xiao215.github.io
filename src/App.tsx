import React from 'react';
import NavBar from './pages/Nav/NavBar';
import Project from './pages/Project/Projects';

function App(): JSX.Element{
  return (
    <div className="font-raleway" >
      <NavBar/>
      <Project/>
    </div>
  );
}

export default App;
