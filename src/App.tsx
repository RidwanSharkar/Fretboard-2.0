import React, { useState } from 'react';
import './App.css';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import Chord from './components/Chord';
import { constructFretboard } from './utils/fretboardUtils';
import { GuitarNote as Note } from './models/Note';
import { Chord as ChordModel } from './models/Chord';

const App: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);  // Manage active notes state
  const [chord, setChord] = useState<ChordModel>({ root: 'C', formula: ['major'] });
  const fretboard: Note[][] = constructFretboard(6, 15); // Example for a 6-string, 15-fret guitar

  const handleCmajor = () => {
    const cMajorNotes = ['C', 'E', 'G'];
    if (activeNotes.length > 0 && cMajorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]);
    } else {
      setActiveNotes(cMajorNotes);
    }
  };

  const handleDminor = () => {
    const dMinorNotes = ['D', 'F', 'A'];
    if (activeNotes.length > 0 && dMinorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]); 
    } else {
      setActiveNotes(dMinorNotes);
    }
  };

  const handleEminor = () => {
    const eMinorNotes = ['E', 'G', 'B'];
    if (activeNotes.length > 0 && eMinorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]); 
    } else {
      setActiveNotes(eMinorNotes);
    }
  };

  const handleFmajor = () => {
    const fMajorNotes = ['F', 'A', 'C'];
    if (activeNotes.length > 0 && fMajorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]);
    } else {
      setActiveNotes(fMajorNotes);
    }
  };

  const handleGmajor = () => {
    const gMajorNotes = ['G', 'B', 'D'];
    if (activeNotes.length > 0 && gMajorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]);
    } else {
      setActiveNotes(gMajorNotes);
    }
  };

  const handleAminor = () => {
    const aMinorNotes = ['A', 'C', 'E'];
    if (activeNotes.length > 0 && aMinorNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]); 
    } else {
      setActiveNotes(aMinorNotes);
    }
  };

  const handleBdiminished = () => {
    const bDiminishedNotes = ['B', 'D', 'F'];
    if (activeNotes.length > 0 && bDiminishedNotes.every(note => activeNotes.includes(note))) {
      setActiveNotes([]); 
    } else {
      setActiveNotes(bDiminishedNotes);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleCmajor}>C Major</button>
        <button onClick={handleDminor}>D Minor</button>
        <button onClick={handleEminor}>E Minor</button>
        <button onClick={handleFmajor}>F Major</button>
        <button onClick={handleGmajor}>G Major</button>
        <button onClick={handleAminor}>A Minor</button>
        <button onClick={handleBdiminished}>B° Dim</button>
        <Fretboard notes={fretboard} activeNotes={activeNotes} /> 
        <Piano />
        <Chord chord={chord} fretboard={fretboard} />
      </header>
    </div>
  );
};

export default App;