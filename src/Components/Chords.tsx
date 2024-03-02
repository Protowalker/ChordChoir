import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Fab } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useContext, useMemo } from "react";
import { Chord } from "../Music/Chords";
import { ChordsContext, ControlsContext } from "./App";
import ChordPiece from "./Chord/ChordPiece";
import React from "react";

const useStyles = makeStyles({
	addButton: {
		alignSelf: "center",
	},
});

const Chords = (props: { activeChordIndex: number }) => {
	const classes = useStyles();

	const [chordSequence, dispatchSequence] = useContext(ChordsContext);
	const [controls] = useContext(ControlsContext);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over) return;

			if (active.id !== over.id) {
				const oldIndex = chordSequence.findIndex((c) => c.id === active.id);
				const newIndex = chordSequence.findIndex((c) => c.id === over.id);
				dispatchSequence({ kind: "move", oldIndex, newIndex });
			}
		},
		[dispatchSequence, chordSequence]
	);

	const updateChord = useCallback(
		(chord: Chord) => {
			dispatchSequence({
				kind: "update",
				id: chord.id,
				newChord: chord,
			});
		},
		[dispatchSequence]
	);

	const addChord = useCallback(() => {
		dispatchSequence({ kind: "add", newChord: new Chord() });
	}, [dispatchSequence]);
	const deleteChord = useCallback(
		(chord: Chord) => {
			dispatchSequence({ kind: "remove", id: chord.id });
		},
		[dispatchSequence]
	);

	const items = useMemo(
		() =>
			chordSequence.map((chord, i) => (
				<ChordPiece
					key={chord.id}
					active={props.activeChordIndex === i}
					baseKey={controls.key}
					chord={chord}
					onChordChange={updateChord}
					delete={deleteChord}
				/>
			)),
		[
			chordSequence,
			controls.key,
			updateChord,
			deleteChord,
			props.activeChordIndex,
		]
	);
	const chordIds = useMemo(
		() => chordSequence.map((c) => c.id),
		[chordSequence]
	);

	return (
		<Grid container>
			<DndContext onDragEnd={handleDragEnd}>
				<SortableContext items={chordIds}>
					{items}
					<Fab color="primary" className={classes.addButton} onClick={addChord}>
						<AddIcon />
					</Fab>
				</SortableContext>
			</DndContext>
		</Grid>
	);
};

export default React.memo(Chords);
