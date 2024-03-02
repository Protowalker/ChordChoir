import { useRef } from "react";
import { Mode } from "../../Music/Notes";
import React from "react";
import Grid from "@mui/material/Grid";

export const Modes = React.memo(
	function Modes(props: { onChange(mode: Mode): void; currentMode: Mode }) {
		const selectedRef = useRef<HTMLSelectElement>(null);

		let modes = [];

		for (const value in Mode) {
			modes.push(value);
		}

		modes = modes.filter((mode) => isNaN(parseInt(mode)));

		return (
			<Grid container item justifyContent="center" width="80%" mx="auto">
				<select
					style={{ width: "100%" }}
					value={modes.find((val) => val === props.currentMode)}
					ref={selectedRef}
					onChange={() =>
						props.onChange(selectedRef.current?.value as any as Mode)
					}
				>
					{modes.map((val) => (
						<option key={val} value={val}>
							{val}
						</option>
					))}
				</select>
			</Grid>
		);
	},
	(prev, next) => prev.currentMode === next.currentMode
);
