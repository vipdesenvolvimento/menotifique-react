import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FlashMessage from "../../Components/Flash/FlashMessage";
import { TextField, Typography, Container, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import TableCategory from "./Table";
const axios = require("axios");

function initialError() {
	return { message: "", type: "warning" };
}

function initialForm() {
	return {
		name: "",
	};
}
const Message = () => {
	const [error, setError] = useState(initialError);
	const [values, setValues] = useState(initialForm);
	const [rows, setRows] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			if (error.message) {
				setError(initialError);
			}
		}, 10000);
	}, [error]);

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/category`)
			.then((response) => {
                setRows(response.data.result);
			})
			.catch((error) => {
				console.log(error);
				setError({
					type: "error",
					message: "Não foi possivel carregar dados.",
				});
			});
	}, [error, values, setError]);

	function onChange(event) {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		const { name } = values;

		try {
			axios
				.post("http://localhost:8000/api/category/create", {
					name: [name],
				})
				.then((response) => {
					if (response.status === 201) {
						setError({
							message: "Categoria criada com sucesso",
							type: "success",
						});

						setValues(initialForm);
					}
				})
				.catch((error) => {
					setError(error);
				});
		} catch (error) {
			setError(error);
		}
	};

	return (
		<>
			<CssBaseline />
			<Container fixed>
				<Box
					component="form"
					sx={{ mt: 2 }}
					onSubmit={onSubmit}
					autoComplete="off"
				>
					{error.message && (
						<FlashMessage type={error.type} sx={{ mb: 2 }}>
							{error.message}
						</FlashMessage>
					)}
					<Stack direction="row" spacing={2}>
						<Box sx={{ p: 2, border: "0px solid grey" }}>
							<Typography
								component="h1"
								variant="h5"
								sx={{ color: "#00448c", fontSize: "1.4rem" }}
							>
								Categoria
							</Typography>

							<TextField
								margin="normal"
								label="Nome"
								name="name"
								id="name"
								required
								value={values.name}
								onChange={onChange}
								fullWidth
							/>

							<LoadingButton
								type="submit"
								variant="contained"
								loadingIndicator="Loading..."
								loading={false}
								size="medium"
								sx={{ mt: 3, mb: 2 }}
							>
								Registrar
							</LoadingButton>
						</Box>
						<Box
							sx={{
								p: 2,
								borderLeft: "1px solid rgba(133,133,133, 0.5)",
								mt: 2,
								width: "100%",
							}}
						>
							<Typography
								component="h1"
								variant="h5"
								sx={{ color: "#00448c", fontSize: "1.4rem" }}
							>
								Lista de Categoria
							</Typography>
                            {rows && (
							    <TableCategory rows={rows} setError={setError}>

                                </TableCategory>
                            )}
						</Box>
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Message;
