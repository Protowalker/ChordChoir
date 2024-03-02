import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useState } from "react";
import { Chord, ExtensionState } from "../../Music/Chords";
import { Mode, Modes, Note, Notes, parseNote } from "../../Music/Notes";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { ChordExtension } from "./ChordExtension";
import zIndex from "@material-ui/core/styles/zIndex";

const useStyles = makeStyles({
  active: {
    background: colors.blueGrey[100],
  },
});

export const ChordPiece = React.memo(
  function (props: {
    baseKey: Note;
    chord: Chord;
    onChordChange: (chord: Chord) => void;
	delete: () => void;
    active: boolean;
  }): React.ReactElement {
    const [mode, setMode] = useState(Mode.Major);
    const [note, setNote] = useState(parseNote("C4")!);

    const [seventh, setSeventh] = useState(ExtensionState.Off);
    const [ninth, setNinth] = useState(ExtensionState.Off);
    const [eleventh, setEleventh] = useState(ExtensionState.Off);

    const { onChordChange, baseKey } = props;
    React.useEffect(() => {
      const chord = new Chord(note, mode, { seventh, ninth, eleventh });
      chord.id = props.chord.id;
      onChordChange(chord);
    }, [mode, note, seventh, ninth, eleventh, onChordChange, props.chord.id]);

    const classes = useStyles();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: props.chord.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
	  zIndex: isDragging ? 1 : 0
    };


    return (
      <div ref={setNodeRef} style={style}>
        <Box pt={1} mr={1} mt={0.5}>
          <Paper className={props.active ? classes.active : ""}>
            <Grid
              container
              item
              direction="column"
              alignItems="stretch"
              justify="space-around"
              spacing={2}
            >
              <Button
                style={{ width: "40px", height: "30px", alignSelf: "flex-end" }}
                onClick={() => props.delete()}
              >
                X
              </Button>
              <Notes startingNote={baseKey} onChange={setNote}></Notes>
              <Grid container item justify="center">
                <Modes onChange={setMode} currentMode={mode}></Modes>
              </Grid>
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
  },
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);


export default ChordPiece;