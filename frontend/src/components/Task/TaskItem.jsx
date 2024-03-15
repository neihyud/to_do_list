import { faCircleXmark, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import HomeConstant from "../../constant/HomeConstant";
import { useContext } from "react";
import TodoContext from "../../context/TodoContext";
import TaskService from "../../service/TaskService";
import { createAxiosJwt } from "../../createInstance";

const TaskItem = (props) => {
	const axiosJwt = createAxiosJwt();
	const { item } = props;

	const { title, status, id } = item;

	const { setTaskEdit, setTypeModal, handleUpdateTask, handleRemoveTask } = useContext(TodoContext);

	const handleRemoveTaskItem = async() => {
		const response = await TaskService.removeTask(axiosJwt, id);

		if (response.success) {
			handleRemoveTask(id);
		}
		
	};

	const handleChangeStatus = async(newStatus) => { 
		const response = await TaskService.editTask(axiosJwt, { taskId: id, status: newStatus });

		if (response.success) {
			handleUpdateTask(id, { status: newStatus });
		}
	};

	const handleEditTask = () => {
		setTaskEdit({ title, status, id });
		setTypeModal("EDIT_TASK");
	};

	const renderStatus = () => {
		return Object.keys(HomeConstant.ENUM_TASK_STATUS).map((statusItem, index) => {
			let statusClass = null;

			if (status === statusItem) {
				statusClass = status;
			}

			return (
				<button 
					className={`btn btn-small ${statusClass}`} 
					key={index}
					onClick={() => handleChangeStatus(statusItem)}
				>
					{statusItem}
				</button>
			);

		});  
	};

	return (
		<tr>
			<td>{title}</td>
			<td align="center" >
				{renderStatus()}
			</td>
			<td align="right">
				<FontAwesomeIcon 
					icon={faPen} 
					className="animation-icon"
					onClick={handleEditTask}
				/>    
				<FontAwesomeIcon 
					icon={faCircleXmark} 
					className="animation-icon"
					onClick={handleRemoveTaskItem}
				/>
			</td>
		</tr>
	);
};

TaskItem.propTypes = {
	item: PropTypes.object
};

export default TaskItem;
