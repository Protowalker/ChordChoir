import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import * as colors from "@mui/material/colors";
import { CSSProperties, makeStyles } from "@mui/styles";
import React, { useMemo, useState } from "react";
import { Chord, ExtensionState } from "../../Music/Chords";
import { Note } from "../../Music/Notes";
import { ChordExtension } from "./ChordExtension";
import { Modes } from "./Modes";
import { Notes } from "./Notes";

const useStyles = makeStyles({
	active: {
		background: colors.blueGrey[100],
	},
});

const ChordPiece = function (props: {
	baseKey: Note;
	chord: Chord;
	onChordChange: (chord: Chord) => void;
	delete: (chord: Chord) => void;
	active: boolean;
}) {
	const [mode, setMode] = useState(props.chord.mode);
	const [relativeNote, setRelativeNote] = useState(() => props.chord.base.getRelativeNumber(props.baseKey));

	const [seventh, setSeventh] = useState(props.chord.extensions.seventh);
	const [ninth, setNinth] = useState(props.chord.extensions.ninth);
	const [eleventh, setEleventh] = useState(props.chord.extensions.eleventh);

	const { onChordChange, baseKey } = props;
	React.useEffect(() => {
		const note = baseKey.offset(relativeNote);
		const chord = new Chord(note, mode, { seventh, ninth, eleventh });
		chord.id = props.chord.id;
		onChordChange(chord);
	}, [
		mode,
		baseKey,
		relativeNote,
		seventh,
		ninth,
		eleventh,
		onChordChange,
		props.chord.id,
	]);

	const classes = useStyles();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: props.chord.id });

	const style: CSSProperties = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 1 : 0,
			touchAction: "none",
		}),
		[transform, isDragging, transition]
	);

	return (
		<div ref={setNodeRef} style={style}>
			<Box pt={1} mr={1} mt={0.5}>
				<Paper className={props.active ? classes.active : ""}>
					<Grid
						container
						item
						direction="column"
						alignItems="stretch"
						justifyContent="space-around"
						spacing={2}
					>
						<Button
							style={{ width: "40px", height: "30px", alignSelf: "flex-end" }}
							onClick={() => props.delete(props.chord)}
						>
							X
						</Button>
						<Notes baseKey={baseKey} offset={relativeNote} onChange={setRelativeNote}></Notes>
						<Modes onChange={setMode} currentMode={mode}></Modes>
						<ChordExtensions
							seventh={seventh}
							ninth={ninth}
							eleventh={eleventh}
							setSeventh={setSeventh}
							setNinth={setNinth}
							setEleventh={setEleventh}
						/>
					</Grid>
					<Box
						p={"5px"}
						textAlign="center"
						{...attributes}
						{...listeners}
						style={{ cursor: "grab" }}
					>
						|||
					</Box>
				</Paper>
			</Box>
		</div>
	);
};

export default React.memo(
	ChordPiece,
	(prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);

const ChordExtensions = React.memo(function ChordExtensions({
	seventh,
	ninth,
	eleventh,
	setSeventh,
	setNinth,
	setEleventh,
}: {
	seventh: number;
	ninth: number;
	eleventh: number;
	setSeventh: (newExtension: ExtensionState) => void;
	setNinth: (newExtension: ExtensionState) => void;
	setEleventh: (newExtension: ExtensionState) => void;
}) {
	return (
		<Grid container item direction="column" alignItems="center">
			<ChordExtension
				number={7}
				extensionState={seventh}
				updateExtension={setSeventh}
			/>
			<ChordExtension
				number={9}
				extensionState={ninth}
				updateExtension={setNinth}
			/>
			<ChordExtension
				number={11}
				extensionState={eleventh}
				updateExtension={setEleventh}
			/>
		</Grid>
	);
});
