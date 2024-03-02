import { useRef } from "react";
import { Mode } from "../../Music/Notes";
import React from "react";

export const Modes = React.memo(
	function Modes(props: { onChange(mode: Mode): void; currentMode: Mode }) {
		const selectedRef = useRef<HTMLSelectElement>(null);

		let modes = [];

		for (const value in Mode) {
			modes.push(value);
		}

		modes = modes.filter((mode) => isNaN(parseInt(mode)));

		return (
			<select
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
		);
	},
	(prev, next) => prev.currentMode === next.currentMode
);
