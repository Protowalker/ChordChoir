import React, { useRef } from "react";
import { Note, range } from "../../Music/Notes";
import Grid from "@material-ui/core/Grid";

export interface NotesProps {
	startingNote: Note;
	onChange: (relativeNote: number) => void;
}

export const Notes = React.memo(
	function ({ onChange, startingNote }: NotesProps): React.ReactElement {
		const noteRef = useRef<HTMLSelectElement>(null);

		// Create the string for the dropdown. We want it in the form of C#5   (IV) with an equal spacing.
		const createDropdownText = React.useCallback(
			(num) => {
				// Get the note in string form.
				let noteString = startingNote.offset(num).toString();
				// Get the relative note in string form (roman numerals)
				let relativeString =
					"(" + startingNote.offset(num).getRelative(startingNote) + ")";

				return noteString + "    " + relativeString;
			},
			[startingNote]
		);

		return (
			<Grid container item justifyContent="center">
				<select
					ref={noteRef}
					onChange={() => onChange(parseInt(noteRef.current?.value ?? "0"))}
				>
					{range(0, 12).map((num) => {
						return (
							<option key={num} value={num}>
								{" "}
								{createDropdownText(num)}{" "}
							</option>
						);
					})}
				</select>
			</Grid>
		);
	},
	(prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);