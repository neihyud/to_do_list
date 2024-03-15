const LocalStorageService = {
	setToken(token) {
		localStorage.setItem("token", JSON.stringify(token));
	},

	removeToken() {
		return localStorage.removeItem("token");
	},
	
	getToken() {
		return JSON.parse(localStorage.getItem("token"));
	},

	setUser(user) {
		localStorage.setItem("user", JSON.stringify(user));
	},

	getUser() {
		return JSON.parse(localStorage.getItem("user"));
	}
};

export default LocalStorageService;
