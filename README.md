**Fretboard Explorer 2.0**

________________________________________________________

OVERVIEW:

Fretboard Explorer is designed for guitarists who want to explore music theory and chord progressions, and their corresponding finger-positions across the fretboard. The program takes user input for a chord, key, or chord progression and computes all possible fingerings across the fretboard. Users can specify detailed chord qualities including major, minor, diminished, augmented, and extended chords such as 7th, 9th, and more. It supports specification of chord criteria (such as 3 strings only, or 3 frets apart) or modifications to match user preferences for finger patterns.  

________________________________________________________________________________________________________________

[IMPLEMENTATION 1] INTRACTIVE FRETBOARD FOR MUSIC THEORY EXPLORATION

A simple Array of all of the notes in the western scale [A, A#, B, C, C#, D, D#, E, F, F#, G, G#] are iterated through and wrapped around (%) to extract the correct notes from the appropriate chord formula. For instance, the C Major chord consists of 1-3-5, or C-E-G, and will be highlighted upon user selection.

Once chord notes are displayed, an algorithm will determine which combinations of these available notes within the selected chord can be considered a "valid chord", meaning that they are actually physically playable on the guitar in real life. This involves eliminating the possibility of more than one note per string, or that no 2 notes be 5 frets apart (for instance, depending on the length of your fingers). Various string customization parameters, such as "no open notes", or "don't skip strings" are implemented as well.  

________________________________________________________________________________________________________________

[IMPLEMENTATION 2] CHORD PROGRESSION GENERATOR FOR MUSIC COMPOSITION

All possible chords and their inversion possibilities, as well as their relationships within higher-order Chord Progressions & Keys, are to be implemented for a comprehensive music theory exploration and visualization tool. Final plans include the ability to feed the user various chord progression possibilities (based on some desired user criteria). For instance, if a user wants to be in the key of A minor and wants to explore the various chord progressions it offers, the program will follow outlined chord progression formulas and feed the user various Chord Progression possibilties that are "ready-made" to begin song-writing. 


![image](https://github.com/RidwanSharkar/Fretboard-2.0/assets/158855066/3ecf0a70-ade2-4e37-8158-b2a714cb42e3)





