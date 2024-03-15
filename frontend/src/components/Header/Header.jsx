import { faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";

import PropTypes from "prop-types";

import LocalStorageService from "../../service/LocalStorageService";

const Header = ({ handleGetUser }) => {

	const handleLogout = () => {
		LocalStorageService.removeToken();
		window.location.href = "/login";
	};
	
	return (
		<header>
			<FontAwesomeIcon icon={faUser} className="animation-icon" onClick={handleGetUser}/>
			<FontAwesomeIcon icon={faArrowRightFromBracket} className="animation-icon" onClick={handleLogout}/>
		</header>
	);
};

Header.propTypes = {
	handleGetUser: PropTypes.func
};

export default Header;
