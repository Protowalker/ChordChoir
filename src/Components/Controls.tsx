import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useCallback, FocusEvent, useContext } from "react";
import { parseNote } from "../Music/Notes";
import { ChordsContext, ControlsContext } from "./App";
import { Chord } from "../Music/Chords";

export default function Controls({ togglePlay }: { togglePlay: () => void }) {
	const [chordSequence, dispatchSequence] = useContext(ChordsContext);
	const [controls, setControls] = useContext(ControlsContext);
	const { key, playing } = controls;

	const consolidateKey = useCallback(
		function (ev: FocusEvent<HTMLInputElement>) {
			const newKey = parseNote(ev.target?.value ?? "C4")!;

			// We need to update all the chords at once

			for (const oldChord of chordSequence) {
				let newChord = new Chord(
					oldChord.base,
					oldChord.mode,
					oldChord.extensions
				);

				const offset = newChord.base.getNumber() - key.getNumber();
				newChord.base = newKey.offset(offset);
				dispatchSequence({
					kind: "update",
					id: oldChord.id,
					newChord: newChord,
				});
			}

			setControls((controls) => ({ ...controls, key: newKey }));
		},
		[chordSequence, key, dispatchSequence, setControls]
	);

	const pressEnter = useCallback(
		(ev: React.KeyboardEvent, func: (ev: any) => void) => {
			if (ev.key === "Enter") func(ev as any);
		},
		[]
	);

	const setTempo = useCallback(
		(tempo: number) => {
			setControls((controls) => ({ ...controls, tempo: tempo }));
		},
		[setControls]
	);

	return (
		<Grid
			container
			item
			direction="row"
			alignItems="flex-end"
			justifyContent="space-evenly"
			xs={3}
		>
				<Button variant="contained" onClick={togglePlay}>
					{playing === false ? "Start" : "Stop"}
				</Button>
			<TextField
				type="number"
				defaultValue={120}
				onKeyDown={(e) =>
					pressEnter(e, (ev) => setTempo(parseInt(ev.target.value) || 0))
				}
				onBlur={(ev) => setTempo(parseInt(ev.target.value) || 0)}
				onClick={(ev: any) => setTempo(parseInt(ev.target.value) || 0)}
				label="Tempo (BPM)"
				style={{ width: "25%" }}
			/>
			<TextField
				defaultValue="C4"
				onKeyDown={(e) => pressEnter(e, consolidateKey)}
				onBlur={consolidateKey}
				onClick={(e) => consolidateKey(e as any)}
				label="Key"
				style={{ width: "25%" }}
			/>
		</Grid>
	);
}
