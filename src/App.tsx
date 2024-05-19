import React from 'react';
import './App.css';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import { constructFretboard } from './utils/fretboardUtils';
import { Note } from './models/Note';

const App: React.FC = () => {
  const fretboard: Note[][] = constructFretboard(6, 15); // Example for a 6-string, 15-fret guitar

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fretboard</h1>
        <Fretboard notes={fretboard} />
        <h1>Piano</h1>
        <Piano />
      </header>
    </div>
  );
};

export default App;
