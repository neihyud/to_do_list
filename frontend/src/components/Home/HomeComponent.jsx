import { useEffect, useRef, useState } from "react";
import TaskList from "../Task/TaskList";
import "./home.css";
import TodoContext from "../../context/TodoContext";
import Modal from "../Modal/Modal";
import EditTask from "../Task/EditTask";
import User from "../User/User";
import { createAxiosJwt } from "../../createInstance";
import TaskService from "../../service/TaskService";
import PropTypes from "prop-types";

const HomeComponent = (props) => {
	const { typeModal, setTypeModal } = props;
	
	const axiosJwt = createAxiosJwt();
	const [todo, setTodo] = useState("");
	const [search, setSearch] = useState("");
	const [data, setData] = useState([]);

	const [taskEdit, setTaskEdit] = useState(null);
	// const [typeModal, setTypeModal] = useState(null);

	const refInputTask = useRef(null);

	const handleSelectFilter = (querySearch) => {
		setSearch(querySearch);
	};

	const getTasks = async() => {
		const response = await TaskService.getTasks(axiosJwt, search);

		const tasks = response.tasks || [];

		setData(tasks);
	};

	useEffect(() => {
		getTasks();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const handleAddTask = async() => {
		if (!todo?.trim()) {
			return null;
		}
		
		const response = await TaskService.addTask(axiosJwt, todo);

		if (response.success) {
			setData(() => {
				return [
					...data, {
						title: todo,
						status: "todo"
					}
				];
			});

			setTodo("");
		}

	};

	const handleUpdateTask = (id, newData = {}) => {
		const updatedListTask = data.map((task) => {
			if (JSON.stringify(task.id) === JSON.stringify(id)) {
				return { ...task, ...newData };
			}	
			return task;
		});

		setData(() => [...updatedListTask]);

		setTodo(""); 
		setTaskEdit(null);
	};

	const handleRemoveTask = (id) => {
		const updatedListTask = data.map((task) => {

			if (JSON.stringify(task.id) === JSON.stringify(id)) {
				return null;
			}	
			return task;
		}).filter(Boolean);

		setData(() => [...updatedListTask]);
	};

	const handleChangeTodo = (event) => {
		setTodo(event.target.value);
	};

	const getBtnHandleTask = () => {
		return <button className="btn" onClick={handleAddTask} disabled={!todo}>{"Add"}</button>;
	};

	const handleGetUser = () => {
		setTypeModal("GET_USER");
	};

	const getModal = () => {
		let modalComponent = null;
		switch (typeModal) {
			case "EDIT_TASK":
				modalComponent = <EditTask/>;
				break;
			case "GET_USER":
				modalComponent = <User />;
				break;
			default: 
				return null;
		}

		return (
			<Modal>
				{modalComponent}
			</Modal>
		);
	};

	const handleCloseModal = () => {
		setTypeModal(null);
	};

	const valueContext = {
		taskEdit,
		setTaskEdit,
		handleAddTask,
		handleSelectFilter, 
		search, 
		data,
		setTodo,
		setTypeModal,
		handleCloseModal,
		handleUpdateTask,
		handleRemoveTask,
		handleGetUser
	};

	return (
		<TodoContext.Provider value={valueContext}>
			<div className="wrapper-home"> 
				<h1>To do list</h1>
				<div className="wrapper-add-to-do">
					<input 
						type="text" 
						placeholder="What do you need to do?"
						value={todo}
						onChange={handleChangeTodo}
						ref={refInputTask}
						autoFocus	
					/>
					{getBtnHandleTask()}
				</div>
				<div className="container">
					<TaskList />
				</div>
			</div>
			{getModal()}
		</TodoContext.Provider>
	);
};

HomeComponent.propTypes = {
	typeModal: PropTypes.string,
	setTypeModal: PropTypes.func
};
export default HomeComponent;
