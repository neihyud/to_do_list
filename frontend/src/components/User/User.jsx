import LocalStorageService from "../../service/LocalStorageService";

const User = () => {
	const user = LocalStorageService.getUser();

	return (
		<>
			<h2>Info User</h2>
			<p>Name: {user?.username}</p>
		</>
	);
};

export default User;
