import React from 'react';
import { useRef, useState } from 'react';
import { Box, Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { colors } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { Notes, Note, Modes, Mode, parseNote } from './Notes';
import { omitFromObject } from 'tone/build/esm/core/util/Defaults';
import { useDrag } from 'react-dnd';


export enum ExtensionState {
  Off = 0,
  Normal = 1,
  Flat = 2,
  Sharp = 3,
}

export class Extensions {
  seventh: ExtensionState = ExtensionState.Off;
  ninth: ExtensionState = ExtensionState.Off;
  eleventh: ExtensionState = ExtensionState.Off;
}

export class Chord {
  base: Note;
  mode: Mode;
  extensions: Extensions;

  constructor(base: Note = parseNote("C4").unwrap(), mode: Mode = Mode.Major, extensions: Extensions = new Extensions()) {
    this.base = base;
    this.mode = mode;
    this.extensions = extensions;
  }

  public getArray(): string[] {
    const patterns: { [K in Mode]: number[] } = {
      [Mode.Major]: [0, 4, 7],
      [Mode.Minor]: [0, 3, 7],
      [Mode.Root]: [0, 7],
      [Mode.Sus2]: [0, 2, 7],
      [Mode.Sus4]: [0, 5, 7]
    };

    let notes = [];

    for (let num of patterns[this.mode]) {
      notes.push(this.base.offset(num).toString());
    }

    // TODO: Calculate these offsets instead of hardcoding them
    // Seventh = 10 half-steps
    // Ninth = 14 half-steps
    // Eleventh = 17 half-steps

  

    function getExtensionOffset(extension: ExtensionState.Flat | ExtensionState.Normal | ExtensionState.Sharp): number {
      return [-1, 0, 1][[ExtensionState.Flat, ExtensionState.Normal, ExtensionState.Sharp].indexOf(extension)];
    }

    if (this.extensions.seventh !== ExtensionState.Off)
      notes.push(this.base.offset(10 + getExtensionOffset(this.extensions.seventh)).toString());

    if (this.extensions.ninth !== ExtensionState.Off)
      notes.push(this.base.offset(14 + getExtensionOffset(this.extensions.ninth)).toString());


    if (this.extensions.eleventh !== ExtensionState.Off)
      notes.push(this.base.offset(17 + getExtensionOffset(this.extensions.eleventh)).toString());



    return notes;
  }

  public isEqual(rhs: Chord): boolean {
    return JSON.stringify(this) === JSON.stringify(rhs);
  }

  
}



const ChordExtension = React.memo(function (props: {
  number: number;
  extensionState: ExtensionState;
  updateExtension(newExtension: ExtensionState): void;
}): React.ReactElement {
  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const thirdRef = useRef<HTMLInputElement>(null);

  const updateExtension = React.useCallback(function (targetIndex: 0 | 1 | 2, targetState: boolean) {
    if (targetState === false) {
      props.updateExtension(ExtensionState.Off);
      return;
    }
    if (
      firstRef.current === null ||
      secondRef.current === null ||
      thirdRef.current === null
    )
      return;

    firstRef.current.checked = false;
    secondRef.current.checked = false;
    thirdRef.current.checked = false;

    [firstRef.current, secondRef.current, thirdRef.current][
      targetIndex
    ].checked = true;


    let extensionState = [ExtensionState.Flat, ExtensionState.Normal, ExtensionState.Sharp][targetIndex];

    props.updateExtension(extensionState);
  }, [props]);

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-between"
      wrap="nowrap"
      alignItems="center"
    >
      <FormControlLabel
        style={{ margin: 0 }}
        control={
          <Checkbox
            color="secondary"
            inputRef={firstRef}
            checked={props.extensionState === ExtensionState.Flat}
            onChange={(ev) => updateExtension(0, ev.target.checked)}
          />
        }
        label="♭"
        labelPlacement="top"
      />
      <FormControlLabel
        style={{ margin: 0 }}
        control={
          <Checkbox
            color="secondary"
            inputRef={secondRef}
            checked={props.extensionState === ExtensionState.Normal}
            onChange={(ev) => updateExtension(1, ev.target.checked)}
          />
        }
        label={props.number}
        labelPlacement="top"
      />
      <FormControlLabel
        style={{ margin: 0 }}
        control={
          <Checkbox
            color="secondary"
            inputRef={thirdRef}
            checked={props.extensionState === ExtensionState.Sharp}
            onChange={(ev) => updateExtension(2, ev.target.checked)}
          />
        }
        label="♯"
        labelPlacement="top"
      />
    </Grid>
  );
});

const useStyles = makeStyles({
  active: {
    
    background: colors.blueGrey[100]
}});

export const ChordPiece = React.memo(function (props: {
  baseKey: Note;
  chord: Chord;
  onChordChange: (chord: Chord, index: number) => void;
  index: number;
  active: boolean;
}): React.ReactElement {

  const [mode, setMode] = useState(Mode.Major);
  const [note, setNote] = useState(parseNote("C4").unwrap());


  const [seventh, setSeventh] = useState(ExtensionState.Off);
  const [ninth, setNinth] = useState(ExtensionState.Off);
  const [eleventh, setEleventh] = useState(ExtensionState.Off);

  const {onChordChange, index, baseKey } = props;
  React.useEffect(() => {
    const chord = new Chord(note, mode, { seventh, ninth, eleventh });
    // safe to ignore because the function only modifies an object so everything is references
    onChordChange(chord, index);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, note, seventh, ninth, eleventh, index]);

  const classes = useStyles();

  const [_, dragRef] = useDrag(
    {
      type: 'Chord'
    },
  );

  return (
    // we need to ingore this because the TS def for box is missing ref
    // @ts-ignore
    <Box pt={1} mr={1} mt={0.5} ref={props.ref}>
      <Paper className={props.active ? classes.active : ""}>
        <Grid
          container
          item
          direction="column"
          alignItems="stretch"
          justify="space-around"
          spacing={2}
        >
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
      </Paper>
    </Box>
  );
}, (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps));

