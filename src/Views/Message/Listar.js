import React, { useState, useEffect } from "react";
import TableCustom from "./../../Components/Table";
import CssBaseline from "@mui/material/CssBaseline";
import FlashMessage from "../../Components/Flash/FlashMessage";
import { Typography, Container, Stack, Box } from "@mui/material";

const axios = require("axios");

function initialError() {
	return { message: "", type: "warning" };
}

function MessageListar() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [rows, setRows] = React.useState(null);
	const [error, setError] = useState(initialError);

	const apiMessage = async () => {
		await axios.get("http://localhost:8000/api/message").then((response) => {
			setRows(response.data.result);
		})
	}

	useEffect(() => {
		setTimeout(() => {
		  if (error.message) {
			setError(initialError);
		  }
		}, 20000);
	  }, [error]);

	
	useEffect(() => {
		apiMessage();
	}, [error]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const columns = [
		{ id: "id", label: "id", minWidth: 20 },
		{ id: "tag", label: "Tag", minWidth: 20 },
		{ id: "name", label: "Nome", minWidth: 300 },
		{ id: "description", label: "Descrição", minWidth: 500 },
		{ id: "hangup", label: "Hangup", minWidth: 20 },
		{ id: "is_active", label: "Inativos", minWidth: 20 },
		{ id: "id_audio", label: "Audio", minWidth: 20 }
	];


	return (
		<>
			<CssBaseline />
			<Container fixed>
				<Box sx={{ mt: 2 }}>
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
								Listar Mensagem
							</Typography>
							{rows && (
								<TableCustom
									columns={columns}
									rows={rows}
									count={rows.length}
									page={page}
									rowsPerPage={rowsPerPage}
									handleChangePage={handleChangePage}
									handleChangeRowsPerPage={handleChangeRowsPerPage}
									rowsPerPageOptions={[10, 25, 100]}
                                    setError={setError}
								></TableCustom>
							)}
						</Box>
					</Stack>
				</Box>
			</Container>
		</>
	);
}

export default MessageListar;
