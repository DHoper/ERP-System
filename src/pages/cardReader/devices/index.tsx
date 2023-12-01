import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { Avatar, Button, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { requestGetAll } from 'src/api/cardReader/device'
import { hexStringToBlobUrl } from 'src/utils/convert'
import DataTable from 'src/views/dataTable/dataTable'
import { formattedDateTime } from 'src/utils/format'

const device_modeLabel = ['讀卡', '開卡']

const columns: GridColDef[] = [
  {
    field: 'device_id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    sortable: false
  },
  {
    field: 'device_name',
    headerName: '名稱',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'device_pos',
    headerName: '裝置位置',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'device_uid',
    headerName: '識別碼',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'device_mode',
    headerName: '類型',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    renderCell: params => <span>{device_modeLabel[params.row.device_mode]}</span>
  },
  {
    field: 'create_date',
    headerName: '建立時間',
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
    field: 'update_time',
    headerName: '最後更新時間',
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
    field: 'action',
    headerName: '管理',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    width: 120,
    renderCell: params => (
      <Link passHref href={`/cardReader/devices/device/${params.row.device_id}`}>
        <IconButton aria-label='edit'>
          <EditIcon color='info' />
        </IconButton>
      </Link>
    )
  }
]

const UserTable = () => {
  const [rows, setRows] = useState()
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'device_id',
      sort: 'desc'
    }
  ])

  useEffect(() => {
    ;(async () => {
      const responseData = await requestGetAll()
      console.log(responseData)

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
                  讀卡機裝置管理
                </Typography>
              }
            />

            <Stack sx={{ paddingRight: 4 }}>
              <Link passHref href={`/cardReader/devices/device/new`}>
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
            getId={row => row.device_id}
            sortModel={sortModel}
          />
        </>
      ) : null}
    </>
  )
}

export default UserTable
