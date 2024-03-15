import { useContext } from "react";
import "./modal.css";
import PropTypes from "prop-types";
import TodoContext from "../../context/TodoContext";

const Modal = ({ children }) => {
	const { handleCloseModal } = useContext(TodoContext);

	return (
		<div className="modal-backdrop" onClick={handleCloseModal}>
			<div className="modal" onClick={(event) => event.stopPropagation()}>
				<div className="modal-content">
					{children}
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	children: PropTypes.node
};

export default Modal;
