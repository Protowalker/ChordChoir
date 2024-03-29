import React, { useEffect, useRef } from "react";
import { Note, range } from "../../Music/Notes";
import Grid from "@mui/material/Grid";

export interface NotesProps {
	baseKey: Note;
	offset: number;
	onChange: (relativeNote: number) => void;
}

export const Notes = React.memo(
	function Notes({ onChange, baseKey: key, offset }: NotesProps) {
		const noteRef = useRef<HTMLSelectElement>(null);

		// Create the string for the dropdown. We want it in the form of C#5   (IV) with an equal spacing.
		const createDropdownText = React.useCallback(
			(num: number) => {
				// Get the note in string form.
				let noteString = key.offset(num).toString();
				// Get the relative note in string form (roman numerals)
				let relativeString =
					"(" + key.offset(num).getRelative(key) + ")";

				return noteString + "    " + relativeString;
			},
			[key]
		);


		return (
			<Grid container item justifyContent="center" width="80%" mx="auto">
				<select
					ref={noteRef}
					onChange={() => onChange(parseInt(noteRef.current?.value ?? "0"))}
					value={offset}
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
