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
