import { Note } from '../models/Note';

export const constructFretboard = (strings: number, frets: number): Note[][] => {
  const notes: Note[][] = [];
  const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  for (let string = 0; string < strings; string++) {
    notes[string] = [];
    const openNoteIndex = noteNames.indexOf(standardTuning[string]);
    for (let fret = 0; fret < frets; fret++) {
      notes[string][fret] = {
        string,
        fret,
        name: noteNames[(openNoteIndex + fret) % 12]
      };
    }
  }
  return notes.reverse();
};