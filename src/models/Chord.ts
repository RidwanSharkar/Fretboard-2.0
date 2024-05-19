import { Note } from './Note';

export interface Chord {
  root: string;
  formula: string[];
  positions: Note[];
}