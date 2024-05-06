import { CardContent, Paper, ThemeProvider, createTheme, useTheme } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridToolbar,
  GridSortModel,
  GridLogicOperator,
  zhTW
} from '@mui/x-data-grid'
import { ReactNode, useMemo } from 'react'

interface DataTableProps {
  rows: GridRowsProp[]
  columns: GridColDef[]
  sortModel: GridSortModel
  getId: (row: any) => GridRowId //暫用any
  tableName?: string
  icon?: ReactNode
}

export default function DataTable({ rows, columns, sortModel, getId }: DataTableProps) {
  const existingTheme = useTheme()

  const theme = useMemo(
    () =>
      createTheme({}, zhTW, existingTheme, {
        direction: 'rtl'
      }),
    [existingTheme]
  )

  return (
    <>
      <CardContent>
        <Paper elevation={4}>
          <ThemeProvider theme={theme}>
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
              slots={{
                toolbar: () => (
                  
                  // *註 *疑問 toolbar相關之選項需方在最外層(本例為 : 作為<GridToolbar>之屬性)，若要按官方文檔之型式包裹在<GridToolbarExport csvOptions={csvOptions} />裡
                  //  則 <GridToolbarExport> 需為最外層
                  <GridToolbar
                    csvOptions={{ utf8WithBom: true, fileName: 'DataTable 資料表' }}
                    sx={{
                      alignItems: 'flex-end',
                      padding: '1rem',
                      paddingBottom: '.5rem',
                      '& .MuiButton-root': { fontSize: '.75rem', color: `${theme.palette.secondary.dark}!important` }
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  csvOptions: {
                    utf8WithBom: true,
                    includeHeaders: false,
                    includeColumnGroupsHeaders: false,
                    fileName: 'aaa',
                    fields: ['isActive']
                  }
                },
                filterPanel: {
                  logicOperators: [GridLogicOperator.And],
                  sx: {
                    padding: '1rem',
                    display: 'grid',
                    gap: '.5rem',
                    '& .MuiDataGrid-filterForm': { gap: '.5rem' },
                    '& .MuiIconButton-root': { margin: 'auto' }
                  },

                  columnsSort: 'asc',
                  filterFormProps: {
                    logicOperatorInputProps: {
                      variant: 'outlined',
                      size: 'small'
                    },
                    columnInputProps: {
                      variant: 'outlined',
                      size: 'small'
                    },
                    operatorInputProps: {
                      variant: 'outlined',
                      size: 'small'
                    },
                    valueInputProps: {
                      InputComponentProps: {
                        variant: 'outlined',
                        size: 'small'
                      }
                    }
                  }
                }
              }}
              sx={{
                '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within':
                  {
                    outline: 'none !important'
                  }
              }}
            />
          </ThemeProvider>
        </Paper>
      </CardContent>
    </>
  )
}
