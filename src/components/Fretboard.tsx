import React, { useState } from 'react';
import './Fretboard.css';
import { Note } from '../models/Note';

interface FretboardProps {
  notes: Note[][];
}

const noteColors: { [key: string]: string } = {
  C: '#93bb70',    
  'C#': '#bcdfd0',   
  D: '#7bb5c8',     
  'D#': '#95b2d9',   
  E: '#234b7e',    
  F: '#A285bf',     
  'F#': '#EFC3DF',    
  G: '#c2586a',     
  'G#': '#eea07d',   
  A: '#d78438',     
  'A#': '#ebd49e',    
  B: '#e6d06f'      
};

// #7090C5
// #94DEE8
// #BDE38C
// #EFE391
// #F5AB72
// #F88787



const Fretboard: React.FC<FretboardProps> = ({ notes }) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const handleFretClick = (note: Note) => {
    setActiveNote(note);
  };

  return (
    <div className="fretboard">
      {notes.map((stringNotes, stringIndex) => (
        <div key={stringIndex} className="string">
          {stringNotes.map((note, fretIndex) => (
            <div
              key={fretIndex}
              className={`fret ${activeNote === note ? 'active' : ''} ${fretIndex === 0 ? 'open-note' : ''}`}
              onClick={() => handleFretClick(note)}
              style={{
                backgroundColor: activeNote === note ? noteColors[note.name] : '#f5f5f5'
              }}
            >
              {activeNote === note && <span className="note">{note.name}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Fretboard;