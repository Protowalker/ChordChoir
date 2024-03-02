import {
	CssBaseline,
	StyledEngineProvider,
	Theme,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

declare module "@mui/styles/defaultTheme" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const theme = createTheme();
const container = document.getElementById("root")!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
	<React.StrictMode>
		<CssBaseline />
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
