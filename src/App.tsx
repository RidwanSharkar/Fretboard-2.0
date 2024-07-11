// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
import { constructFretboard, possibleChord } from './utils/fretboardUtils';
import { GuitarNote, ChordPosition } from './models/Note';
import { chordFormulas, ChordType, ChordInfo } from './utils/chordUtils';
import { playNote } from './utils/midiUtils';

/*=================================================================================================================*/
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
/*const intervals = ['R', 'm2', 'M2', 'm3', 'M3', 'P4', 'T', 'P5', 'm6', 'M6', 'm7', 'M7'];*/
/*=================================================================================================================*/

const App: React.FC = () => 
{
    const [fretboard, setFretboard] = useState<GuitarNote[][]>(() => constructFretboard(6, 16));
    const [activeNotes, setActiveNotes] = useState<{ note: string; interval: string }[]>([]);
    const [selectedKey, setSelectedKey] = useState('C');
    const [selectedChord, setSelectedChord] = useState<{ root: string; type: keyof typeof chordFormulas } | null>(null);
    const [includeSeventh, setIncludeSeventh] = useState(false);
    const [includeNinth, setIncludeNinth] = useState(false);
    const [isMinorKey, setIsMinorKey] = useState(false);
    const [currentChordIndex, setCurrentChordIndex] = useState(-1);
    const [validChords, setValidChords] = useState<ChordPosition[][]>([]);
    const [highlightAll, setHighlightAll] = useState(false);
    const toggleHighlightAll = () => {setHighlightAll(!highlightAll);};
    const [activePositions, setActivePositions] = useState<ChordPosition[]>([]);
    const clearActivePositions = () => {setActivePositions([]);};
    const [isPlayable, setIsPlayable] = useState(false); // MIDI

    /*=================================================================================================================*/

    const updateChordNotes = useCallback((root: string, type: keyof typeof chordFormulas, includeSeventh: boolean, includeNinth: boolean) => {
        const rootIndex = notes.indexOf(root);
        // Dominant 7th condition
        const fifthDegreeIndex = (notes.indexOf(selectedKey) + 7) % 12; // V degree in major 
        const seventhDegreeIndex = (notes.indexOf(selectedKey) + 10) % 12; // VII degree in minor
        const baseIntervals = chordFormulas[type].map((interval, index) => ({
            note: notes[(rootIndex + interval) % 12],
            interval: ['R', '3rd', '5th'][index % 3]
        }));
        let additionalIntervals = [];
    
        const shouldUseFlatSeventh = (type === 'minor7' || type === 'dominant7' || type === 'diminished7') ||
            (includeSeventh && (
                (type === 'major' && (
                    (!isMinorKey && notes[rootIndex] === notes[fifthDegreeIndex]) ||
                    (isMinorKey && notes[rootIndex] === notes[seventhDegreeIndex])
                )) ||
                (type === 'minor' || type === 'diminished')
            ));
        if (includeSeventh) {
            additionalIntervals.push({
                note: notes[(rootIndex + (shouldUseFlatSeventh ? 10 : 11)) % 12],
                interval: '7th'});
        }
        if (includeNinth) {
            additionalIntervals.push({ note: notes[(rootIndex + 14) % 12], interval: '9th' });
        }
        setActiveNotes([...baseIntervals, ...additionalIntervals]);
    }, [ selectedKey, isMinorKey ]);
    

    /*=================================================================================================================*/


    const findAndHighlightChord = useCallback(() => {
        if (!selectedChord) {
            console.log("No chord selected.");
            return;
        }
        /* merge function from updateChordNotes */
        const rootIndex = notes.indexOf(selectedChord.root);
        let noteNames = chordFormulas[selectedChord.type].map(interval => notes[(rootIndex + interval) % 12]);
        const fifthDegreeIndex = (notes.indexOf(selectedKey) + 7) % 12; // V degree in major 
        const seventhDegreeIndex = (notes.indexOf(selectedKey) + 10) % 12; // VII degree in minor
        const shouldUseFlatSeventh = (selectedChord.type === 'minor7' || selectedChord.type === 'dominant7' || selectedChord.type === 'diminished7') ||
            (includeSeventh && (
                (selectedChord.type === 'major' && (
                    (!isMinorKey && notes[rootIndex] === notes[fifthDegreeIndex]) ||
                    (isMinorKey && notes[rootIndex] === notes[seventhDegreeIndex])
                )) ||
                (selectedChord.type === 'minor' || selectedChord.type === 'diminished')
            ));
    
        if (includeSeventh) {
            const seventhInterval = shouldUseFlatSeventh ? 10 : 11;
            noteNames.push(notes[(rootIndex + seventhInterval) % 12]);}
        if (includeNinth) {
            noteNames.push(notes[(rootIndex + 14) % 12]);}

        if (validChords.length === 0 || currentChordIndex === -1) {
            const newValidChords = possibleChord(fretboard, noteNames);
            if (newValidChords.length > 0) {
                setValidChords(newValidChords);
                setCurrentChordIndex(0);
                setActivePositions(newValidChords[0]);
                setActiveNotes([]);
                setIsPlayable(true);} 
            else {
                console.log("No valid chords found.");
                setIsPlayable(false);}
        } 
        else {
            const nextIndex = (currentChordIndex + 1) % validChords.length;           // Cycle
            setCurrentChordIndex(nextIndex);
            setActivePositions(validChords[nextIndex]);
        }
    }, [selectedChord, fretboard, includeSeventh, includeNinth, currentChordIndex, validChords, selectedKey, isMinorKey]);
    
    const playChord = useCallback(() => {
        if (activePositions.length > 0) {
            const sortedPositions = activePositions.sort((a, b) => a.string === b.string ? a.fret - b.fret : b.string - a.string);
            sortedPositions.forEach((pos, index) => {
                const staggerTime = index * 0.05; // stagger time for strumming
                setTimeout(() => {
                    playNote(pos.string, pos.fret, fretboard, '8n', staggerTime);
                }, 100);
            });
        }
    }, [activePositions, fretboard]);

    /*=================================================================================================================*/

    const playRandomChordFromKey = useCallback((root: string, type: keyof typeof chordFormulas) => {
        if (!selectedKey) return;

        const randomToggle = Math.floor(Math.random() * 2); // Random 7th or 9th
        const newIncludeSeventh = randomToggle === 0;
        const newIncludeNinth = randomToggle === 1;

        setIncludeSeventh(newIncludeSeventh);
        setIncludeNinth(newIncludeNinth);
        setSelectedChord({ root, type });


        setCurrentChordIndex(-1);
        updateChordNotes(root, type, includeSeventh, includeNinth);
        const finds = Math.floor(Math.random() * 12) + 1;
        for (let i = 0; i < finds; i++) 
        {
            findAndHighlightChord();  
        }
    }, [selectedKey, includeSeventh, includeNinth, updateChordNotes, findAndHighlightChord]);

    useEffect(() => {
        if (selectedChord && activePositions.length > 0) {
            playChord();
        }
    }, [selectedChord, activePositions, playChord]);

   /*=================================================================================================================*/

    const renderRandomChordButtons = () => {
        const rootIndex = notes.indexOf(selectedKey);
        const pattern = isMinorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
        const types = isMinorKey ? ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
                                 : ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
        const degreeLabels = isMinorKey ? ['i', 'iiº', 'III', 'iv', 'v', 'VI', 'VII'] 
                                        : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiº']; 
        return (
                <div className="chord-and-play-buttons">
                <div className="play-buttons">
                    {pattern.map((shift, index) => {
                        const chordRoot = notes[(rootIndex + shift) % 12];
                        const type = types[index];
                        return (
                            <button key={`play-${index}`} 
                                onClick={() => playRandomChordFromKey(chordRoot, type as keyof typeof chordFormulas)}>
                                {degreeLabels[index]}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };



/*=================================================================================================================*/

    const cycleChords = (direction: 'next' | 'prev') => {
        if (validChords.length > 0) {
            let newIndex = direction === 'next' 
                ? (currentChordIndex + 1) % validChords.length 
                : (currentChordIndex - 1 + validChords.length) % validChords.length;
            setCurrentChordIndex(newIndex);
            setActivePositions(validChords[newIndex]);
        }
    };

/*=================================================================================================================*/

    useEffect(() => {
        console.log("Updating active positions for index:", currentChordIndex);
        if (validChords.length > 0 && currentChordIndex >= 0) {
            setActivePositions(validChords[currentChordIndex]);
        }
    }, [validChords, currentChordIndex]);

    /*
    useEffect(() => {
        if (activePositions.length > 0) {
            playChord();
        }
    }, [activePositions]);
    */

/*=================================================================================================================*/

    const handleChordSelection = (root: string, type: keyof typeof chordFormulas) => 
    {
        resetToggles();
        setSelectedChord({ root, type });
        setActiveNotes([]);
        setValidChords([]); // Clearing "Find"
        setCurrentChordIndex(-1); 
        updateChordNotes(root, type, includeSeventh, includeNinth);
    };  

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
                        const displayType = type === 'diminished' ? 'dim' : type;   // BUTTON TEXT CONVERT
                        const isSelectedChord = selectedChord && selectedChord.root === chordRoot && selectedChord.type === type;
                        return (
                            <button
                                className={`button ${isSelectedChord ? 'selected' : ''}`}
                                key={`${chordRoot}-${type}`}
                                onClick={() => handleChordSelection(chordRoot, type as keyof typeof chordFormulas)}>
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

    /*=================================================================================================================*/    

    const resetToggles = () => {
        setIncludeSeventh(false);
        setIncludeNinth(false);};
    const toggleSeventh = () => {
        setIncludeSeventh(prevSeventh => !prevSeventh);
        setIncludeNinth(false);};
    const toggleNinth = () => {
        setIncludeNinth(prevNinth => !prevNinth);
        setIncludeSeventh(false);};
    useEffect(() => {if (selectedChord) {updateChordNotes(selectedChord.root, selectedChord.type, includeSeventh, includeNinth);}}, 
        [selectedChord, includeSeventh, includeNinth, updateChordNotes]);


    /*=================================================================================================================*/

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
                    {renderRandomChordButtons()}
                </div>

                {/* Fretboard and toggles container */}
                <div className="fretboard-container">
                    <Fretboard notes={fretboard} activeNotes={activeNotes} highlightAll={highlightAll} activePositions={activePositions} clearActivePositions={clearActivePositions}/>
                    <div className="toggle-buttons">
                        <button onClick={toggleSeventh} className={`toggle-button ${includeSeventh ? 'active' : ''}`}>7th</button>
                        <button onClick={toggleNinth} className={`toggle-button ${includeNinth ? 'active' : ''}`}>9th</button>
                        <button onClick={toggleHighlightAll} className={`toggle-button ${highlightAll ? 'active' : ''}`}>All</button>
                        <button onClick={findAndHighlightChord} className="toggle-button">Find</button>
                        <button onClick={() => cycleChords('prev')} disabled={validChords.length <= 1} className="toggle-button">Prev</button>
                        <button onClick={() => cycleChords('next')} disabled={validChords.length <= 1} className="toggle-button">Next</button> 
                        <button onClick={playChord} disabled={!isPlayable} className="toggle-button">Play</button>
                    </div>
                        
                </div>


                <div className="fret-labels">
                        {Array.from({ length: 16 }).map((_, index) => (  
                            <div className="fret-label" key={index}>{index}</div>
                        ))}
                    </div>
        
            </header>
        </div>
    );
};

export default App;