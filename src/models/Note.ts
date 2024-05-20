export interface GuitarNote {
  string: number;
  fret: number;
  name: string;
}

export interface PianoNote {
  key: string;
  color: string; // To store color information for dynamic styling
}