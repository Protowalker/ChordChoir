import { Chord } from "./Music/Chords";

interface ChordSequenceAdd {
  kind: "add";
  newChord: Chord;
  // if undefined, last
  index?: number;
}
interface ChordSequenceRemove {
  kind: "remove";
  startIndex: number;
  endIndex: number;
}
interface ChordSequenceUpdate {
  kind: "update";
  index: number;
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

type Action =
  | ChordSequenceAdd
  | ChordSequenceRemove
  | ChordSequenceUpdate
  | ChordSequenceMove
  | ChordSequenceSetLength;

const chordSequenceReducer = (oldState: Chord[], action: Action): Chord[] => {
  switch (action.kind) {
    case "add": {
      let newState = oldState.slice();
      if (action.index === undefined) action.index = -1;
      newState.splice(action.index, 0, action.newChord);
      return newState;
    }

    case "remove": {
      let newState = oldState.slice();
      newState.splice(action.startIndex, action.endIndex - action.startIndex);
      return newState;
    }
    case "update": {
      let newState = oldState.slice();
      newState[action.index] = action.newChord;
      return newState;
    }
    case "move": {
      let newState = oldState.slice();
      let chord = newState.splice(action.oldIndex, 1)[0];
      newState.splice(action.newIndex, 0, chord);
      return newState;
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
  }
};

export default chordSequenceReducer;
