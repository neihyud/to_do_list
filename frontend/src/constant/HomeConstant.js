
const ENUM_TASK_STATUS = {
	todo: "to do",
	doing: "doing",
	done: "done"
};

const HomeConstant = {
	ENUM_TASK_STATUS: ENUM_TASK_STATUS,
	ENUM_FILTER_STATUS: {
		all: "all",
		...ENUM_TASK_STATUS
	}
};

export default HomeConstant;
