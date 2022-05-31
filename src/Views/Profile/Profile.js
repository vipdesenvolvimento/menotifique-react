import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	TextField,
	Typography,
	FormControl,
	Container,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingButton from "@mui/lab/LoadingButton";
import FlashMessage from "../../Components/Flash/FlashMessage";
import StoreContext from "../../Components/Store/Context";
const axios = require("axios");
function initialError() {
	return { message: "", type: "warning" };
}

function fetchUser() {
	return {
		username: "",
		first_name: "",
		last_name: "",
		password: "",
		rePassword: "",
	};
}

const Profile = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(initialError);
	const [values, setValues] = useState(fetchUser);
	// const [data, setData] = useState(null);
  const { token } = useContext(StoreContext);

	useEffect(() => {
		setTimeout(() => {
			if (error.message) {
				setError(initialError);
				setLoading(false);
			}
		}, 2000);
	}, [error]);

	function onChange(event) {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/users/${token}`)
			.then((response) => {
				if (response.data.result.length > 0) {
					const user = response.data.result[0];
					setValues({
						...values,
						first_name: user.first_name,
						last_name: user.last_name,
						username: user.username,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				setError({
					type: "error",
					message: "Não foi possivel carregar dados.",
				});
			});
	}, [error]);

	function onSubmit(event) {
		event.preventDefault();

		const { first_name, last_name, password, rePassword } = values;

		// limpar erro anterior
		if (first_name === "" || first_name.length < 4) {
			setError({
				message:
					"Porfavor coloque pelo menos 4 caracter para *Primeiro Nome",
				type: "warning",
			});

			return null;
		} else if (password.length > 0) {
      console.log(password.length)
			if (password !== rePassword) {
				setError({
					message: "Senhas estão diferentes",
					type: "warning",
				});
        return null;
			}

			
		}

		axios
			.put(`http://localhost:8000/api/users/${token}/update`, {
				first_name: first_name,
				last_name: last_name,
				password: password,
			})
			.then((response) => {
				if (response.status === 200) {
					setError({
						message: "Perfil atualizado com sucesso",
						type: "success",
					});
          
				}
			})
			.catch((error) => {
				setError({
					type: "error",
					message: "Não foi possivel atualizar cadastro.",
				});
			});
	}

	return (
		<>
			<CssBaseline />
			<Container maxWidth="md">
				<Box
					component="form"
					onSubmit={onSubmit}
					noValidate
					sx={{ mt: 2 }}
					autoComplete="off"
				>
					<div>
						<Box sx={{ p: 2 }}>
							<Typography
								component="h1"
								variant="h5"
								sx={{
									color: "#00448c",
									fontSize: "1.4rem",
								}}
							>
								Perfil
							</Typography>

							{error.message && (
								<FlashMessage type={error.type}>
									{error.message}
								</FlashMessage>
							)}

							<FormControl sx={{ mt: 2, width: "100%" }}>
								<TextField
									margin="normal"
									label="Username"
									name="username"
									id="username"
									disabled={true}
									value={values.username}
									fullWidth
								/>

								<TextField
									margin="normal"
									label="Primero Nome"
									required
									name="first_name"
									id="first_name"
									value={values.first_name}
									onChange={onChange}
									fullWidth
								/>

								<TextField
									margin="normal"
									label="Segundo Nome"
									name="last_name"
									id="last_name"
									value={values.last_name}
									onChange={onChange}
									fullWidth
								/>

								<TextField
									margin="normal"
									required
									fullWidth
									autoFocus
									label="Senha"
									type="password"
									id="password"
									name="password"
									onChange={onChange}
									value={values.password}
								/>

								<TextField
									margin="normal"
									required
									fullWidth
									autoFocus
									label="Confirmar senha"
									type="password"
									id="rePassword"
									name="rePassword"
									onChange={onChange}
									value={values.rePassword}
								/>
							</FormControl>

							<LoadingButton
								type="submit"
								variant="contained"
								loadingIndicator="Loading..."
								loading={loading}
								sx={{ mt: 3, mb: 2 }}
							>
								Atualizar
							</LoadingButton>
						</Box>
					</div>
				</Box>
			</Container>
		</>
	);
};

export default Profile;
