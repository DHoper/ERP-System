import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { Avatar, Button, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { requestGetAll } from 'src/api/card/card'
import { hexStringToBlobUrl } from 'src/utils/convert'
import DataTable from 'src/views/dataTable/dataTable'
import { formattedDateTime } from 'src/utils/format'

const device_modeLabel = ['讀卡', '開卡']

const columns: GridColDef[] = [
  {
    field: 'card_id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    sortable: false
  },
  {
    field: 'card_uid',
    headerName: '卡片號碼',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'nickname',
    headerName: '使用者',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'card_active',
    headerName: '卡片狀態',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'card_valid',
    headerName: '卡片效期',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: params => {
      const originalDateTime = params.value

      return <span>{formattedDateTime(originalDateTime)}</span>
    }
  },
  {
    field: 'card_group_id',
    headerName: '權限組別',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'card_group_name',
    headerName: '卡片狀態',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },

  {
    field: 'action',
    headerName: '管理',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    width: 120,
    renderCell: params => (
      <Link passHref href={`/cards/cardManagement/card/${params.row.card_id}`}>
        <IconButton aria-label='edit'>
          <EditIcon color='info' />
        </IconButton>
      </Link>
    )
  }
]

const Devices = () => {
  const [rows, setRows] = useState()
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'card_id',
      sort: 'desc'
    }
  ])

  useEffect(() => {
    ;(async () => {
      const responseData = await requestGetAll()

      if (responseData) {
        for (const items of responseData) {
          if (items.head_portrait) {
            items.head_portrait = hexStringToBlobUrl(items.head_portrait)
          }
        }
        setRows(responseData)
      }
    })()
  }, [])

  return (
    <>
      {rows && columns ? (
        <>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <CardHeader
              title={
                <Typography variant='h5' fontWeight='bold'>
                  卡片管理
                </Typography>
              }
            />

            <Stack sx={{ paddingRight: 4 }}>
              <Link passHref href={`/cards/cardsManagement/card/new`}>
                <Button variant='contained' startIcon={<PersonAddIcon />}>
                  新增讀卡機裝置
                </Button>
              </Link>
            </Stack>
          </Stack>
          <DataTable
            tableName='讀卡機裝置管理'
            rows={rows}
            columns={columns}
            icon={GroupIcon}
            getId={row => row.card_id}
            sortModel={sortModel}
          />
        </>
      ) : null}
    </>
  )
}

export default Devices
