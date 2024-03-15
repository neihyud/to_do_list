import { useState } from "react";
import Header from "../components/Header/Header";
import HomeComponent from "../components/Home/HomeComponent";

const Home = () => {
	const [typeModal, setTypeModal] = useState(null);

	const handleGetUser = () => {
		setTypeModal("GET_USER");
	};
	
	return (
		<>
			<Header handleGetUser={handleGetUser} />
			<HomeComponent setTypeModal={setTypeModal} typeModal={typeModal}/>
		</>
	);
};

export default Home;
