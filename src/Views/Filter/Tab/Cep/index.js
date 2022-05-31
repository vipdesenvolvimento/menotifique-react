import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	TextField,
	Stack,
	Alert,
	IconButton,
	FormControl,
} from "@mui/material";
import InputMask from "react-input-mask";
import FilterTableCep from "./Table";
import FormContext from "../../../../Components/Store/FormContext";
// icons
import AddIcon from "@mui/icons-material/AddCircle";

const axios = require("axios");

function initCep() {
	return {
		cep: "",
	};
}

function Cep() {
	const [values, setValues] = useState(initCep);
	const [cepData, setCepData] = useState(null);
	const { setCeps, ceps } = useContext(FormContext);
	const [rows, setRows] = React.useState(ceps);

	const registerRows = (value) => {
		setRows(value);
	};
	
	const apiCep = async () => {
		await axios
			.get(`http://localhost:8000/cep/${values.cep}`)
			.then((response) => {
				if (response.data.status !== false) {
					setCepData(response.data);
				}
			});
	};

	useEffect(() => {
		if(values.cep.length === 9) { apiCep(); }
		setCeps(rows);
	}, [values, rows]);

	function onChange(event) {
		const { value, name } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

	const handleChangeCep = () => {
		if (cepData !== null) {
			const verify = rows.filter((item) => {
				return item.cep === cepData.cep.replace(/[^\d]/g, "");
			});
			if (
				verify.length === 0 &&
				cepData.cep !== null &&
				cepData.cep !== undefined
			) {
				setRows([...rows, cepData]);
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
						<InputMask
							mask="99999-999"
							disabled={false}
							maskChar=" "
							onChange={onChange}
							value={values.cep}
						>
							{() => (
								<TextField
									label="Cep"
									name="cep"
									id="cep"
									value={values.cep}
								/>
							)}
						</InputMask>
					</FormControl>
					<FormControl>
						<IconButton
							color="primary"
							aria-label="add item"
							component="span"
							onClick={handleChangeCep}
						>
							<AddIcon fontSize="large" />
						</IconButton>
					</FormControl>
					<FormControl>
						{cepData && (
							<Alert icon={false} severity="info">
								{cepData
									? `[ ${cepData.city} ] ${cepData.street} - ${cepData.neighborhood}`
									: ""}
							</Alert>
						)}
					</FormControl>
				</Stack>
			</Box>
			<Box
				sx={{
					display: "flex",
					mt: 2,
				}}
			>
				<FilterTableCep
					rows={rows}
					registerRows={registerRows}
				></FilterTableCep>
			</Box>
		</>
	);
}

export default Cep;
