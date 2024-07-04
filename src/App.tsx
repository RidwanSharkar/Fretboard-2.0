// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
import Chord from './components/Chord';
import { constructFretboard } from './utils/fretboardUtils';
import { chordFormulas } from './utils/chordUtils';

//=================================================================================================================//
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
//=================================================================================================================//

const App: React.FC = () => 
{
    const [activeNotes, setActiveNotes] = useState<{ note: string; interval: string }[]>([]);
    const [selectedKey, setSelectedKey] = useState('C');
    const [selectedChord, setSelectedChord] = useState<{ root: string; type: keyof typeof chordFormulas } | null>(null);
    const [includeSeventh, setIncludeSeventh] = useState(false);
    const [includeNinth, setIncludeNinth] = useState(false);
    const [isMinorKey, setIsMinorKey] = useState(false);
//=================================================================================================================//
    const handleKeySelection = (key: string, isMinor: boolean) => {
        console.log("Selected Key: ", key, " Is Minor: ", isMinor);
        setSelectedKey(key);
        setActiveNotes([]); 
        setIsMinorKey(isMinor); 
    };
    const renderChordsForSelectedKey = () => {
        const rootIndex = notes.indexOf(selectedKey);
        const pattern = isMinorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
        const types = isMinorKey ? ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
                                 : ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
    
        return pattern.map((shift, index) => {
            const chordRoot = notes[(rootIndex + shift) % 12];
            const type = types[index];
            return (
                <button key={`${chordRoot}-${type}`} onClick={() => handleChordSelection(chordRoot, type as keyof typeof chordFormulas)}>
                    {`${chordRoot} ${type}`}
                </button>
            );
        });
    };
//=================================================================================================================//    
const handleChordSelection = (root: string, type: keyof typeof chordFormulas) => 
    {
      setSelectedChord({ root, type });
      setIncludeSeventh(false);
      setIncludeNinth(false);
      updateChordNotes(root, type);
    };
//=================================================================================================================//
    const updateChordNotes = (root: string, type: keyof typeof chordFormulas) => 
    {
      const rootIndex = notes.indexOf(root);
      
      const baseIntervals = chordFormulas[type].map((interval, index) => 
      ({
        note: notes[(rootIndex + interval) % 12],
        interval: ['R', '3rd', '5th'][index % 3]
      }));
    
      let additionalIntervals = [];
      if (includeSeventh) {
        const isMajor7 = type === 'major7' || (type === 'major' && !chordFormulas[type].includes(10));
        additionalIntervals.push({
          note: notes[(rootIndex + (isMajor7 ? 11 : 10)) % 12],
          interval: '7th'
        });
      }
      if (includeNinth) {
        additionalIntervals.push({ note: notes[(rootIndex + 14) % 12], interval: '9th' });
      }
      setActiveNotes([...baseIntervals, ...additionalIntervals]);
    };
//=================================================================================================================//
    const toggleSeventh = () => {
        setIncludeSeventh(prev => {
            if (!prev) setIncludeNinth(false);
            return !prev;
        });
        if (selectedChord) {
            updateChordNotes(selectedChord.root, selectedChord.type);
        }
    };
    const toggleNinth = () => {
        setIncludeNinth(prev => {
            if (!prev) setIncludeSeventh(false);
            return !prev;
        });
        if (selectedChord) {
            updateChordNotes(selectedChord.root, selectedChord.type);
        }
    };

//=================================================================================================================//

    const radiusMajor = 175;
    const radiusMinor = 120;

    return (
        <div className="App">
            <header className="App-header">
                <div className="circle-container">
                    {keys.map((key, index) => {
                        const angleMajor = index * (360 / keys.length) - 90;
                        const angleMinor = angleMajor - 90; 

                        const xMajor = radiusMajor * Math.cos(angleMajor * Math.PI / 180);
                        const yMajor = radiusMajor * Math.sin(angleMajor * Math.PI / 180);
                        const xMinor = radiusMinor * Math.cos(angleMinor * Math.PI / 180);
                        const yMinor = radiusMinor * Math.sin(angleMinor * Math.PI / 180);

                        return (
                            <React.Fragment key={key}>
                                <button
                                    className="circle-button"
                                    style={{ transform: `translate(${xMajor}px, ${yMajor}px)` }}
                                    onClick={() => handleKeySelection(key, false)}
                                >
                                    {key} Major
                                </button>
                                <button
                                    className="circle-button minor"
                                    style={{ transform: `translate(${xMinor}px, ${yMinor}px)` }}
                                    onClick={() => handleKeySelection(key, true)}
                                >
                                    {key} Minor
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>


                {/* Chord Buttons */}
                <div className = "row">
                    {renderChordsForSelectedKey()}
                </div>

                {/* Toggle Buttons */}
                <div style={{ marginTop: '10px' }}>
                <button onClick={toggleSeventh} style={{ marginRight: '10px' }}>
                    7th
                </button>
                <button onClick={toggleNinth}>
                    9th
                </button>
                </div>

                {/* Fretboard */}
                <Fretboard notes={constructFretboard(6, 15)} activeNotes={activeNotes} />
            </header>
        </div>
    );
};

export default App;