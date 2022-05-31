import React, { useState, useEffect } from "react";
import { Container, Stack, Box, Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import CardUra from "./../../Components/CardUra/index";
import FlashMessage from "../../Components/Flash/FlashMessage";
import { format } from "date-fns";

const axios = require("axios");

function initialError() {
	return { message: "", type: "warning" };
}


const DashBoard = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(initialError);

	async function apiActivation() {
		try {
			await axios
				.get("http://localhost:8000/api/activation")
				.then((response) => {
					if(response.data.result.length) {
						setData(response.data);
					}
				})
				.catch((error) => {
					if (error.response.status === 404) {
						console.log(error);
					}
				});
		} catch (err) {
			console.log(err);
		}
	}

	async function handleClick(id) {
		const response = await axios.put(
			`http://localhost:8000/api/activation/${id}`
		);
		if (response.status === 200) {
			if (!response.data.status) {
				setError({
					message: "Evento desativado.",
					type: "warning",
				});
			} else {
				setError({
					message: "Evento ativado com sucesso",
					type: "success",
				});
			}
		}
	}

	async function handleClickClose(id) {
		const response = await axios.put(
			`http://localhost:8000/api/activation/close/${id}`
		);
		if (response.status === 200) {
			if (!response.data.status) {
				setError({
					message: response.data.message,
					type: "success",
				});
			} else {
				setError({
					message: response.data.error,
					type: "success",
				});
			}
		}
	}

	useEffect(() => {
		setTimeout(() => {
			if (error.message) {
				setError(initialError);
			}
		}, 20000);
		apiActivation();
	}, [error]);
	
	function cardMonitor(event) {
		const dateNow = new Date().getTime();
		const dateEnd = new Date(event.date_end).getTime();
		if (dateEnd >= dateNow) {
			return (
				<>
					<CardUra
						key={event.id}
						id={event.id}
						tag={event.tag}
						description={event.description}
						date_init={
							"Data Inicio: " +
							format(
								new Date(event.date_init),
								"dd/MM/yyyy H:ii:ss"
							)
						}
						date_end={
							"Data Fim: " +
							format(
								new Date(event.date_end),
								"dd/MM/yyyy H:ii:ss"
							)
						}
						active={event.is_active}
					>
						<Button
							size="small"
							onClick={() => {
								handleClick(event.id);
							}}
						>
							{event.is_active ? "Desativar" : "Ativar"}
						</Button>
						<Button
							size="small"
							onClick={() => {
								handleClickClose(event.id);
							}}
						>
							Encerar
						</Button>
					</CardUra>
				</>
			);
		}
		return null;
	}

	return (
		<>
			<CssBaseline />
			<Container fixed>
				<Box component="div" sx={{ mt: 2 }}>
					{error.message && (
						<FlashMessage type={error.type} sx={{ mb: 2 }}>
							{error.message}
						</FlashMessage>
					)}
					<Stack direction="row" spacing={2}>
						{data &&
							data.result.length > 0 && (								
								data.result.map((event) => {
									return cardMonitor(event);
								})
							)
						}
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default DashBoard;
