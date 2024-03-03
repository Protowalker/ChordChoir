import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useCallback, FocusEvent, useContext, useState } from "react";
import { parseNote } from "../Music/Notes";
import { ChordsContext, ControlsContext } from "./App";
import { Chord } from "../Music/Chords";
import React from "react";
import { encodeLink } from "../Music/LinkParser";
import { Alert } from "@mui/material";

export const Controls = React.memo(
	({ togglePlay }: { togglePlay: () => void }) => {
		const [chordSequence, dispatchSequence] = useContext(ChordsContext);
		const [controls, setControls] = useContext(ControlsContext);
		const { key, playing } = controls;

		const consolidateKey = useCallback(
			function (ev: FocusEvent<HTMLInputElement>) {
				const newKey = parseNote(ev.target?.value ?? "C4")!;
				if (key.toString() === newKey.toString()) {
					return;
				}

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

		const createShareLink = useCallback(() => {
			const link = encodeLink(controls.tempo, controls.key, chordSequence);
			const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?sequence=${link}`;
			
			navigator.clipboard.writeText(url);
			window.history.pushState("", "", url)
			
			setShowLinkAlert(true);
		}, [chordSequence, controls]);
		const [showLinkAlert, setShowLinkAlert] = useState(false);

		return (
			<Grid
				container
				item
				direction="row"
				alignItems="flex-end"
				justifyContent="space-evenly"
				xs={4}
				spacing={2}
			>
				<Grid item xs={3}>
					<Button variant="contained" onClick={togglePlay} fullWidth>
						{playing === false ? "Start" : "Stop"}
					</Button>
				</Grid>
				<Grid item xs={3}>
					<TextField
						type="number"
						defaultValue={controls.tempo}
						onKeyDown={(e) =>
							pressEnter(e, (ev) => setTempo(parseInt(ev.target.value) || 0))
						}
						onBlur={(ev) => setTempo(parseInt(ev.target.value) || 0)}
						onClick={(ev: any) => setTempo(parseInt(ev.target.value) || 0)}
						label="Tempo (BPM)"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={3}>
					<TextField
						defaultValue={key.toString()}
						onKeyDown={(e) => pressEnter(e, consolidateKey)}
						onBlur={consolidateKey}
						onClick={(e) => consolidateKey(e as any)}
						label="Key"
						variant="standard"
					/>
				</Grid>
				<Grid item position="relative" xs={3}>
					{showLinkAlert && (
						<Alert
							style={{
								position: "absolute",
								left: "100%",
								top: "15%",
								height: "100%",
								width: "300px",
							}}
							onClose={() => setShowLinkAlert(false)}
						>
							Link copied to clipboard
						</Alert>
					)}
					<Button variant="contained" fullWidth onClick={createShareLink}>
						Share
					</Button>
				</Grid>
			</Grid>
		);
	}
);

export default Controls;
