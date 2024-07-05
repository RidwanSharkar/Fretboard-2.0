// App.tsx
import React, { useState } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
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

    const handleKeySelection = (key: string, isMinor: boolean) => {
        console.log("Selected Key: ", key, " Is Minor: ", isMinor);
        setSelectedKey(key);
        setIsMinorKey(isMinor);
        resetToggles();
        setActiveNotes([]); 
    };

    const renderChordsForSelectedKey = () => {
        const rootIndex = notes.indexOf(selectedKey);
        const pattern = isMinorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
        const types = isMinorKey ? ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
                                 : ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
        
        const degreeLabels = isMinorKey ? ['i', 'iiº', 'III', 'iv', 'v', 'VI', 'VII'] 
                                        : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiº'];     

        return (
            <div className="chord-container">
                <div className="chord-buttons">
                    {pattern.map((shift, index) => {
                        const chordRoot = notes[(rootIndex + shift) % 12];
                        const type = types[index];
                        // BUTTON TEXT CONVERT
                        const displayType = type === 'diminished' ? 'dim' : type;
                        const isSelectedChord = selectedChord && selectedChord.root === chordRoot && selectedChord.type === type;
    
                        return (
                            <button
                                className={`button ${isSelectedChord ? 'selected' : ''}`}
                                key={`${chordRoot}-${type}`}
                                onClick={() => handleChordSelection(chordRoot, type as keyof typeof chordFormulas)}
                            >
                                {`${chordRoot} ${displayType}`}
                            </button>
                        );
                    })}
                </div>
                <div className="chord-labels">
                    {degreeLabels.map(label => (
                        <div className="label" key={label}>{label}</div>
                    ))}
                </div>
            </div>
        );
    };


    //=================================================================================================================//    

    const handleChordSelection = (root: string, type: keyof typeof chordFormulas) => 
    {
        resetToggles();
        setSelectedChord({ root, type });
        setActiveNotes([]);
        updateChordNotes(root, type);
    };  

    const resetToggles = () => 
    {
        setIncludeSeventh(false);
        setIncludeNinth(false);
    };

    //=================================================================================================================//

    /* TOGGLING BUGGED, merge with chord change */
    const toggleSeventh = () => {
        if (selectedChord) {
            setIncludeNinth(false);  
            setIncludeSeventh(!includeSeventh); 
            updateChordNotes(selectedChord.root, selectedChord.type);
        }
    };

    const toggleNinth = () => {
        if (selectedChord) {
            setIncludeSeventh(false);  
            setIncludeNinth(!includeNinth);  
            updateChordNotes(selectedChord.root, selectedChord.type);
        }
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

    const radiusMajor = 175;
    const radiusMinor = 120;

    return (
        <div className="App">
            <header className="App-header">
            <div className="circle-container">
                {keys.map((key, index) => {
                    const angleMajor = index * (360 / keys.length) - 90;
                    const xMajor = radiusMajor * Math.cos(angleMajor * Math.PI / 180);
                    const yMajor = radiusMajor * Math.sin(angleMajor * Math.PI / 180);
                    const isSelectedMajor = selectedKey === key && !isMinorKey;

                    const angleMinor = angleMajor - 90; 
                    const xMinor = radiusMinor * Math.cos(angleMinor * Math.PI / 180);
                    const yMinor = radiusMinor * Math.sin(angleMinor * Math.PI / 180);
                    const isSelectedMinor = selectedKey === key && isMinorKey;
    
        return (
            <React.Fragment key={key}>
                <button
                    className={`circle-button ${isSelectedMajor ? 'selected' : ''}`}
                    style={{ transform: `translate(${xMajor}px, ${yMajor}px)` }}
                    onClick={() => handleKeySelection(key, false)}
                >
                    {key} Major
                </button>
                <button
                    className={`circle-button minor ${isSelectedMinor ? 'selected' : ''}`}
                    style={{ transform: `translate(${xMinor}px, ${yMinor}px)` }}
                    onClick={() => handleKeySelection(key, true)}
                >
                    {key} Minor
                </button>
            </React.Fragment>);})}


            <div className="circle-text">Select Key</div>
        </div>
            <div className="key-display">Chords in the Key of {selectedKey} {isMinorKey ? 'Minor' : 'Major'} </div>


                {/* Chord Buttons */}
                <div className = "row">
                    {renderChordsForSelectedKey()}
                </div>

                {/* Fretboard and toggles container */}
                <div className="fretboard-container"> 
                <Fretboard notes={constructFretboard(6, 15)} activeNotes={activeNotes} />
                <div className="toggle-buttons">
                    <button onClick={toggleSeventh} className="toggle-button">7th</button>
                    <button onClick={toggleNinth} className="toggle-button">9th</button>
                </div>
            </div>

            </header>
        </div>
    );
};

export default App;