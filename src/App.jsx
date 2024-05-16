import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./scenes/auth/Login";
import Dashboard from "./scenes/dashboard/index";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Employee from "./scenes/employee/index";

function App() {
	const [theme, colorMode] = useMode();
	const location = useLocation();
	const isAuthPage = location.pathname === "/login";

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{isAuthPage ? (
					<Routes>
						<Route path="/login" element={<Login />} />
					</Routes>
				) : (
					<div className="app">
						<Sidebar />
						<main className="content">
							<Topbar />
							<Routes>
								<Route path="/" element={<ProtectedRoute />}>
									<Route path="/" element={<Dashboard />} />
									<Route
										path="/employee"
										element={<Employee />}
									/>
								</Route>
							</Routes>
						</main>
					</div>
				)}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;