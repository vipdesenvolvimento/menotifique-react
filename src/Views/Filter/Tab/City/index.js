import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	TextField,
	Stack,
	IconButton,
	FormControl,
	Autocomplete,
} from "@mui/material";
import FilterTableCity from "./Table";
import FormContext from "../../../../Components/Store/FormContext";
// icons
import AddIcon from "@mui/icons-material/AddCircle";

const axios = require("axios");

function initCity() {
	return {
		city: "",
	};
}

function City() {
	const [values, setValues] = useState(initCity);
	const { citys, setCitys } = useContext(FormContext);
	const [rows, setRows] = React.useState(citys);
	const [inputCityValue, setInputCityValue] = useState("");
	const [options, setOptions] = useState([]);

	console.log(rows);

	const registerRows = (value) => {
		setRows(value);
	};

	function createData(value) {
		return { name: value };
	}

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
		setCitys(rows);
	}, [values, rows]);

	function onChange(event) {
		const { value, name } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	const handleChangeCity = () => {
		if (inputCityValue !== null) {
			const verify = rows.filter((item) => {
				return item.name === inputCityValue;
			});

			if (
				verify.length === 0 &&
				inputCityValue !== "" &&
				inputCityValue !== null &&
				inputCityValue !== undefined
			) {
				setRows([...rows, createData(inputCityValue)]);
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
				<Stack direction="row" spacing={3} alignItems="center">
					<FormControl>
						<Autocomplete
							id="controllable-states-cidade"
							options={options}
							sx={{ width: 210 }}
							onChange={onChange}
							inputValue={inputCityValue}
							onInputChange={(event, newInputValue) => {
								setInputCityValue(newInputValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									fullWidth
									label="Cidade"
								/>
							)}
						/>
					</FormControl>
					<FormControl>
						<IconButton
							color="primary"
							aria-label="add item"
							component="span"
							onClick={handleChangeCity}
						>
							<AddIcon fontSize="large" />
						</IconButton>
					</FormControl>
				</Stack>
			</Box>
			<Box
				sx={{
					display: "flex",
					mt: 2,
				}}
			>
				<FilterTableCity
					rows={rows}
					registerRows={registerRows}
				></FilterTableCity>
			</Box>
		</>
	);
}

export default City;
