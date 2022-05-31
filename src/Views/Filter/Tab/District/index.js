import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	TextField,
	Stack,
	IconButton,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Autocomplete,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import FilterTableDistrict from "./Table";
import FormContext from "./../../../../Components/Store/FormContext";
// icons
import AddIcon from "@mui/icons-material/AddCircle";

const axios = require("axios");

function initDistrict() {
	return {
		district: "",
		city: "",
	};
}

function District() {
	const [values, setValues] = useState(initDistrict);
	const { districts, setDistricts } = useContext(FormContext);
	const { except, setException } = useContext(FormContext);
	const [rows, setRows] = React.useState(districts);
	const [inputDistrictValue, setInputDistrictValue] = useState("");
	const [options, setOptions] = useState([]);
	const [districtOtions, setDistrictOptions] = useState([]);

	const registerRows = (value) => {
		setRows(value);
	};

	function createData(district, city) {
		return { district: district, city: city };
	}

	const apiNeighborhood = async () => {
		values.city &&
			(await axios
				.get(`http://localhost:8000/neighborhood/${values.city}`)
				.then((response) => {
					let opt = [];
					response.data.data.forEach((element) => {
						opt.push(element.BAIRRO);
					});
					setDistrictOptions(opt);
				}));
	};

	const onClickException = () => {
		setException(!except);
	};

	const apiCity = async () => {
		await axios.get(`http://localhost:8000/city/`).then((response) => {
			if (response.status !== false) {
				let opt = [];
				response.data.data.forEach((element) => {
					opt.push(element.CIDADE);
				});
				setOptions(opt);
			}
		});
	};

	useEffect(() => {
		apiCity();
		setDistricts(rows);
		if (values.city.length > 0) {
			apiNeighborhood();
		}
	}, [values, rows]);

	function onChange(event) {
		const { value, name } = event.target;
		if (name === "city") {
			setInputDistrictValue("clear");
		}
		setValues({
			...values,
			[name]: value,
		});
	}

	const handleChangeDistrict = () => {
		const { city } = values;
		if (inputDistrictValue !== null && inputDistrictValue !== "") {
			const verify = rows.filter((item) => {
				return item.district === inputDistrictValue;
			});

			if (verify.length === 0) {
				if (
					inputDistrictValue !== "" &&
					inputDistrictValue !== null &&
					inputDistrictValue !== undefined
				) {
					setRows([...rows, createData(inputDistrictValue, city)]);
				}
			}
		}
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Stack direction="column" spacing={3} alignItems="left">
					<FormControl fullWidth>
						<InputLabel id="city-select-label">Cidade</InputLabel>
						<Select
							labelId="city-select-label"
							id="city-select"
							value={values.city}
							label="Cidade"
							name="city"
							onChange={onChange}
							sx={{ width: 210 }}
						>
							<MenuItem value="">Escolha um Opção</MenuItem>
							{options &&
								options.map((item) => {
									return (
										<MenuItem key={item} value={item}>
											{item}
										</MenuItem>
									);
								})}
						</Select>
					</FormControl>
					<Stack direction="row" spacing={3} alignItems="center">
						<FormControl>
							<Autocomplete
								id="controllable-states-district"
								options={districtOtions}
								sx={{ width: 210 }}
								onChange={onChange}
								inputValue={inputDistrictValue}
								onInputChange={(event, newInputValue) => {
									setInputDistrictValue(newInputValue);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										label="Bairros"
									/>
								)}
							/>
						</FormControl>
						<FormControl>
							<IconButton
								color="primary"
								aria-label="add item"
								component="span"
								onClick={handleChangeDistrict}
							>
								<AddIcon fontSize="large" />
							</IconButton>
						</FormControl>
					</Stack>
					<FormControl fullWidth>
						<FormGroup>
							<FormControlLabel
								labelPlacement="end"
								label="Exceto"
								control={<Checkbox checked={except} />}
								onClick={onClickException}
							/>
						</FormGroup>
					</FormControl>
				</Stack>
			</Box>
			<Box
				sx={{
					display: "flex",
					mt: 2,
				}}
			>
				<FilterTableDistrict
					rows={rows}
					registerRows={registerRows}
				></FilterTableDistrict>
			</Box>
		</>
	);
}

export default District;
