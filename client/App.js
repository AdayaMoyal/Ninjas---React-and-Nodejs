import React, { useState } from 'react';
import "./App.css";
import SearchBar from "./searchBar.js";
import Chat from './chat.js';
import instructions from './InstructionsForBot.PNG';
  
const filterAttacks = (attacks, query) => {
  if (!query) {
      return attacks;
  }

  return attacks.filter((attack) => {
      const attackDescriptionLowerCase = attack.description.toLowerCase();
      const attackDescriptionUpperCase = attack.description.toUpperCase();
      const attackDescriptionRegular = attack.description;
      return attackDescriptionLowerCase.includes(query) || attackDescriptionUpperCase.includes(query) || attackDescriptionRegular.includes(query);
  });
};

const instructionsWindow = () => {
    const openInstructions = window.open('', 'instructions', 'width=830,height=470');
    openInstructions.document.write(`<img src="${instructions}"/>`);
};

function App() {
  const [attacks, setAttacks] = useState([]);
  const { search } = window.location;
  const query = new URLSearchParams(search).get('query');
  const [searchQuery, setQuery] = useState(query || '');
  React.useEffect(() => {
    var exist = false;
    fetch("http://localhost:7000")
      .then((res) => res.json())
      .then((data) => {
        if(exist === false)
        {
          exist = true;
          setAttacks(data);
        }
      })
  }, []);

  const filteredAttacks = filterAttacks(attacks, searchQuery);
  
  return (
    <div className="App">
        <h1>Welcome to ADAttack</h1>
        <h2>By Adaya Moyal</h2>
        <button className='buttonDesign' type="button" onClick={instructionsWindow} id="btInstructions">Show Instructions For Bot</button>
        <Chat information={attacks}/>
        <SearchBar 
         searchQuery={searchQuery}
         setQuery={setQuery}
     />
            <ul className='designForUL'>
                {filteredAttacks.map((attack) => (
                    <li> <span style={{ fontWeight: 'bold' }}>{attack.name}</span>:<br/>
                    {attack.description}<br/>Phase name: {attack.phase_name}<br/>Id: {attack.id}<br/>x_mitre_platforms: {attack.x_mitre_platforms}<br/>x_mitre_detection: {attack.x_mitre_detection}<br/><br/></li>
                ))}
            </ul>
            
    </div>
    
  );
}

export default App;