import React from "react";
import { Typography } from "@mui/material";

const TH5 = ({children}) => {
	return (
		<div>
			<Typography
				component="h1"
				variant="h5"
				sx={{
					color: "#00448c",
					fontSize: "1.4rem",
				}}>{children}</Typography>
		</div>
	);
}

export default TH5;
