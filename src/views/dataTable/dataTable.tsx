import { Paper } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'

interface DataTableProps {
  rows: GridRowsProp[]
  columns: GridColDef[]
}
export default function DataTable({ rows, columns }: DataTableProps) {
  return (
    <Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={70}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        disableColumnMenu={true}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        hideFooterSelectedRowCount={true}
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none !important'
            }
        }}
      />
    </Paper>
  )
}
