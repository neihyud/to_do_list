import { useContext, useState } from "react";
import TodoContext from "../../context/TodoContext";
import TaskService from "../../service/TaskService";
import { createAxiosJwt } from "../../createInstance";

const EditTask = () => {
	const axiosJwt = createAxiosJwt();

	const [error, setError] = useState("");
	const { taskEdit, setTaskEdit, handleUpdateTask, setTypeModal } = useContext(TodoContext);

	const handleChange = (event) => {
		if (event.target.value && error) {
			setError("");
		}

		setTaskEdit({ ...taskEdit, title: event.target.value });
	};

	const handleEditTask = async() => {
		if (!taskEdit) {
			setError("Field is required");
		}

		const response = await TaskService.editTask(axiosJwt, { title: taskEdit.title, taskId: taskEdit.id });

		if (response.success) {
			handleUpdateTask(taskEdit.id, { title: taskEdit.title });
			setTypeModal("");
		}
	};

	return (
		<>
			<div className="wrapper-edit-task">
				<h2>Edit Task</h2>
				<div className="form-group w-100">
					<label className="form-label">Title</label>
					<input 
						name="title" 
						type="text" 
						placeholder="Edit task" 
						className="form-control w-100"
						value={taskEdit?.title}
						onChange={handleChange}
						autoFocus
					/>
					<span className="form-message">{error}</span>
					<button className="btn btn-primary" onClick={handleEditTask}>Save</button>
				</div>
			</div>
		</>
   
	);
};

export default EditTask;
