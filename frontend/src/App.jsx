import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes } from "./router/routes";
import NotFound from "./page/NotFound";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
	const renderPublicRouter = publicRoutes.map((route, index) => {
		const Page = route.component;
		const path = route.path;
		
		return (
			<Route 
				key={index} 
				path={path} 
				element={ <ProtectedRoute path={path} element={<Page />} />} 
			/>
		);
	});

	return (
		<>
			<Router>
				<Routes>
					{renderPublicRouter}
					<Route path="*" element={<NotFound/>} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
