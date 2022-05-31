import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Switch from "@mui/material/Switch";
const axios = require("axios");

const TableCategory = ({ rows, setError }) => {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const columns = [
		{ id: "id", label: "id", minWidth: 10 },
		{ id: "name", label: "Name", minWidth: 170 },
		{ id: "is_active", label: "Inativo", minWidth: 120 },
	];

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const options = ["Deletar"];

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleOnChangeChecked = async (event) => {
		const { value } = event.currentTarget;

		try {
			await axios
				.put(`http://localhost:8000/api/category/${value}`)
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
	};

	const handleClose = async (event) => {
		const { value } = anchorEl;

		if (event.target.id === "Deletar") {
			try {
				await axios
					.delete(`http://localhost:8000/api/category/${value}`)
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
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
							<TableCell style={{ minWidth: 20 }}>Ação</TableCell>
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
													typeof value ===
														"number" ? (
														column.format(value)
													) : column.id ===
													  "is_active" ? (
														<Switch
															key={row.id}
															checked={
																value
																	? true
																	: false
															}
															value={row.id}
															inputProps={{
																"aria-label":
																	"controlled",
															}}
															onChange={
																handleOnChangeChecked
															}
														/>
													) : (
														value
													)}
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
									sx={{ justifyContent: "center" }}
								>
									{option}
								</MenuItem>
							))}
						</Menu>
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default TableCategory;
