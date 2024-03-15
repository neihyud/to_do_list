import { useNavigate } from "react-router-dom";
import Auth from "./Auth";
import "./auth.css";
import { useState } from "react";
import { createAxios } from "../../createInstance";
import LocalStorageService from "../../service/LocalStorageService";
import AuthService from "../../service/AuthService";

const Login = () => {
	const axios = createAxios();
	const [error, setError] = useState({});
	
	const navigate = useNavigate();

	const [credentials, setCredentials] = useState({
		username: "",
		password: ""
	});

	const fieldsConfig = {
		username: {
			validates: [
				(value) => {
					if (value) {
						return "";
					}

					return "Field is required";
				},
			],
		},
		password: {
			validates: [
				(value) => {
					const alphabeticRegExp = /(?=.*?[a-zA-Z])/;
					const digitsRegExp = /(?=.*?[0-9])/;
					const minLengthRegExp = /.{7,}/;
					const alphabeticPassword = alphabeticRegExp.test(value);
					const digitsPassword = digitsRegExp.test(value);
					const minLengthPassword = minLengthRegExp.test(value);
					if (!alphabeticPassword ||
            !digitsPassword ||
            !minLengthPassword
					) {
						return "Please enter 7 or more characters, using both numeric and alphabetic";
					}

					return "";
				},
			],
		},
	};

	const validateField = (field, value, object) => {
		let errorMessage = "";

		for (const validateFunction of fieldsConfig[field].validates) {
			errorMessage = validateFunction(value, object);
			if (errorMessage) {
				break;
			}
		}

		return errorMessage;
	};

	const validateForm = (object) => {
		const errors = {};

		Object.keys(fieldsConfig).forEach((field) => {
			const errorMessage = validateField(field, object[field], object);
			if (errorMessage) {
				errors[field] = errorMessage;
			}
		});

		setError(errors);

		return !(errors && Object.keys(errors).length);
	};

	const handleChange = (event) =>{
		const field = event.target.name;
		const value = event.target.value;

		setCredentials({
			...credentials,
			[field]: value
		});
	};

	const handleBlur = (event) => {
		const field = event.target.name;
		const value = event.target.value;

		const errorMessage = validateField(field, value, credentials);

		if (errorMessage) {

			setError({
				...error,
				[field]: errorMessage
			});
		} else {
			setError({
				...error,
				[field]: ""
			});
		}
	};

	const handleLogin = async() => {
		if (validateForm(credentials)) {
			const response = await AuthService.handleLogin(axios, credentials);

			if (response.success) {
				LocalStorageService.setToken(response.accessToken);
				LocalStorageService.setUser(response.user);
				
				navigate("/");
			} else if (response.errors) {
				setError(response.errors);
			}
		}
	};

	const hasDisableBtnLogin = () => {
		return Object.keys(fieldsConfig).some((field) => {
			return !credentials[field]?.trim() || error[field];
		});
	};

	return (
		<Auth>
			<h2>{"Login"}</h2>
			<div className="form-group">
				<label className="form-label">Username</label>
				<input 
					name="username" 
					type="text" 
					placeholder="User name" 
					className="form-control"
					value={credentials?.username}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				<span className="form-message">{error?.username}</span>
			</div>
			<div className="form-group">
				<label className="form-label">Password</label>
				<input 
					name="password" 
					type="password" 
					placeholder="Password" 
					className="form-control"
					value={credentials?.password}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				<span className="form-message">{error?.password}</span>
			</div>

			<button 
				className="btn w-100" 
				onClick={handleLogin}
				disabled={hasDisableBtnLogin()}
			>
				Login
			</button>
			<p 
				onClick={() => {
					navigate("/auth/register");
				}}
			>
				{"Don't have an account? Register here"}
			</p>
		</Auth>
	);
};

export default Login;
