import React from 'react';
import { Chord as ChordModel } from '../models/Chord';
import Chord from './Chord';
import { Note } from '../models/Note';

interface ChordProgressionProps {
  progression: ChordModel[];
  fretboard: Note[][];
}

const ChordProgression: React.FC<ChordProgressionProps> = ({ progression, fretboard }) => {
  return (
    <div className="chord-progression">
      {progression.map((chord, index) => (
        <Chord key={index} chord={chord} fretboard={fretboard} />
      ))}
    </div>
  );
};

export default ChordProgression;