import Box from "@mui/material/Box";
import React, {
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import * as Tone from "tone";
import chordSequenceReducer, {
	ChordSequenceAction,
} from "../ChordSequenceReducer";
import { Chord } from "../Music/Chords";
import { tryParseLink } from "../Music/LinkParser";
import { Note, parseNote, range } from "../Music/Notes";
import Chords from "./Chords";
import Controls from "./Controls";

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

	const [controls, setControls] = useState<ControlValues>(() => ({
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

	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		const sequence = new URLSearchParams(window.location.search).get(
			"sequence"
		);
		if (sequence) {
			const parsedLink = tryParseLink(sequence);
			if (parsedLink) {
				dispatchSequence({
					kind: "overwrite",
					newSequence: parsedLink.sequence,
				});
				setControls({
					key: parsedLink.key,
					tempo: parsedLink.tempo,
					playing: false,
				});
			}
		}
		setLoaded(true);
	}, []);

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
				<Box width="100%" pt={3}>
					{loaded && (
						<>
							<Controls togglePlay={togglePlay} />
							<br />
							<Chords activeChordIndex={activeChordIndex} />
						</>
					)}
				</Box>
			</ChordsContext.Provider>
		</ControlsContext.Provider>
	);
}
