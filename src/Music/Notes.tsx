import { Grid } from "@material-ui/core";
import { PassThrough } from "node:stream";
import React from "react";
import { useRef } from "react";
import Tone from 'tone';


export enum NoteLetter {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G'
}




export class Note {
  letter: NoteLetter = NoteLetter.A;
  sharp: boolean =  false;
  octave: number = 0;

  public getNumber(): number {
    const noteLookup = 'CDEFGBA';
    let noteIndex = noteLookup.indexOf(this.letter) * 2;
    if (noteIndex/2 > noteLookup.indexOf('B')) noteIndex -= 1;
    if (noteIndex/2 > noteLookup.indexOf('E')) noteIndex -= 1;
    
    const num = (this.octave * 12) + noteIndex + (this.sharp ? 1 : 0);
    return num;
  }

  public getFreq(): number {
    const twelfth_root = 1.059463094359;
    return Math.pow(twelfth_root, this.getNumber() - 49) * 440;
  }

  public static fromNumber(number: number): Note {
    const notes: Note[] = [
  
      parseNote("C"),
      parseNote("C#"),
      parseNote("D"),
      parseNote("D#"),
      parseNote("E"),
      parseNote("F"),
      parseNote("F#"),
      parseNote("G"),
      parseNote("G#"),
      parseNote("A"),
      parseNote("A#"),
      parseNote("B"),
    ];
    
    
    let note = notes[number % 12];
    const octave = Math.floor(number / 12);

    note.octave = octave;
    return note;
  }

  // Get the note that is offset from this one by `offset` half-steps
  public offset(offset: number): Note {
    return Note.fromNumber(this.getNumber() + offset);
  }

  // Takes the form of A#3
  public toString(): string {
    return this.letter + (this.sharp ? '#' : '') + this.octave;
  }
}

export enum Mode {
  Root = "Root",
  Major = "Major",
  Minor = "Minor",
  Sus2 = "Sus2",
  Sus4 = "Sus4",
}

export function Modes(props: { onChange(mode: Mode): void, currentMode: Mode }): React.ReactElement {
  const selectedRef = useRef<HTMLSelectElement>(null);

  let modes = [];

  for (const value in Mode) {
    modes.push(value);
  }

  modes = modes.filter((mode) => isNaN(parseInt(mode)));

  return (
    <select
      ref={selectedRef}
      onChange={() =>
        props.onChange((selectedRef.current?.value as any) as Mode)
      }
    >
      {modes.map((val) => (
        <option key={val} value={val} selected={val===props.currentMode}>
          {val}
        </option>
      ))}
    </select>
  );
}


// Takes the form of A#3
export function parseNote(note: string): Note {
    const letter = note[0];
    const sharp = note[1] === "#";
    
    let octave: number;
  if (note[1] && note[2])
    octave = parseInt(note[2]);
  else if (!sharp)
    octave = parseInt(note[1]);
  else
    octave = 0;
  
  let retNote = new Note();
  retNote.letter = letter as NoteLetter;
  retNote.octave = octave;
  retNote.sharp = sharp;

  return retNote;
}



export const range = (start: number, end: number) => Array.from({length: (end - start)}, (v, k) => k + start);

export interface NotesProps {
  startingNote: Note,
  onChange: (note: Note) => void
}

export function Notes(props: NotesProps): React.ReactElement {
  const noteRef = useRef<HTMLSelectElement>(null);
  const startingNumber = props.startingNote.getNumber();



  return (
    <Grid container item justify="center">
      <select ref={noteRef} onChange={() => props.onChange(Note.fromNumber(parseInt(noteRef.current?.value ?? 'A0' /*We need to explicitly nullcheck here even though it's impossible for this to ever be null */)))}>
        {range(0, 12).map((num) => {
          return (<option key={num} value={startingNumber + num}> {props.startingNote.offset(num).toString()} </option>);
        })}
      </select>
    </Grid>);
}

export enum ExtensionState {
  Off = 0,
  Normal = 1,
  Flat = 2,
  Sharp = 3,
}

export class Extensions {
  seventh: ExtensionState = ExtensionState.Off;
  ninth: ExtensionState = ExtensionState.Off;
  eleventh: ExtensionState = ExtensionState.Off;
}

export class Chord {
  base: Note;
  mode: Mode;
  extensions: Extensions;

  constructor(base: Note = parseNote("C4"), mode: Mode = Mode.Major, extensions: Extensions = new Extensions()) {
    this.base = base;
    this.mode = mode;
    this.extensions = extensions;
  }

  public getArray(): string[] {
    const patterns: { [K in Mode]: number[] } = {
      [Mode.Major]: [0, 4, 7],
      [Mode.Minor]: [0, 3, 7],
      [Mode.Root]: [0, 7],
      [Mode.Sus2]: [0, 2, 7],
      [Mode.Sus4]: [0, 5, 7]
    };
  
    let notes = [];
  
    for (let num of patterns[this.mode]) {
      notes.push(this.base.offset(num).toString());
    }

    // TODO: Calculate these offsets instead of hardcoding them
    // Seventh = 10 half-steps
    // Ninth = 14 half-steps
    // Eleventh = 17 half-steps

    console.log(this.extensions);

    
    function getExtensionOffset(extension: ExtensionState.Flat | ExtensionState.Normal | ExtensionState.Sharp): number {
      return [-1, 0, 1][[ExtensionState.Flat, ExtensionState.Normal, ExtensionState.Sharp].indexOf(extension)];
    }

    if (this.extensions.seventh !== ExtensionState.Off)
      notes.push(this.base.offset(10 + getExtensionOffset(this.extensions.seventh)).toString());
    
    if (this.extensions.ninth !== ExtensionState.Off)
      notes.push(this.base.offset(14 + getExtensionOffset(this.extensions.ninth)).toString());
      
    
    if (this.extensions.eleventh !== ExtensionState.Off)
      notes.push(this.base.offset(17 + getExtensionOffset(this.extensions.eleventh)).toString());
      

  
    return notes;
  }
}

