import React, { useRef } from "react";
import { ExtensionState } from "../../Music/Chords";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export const ChordExtension = React.memo(function (props: {
  number: number;
  extensionState: ExtensionState;
  updateExtension(newExtension: ExtensionState): void;
}): React.ReactElement {
  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const thirdRef = useRef<HTMLInputElement>(null);

  const updateExtension = React.useCallback(
    function (targetIndex: 0 | 1 | 2, targetState: boolean) {
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

      let extensionState = [
        ExtensionState.Flat,
        ExtensionState.Normal,
        ExtensionState.Sharp,
      ][targetIndex];

      props.updateExtension(extensionState);
    },
    [props]
  );

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

export default ChordExtension;