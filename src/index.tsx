import React, { useState, useCallback, useRef, FocusEvent } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Note, parseNote, range } from "./Music/Notes";
import { ChordPiece, Chord, } from "./Music/Chords";
import {
  Box,
  Grid,
  TextField,
  Button,
  CssBaseline,
} from "@material-ui/core";
import * as Tone from "tone";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


const synth = new Tone.PolySynth(Tone.Synth, { volume: -15 }).toDestination();
Tone.Transport.bpm.value = 120;

function Home(): React.ReactElement {
  const [chordCount, setChordCount] = useState(4);

  const toneSeq = useRef<Tone.Sequence<number>>();
  const [chordSequence, setSequence] = useState<Chord[]>(
    Array(chordCount).fill(new Chord())
  );

  const consolidateChordCount = useCallback(function (ev: FocusEvent<HTMLInputElement>) {
    let newChordCount = parseInt(ev.target.value);
    if (isNaN(newChordCount)) {
      newChordCount = 0;
    }

    setChordCount(newChordCount);

    if (chordSequence.length > newChordCount) {
      generateSequence(chordSequence.slice(0, newChordCount));
      setSequence(chordSequence.slice(0, newChordCount));
    } else if (chordSequence.length < newChordCount) {
      let newSequence = chordSequence.slice();
      while (newSequence.length < newChordCount) newSequence.push(new Chord());

      generateSequence(newSequence);
      setSequence(newSequence);
    }
  }, [chordSequence]);


  const [activeChord, setActiveChord] = useState(-1);
  const generateSequence = useCallback(function (sequence: Chord[]) {
    console.log("called");
    if (toneSeq.current)
      toneSeq.current.dispose();

    const seq = new Tone.Sequence(
      (time, chordIndex) => {
        setActiveChord(chordIndex);
        synth.triggerAttackRelease(
          sequence[chordIndex].getArray(),
          "8n",
          time
        );
        // subdivisions are given as subarrays
      },
      range(0, sequence.length),
      "4n"
    ).start(0);
    toneSeq.current = seq;

  }, [chordCount]);

  const updateChordSequence = useCallback(function (entry: Chord, index: number) {
    let newSequence = chordSequence.slice();
    newSequence[index] = entry;
    setSequence(newSequence);
    generateSequence(newSequence);

  }, [chordSequence, generateSequence]);

  const [tempo, setTempo] = useState(120);
  const consolidateTempo = useCallback(function (ev: FocusEvent<HTMLInputElement>) {
    let newTempo = parseInt(ev.target.value);
    if (isNaN(newTempo)) {
      newTempo = 120;
    }

    setTempo(newTempo);
    Tone.Transport.bpm.value = newTempo;
  }, []);


  const [key, setKey] = useState(parseNote("C4").unwrap());
  const consolidateKey = useCallback(function (ev: FocusEvent<HTMLInputElement>) {
      const newKey = parseNote(ev.target?.value ?? 'C4').unwrap();
      // We need to update all the chords at once
      let newSequence = chordSequence.slice();
      for(let chord in newSequence) {
        // offset of the note
        // Changing the old chord makes javascript angry because it can't just have explicit references like a sane language
        // So instead we make a copy of it
        // And change that
        const oldChord = newSequence[chord];
        let newChord = new Chord(oldChord.base, oldChord.mode, oldChord.extensions);

        const offset = newChord.base.getNumber() - key.getNumber();
        newChord.base = newKey.offset(offset);

        // Update the sequence with the new chord
        newSequence[chord] = newChord;
      }
      setKey(newKey);
      setSequence(newSequence);
      generateSequence(newSequence);

  }, [chordSequence, generateSequence]);

  const [playing, setPlaying] = useState(false);
  async function togglePlay() {
    if (playing === false) {
      await Tone.start();
      setPlaying(true);
      generateSequence(chordSequence);
      Tone.Transport.start("+0.1");
    } else {
      toneSeq.current?.dispose();
      Tone.Transport.stop();
      setPlaying(false);
      setActiveChord(-1);
    }
  }


  const pressEnter = useCallback((ev: React.KeyboardEvent, func: (ev: any) => void) => {
    if (ev.key === "Enter")
      func(ev as any);
  }, []);

  return (
    <Box>
      <Grid container direction="row" alignItems="flex-end" justify="space-evenly" xs={3}>
        <Button variant="contained" onClick={togglePlay}>
          {playing === false ? "Start" : "Stop"}
        </Button>
        <TextField
          type="number"
          defaultValue={4}
          onBlur={consolidateChordCount}
          onKeyDown={(e) => pressEnter(e, consolidateChordCount)}
          onClick={(e) => consolidateChordCount(e as any)}
          label="Note Count"
          InputProps={{ inputProps: { min: 0, max: 30 } }}
          style={{ width: "25%" }}
        />
        <TextField
          type="number"
          defaultValue={120}
          onKeyDown={(e) => pressEnter(e, consolidateTempo)}
          onBlur={consolidateTempo}
          onClick={(e) => consolidateTempo(e as any)}
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
      <Grid container>
        {chordSequence.map((chord: Chord, index: number) => (
          <ChordPiece
            baseKey={key}
            key={index}
            chord={chord}
            index={index}
            onChordChange={updateChordSequence}
            active={activeChord === index}
          />
        ))}
      </Grid>
    </Box>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Home />
  </React.StrictMode>,
  document.getElementById("root")
);


