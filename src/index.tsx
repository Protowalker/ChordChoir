import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { parseNote, Notes, Mode, Modes, Chord, range, ExtensionState, Extensions } from "./Music/Notes";
import {
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
} from "@material-ui/core";
import * as Tone from "tone";
import { Clock } from "tone";
import { spacing } from "@material-ui/system";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const AccidentalLabels = {
  left: { title: "♭", value: "flat" },
  center: { title: "♮", value: "normal" },
  right: { title: "♯", value: "sharp" },
};





function ChordPiece(props: {
  chord: Chord;
  onChordChange: (chord: Chord) => void;
  index: number;
}): React.ReactElement {
  const [mode, setMode] = useState(Mode.Major);
  const [note, setNote] = useState(parseNote("C4"));

  function Extension(props: {
    number: number;
    extensionState: ExtensionState;
    updateExtension(newExtension: ExtensionState): void;
  }): React.ReactElement {
    const firstRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const thirdRef = useRef<HTMLInputElement>(null);

    function updateExtension(targetIndex: 0 | 1 | 2, targetState: boolean) {
      if (targetState == false) {
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
    }

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
              checked={props.extensionState == ExtensionState.Flat }
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
              checked={props.extensionState == ExtensionState.Normal}
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
              checked={props.extensionState == ExtensionState.Sharp}
              onChange={(ev) => updateExtension(2, ev.target.checked)}
            />
          }
          label="♯"
          labelPlacement="top"
        />
      </Grid>
    );
  }

  const [seventh, setSeventh] = useState(ExtensionState.Off);
  const [ninth, setNinth] = useState(ExtensionState.Off);
  const [eleventh, setEleventh] = useState(ExtensionState.Off);


  React.useEffect(() => {
    const chord = new Chord(note, mode, {seventh, ninth, eleventh});
    props.onChordChange(chord);
  }, [mode, note, seventh, ninth, eleventh]);

  return (
    <Box bgcolor={props.index % 2 ? "primary.light" : "primary.dark"} pt={1}>
      <Grid
        container
        item
        direction="column"
        alignItems="stretch"
        justify="space-around"
        spacing={2}
      >
        <Notes startingNote={parseNote("C4")} onChange={setNote}></Notes>
        <Grid container item justify="center">
          <Modes onChange={setMode} currentMode={mode}></Modes>
        </Grid>
        <Grid container item direction="column" alignItems="center">
          <Extension
            number={7}
            extensionState={seventh}
            updateExtension={setSeventh}
          />
          <Extension
            number={9}
            extensionState={ninth}
            updateExtension={setNinth}
          />
          <Extension
            number={11}
            extensionState={eleventh}
            updateExtension={setEleventh}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

const synth = new Tone.PolySynth(Tone.Synth, { volume: -15 }).toDestination();
Tone.Transport.bpm.value = 120;

function Home(): React.ReactElement {
  const [chordCount, setChordCount] = useState(4);
  const [temporaryChordCount, setTemporaryChordCount] = useState(chordCount);

  const [chordSequence, setSequence] = useState<Chord[]>(
    Array(chordCount).fill(new Chord())
  );

  function consolidateChordCount() {
    let newChordCount = temporaryChordCount;
    if (isNaN(temporaryChordCount)) {
      setTemporaryChordCount(0);
      newChordCount = 0;
    }

    setChordCount(newChordCount);

    if (chordSequence.length > newChordCount) {
      setSequence(chordSequence.slice(0, newChordCount));
    } else if (chordSequence.length < newChordCount) {
      let newSequence = chordSequence.slice();
      while (newSequence.length < newChordCount) newSequence.push(new Chord());

      setSequence(newSequence);
    }
  }

  function updateChordSequence(entry: Chord, index: number) {
    let newSequence = chordSequence.slice();
    newSequence[index] = entry;
    setSequence(newSequence);
  }

  const [tempo, setTempo] = useState(120);
  const [temporaryTempo, setTemporaryTempo] = useState(tempo);
  function consolidateTempo() {
    let newTempo = temporaryTempo;
    if (isNaN(temporaryTempo)) {
      newTempo = 120;
      setTemporaryTempo(120);
    }

    setTempo(newTempo);
    Tone.Transport.bpm.value = newTempo;
  }

  const [playing, setPlaying] = useState(false);
  const [toneSeq, setToneSeq] = useState<Tone.Sequence<number>>(null as any);
  async function togglePlay() {
    if (playing === false) {
      await Tone.start();
      setPlaying(true);
      const seq = new Tone.Sequence(
        (time, chordIndex) => {
          synth.triggerAttackRelease(
            chordSequence[chordIndex].getArray(),
            "8n",
            time + 0.1
          );
          // subdivisions are given as subarrays
        },
        range(0, chordCount),
        "4n"
      ).start(0);
      setToneSeq(seq);
      Tone.Transport.start("+0.1");
    } else {
      toneSeq.stop();
      Tone.Transport.stop();
      setPlaying(false);
    }
  }

  return (
    <Box>
      <Button onClick={togglePlay}>
        {playing === false ? "Start" : "Stop"}
      </Button>
      <TextField
        type="number"
        value={temporaryChordCount}
        onChange={(ev) =>
          setTemporaryChordCount(parseInt(ev.target?.value as string))
        }
        onBlur={consolidateChordCount}
        label="Note Count"
      />
      <TextField
        type="number"
        value={temporaryTempo}
        onChange={(ev) =>
          setTemporaryTempo(parseInt(ev.target.value as string))
        }
        onBlur={consolidateTempo}
        label="Tempo (BPM)"
      />
      <Grid container>
        {chordSequence.map((chord: Chord, index: number) => (
          <ChordPiece
            key={index}
            chord={chord}
            index={index}
            onChordChange={(newChord) => updateChordSequence(newChord, index)}
          />
        ))}
      </Grid>
    </Box>
  );
}

{
  ReactDOM.render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
