import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 11 };

export default function DataTable({ rows, columns, getRowId }) {
  return (
    <Paper
      sx={{
        height: 721,
        width: "100%",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[11, 22]}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            padding: "10px",
            fontSize: "14px",
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(odd)": {
              backgroundColor: "#fafafa",
            },
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          },
        }}
      />
    </Paper>
  );
}
