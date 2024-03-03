import { assert } from "../Utilities/common";
import { Chord } from "./Chords";
import { Note, modes, parseNote } from "./Notes";

type ParsedLink = 
{tempo: number, key: Note, sequence: Chord[]}


export function tryParseLink(query: string): ParsedLink | null {
	try {
		return parseLink(query);
	} catch {
		return null;
	}
}

export function parseLink(query: string): ParsedLink  {
	const chars = [...query];
	let curr = chars.shift();

	// Parse tempo
	let tempoStr = "";
	while (curr) {
		let num = parseInt(curr);
		if (isNaN(num)) {
			break;
		}
		tempoStr += curr;

		curr = chars.shift();
	}
	const tempo = parseInt(tempoStr);

	// Parse key
	let keyStr = "";
	keyStr += curr;
	keyStr += chars.shift();

	curr = chars.shift();
	while (curr) {
		if (curr === ";") {
			break;
		}
		keyStr += curr;
		curr = chars.shift();
	}

	const key = parseNote(keyStr);
	assert(key, `invalid key "${keyStr}"`);

	//Parse chords
	const chordSequence: Chord[] = [];
	while (chars.length) {
		const first = base64ToNumber(chars.shift()!);
		const second = base64ToNumber(chars.shift()!);

		const offset = first >> 2;
		const mode = ((first & 0b11) << 2) | (second >> 4);
		const length = second & 0b1111;

		assert(
			Object.keys(modes).includes(mode.toString()),
			`Invalid mode ${mode}`
		);

		const third = base64ToNumber(chars.shift()!);

		const extensionSeventh = third >> 4;
		const extensionNinth = (third >> 2) & 0b11;
		const extensionEleventh = third & 0b11;

		const chord = new Chord(key.offset(offset), mode, {
			seventh: extensionSeventh,
			ninth: extensionNinth,
			eleventh: extensionEleventh,
		});
		chordSequence.push(chord);
	}

	return {tempo: tempo, key: key, sequence: chordSequence};
}

export function encodeLink(tempo: number, key: Note, chordSequence: Chord[]): string {
	let result = "";
	result += tempo;
	result += key.toString();
	result += ";";
	for (const chord of chordSequence) {
		const offset = (chord.base.getNumber() - key.getNumber()) % 12;
		const mode = chord.mode;
		// TODO: when adding different lengths, change this
		const length = 1;
		assert(length < 16, "invalid length");

		const first = (offset << 2) | (mode >> 2);
		const second = ((mode & 0b11) << 4) | length;
		const third = 
			(chord.extensions.seventh << 4) |
			(chord.extensions.ninth << 2) |
			chord.extensions.eleventh;

			result += base64Table[first];
			result += base64Table[second];
			result += base64Table[third];
	}

	return result;
}

export const base64Table =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function base64ToNumber(char: string): number {
	return base64Table.indexOf(char);
}
