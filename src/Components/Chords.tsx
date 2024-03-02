import { DndContext } from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Fab, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import { useCallback, useContext } from "react";
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
		(event) => {
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
		(chord) => {
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
		(index: number) => {
			dispatchSequence({ kind: "remove", startIndex: index, endIndex: index });
		},
		[dispatchSequence]
	);

	return (
		<Grid container>
			<DndContext onDragEnd={handleDragEnd}>
				<SortableContext items={chordSequence.map((c) => c.id)}>
					{chordSequence.map((chord, i) => (
						<ChordPiece
							key={chord.id}
							active={props.activeChordIndex === i}
							baseKey={controls.key}
							chord={chord}
							onChordChange={(chord) => updateChord(chord)}
							delete={() => deleteChord(i)}
						/>
					))}
					<Fab color="primary" className={classes.addButton} onClick={addChord}>
						<AddIcon />
					</Fab>
				</SortableContext>
			</DndContext>
		</Grid>
	);
}

export default React.memo(Chords);