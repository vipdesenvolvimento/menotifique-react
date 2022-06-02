import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FlashMessage from "../../Components/Flash/FlashMessage";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FormContext from "./../../Components/Store/FormContext";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import {
	Container,
	Stack,
	Tab,
	Select,
	MenuItem,
	InputLabel,
	TextField,
	FormControl,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import TH5 from "./../../Components/TypographyH5";

// tabs
import Cep from "./Tab/Cep";
import District from "./Tab/District";
import City from "./Tab/City";
import Custom from "./Tab/Custom";

const axios = require("axios");

function submitDefault() {
	return {
		description: "",
		category: "",
	};
}

function initialError() {
	return { message: "", type: "warning" };
}

const MessageFilter = () => {
	const [tabIndex, setTabIndex] = useState("1");
	const [values, setValues] = useState(submitDefault);
	const [dateInit, setDateInit] = useState(new Date());
	const [dateInitHora, setDateInitHora] = useState(new Date().getTime());
	const [dateEnd, setDateEnd] = useState(new Date());
	const [dateEndHora, setDateEndHora] = useState(new Date().getTime());
	const [tagMessage, setTagMessage] = useState("");
	const [messageData, setMessageData] = useState(null);
	const [categoryData, setCategoryData] = useState(null);
	const [tag, setTag] = useState("");
	const {
		ceps,
		setCeps,
		districts,
		setDistricts,
		citys,
		setCitys,
		customs,
		except,
	} = useContext(FormContext);

	const [error, setError] = useState(initialError);

	const apiCategory = async () => {
		await axios
			.get(`http://localhost:8000/api/category`)
			.then((response) => {
				if(response.status === 200) {
					setCategoryData(response.data.result);
				}
			});
	};

	const apiMessageTag = async () => {
		await axios
			.get(`http://localhost:8000/api/message/tag/${tag}`)
			.then((response) => {
				if (response.status === 200) {
					if (response.data.result.length) {
						setMessageData(response.data.result);
					} else {
						setMessageData(null);
					}
				}
			});
	};

	const apiMessage = async () => {
		await axios
			.get(`http://localhost:8000/api/message`)
			.then((response) => {
				if (response.status === 200) {
					if (response.data.result.length) {
						setMessageData(response.data.result);
					}
				}
			});
	};

	useEffect(() => {
		setTimeout(() => {
			if (error.message) {
				setError(initialError);
			}
		}, 20000);
	}, [error]);

	useEffect(() => {
		apiCategory();

		if(tag !== "") {
			apiMessageTag()
		} else {
			apiMessage();
		}
		
	}, [values, tag]);

	const handleChangeTab = (event, newValue) => {
		setTabIndex(newValue);
	};

	function onChangeSelect(event, newValue) {
		setTagMessage(event.target.value);
		setTag(event.target.value);
	}

	function onChangeTag(event) {
		setTag(event.target.value);
	}

	function onChange(event) {
		const { value, name } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	const onSubmit = async (event) => {
		event.preventDefault();

		const { description, category } = values;

		let dataCep = [];
		let dataDistricts = [];
		let dataDistrictCity = [];
		let dataCitys = [];

		var count = 0;

		// percorer os dados
		if (ceps.length > 0) {
			count++;
			ceps.forEach((cep) => {
				dataCep.push(cep.cep);
			});
		}

		if (districts.length > 0) {
			count++;
			districts.forEach((dist) => {
				dataDistricts.push(dist.district);
				dataDistrictCity.push(dist.city);
			});
		}

		if (citys.length > 0) {
			count++;
			citys.forEach((city) => {
				dataCitys.push(city.name);
			});
		}

		if(count === 0){
			setError({
				message: "Escolha no minimo 1 filtro para continuar.",
				type: "warning",
			});
			return null;
		}

		let dateE = new Date(dateEnd).toISOString();
		let dateI = new Date(dateInit).toISOString();

		await axios
			.post("http://localhost:8000/api/activation", {
				tag: tag,
				description: description,
				category: category,
				date_init: dateI,
				date_end: dateE,
				cep: {
					ceps: dataCep,
				},
				district: {
					exception: except,
					districts: dataDistricts,
					districtsCity: dataDistrictCity
				},
				city: dataCitys,
				custom: [],
				is_active: 1,
			})
			.then((response) => {
				if (response.status === 201) {
					setError({
						message: response.data.message,
						type: "success",
					});
				}

				setValues(submitDefault);
				setTag("");
				setCitys(null);
				setCeps(null);
				setDistricts(null);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<CssBaseline />
			<Container fixed>
				<Box
					component="form"
					sx={{ mt: 2 }}
					autoComplete="off"
					onSubmit={onSubmit}
				>
					{error.message && (
						<FlashMessage type={error.type} sx={{ mb: 2 }}>
							{error.message}
						</FlashMessage>
					)}
					<div>
						<Stack direction="row" spacing={2}>
							<Box
								sx={{
									p: 2,
									borderLeft:
										"0px solid rgba(133,133,133, 0.5)",
									width: 540,
								}}
							>
								<TH5>Ativação</TH5>
								<Stack direction="column" spacing={4}>
									<FormControl>
										<TextField
											margin="normal"
											label="Tag"
											name="tag"
											id="tag"
											required
											value={tag}
											onChange={onChangeTag}
											fullWidth
										/>
									</FormControl>
									<FormControl fullWidth>
										<InputLabel id="message-select-label">
											Message
										</InputLabel>
										<Select
											labelId="message-select-label"
											defaultValue=""
											id="message-select"
											name="tagMessage"
											value={tagMessage}
											label="Message"
											onChange={onChangeSelect}
										>
											<MenuItem value={""}>
												<em>Escolha um Opção</em>
											</MenuItem>
											{messageData &&
												messageData.map((item) => {
													if (item.is_active) {
														return (
															<MenuItem
																key={item.id}
																value={item.tag}
															>
																{item.tag}
																{" - "}
																{
																	item.description
																}
															</MenuItem>
														);
													}
													return null;
												})}
										</Select>
									</FormControl>
									<FormControl fullWidth>
										<InputLabel id="message-select-label">
											Categoria
										</InputLabel>
										<Select
											labelId="category-select-label"
											id="category-select"
											name="category"
											value={values.category}
											required
											label="Categoria"
											onChange={onChange}
										>
											<MenuItem value={""}>
												Escolha um Opção
											</MenuItem>
											{categoryData &&
												categoryData.map((item) => {
													if (item.is_active) {
														return (
															<MenuItem
																key={item.id}
																value={item.id}
															>
																{item.id}
																{" - "}
																{item.name}
															</MenuItem>
														);
													}
													return null;
												})}
										</Select>
									</FormControl>
									<FormControl>
										<TextField
											margin="normal"
											label="Descrição"
											name="description"
											id="description"
											required
											value={values.description}
											onChange={onChange}
											fullWidth
										/>
									</FormControl>
									<FormControl>
										{/* <Stack direction="row" spacing={1}> */}
											<DateTimePicker
												renderInput={(props) => (
													<TextField {...props} />
												)}
												label="Data Inicio"
												name="date_init"
												value={dateInit}
												onChange={(newValue) => {
													setDateInit(newValue);
												}}
											/>

											{/* <TimePicker
												renderInput={(props) => (
													<TextField {...props} />
												)}
												label="Hora"
												name="date_init_hora"
												value={dateInitHora}
												onChange={(newValue) => {
													setDateInitHora(newValue);
												}}
											/> */}
										{/* </Stack> */}
									</FormControl>

									<FormControl>
										{/* <Stack direction="row" spacing={1}> */}
											<DateTimePicker
												renderInput={(props) => (
													<TextField {...props} />
												)}
												label="Data Fim"
												name="date_end"
												value={dateEnd}
												onChange={(newValue) => {
													setDateEnd(newValue);
												}}
											/>

											{/* <TimePicker
												renderInput={(props) => (
													<TextField {...props} />
												)}
												label="Hora"
												name="date_end_hora"
												value={dateEndHora}
												onChange={(newValue) => {
													setDateEndHora(newValue);
												}}
											/> */}
										{/* </Stack> */}
									</FormControl>
								</Stack>
							</Box>
							<Box
								sx={{
									p: 2,
									borderLeft:
										"1px solid rgba(133,133,133, 0.5)",
									mt: 2,
									width: 540,
								}}
							>
								<TH5>Filtros</TH5>
								<TabContext value={tabIndex}>
									<Box
										sx={{
											borderBottom: 1,
											borderColor: "divider",
											mt: 4,
										}}
									>
										<TabList
											onChange={handleChangeTab}
											aria-label="lab API tabs example"
										>
											<Tab label="CEP" value="1" />
											<Tab label="BAIRRO" value="2" />
											<Tab label="CIDADE" value="3" />
											{/* <Tab
												label="PERSONALIZADO"
												value="4"
											/> */}
										</TabList>
									</Box>
									<TabPanel value="1">
										<Cep />
									</TabPanel>
									<TabPanel value="2">
										<District />
									</TabPanel>
									<TabPanel value="3">
										<City />
									</TabPanel>
									<TabPanel value="4">
										<Custom />
									</TabPanel>
								</TabContext>
								<Stack direction="row" justifyContent="flex-end">
									<FormControl>
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
									</FormControl>
								</Stack>
							</Box>
						</Stack>
					</div>
				</Box>
			</Container>
		</>
	);
};

export default MessageFilter;
