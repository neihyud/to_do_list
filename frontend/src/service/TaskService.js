const TaskService = {
	async getTasks(axiosJwt, search) {
		try {
			const response = await axiosJwt.get(`/task?q=${search}`);
	
			return response.data;
		} catch (error) {
			return error?.response?.data;
		}
	},

	async addTask(axiosJwt, title) {
		try {
			const response = await axiosJwt.post("/task", {
				title
			});
	
			return response.data;
		} catch (error) {
			return error?.response?.data;
		}
	},

	async removeTask(axiosJwt, id) {
		try {
			const response = await axiosJwt.delete(`/task/${id}`);
	
			return response.data;
		} catch (error) {
			return error?.response?.data;
		}
	},

	async editTask(axiosJwt, newData) {
		try {
			const response = await axiosJwt.put(`/task/${newData.taskId}`, {
				...newData
			});
	
			return response.data;
		} catch (error) {
			return error?.response?.data;
		}
	}
};

export default TaskService;
