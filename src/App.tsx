/* App.tsx */

import React, { useState, useEffect } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
import Chord from './components/Chord';
import { constructFretboard } from './utils/fretboardUtils';
import { GuitarNote as Note } from './models/Note';
import { chordFormulas } from './utils/chordUtils';

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const App: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<{ note: string; interval: string }[]>([]);
  const [includeSeventh, setIncludeSeventh] = useState(false);
  const [includeNinth, setIncludeNinth] = useState(false);
  const [selectedChord, setSelectedChord] = useState<{ root: string; type: keyof typeof chordFormulas } | null>(null);
  const fretboard: Note[][] = constructFretboard(6, 15);

  const handleChordSelection = (root: string, type: keyof typeof chordFormulas) => {
    setSelectedChord({ root, type });
  };

  useEffect(() => {
    if (!selectedChord) return;
  
    const { root, type } = selectedChord;
    const rootIndex = notes.indexOf(root);
    const baseIntervals = chordFormulas[type].map(interval => ({
      interval,
      label: ['R', '3rd', '5th'][chordFormulas[type].indexOf(interval) % 3]  // HMMM
    }));
  
    const additionalIntervals = [
      ...(includeSeventh ? [{ interval: type.includes("major") ? 11 : 10, label: '7th' }] : []),
      ...(includeNinth ? [{ interval: 14, label: '9th' }] : [])
    ];
  
    const chordIntervals = [...baseIntervals, ...additionalIntervals];
    const chordNotes = chordIntervals.map(item => ({
      note: notes[(rootIndex + item.interval) % 12],
      interval: item.label
    }));
  
    setActiveNotes(chordNotes);
  }, [selectedChord, includeSeventh, includeNinth]);

  const isSharp = (note: string) => note.includes('#');
  const toggleSeventh = () => {
    setIncludeSeventh(prev => !prev);
    if (includeNinth) setIncludeNinth(false);
  };
  
  const toggleNinth = () => {
    setIncludeNinth(prev => !prev);
    if (includeSeventh) setIncludeSeventh(false);
  };
  

return (
  <div className="App">
    <header className="App-header">
      <button onClick={toggleSeventh} style={{ marginBottom: '10px' }}>7th</button>
      <button onClick={toggleNinth} style={{ marginBottom: '10px' }}>9th</button>
      <div className="row">
        {notes.filter(note => !isSharp(note)).map(note =>
          ['major', 'minor'].map(type =>
            <button key={`${note}-${type}`} onClick={() => handleChordSelection(note, type as keyof typeof chordFormulas)}>
              {`${note} ${type}`}
            </button>
          )
        )}
      </div>
      <div className="row">
        {notes.filter(isSharp).map(note =>
          ['major', 'minor'].map(type =>
            <button key={`${note}-${type}`} onClick={() => handleChordSelection(note, type as keyof typeof chordFormulas)}>
              {`${note} ${type}`}
            </button>
          )
        )}
      </div>
      <Fretboard notes={fretboard} activeNotes={activeNotes} /> 
      {selectedChord && <Chord chord={{ root: selectedChord.root, formula: activeNotes.map(an => an.note) }} fretboard={fretboard} />}
    </header>
  </div>
  );
};

export default App;