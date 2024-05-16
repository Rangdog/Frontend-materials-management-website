import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box mt="-50px">
			<Typography
				variant="h2"
				color={colors.grey[100]}
				fontWeight="bold"
				sx={{ mb: "5px" }}
			>
				{title}
			</Typography>
			<Typography
				variant="h5"
				color={colors.greenAccent[400]}
				fontStyle="italic"
			>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default Header;