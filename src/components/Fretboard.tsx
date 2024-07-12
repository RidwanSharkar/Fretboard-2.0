// components/Fretboard.tsx

import React, { useState, useEffect } from 'react';
import './Fretboard.css';
import { GuitarNote as Note, ChordPosition  } from '../models/Note';

interface FretboardProps {
  notes: Note[][];
  activeNotes: { note: string; interval: string }[];
  highlightAll: boolean;
  activePositions: ChordPosition[];
  clearActivePositions: () => void;
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

const Fretboard: React.FC<FretboardProps> = ({
  notes, activeNotes, highlightAll, activePositions, clearActivePositions
}) => {

const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    clearActivePositions(); 
  }, [activeNotes, clearActivePositions]);

  const handleFretClick = (note: Note) => {
    setActiveNote(prevNote =>
      prevNote && prevNote.string === note.string && prevNote.fret === note.fret ? null : note
    );
  };

  const isActive = (string: number, fret: number) => {
    return highlightAll ||
           activeNotes.some(an => an.note === notes[string][fret].name) ||
           activePositions.some(pos => pos.string === string && pos.fret === fret);
  };

  return (
    <div className="fretboard">
      {notes.map((stringNotes, stringIndex) => (
        <div key={stringIndex} className="string">
          {stringNotes.map((note, fretIndex) => {
            const active = isActive(stringIndex, fretIndex);
            const activeDetail = activeNotes.find(an => an.note === note.name);
            return (
              <div
                key={fretIndex}
                className={`fret ${active ? 'active' : ''} ${fretIndex === 0 ? 'open-note' : ''}`}
                onClick={() => handleFretClick(note)}
                style={{ backgroundColor: active ? noteColors[note.name] : '#f5f5f5' }}
              >
                <span className="note">{note.name}</span>
                {active && (
                  <span className="note-label" style={{ position: 'absolute', top: '2px', left: '2px', fontSize: '8px', color: '#fff', fontWeight: 'bold' }}>
                    {activeDetail ? activeDetail.interval : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Fretboard;