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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function FilterTableDistrict({ rows, registerRows }) {
	const options = ["Desativar"];
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const columns = [
		{ id: "district", label: "Bairro", minWidth: 200, align: "left" },
		{ id: "city", label: "Cidade", minWidth: 200, align: "left" },
	];

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event) => {
		const { value } = anchorEl;
		const newRows = [...rows];
		newRows.map((row, i) => {
			if (row.district === value) {
				newRows.splice(i, 1);
			}
		});
		registerRows(newRows);
		setAnchorEl(null);
	};

	const ITEM_HEIGHT = 48;

	return (
		<Paper sx={{  mt: 2 }}>
			<TableContainer sx={{ maxHeight: 500 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns &&
								columns.map((column) => (
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
								align={"center"}
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
						{rows &&
							rows
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
											key={row.district}
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
															"number"
															? column.format(
																	value
															  )
															: value}
													</TableCell>
												);
											})}

											<TableCell align="center">
												<IconButton
													aria-label="more"
													id="long-button"
													value={row.district}
													aria-controls={
														open
															? "long-menu"
															: undefined
													}
													aria-expanded={
														open
															? "true"
															: undefined
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
									{"Remover"}
								</MenuItem>
							))}
						</Menu>
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows && ( rows.length)}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

export default FilterTableDistrict;
