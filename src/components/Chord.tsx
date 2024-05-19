import React, { useEffect, useState } from 'react';
import { Chord as ChordModel } from '../models/Chord';
import { Note } from '../models/Note';
import { generateChordPositions } from '../utils/chordUtils';

interface ChordProps {
  chord: ChordModel;
  fretboard: Note[][];
}

const Chord: React.FC<ChordProps> = ({ chord, fretboard }) => {
  const [positions, setPositions] = useState<Note[]>([]);

  useEffect(() => {
    setPositions(generateChordPositions(chord, fretboard));
  }, [chord, fretboard]);

  return (
    <div className="chord">
      {positions.map((note, index) => (
        <div key={index} className="note">
          String: {note.string}, Fret: {note.fret}, Note: {note.name}
        </div>
      ))}
    </div>
  );
};

export default Chord;