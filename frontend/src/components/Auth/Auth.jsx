import "./auth.css";
import PropTypes from "prop-types";

const Auth = (props) => {
	const { children } = props;
	return (
		<div className="modal-backdrop auth">
			<div className="wrapper-auth">
				{children}
			</div>
		</div>
	);
};

Auth.propTypes = {
	children: PropTypes.node
};

export default Auth;
