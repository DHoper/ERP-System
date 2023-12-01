import {
  CardContent,
  IconButton,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useTheme
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridToolbar,
  GridSortModel,
  GridLogicOperator,
  zhTW,
  zhCN
} from '@mui/x-data-grid'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { ReactNode, useMemo } from 'react'

const MyGridToolbar = () => {
  const handleFilterClick = () => {
    // Add your filter logic here...
    console.log('Filter button clicked')
  }

  const handleAddClick = () => {
    // Add your add logic here...
    console.log('Add button clicked')
  }

  const handleDeleteClick = () => {
    // Add your delete logic here...
    console.log('Delete button clicked')
  }

  return (
    <Toolbar>
      <IconButton onClick={handleFilterClick} aria-label='filter'>
        <FilterListIcon />
        <Typography variant='body2'>Filter</Typography>
      </IconButton>
      <IconButton onClick={handleAddClick} aria-label='add'>
        <AddIcon />
        <Typography variant='body2'>Add</Typography>
      </IconButton>
      <IconButton onClick={handleDeleteClick} aria-label='delete'>
        <DeleteIcon />
        <Typography variant='body2'>Delete</Typography>
      </IconButton>
      {/* Add more buttons as needed... */}
    </Toolbar>
  )
}

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
        direction: 'ltr'
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
                  <GridToolbar
                    sx={{
                      paddingY: '.5rem',
                      paddingX: '1rem',
                      '& .MuiButton-root': { fontSize: '.75rem' }
                    }}
                  />
                )
              }}
              slotProps={{
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
