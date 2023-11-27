import { CardContent, Paper } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid'
import { ReactNode } from 'react'

interface DataTableProps {
  rows: GridRowsProp[]
  columns: GridColDef[]
  tableName?: string
  icon?: ReactNode
}
export default function DataTable({ rows, columns }: DataTableProps) {
  return (
    <>
      <CardContent>
        <Paper elevation={4}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={70}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 }
              }
            }}
            disableColumnMenu={true}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            disableDensitySelector
            hideFooterSelectedRowCount={true}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within':
                {
                  outline: 'none !important'
                }
            }}
          />
        </Paper>
      </CardContent>
    </>
  )
}
