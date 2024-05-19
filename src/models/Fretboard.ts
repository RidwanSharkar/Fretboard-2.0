import { Note } from './Note';

export interface Fretboard {
  strings: number;
  frets: number;
  notes: Note[][];
}
