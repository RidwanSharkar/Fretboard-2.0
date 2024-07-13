// utils/progressionUtils.ts

import { chordFormulas } from './chordUtils';

 
export type ScaleType = 'major' | 'minor';
export type RomanNumeral = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | 'vii' | 'ii°' | 'vii°';
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const chordProgressionRules: Record<ScaleType, Partial<Record<RomanNumeral, RomanNumeral[]>>> = {
    major: {
        'I': ['ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
        'ii': ['V', 'vii°'],
        'iii': ['vi', 'IV'],
        'IV': ['ii', 'V', 'vii°'],
        'V': ['I', 'vii°'],
        'vi': ['IV', 'ii'],
        'vii°': ['I', 'vi']
    },

    minor: {
        'i': ['ii°', 'III', 'iv', 'V', 'VI', 'VII'],
        'ii°': ['V', 'VII'],
        'III': ['iv', 'ii°', 'VI'],
        'iv': ['ii°', 'V', 'VII'], // 'V' for harmonic minor only
        'V': ['VII', 'i', 'vii°'], // 'v' melodic minor
        'VI': ['iv', 'ii°'],
        'VII': ['III', 'iv', 'ii°'] 
    }
};




export function generateChordProgression(isMinorKey: boolean, selectedKey: string): { root: string; type: keyof typeof chordFormulas }[] {
    const scaleType: ScaleType = isMinorKey ? 'minor' : 'major';
    const rules = chordProgressionRules[scaleType];
    const startingOptions: RomanNumeral[] = isMinorKey ? ['VI', 'VII'] : ['vi', 'iii'];
    const endingOptions: RomanNumeral[] = isMinorKey ? ['i', 'v'] : ['I', 'V'];

    let currentChord: RomanNumeral = startingOptions[Math.floor(Math.random() * startingOptions.length)];
    let progression: RomanNumeral[] = [currentChord];

    while (progression.length < 3 || !endingOptions.includes(currentChord)) {
        const possibleNextChords: RomanNumeral[] | undefined = rules[currentChord];
        if (possibleNextChords && possibleNextChords.length > 0) {
            currentChord = possibleNextChords[Math.floor(Math.random() * possibleNextChords.length)];
            progression.push(currentChord);
        } else {
            break;
        }
    }

    if (!endingOptions.includes(currentChord)) {
        currentChord = endingOptions[Math.floor(Math.random() * endingOptions.length)];
        progression.push(currentChord);
    }

    return progression.map(chord => getChordFromRomanNumeral(chord, selectedKey, notes, isMinorKey));
}

const romanNumeralToChordType: Record<RomanNumeral, keyof typeof chordFormulas> = {
        'i': 'minor',
        'ii°': 'diminished',
        'III': 'major',
        'iv': 'minor',
        'v': 'minor',
        'VI': 'major',
        'VII': 'major',
        'I': 'major',
        'ii': 'minor',
        'iii': 'minor',
        'IV': 'major',
        'V': 'major',
        'vi': 'minor',
        'vii°': 'diminished',
        // Unused but req
        'II': 'major',
        'vii': 'diminished'
};

export const getChordFromRomanNumeral = (
        romanNumeral: RomanNumeral,
        selectedKey: string,
        notes: string[],
        isMinorKey: boolean // Add this parameter to indicate if the key is minor
    ): { root: string; type: keyof typeof chordFormulas } => {
        const chordType = romanNumeralToChordType[romanNumeral];
        const rootIndex = notes.indexOf(selectedKey);
        let chordInterval = 0;
    
        switch (romanNumeral.toUpperCase().replace('°', '')) {
            case 'I': chordInterval = 0; break;
            case 'II': chordInterval = 2; break;
            case 'III': chordInterval = isMinorKey ? 3 : 4; break; // Minor third or major third
            case 'IV': chordInterval = 5; break;
            case 'V': chordInterval = 7; break; // Perfect fifth
            case 'VI': chordInterval = isMinorKey ? 8 : 9; break; // Minor sixth or major sixth
            case 'VII': chordInterval = isMinorKey ? 10 : 11; break; // Minor seventh or major seventh
            default: chordInterval = 0;
        }
    
        const chordRoot = notes[(rootIndex + chordInterval) % 12];
        return { root: chordRoot, type: chordType };
    };


