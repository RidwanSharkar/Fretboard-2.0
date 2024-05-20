import React, { useState } from 'react';
//import { PianoNote } from '../models/Note';
import { createPianoKeys } from '../utils/pianoUtils';
import './Piano.css';

const Piano: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const keys = createPianoKeys();

  const handleKeyClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Unselect if the same key is clicked again
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="piano">
      <div className="keys">
        {keys.map((note, index) => (
          <div key={index} className="key-container">
            <div 
              className={`key ${note.key.includes('#') ? 'black-key' : 'white-key'}`}
              onClick={() => handleKeyClick(index)}
              style={{ backgroundColor: activeIndex === index ? note.color : undefined }}
            >
              {activeIndex === index ? <span className="note-name">{note.key}</span> : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Piano;