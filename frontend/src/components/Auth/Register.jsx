import { useState } from "react";
import Auth from "./Auth";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";
import LocalStorageService from "../../service/LocalStorageService";
import { createAxios } from "../../createInstance";

const Register = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
		confirmPassword: ""
	});
	const [error, setError] = useState({});

	const axios = createAxios();

	const navigate = useNavigate();

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
		confirmPassword: {
			validates: [
				(value, object) => {
					if ((value || object.password) && value !== object.password) {
						return "Please fill in the same value with field Password";
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

	const handleRegister = async() => {
		if (validateForm(credentials)) {
			const data = await AuthService.handleRegister(axios, credentials);
	
			if (data.success && data.accessToken) {
				LocalStorageService.setToken(data?.accessToken);
				LocalStorageService.setUser(data?.user);

				navigate("/");
					
			} else if (data.errors) {
				setError(data.errors);
			}
		
		}
	};

	const handleChangeField = (event) =>{
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

	const hasDisableBtnRegister = () => {
		return Object.keys(fieldsConfig).some((field) => {
			return !credentials[field]?.trim() || error[field];
		});
	};

	return (
		<Auth>
			<h2>{"Register"}</h2>
			<div className="form-group">
				<label className="form-label">Username</label>
				<input 
					name="username" 
					type="text" 
					placeholder="User name" 
					className="form-control"
					value={credentials?.username}
					onChange={handleChangeField}
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
					onChange={handleChangeField}
					onBlur={handleBlur}
				/>
				<span className="form-message">{error?.password}</span>
			</div>
			<div className="form-group">
				<label className="form-label">Confirm Password</label>
				<input 
					name="confirmPassword" 
					type="password" 
					placeholder="Confirm Password" 
					className="form-control"
					value={credentials?.confirmPassword}
					onChange={handleChangeField}
					onBlur={handleBlur}
				/>
				<span className="form-message">{error?.confirmPassword}</span>
			</div>
		
			<button 
				className="btn w-100" 
				onClick={handleRegister} 
				disabled={hasDisableBtnRegister()}
			>
					Register
			</button>
			<p 
				onClick={() => {
					navigate("/auth/login");
				}}
			>
				{"Already have an account? Login here"}
			</p>
		</Auth>
	);
};

export default Register;
