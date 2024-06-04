import { useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import { DateTimeUtil } from "../../utils";
import DataForm from "./DataForm";
import DataDetail from "./DataDetail";
import AxiosInstance from "../../api/api";
import {
	CREATE_ORDER_FAILED,
	CREATE_ORDER_SUCCESS,
	DATA_NOTICE,
	UPDATE_ORDER_FAILED,
	UPDATE_ORDER_SUCCESS,
} from "../../notice";

const Order = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const [selectedRowModel, setSelectedRowModel] = useState([]);
	const [rows, setRows] = useState([]);
	const columns = [
		{ field: "id", headerName: "ID", flex: 1, hideable: false },
		{
			field: "partner",
			headerName: "PARTNER",
			flex: 1,
			hideable: false,
			valueGetter: (value) => value.name,
		},
		{
			field: "depot",
			headerName: "DEPOT",
			flex: 1,
			hideable: false,
			valueGetter: (value) => value.name,
		},
		{
			field: "created_date",
			headerName: "CREATED AT",
			type: "date",
			flex: 1,
			valueGetter: (value) => DateTimeUtil.parse(value),
			valueFormatter: (value) => DateTimeUtil.format(value),
		},
		{
			field: "total",
			headerName: "TOTAL (VNĐ)",
			type: "number",
			flex: 1,
		},
	];
	// API.
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/order_form/")
			.then((response) => setRows(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	}, []);
	// FORM SECTION.
	const [selectedRow, setSelectedRow] = useState({});
	// DETAIL SECTION.
	const [details, setDetails] = useState([]);
	useEffect(() => {
		if (!Boolean(selectedRow.id)) {
			setDetails([]);
			return;
		}
		// CALL API TO GET FORM DETAIL.
		AxiosInstance.get(
			`api/web/order_detail/${selectedRow.id}/filter_detail/`
		)
			.then((response) => setDetails(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	}, [selectedRow]);
	// CALCULATE TOTAL AUTOMATICALLY.
	const total = useMemo(
		() =>
			details.map((e) => e.quantity * e.price).reduce((a, b) => a + b, 0),
		[details]
	);

	const handleFormCancel = () => {
		setSelectedRowModel([]);
		setSelectedRow({});
	};

	// CALL API CREATE & UPDATE.
	const handleFormSubmit = (contentValues, { setSubmitting, resetForm }) => {
		contentValues = {
			...contentValues,
			total: total,
			details: !Boolean(selectedRow.id)
				? details
				: details.map((e) => {
						return {
							id: `${selectedRow.id}-${e.product.id}`,
							...e,
						};
				  }),
		};

		if (!Boolean(contentValues.id)) {
			AxiosInstance.post("api/web/order_form/", contentValues)
				.then((_) => {
					setAlert(CREATE_ORDER_SUCCESS);
					handleFormCancel();
					resetForm();
				})
				.catch((_) => setAlert(CREATE_ORDER_FAILED));
		} else {
			AxiosInstance.put(
				`api/web/order_form/${selectedRow.id}/`,
				contentValues
			)
				.then((_) => {
					setAlert(UPDATE_ORDER_SUCCESS);
					handleFormCancel();
					resetForm();
				})
				.catch((_) => setAlert(UPDATE_ORDER_FAILED));
		}
		setSubmitting(false);
	};

	return (
		<Box
			m="0 20px"
			height="100%"
			maxHeight="90vh"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			gap="20px"
		>
			<Box
				width="100%"
				height="262px"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none !important",
					},
					"& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-withBorderColor":
						{
							outline: "none !important",
						},
					"& .MuiDataGrid-columnHeader": {
						backgroundColor: colors.blueAccent[700],
					},
					"& .MuiDataGrid-topContainer::after": {
						content: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: colors.primary[400],
					},
					"& .MuiDataGrid-cell": {
						border: "none !important",
					},
					"& .css-tgsonj": {
						border: "none !important",
					},
					"& .MuiDataGrid-footerContainer": {
						minHeight: "50px !important",
						height: "50px !important",
						backgroundColor: colors.blueAccent[700],
						border: "none !important",
						borderRadius: "0 0 4px 4px",
					},
					"& .MuiDataGrid-columnSeparator": {
						display: "none !important",
					},
					"& .MuiDataGrid-selectedRowCount": {
						visibility: "hidden !important",
					},
				}}
			>
				<DataGrid
					columns={columns}
					rows={rows}
					autoPageSize
					disableColumnResize
					rowSelectionModel={selectedRowModel}
					onRowClick={(params) => setSelectedRow(params.row)}
					onRowSelectionModelChange={(params) => {
						if (selectedRowModel[0] === params[0])
							handleFormCancel();
						else setSelectedRowModel(params);
					}}
				/>
			</Box>

			<Box
				mb="20px"
				flex="1"
				display="flex"
				justifyContent="space-between"
			>
				<Box
					width="45%"
					padding="25px"
					borderRadius="5px"
					bgcolor={colors.primary[400]}
				>
					<DataForm
						handleFormSubmit={handleFormSubmit}
						handleFormCancel={handleFormCancel}
						form={selectedRow}
						total={total}
					/>
				</Box>

				<Box width="52%">
					<DataDetail details={details} setDetails={setDetails} />
				</Box>
			</Box>
		</Box>
	);
};

export default Order;
