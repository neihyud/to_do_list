import Register from "../components/Auth/Register";
import Home from "../page/Home";
import Login from "../page/Login";

const publicRoutes = [
	{
		path: "/",
		component: Home 
	},
	{
		path: "/auth/login",
		component: Login 
	},
	{
		path: "/auth/register",
		component: Register
	}
];
 
export { publicRoutes };
