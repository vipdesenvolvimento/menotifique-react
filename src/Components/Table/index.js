import React from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Switch,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import CheckIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from '@mui/icons-material/Autorenew';


const axios = require("axios");
function TableCustom({
	rowsPerPageOptions,
	handleChangeRowsPerPage,
	handleChangePage,
	rowsPerPage,
	columns,
	count,
	page,
	rows,
	setError,
}) {
	const options = ["Desativar"];
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleOnChangeChecked = async (event) => {

		const { value } = event.currentTarget;

		try {
			await axios
				.put(`http://localhost:8000/api/message/${value}`)
				.then((response) => {
					if (response.status === 200) {
						setError({
							message: response.data.message,
							type: "success",
						});
					}
				})
				.catch((error) => {
					setError(error);
				});
		} catch (error) {
			setError(error);
		}
	}

	// function IconDisabled(el) {
	// 	if (el) {
	// 		return <CheckIcon color="secondary"></CheckIcon>;
	// 	}

	// 	return null;
	// }

	const handleClose =  async (event) => {
		const { value } = anchorEl;

		if (event.target.id === "Desativar" || event.target.id === "Ativar") {
			// desativar
			try {
				await axios
					.put(`http://localhost:8000/api/message/${value}`)
					.then((response) => {
						if (response.status === 200) {
							setError({
								message: response.data.message,
								type: "success",
							});
						}
					})
					.catch((error) => {
						setError(error);
					});
			} catch (error) {
				setError(error);
			}
		}

		setAnchorEl(null);
	};

	const ITEM_HEIGHT = 48;

	return (
		<Paper sx={{ width: "100%", mt: 2 }}>
			<TableContainer sx={{ maxHeight: 540 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{
										top: 0,
										minWidth: column.minWidth,
									}}
								>
									{column.label}
								</TableCell>
							))}
							<TableCell
								style={{
									top: 0,
									minWidth: 20,
								}}
							>
								Ação
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row.id}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
												>
													{column.format &&
													typeof value === "number"
														? column.format(value)
														: column.id ===
														  "is_active"
														? <Switch checked={(value ? true : false)} value={row.id} onChange={handleOnChangeChecked} />
														: value}
												</TableCell>
											);
										})}

										<TableCell align="right">
											<IconButton
												aria-label="more"
												id="long-button"
												value={row.id}
												aria-controls={
													open
														? "long-menu"
														: undefined
												}
												aria-expanded={
													open ? "true" : undefined
												}
												aria-haspopup="true"
												onClick={handleClick}
											>
												<MoreVertIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						<Menu
							id="long-menu"
							MenuListProps={{
								"aria-labelledby": "long-button",
							}}
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								style: {
									maxHeight: ITEM_HEIGHT * 4.5,
									width: "10ch",
								},
							}}
						>
							{options.map((option) => (
								<MenuItem
									key={option}
									id={option}
									selected={option === "Pyxis"}
									onClick={handleClose}
									sx={{ justifyContent: "center"}}
								>
									{/* {option} */}
									<AutorenewIcon></AutorenewIcon>
								</MenuItem>
							))}
						</Menu>
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={rowsPerPageOptions}
				component="div"
				count={count}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

export default TableCustom;
