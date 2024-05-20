// src/utils/pianoUtils.ts
import { PianoNote } from '../models/Note';

const noteColors: { [key: string]: string } = {
  C: '#93bb70', 'C#': '#bcdfd0', D: '#7bb5c8', 'D#': '#95b2d9',
  E: '#234b7e', F: '#A285bf', 'F#': '#EFC3DF', G: '#c2586a',
  'G#': '#eea07d', A: '#d78438', 'A#': '#ebd49e', B: '#e6d06f'
};

export const createPianoKeys = (): PianoNote[] => {
  const keys = [
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
    'A', 'A#', 'B', 'C'
  ]; // Example keys for multiple octaves

  return keys.map(key => ({
    key: key,
    color: noteColors[key] || '#f5f5f5'
  }));
};