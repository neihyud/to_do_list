import "./task.css";
import TaskItem from "./TaskItem";
import HomeConstant from "../../constant/HomeConstant";
import { useContext } from "react";
import TodoContext from "../../context/TodoContext";

const TaskList = () => {
	const { handleSelectFilter, search, data } = useContext(TodoContext);

	const renderTaskItem = () => {
		const tasks = data && data?.map((item) => {
			return ( 
				<TaskItem 
					key={item.id} 
					item={item}
				/>
			);
		});

		if (tasks.length) {
			return tasks;
		}

		return (
			<h2 className="transform-center-X"> Not found</h2>
		);
	}; 

	const renderBtnFilter = () => {
		return Object.keys(HomeConstant.ENUM_FILTER_STATUS).map((item, index) => {

			let activeClass = "";
			if (search === item || (index === 0 && !search)) {
				activeClass = "active";
			}

			return (
				<button 
					key={index} 
					className={`btn-plain status-filter ${activeClass}`} 
					onClick={() => handleSelectFilter(item)}
				>
					{item}
				</button>
			);
		}); 
	};

	return (
		<> 
			<div className="filter">
				{renderBtnFilter()}
			</div>
			<div className="wrapper-task-list">
				<table >
					<thead>
						<tr>
							<th align="left">Task</th>
							<th align="center">Status</th>
							<th colSpan={2} align="right"></th>
						</tr>
					</thead>
					<tbody>
						{renderTaskItem()}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default TaskList;
