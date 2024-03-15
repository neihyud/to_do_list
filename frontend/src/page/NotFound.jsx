import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/auth/login");

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>NotFound</div>
	);
};

export default NotFound;
