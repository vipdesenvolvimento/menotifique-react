import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FlashMessage from "../../Components/Flash/FlashMessage";
import {
	Checkbox,
	FormGroup,
	TextField,
	Typography,
	FormControlLabel,
	FormControl,
	Container,
	Stack,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
const axios = require("axios");

function initialError() {
	return { message: "", type: "warning" };
}

function initialForm() {
	return {
		name: "",
		description: "",
		textMessage: "",
		fonetic: "",
		action: 0,
		hangup: 0,
		tag: "",
		audio: "",
	}
}
const Message = () => {
	const [action, setAction] = useState(true);
	const [audioDisabled, setAudioDisabled] = useState(false);
	const [fonectDisabled, setFonectDisabled] = useState(false);
	const [error, setError] = useState(initialError);
 
	const [values, setValues] = useState(initialForm);

	useEffect(() => {
		setTimeout(() => {
		  if (error.message) {
			setError(initialError);
		  }
		}, 20000);
	  }, [error]);
	

	useEffect(() => {

		if (values.audio.length > 0) {
			setFonectDisabled(true);
			setValues({
				...values,
				fonetic: "",
			});
		} else {
			setFonectDisabled(false);
		}

		if (values.fonetic.length > 0) {
			setAudioDisabled(true);
			setValues({
				...values,
				audio: "",
			});
		} else {
			setAudioDisabled(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.audio, values.fonetic]);

	function onChange(event) {
		const { value, name } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	function onChangeHangup(event) {
		setAction(!event.target.checked);
		if(event.target.checked)
		{
			setValues({
				...values,
				action: "",
			});
		}
	}

	const onSubmit = async (event) => {
		event.preventDefault();

		const {
			name,
			description,
			textMessage,
			fonetic,
			action,
			// hangup,
			tag,
			// audio,
		} = values;

		const options = {
			method: "POST",
			url: `http://localhost:8000/message/create`,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				"name": `${name}`,
				"description": `${description}`,
				"texto": `${textMessage}`,
				"texto_fonetico": `${fonetic}`,
				"action": action,
				"is_active": 1,
				"hangup": 0,
				"tag": tag,
				"id_audio": ""
			},
		};
		
		try {
			axios
				.request(options)
				.then((response) => {
					if(response.status === 201) {
						setError({
							message: response.data.message,
							type: "success",
						  });
						
						 setValues(initialForm)
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
						<FlashMessage type={error.type} sx={{mb: 2}} >{error.message}</FlashMessage>
					)}
					<Stack direction="row" spacing={2}>

						<Box sx={{ p: 2, border: "0px solid grey" }} >
							<Typography
								component="h1"
								variant="h5"
								sx={{ color: "#00448c", fontSize: "1.4rem" }}
							>
								Mensagem
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

							<TextField
								margin="normal"
								multiline
								label="Descrição"
								name="description"
								id="description"
								rows={4}
								required
								value={values.description}
								onChange={onChange}
								fullWidth
							/>

							<TextField
								margin="normal"
								multiline
								label="Texto"
								name="textMessage"
								id="textMessage"
								value={values.textMessage}
								onChange={onChange}
								rows={4}
								fullWidth
							/>

							<TextField
								margin="normal"
								multiline
								label="Fonetico"
								name="fonetic"
								id="fonetic"
								value={values.fonetic}
								onChange={onChange}
								disabled={fonectDisabled}
								rows={4}
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
								Configuração da URA
							</Typography>
							<TextField
								margin="normal"
								label="Tag"
								name="tag"
								id="tag"
								required
								value={values.tag}
								onChange={onChange}
								fullWidth
							/>

							<Stack direction="row" spacing={2}>
								<TextField
									margin="normal"
									type="number"
									label="Quantas vezes"
									name="action"
									id="action"
									disabled={action}
									onChange={onChange}
									value={action ? "" : values.action}
									sx={{width: "60%" }}
								/>
								<FormControl
									margin="normal"
									sx={{
										pl: 0.7,
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<FormGroup aria-label="position" row>
										<FormControlLabel
											value="top"
											control={<Checkbox />}
											name="hangup"
											id="hangup"
											label="Derrubar chamada?"
											labelPlacement="end"
											onClick={onChangeHangup}
										/>
									</FormGroup>
								</FormControl>
							</Stack>
							<TextField
								margin="normal"
								label="Audio"
								name="audio"
								id="audio"
								onChange={onChange}
								disabled={audioDisabled}
								placeholder="Digite o id do audio"
								fullWidth
							/>
						</Box>
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Message;
