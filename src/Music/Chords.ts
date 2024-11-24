import { nanoid } from "nanoid";
import { Mode, Note, parseNote } from "./Notes";

export const enum ExtensionState {
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
	id: string;
	extensions: Extensions;
	length: number;

	constructor(
		base: Note = parseNote("C4")!,
		mode: Mode = Mode.Major,
		extensions: Extensions = new Extensions(),
		length: number = 1
	) {
		this.base = base;
		this.mode = mode;
		this.extensions = extensions;
		this.id = nanoid();
		this.length = length;
	}

	public getArray(): string[] {
		const patterns: { [K in Mode]: number[] } = {
			[Mode.Major]: [0, 4, 7],
			[Mode.Minor]: [0, 3, 7],
			[Mode.Root]: [0, 7],
			[Mode.Sus2]: [0, 2, 7],
			[Mode.Sus4]: [0, 5, 7],
		};

		let notes = [];

		for (let num of patterns[this.mode]) {
			notes.push(this.base.offset(num).toString());
		}

		// TODO: Calculate these offsets instead of hardcoding them
		// Seventh = 10 half-steps
		// Ninth = 14 half-steps
		// Eleventh = 17 half-steps

		function getExtensionOffset(
			extension:
				| ExtensionState.Flat
				| ExtensionState.Normal
				| ExtensionState.Sharp
		): number {
			return [-1, 0, 1][
				[
					ExtensionState.Flat,
					ExtensionState.Normal,
					ExtensionState.Sharp,
				].indexOf(extension)
			];
		}

		if (this.extensions.seventh !== ExtensionState.Off)
			notes.push(
				this.base
					.offset(10 + getExtensionOffset(this.extensions.seventh))
					.toString()
			);

		if (this.extensions.ninth !== ExtensionState.Off)
			notes.push(
				this.base
					.offset(14 + getExtensionOffset(this.extensions.ninth))
					.toString()
			);

		if (this.extensions.eleventh !== ExtensionState.Off)
			notes.push(
				this.base
					.offset(17 + getExtensionOffset(this.extensions.eleventh))
					.toString()
			);

		return notes;
	}

	public isEqual(rhs: Chord): boolean {
		return JSON.stringify(this) === JSON.stringify(rhs);
	}
}
