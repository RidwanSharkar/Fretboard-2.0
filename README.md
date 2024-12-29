# Fretboard Explorer v2.0
Fretboard Explorer is designed for guitarists who want to explore music theory and chord progressions, and their corresponding finger-positions across the fretboard.

## Overview: 

• The program takes user input for a chord, key, or chord progression and computes all possible fingerings across the fretboard. <br>
• Users can specify detailed chord qualities including major, minor, diminished, augmented, and extended chords such as 7th & 9th. <br>
• Fretboard supports specification of chord criteria (e.g. skipping strings for voicing) or modifications to match user preferences for finger patterns.  <br>


![All Chords in All Keys](https://github.com/RidwanSharkar/Fretboard-2.0/assets/158855066/f5535eca-b43c-4fac-ab7f-a23a4981c85b)

---

## Implementation 1: Interactive Music Theory Visualizer

• An array of all of the notes in the western scale [A, A#, B, C, C#, D, D#, E, F, F#, G, G#] are iterated through to extract the correct notes from the appropriate chord formula. For instance, the C Major chord consists of 1-3-5, or C-E-G, and will be highlighted upon user selection.

• Each chord belongs to a set of chords: [ I ii iii IV V VI Vii ] that form a 'key', all twelve of which are implemented as buttons on the Circle of Fifths for the user to explore.

• Once chord notes are displayed, an algorithm will determine which combinations of these available notes within the selected chord can be considered a "valid chord", meaning that they are actually physically playable on the guitar in real life. This involves eliminating the possibility of more than one note per string, or that no 2 notes be 5 frets apart (for instance, depending on the length of your fingers). Various chord customization parameters, such as "no open notes", or "don't skip strings" are available as well.  

![image](https://github.com/user-attachments/assets/32caf38b-1ec0-4297-82f3-af0eb0fbfaa5)

---

## Implementation 2: Chord Progression Generator for Composition

• If a user wants to be in the key of A minor, for instance, and wants to explore the various chord progressions it offers, the program will follow outlined chord progression formulas and feed the user various Chord Progression possibilties that are ready-made to begin song-writing. Options to break the rules of music theory are added to mimic realistic composition, including transitioning to and borrowing compatible chords from neighboring keys. 

![image](https://github.com/RidwanSharkar/Fretboard-2.0/assets/158855066/3ecf0a70-ade2-4e37-8158-b2a714cb42e3)

•  MIDI integration allows users to hear the exact chord displayed on the screen and throughout the generated chord progression. Randomly generated chord progressions that the user likes can be saved for future use. 

![image](https://github.com/user-attachments/assets/3b7c8e6e-9544-4da7-8e92-62bd72a4aab3)





