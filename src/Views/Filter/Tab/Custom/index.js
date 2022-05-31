import React, { useState, useEffect, useContext } from "react";
import { Box, Stack, Button, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";

import FormContext from "../../../../Components/Store/FormContext";

function initInput() {
	return { file: "" };
}

const Input = styled("input")({
	display: "none",
});

function Custom() {
	const [values, setValues] = useState(initInput);

	function onChange(event) {
		const { value, name } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	}

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
						<label htmlFor="contained-button-file">
							<Input
								accept=".csv"
                name="file"
								id="contained-button-file"
								multiple
								type="file"
							/>
							<Button variant="contained" component="span">
								Upload
							</Button>
						</label>
					</FormControl>
				</Stack>
			</Box>
		</>
	);
}

export default Custom;
