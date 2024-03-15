
import LocalStorageService from "../service/LocalStorageService";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, path }) => {
	const token = LocalStorageService.getToken();

	if (!token && !path.startsWith("/auth")) {
		return <Navigate to="/auth/login" />;
	}

	if (token && path.startsWith("/auth")) {
		return <Navigate to="/" />;
	}

	return element;
};

ProtectedRoute.propTypes = {
	path: PropTypes.string,
	element: PropTypes.element,
};

export default ProtectedRoute;
