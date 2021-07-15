import { Box, Button, CssBaseline, Grid, TextField } from "@material-ui/core";
import React, {
  FocusEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import * as Tone from "tone";
import "./index.css";
import { Chord, ChordPiece } from "./Music/Chords";
import { parseNote, range } from "./Music/Notes";
import reportWebVitals from "./reportWebVitals";
import chordSequenceReducer from "./ChordSequenceReducer";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const synth = new Tone.PolySynth(Tone.Synth, { volume: -15 }).toDestination();

function orDefault<T>(value: T | undefined, defaultValue: T): T {
  if (value === undefined) return defaultValue;
  if (typeof value === "number" && isNaN(value)) return defaultValue;
  return value;
}

function calledWithOrDefault<T, U>(
  func: (t: T) => U,
  defaultValue: T
): (t: T | undefined) => U {
  return (value: T | undefined) => func(orDefault(value, defaultValue));
}

function Home(): React.ReactElement {
  const [chordCount, setChordCount] = useState(4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setChordCountOrDefault = useCallback(
    calledWithOrDefault(setChordCount, chordCount),
    [setChordCount, chordCount]
  );

  const [tempo, setTempo] = useState(120);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setTempoOrDefault = useCallback(calledWithOrDefault(setTempo, tempo), [
    setTempo,
    tempo,
  ]);
  const [key, setKey] = useState(parseNote("C4").unwrap());
  const [playing, setPlaying] = useState(false);

  const toneSeq = useRef<Tone.Sequence<number>>();
  const [chordSequence, dispatchSequence] = useReducer(
    chordSequenceReducer,
    null,
    () => Array(chordCount).fill(new Chord())
  );

  const [activeChord, setActiveChord] = useState(-1);

  useEffect(() => {
    dispatchSequence({ kind: "setLength", length: chordCount });
  }, [chordCount]);

  useEffect(() => {
    if (!playing) return;

    Tone.Transport.bpm.value = tempo;

    const seq = new Tone.Sequence(
      (time, chordIndex) => {
        setActiveChord(chordIndex);
        synth.triggerAttackRelease(
          chordSequence[chordIndex].getArray(),
          "8n",
          time
        );
        // subdivisions are given as subarrays
      },
      range(0, chordSequence.length),
      "4n"
    ).start(0);
    toneSeq.current = seq;

    return () => {
      toneSeq.current?.dispose();
    };
  }, [chordSequence, tempo, key, playing]);

  const consolidateKey = useCallback(
    function (ev: FocusEvent<HTMLInputElement>) {
      const newKey = parseNote(ev.target?.value ?? "C4").unwrap();
      // We need to update all the chords at once

      for (let i = 0; i < chordSequence.length; i++) {
        const oldChord = chordSequence[i];
        let newChord = new Chord(
          oldChord.base,
          oldChord.mode,
          oldChord.extensions
        );

        const offset = newChord.base.getNumber() - key.getNumber();
        newChord.base = newKey.offset(offset);
        dispatchSequence({ kind: "update", index: i, newChord: newChord });
      }

      setKey(newKey);
    },
    [chordSequence, key]
  );

  async function togglePlay() {
    if (playing === false) {
      await Tone.start();
      setPlaying(true);
      Tone.Transport.start("+0.1");
    } else {
      toneSeq.current?.dispose();
      Tone.Transport.stop();
      setPlaying(false);
      setActiveChord(-1);
    }
  }

  const pressEnter = useCallback(
    (ev: React.KeyboardEvent, func: (ev: any) => void) => {
      if (ev.key === "Enter") func(ev as any);
    },
    []
  );

  const updateChord = useCallback((index, chord) => {
    dispatchSequence({
      kind: "update",
      index: index,
      newChord: chord,
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Grid
          container
          direction="row"
          alignItems="flex-end"
          justify="space-evenly"
          xs={3}
        >
          <Button variant="contained" onClick={togglePlay}>
            {playing === false ? "Start" : "Stop"}
          </Button>
          <TextField
            type="number"
            defaultValue={4}
            onBlur={(ev) => setChordCountOrDefault(parseInt(ev.target.value))}
            onKeyDown={(e) =>
              pressEnter(e, (ev) =>
                setChordCountOrDefault(parseInt(ev.target.value))
              )
            }
            onClick={(ev: any) =>
              setChordCountOrDefault(parseInt(ev.target.value))
            }
            label="Note Count"
            InputProps={{ inputProps: { min: 0, max: 30 } }}
            style={{ width: "25%" }}
          />
          <TextField
            type="number"
            defaultValue={120}
            onKeyDown={(e) =>
              pressEnter(e, (ev) =>
                setTempoOrDefault(parseInt(ev.target.value))
              )
            }
            onBlur={(ev) => setTempoOrDefault(parseInt(ev.target.value))}
            onClick={(ev: any) => setTempoOrDefault(parseInt(ev.target.value))}
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
          {chordSequence.map((chord: Chord, index: number) => {
            return (
              <ChordPiece
                baseKey={key}
                key={index}
                chord={chord}
                index={index}
                onChordChange={(chord) => updateChord(index, chord)}
                active={activeChord === index}
              />
            );
          })}
        </Grid>
      </Box>
    </DndProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Home />
  </React.StrictMode>,
  document.getElementById("root")
);
