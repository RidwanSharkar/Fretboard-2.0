import React from 'react';
import './Piano.css';

const whiteKeys = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'A', 'B', 'C', 'D', 'E'
];

const blackKeys = [
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', '', 'F#', 'G#',
  'A#', '', 'C#', 'D#', ''
];

const Piano: React.FC = () => {
  return (
    <div className="piano">
      <div className="keys">
        {whiteKeys.map((key, index) => (
          <div key={index} className="key-container">
            <div className="key white-key">
              {key}
            </div>
            {blackKeys[index] && blackKeys[index] !== '' && (
              <div className="key black-key">
                {blackKeys[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Piano;