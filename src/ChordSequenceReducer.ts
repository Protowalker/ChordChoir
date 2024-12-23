import { arrayMove } from "@dnd-kit/sortable";
import { Chord } from "./Music/Chords";

interface ChordSequenceAdd {
	kind: "add";
	newChord: Chord;
	// if undefined, last
	index?: number;
}
interface ChordSequenceRemove {
	kind: "remove";
	id: string;
}
interface ChordSequenceRemoveAt {
	kind: "removeAt";
	startIndex: number;
	endIndex: number;
}
interface ChordSequenceUpdate {
	kind: "update";
	id: string;
	newChord: Chord;
}
interface ChordSequenceMove {
	kind: "move";
	oldIndex: number;
	newIndex: number;
}

interface ChordSequenceSetLength {
	kind: "setLength";
	length: number;
}

interface ChordSequenceOverwrite {
	kind: "overwrite";
	newSequence: Chord[];
}

export type ChordSequenceAction =
	| ChordSequenceAdd
	| ChordSequenceRemove
	| ChordSequenceRemoveAt
	| ChordSequenceUpdate
	| ChordSequenceMove
	| ChordSequenceSetLength
	| ChordSequenceOverwrite;

const chordSequenceReducer = (
	oldState: Chord[],
	action: ChordSequenceAction
): Chord[] => {
	switch (action.kind) {
		case "add": {
			let newState = oldState.slice();
			if (action.index === undefined) action.index = newState.length;
			newState.splice(action.index, 0, action.newChord);
			return newState;
		}

		case "remove": {
			let newState = oldState.slice();
			const index = newState.findIndex((c) => c.id === action.id);
			newState.splice(index, 1);
			return newState;
		}

		case "removeAt": {
			let newState = oldState.slice();
			newState.splice(
				action.startIndex,
				action.endIndex - action.startIndex + 1
			);
			return newState;
		}
		case "update": {
			let newState = oldState.slice();
			const oldChordIndex = newState.findIndex((c) => c.id === action.id);
			action.newChord.id = action.id;
			newState[oldChordIndex] = action.newChord;
			return newState;
		}
		case "move": {
			return arrayMove(oldState, action.oldIndex, action.newIndex);
		}
		case "setLength": {
			let newState = oldState.slice(0, action.length);
			if (action.length > oldState.length) {
				for (let i = oldState.length; i < action.length; i++) {
					newState.push(new Chord());
				}
			}

			return newState;
		}
		case "overwrite": {
			return action.newSequence;
		}
	}
};

export default chordSequenceReducer;
