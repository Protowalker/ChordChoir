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
import { Note, parseNote } from "../Music/Notes";
import Chords from "./Chords";
import Controls from "./Controls";
import { keyboardKeys } from "./Chord/ChordPiece";

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
	const toneSeq = useRef<Tone.Part<readonly [number, number]>>();

	const [controls, setControls] = useState<ControlValues>(() => ({
		tempo: 120,
		key: parseNote("C4")!,
		playing: false,
	}));

	const [activeChordIndex, setActiveChordIndex] = useState(-1);
	// Don't allow playing the same chord overtop itself
	const [activeChords, setActiveChords] = useState<Chord[]>([]);
	const [chordSequence, dispatchSequence] = useReducer(
		chordSequenceReducer,
		null,
		() =>
			Array(5)
				.fill(0)
				.map(() => new Chord())
	);

	useEffect(() => {
		const listener = (event: KeyboardEvent, type: "start" | "end") => {
			if (event.repeat || controls.playing) {
				return;
			}
			const index = keyboardKeys.indexOf(event.key.toUpperCase());
			if (index === -1 || index > (chordSequence.length - 1)) {
				return;
			}
			const chord = chordSequence[index];
			if (type === "start" && !activeChords.includes(chord)) {
				synth.triggerAttack(chord.getArray());
				setActiveChords([...activeChords, chord]);
				setActiveChordIndex(index);
			} else if(type === 'end' && activeChords.includes(chord)) {
				synth.triggerRelease(chord.getArray());
				const filteredActiveChords = activeChords.filter(c => c !== chord);
				setActiveChords(filteredActiveChords);
				if(filteredActiveChords.length === 0) {
					setActiveChordIndex(-1);
				}
			}
		};
		
		const listenerStart = (ev: KeyboardEvent) => listener(ev, "start");
		document.addEventListener("keydown", listenerStart);

		const listenerEnd = (ev: KeyboardEvent) => listener(ev, "end");
		document.addEventListener("keyup", listenerEnd);

		return () => {
			document.removeEventListener("keydown", listenerStart);
			document.removeEventListener("keyup", listenerEnd);
		};
	}, [activeChords, chordSequence, controls.playing, controls.tempo]);

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
		const beatLength = 60 / controls.tempo;

		const chordsWithTiming = chordSequence.reduce(
			(acc, curr, currIndex) => ({
				cursor: acc.cursor + curr.length,
				values: [...acc.values, { chordIndex: currIndex, cursor: acc.cursor }],
			}),
			{ cursor: 0, values: [] as { chordIndex: number; cursor: number }[] }
		);

		const chordsWithAdjustedTiming = chordsWithTiming.values.map(
			(chord) => [chord.cursor * beatLength, chord.chordIndex] as const
		);

		const seq = new Tone.Part((time, chordIndex) => {
			const chord = chordSequence[chordIndex];
			setActiveChordIndex(chordIndex);
			synth.triggerAttackRelease(
				chord.getArray(),
				`${chord.length * beatLength - 0.1}`,
				time
			);
		}, chordsWithAdjustedTiming).start(0);
		seq.loop = true;
		seq.loopEnd = chordsWithTiming.cursor * beatLength;

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
