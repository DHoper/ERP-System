import { Card, CardContent, CardHeader, Paper, Typography, useTheme } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { ReactNode } from 'react'

interface DataTableProps {
  rows: GridRowsProp[]
  columns: GridColDef[]
  tableName?: string
  icon?: ReactNode
}
export default function DataTable({ rows, columns, tableName, icon }: DataTableProps) {
  return (
    <Paper elevation={4}>
      <Card>
        <CardHeader
          title={
            <Typography variant='h6' fontWeight='bold'>
              {/* {icon && <span style={{ marginRight: '8px' }}>{icon}</span>} */}
              {tableName}
            </Typography>
          }
        />
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
              hideFooterSelectedRowCount={true}
              sx={{
                '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within':
                  {
                    outline: 'none !important'
                  }
              }}
            />
          </Paper>
        </CardContent>
      </Card>
    </Paper>
  )
}
