import Box from "@material-ui/core/Box";
import React, {
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import Controls from "./Controls";
import { Chords } from "./Chords";
import { Note, parseNote, range } from "../Music/Notes";
import * as Tone from "tone";
import { Chord } from "../Music/Chords";
import chordSequenceReducer, {
	ChordSequenceAction,
} from "../ChordSequenceReducer";

const synth = new Tone.PolySynth(Tone.Synth, { volume: -15 }).toDestination();

export type ControlValues = {
	tempo: number;
	key: Note;
	playing: boolean;
};

export const ControlsContext = createContext<
	[ControlValues, React.Dispatch<SetStateAction<ControlValues>>]
>([
	{
		tempo: 120,
		key: parseNote("C4")!,
		playing: false,
	},
	() => {},
]);

export const ChordsContext = createContext<
	[Chord[], React.Dispatch<ChordSequenceAction>]
>([[], () => {}]);

export default function App(): React.ReactElement {
	const toneSeq = useRef<Tone.Sequence<number>>();

	const [controls, setControls] = useState(() => ({
		tempo: 120,
		key: parseNote("C4")!,
		playing: false,
	}));


	const [activeChordIndex, setActiveChordIndex] = useState(-1);

	const [chordSequence, dispatchSequence] = useReducer(
		chordSequenceReducer,
		null,
		() =>
			Array(5)
				.fill(0)
				.map(() => new Chord())
	);

	useEffect(() => {
		if (!controls.playing) return;

		Tone.Transport.bpm.value = controls.tempo;


		const seq = new Tone.Sequence(
			(time, chordIndex) => {
				setActiveChordIndex(chordIndex);
				synth.triggerAttackRelease(
					chordSequence[chordIndex].getArray(),
					"8n",
					time
				);
				// subdivisions are given as subarrays
			},
			range(0, chordSequence.length),
			"4n"
		).start(0);
		toneSeq.current = seq;

		return () => {
			toneSeq.current?.dispose();
		};
	}, [chordSequence, controls]);

	const togglePlay = useCallback(async () => {
		if (controls.playing === false) {
			await Tone.start();
			setControls((controls) => ({ ...controls, playing: true }));
			Tone.Transport.start("+0.1");
		} else {
			toneSeq.current?.dispose();
			Tone.Transport.stop();
			setControls((controls) => ({ ...controls, playing: false }));
			setActiveChordIndex(-1);
		}
	}, [setControls, setActiveChordIndex, toneSeq, controls]);

	return (
		<ControlsContext.Provider value={[controls, setControls]}>
			<ChordsContext.Provider value={[chordSequence, dispatchSequence]}>
				<Box>
					<Controls togglePlay={togglePlay}/>
					<Chords activeChordIndex={activeChordIndex} />
				</Box>
			</ChordsContext.Provider>
		</ControlsContext.Provider>
	);
}
