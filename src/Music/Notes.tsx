import { Grid } from "@material-ui/core";
import React, { useRef } from "react";

export enum NoteLetter {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
}

export class Note {
  letter: NoteLetter = NoteLetter.A;
  sharp: boolean = false;
  octave: number = 0;

  public getNumber(): number {
    const noteLookup = "CDEFGAB";
    let noteIndex = noteLookup.indexOf(this.letter) * 2;
    //if ((noteIndex / 2) > noteLookup.indexOf('B')) noteIndex -= 1;
    if (noteIndex / 2 > noteLookup.indexOf("E")) noteIndex -= 1;

    const num = this.octave * 12 + noteIndex + (this.sharp ? 1 : 0);
    return num;
  }

  public getFreq(): number {
    const twelfth_root = 1.059463094359;
    return Math.pow(twelfth_root, this.getNumber() - 49) * 440;
  }

  public static fromNumber(number: number): Note {
    const notes: Note[] = [
      parseNote("C")!,
      parseNote("C#")!,
      parseNote("D")!,
      parseNote("D#")!,
      parseNote("E")!,
      parseNote("F")!,
      parseNote("F#")!,
      parseNote("G")!,
      parseNote("G#")!,
      parseNote("A")!,
      parseNote("A#")!,
      parseNote("B")!,
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
    return this.letter + (this.sharp ? "#" : "") + this.octave;
  }

  public getRelative(key: Note): string {
    const keyDifference = (this.getNumber() - key.getNumber()) % 12;
    let output = "";
    switch (keyDifference) {
      case 0:
        output = "I";
        break;
      case 1:
        output = "#I";
        break;
      case 2:
        output = "II";
        break;
      case 3:
        output = "#II";
        break;
      case 4:
        output = "III";
        break;
      case 5:
        output = "IV";
        break;
      case 6:
        output = "#IV";
        break;
      case 7:
        output = "V";
        break;
      case 8:
        output = "#V";
        break;
      case 9:
        output = "VI";
        break;
      case 10:
        output = "#VI";
        break;
      case 11:
        output = "VII";
        break;
      default:
        output = "???";
        break;
    }
    return output;
  }
}

export enum Mode {
  Root = "Root",
  Major = "Major",
  Minor = "Minor",
  Sus2 = "Sus2",
  Sus4 = "Sus4",
}

export function Modes(props: {
  onChange(mode: Mode): void;
  currentMode: Mode;
}): React.ReactElement {
  const selectedRef = useRef<HTMLSelectElement>(null);

  let modes = [];

  for (const value in Mode) {
    modes.push(value);
  }

  modes = modes.filter((mode) => isNaN(parseInt(mode)));

  return (
    <select
      ref={selectedRef}
      onChange={() => props.onChange(selectedRef.current?.value as any as Mode)}
    >
      {modes.map((val) => (
        <option key={val} value={val} selected={val === props.currentMode}>
          {val}
        </option>
      ))}
    </select>
  );
}

// class Maybe<T> {
//   #val: T | null;
//   constructor(val: T | null) {
//     this.#val = val;
//   }

//   public unwrap(): T {
//     return this.#val as T;
//   }

//   public isSome(): boolean {
//     return this.#val !== null;
//   }
// }

// function Some<T>(val: T): Maybe<T> {
//   return new Maybe(val);
// }
// function None<T>(): Maybe<T> {
//   return new Maybe<T>(null);
// }

// Takes the form of A#3
export function parseNote(note: string): Note | null {
  const letter = note[0]?.toUpperCase() ?? "C";
  const sharp = note[1] === "#";

  let octave: number;
  if (note[1] && note[2]) octave = parseInt(note[2]);
  else if (!sharp && note[1]) octave = parseInt(note[1]);
  else octave = 4;

  if (!(letter in NoteLetter)) return null;

  let retNote = new Note();
  retNote.letter = letter as NoteLetter;
  retNote.octave = octave;
  retNote.sharp = sharp;

  return retNote;
}

export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (v, k) => k + start);

export interface NotesProps {
  startingNote: Note;
  onChange: (note: Note) => void;
}

export const Notes = React.memo(function ({
  onChange,
  startingNote,
}: NotesProps): React.ReactElement {
  const noteRef = useRef<HTMLSelectElement>(null);
  const startingNumber = startingNote.getNumber();


  // Create the string for the dropdown. We want it in the form of C#5   (IV) with an equal spacing.
  const createDropdownText = React.useCallback(
    (num) => {
      // Get the note in string form.
      let noteString = startingNote.offset(num).toString();
      // Get the relative note in string form (roman numerals)
      let relativeString =
        "(" + startingNote.offset(num).getRelative(startingNote) + ")";

      return noteString + "    " + relativeString;
    },
    [startingNote]
  );

  return (
    <Grid container item justify="center">
      <select
        ref={noteRef}
        onChange={() =>
          onChange(
            Note.fromNumber(
              parseInt(
                noteRef.current?.value ??
                  "0" /*We need to explicitly nullcheck here even though it's impossible for this to ever be null */
              )
            )
          )
        }
      >
        {range(0, 12).map((num) => {
          return (
            <option key={num} value={startingNumber + num}>
              {" "}
              {createDropdownText(num)}{" "}
            </option>
          );
        })}
      </select>
    </Grid>
  );
}, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
