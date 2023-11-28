import { CardContent, Paper } from '@mui/material'
import { DataGrid, GridColDef, GridRowId, GridRowsProp, GridToolbar, GridSortModel } from '@mui/x-data-grid'
import { ReactNode } from 'react'

interface DataTableProps {
  rows: GridRowsProp[]
  columns: GridColDef[]
  sortModel: GridSortModel
  getId: (row: any) => GridRowId //暫用any
  tableName?: string
  icon?: ReactNode
}
export default function DataTable({ rows, columns, sortModel, getId }: DataTableProps) {
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
            getRowId={getId}
            disableColumnMenu={true}
            sortModel={sortModel}
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
