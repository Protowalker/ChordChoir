import Grid from "@mui/material/Grid";
import React, { useMemo, useRef } from "react";
import { Mode, modes } from "../../Music/Notes";

export const Modes = React.memo(
	function Modes(props: { onChange(mode: Mode): void; currentMode: Mode }) {
		const selectedRef = useRef<HTMLSelectElement>(null);

		const options = useMemo(
			() =>
				Object.keys(modes)
					.map((k) => parseInt(k) as Mode)
					.map((key) => (
						<option key={key} value={key}>
							{modes[key]}
						</option>
					)),
			[]
		);

		return (
			<Grid container item justifyContent="center" width="80%" mx="auto">
				<select
					style={{ width: "100%" }}
					value={props.currentMode}
					ref={selectedRef}
					onChange={() =>
						props.onChange(selectedRef.current?.value as any as Mode)
					}
				>
					{options}
				</select>
			</Grid>
		);
	},
	(prev, next) => prev.currentMode === next.currentMode
);
