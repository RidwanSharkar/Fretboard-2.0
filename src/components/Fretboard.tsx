// Fretboard.tsx

import React, { useState } from 'react';
import './Fretboard.css';
import { GuitarNote as Note } from '../models/Note';

interface FretboardProps {
  notes: Note[][];
  activeNotes: string[]; 
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

const Fretboard: React.FC<FretboardProps> = ({ notes, activeNotes }) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const handleFretClick = (note: Note) => {
    if (activeNote && activeNote.string === note.string && activeNote.fret === note.fret) {
      setActiveNote(null); // untoggle
    } else {
      setActiveNote(note);
    }
  };

  return (
    <div className="fretboard">
      {notes.map((stringNotes, stringIndex) => (
        <div key={stringIndex} className="string">
          {stringNotes.map((note, fretIndex) => {
            const isActive = activeNote === note || activeNotes.includes(note.name);
            return (
              <div
                key={fretIndex}
                className={`fret ${isActive ? 'active' : ''} ${fretIndex === 0 ? 'open-note' : ''}`}
                onClick={() => handleFretClick(note)}
                style={{
                  backgroundColor: isActive ? noteColors[note.name] : '#f5f5f5'
                }}
              >
                <span className="note">{note.name}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Fretboard;