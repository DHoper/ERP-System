import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import DataTable from '../../views/dataTable/dataTable'
import { Avatar, Button, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { requestGetAll } from 'src/api/member/member'
import { hexStringToBlobUrl } from 'src/utils/convert'
import { aa } from './membersData'

const roleLabel = ['家長', '學員', '顧客']

const columns: GridColDef[] = [
  {
    field: 'member_id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    sortable: false
  },
  {
    field: 'head_portrait',
    headerName: '',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: params => <Avatar alt="Member's Avatar" sx={{ width: 48, height: 48 }} src={params.row.head_portrait} />
  },
  {
    field: 'nickname',
    headerName: '姓名',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'account',
    headerName: '帳號',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'role',
    headerName: '身分別',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams) => <Chip label={roleLabel[params.value]} variant='outlined' />
  },
  {
    field: 'phone',
    headerName: '電話',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'email',
    headerName: '信箱',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'isActive',
    headerName: '狀態',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: params => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Chip
          label={params.row.isActive ? '啟用' : '停用'}
          variant='outlined'
          icon={<CircleIcon sx={{ fontSize: 15 }} />}
          color={params.row.isActive ? 'success' : 'error'}
          sx={{
            padding: 1,
            fontWeight: 'bold',
            lineHeight: 1
          }}
        />
      </div>
    )
  },
  {
    field: 'action',
    headerName: '管理',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    width: 120,
    renderCell: params => (
      <Link passHref href={`/members/member/${params.row.member_id}`}>
        <IconButton aria-label='edit'>
          <EditIcon color='info' />
        </IconButton>
      </Link>
    )
  }
]

const Members = () => {
  const [rows, setRows] = useState()
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'member_id',
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
                  會員管理
                </Typography>
              }
            />

            <Stack sx={{ paddingRight: 4 }}>
              <Link passHref href={`/members/member/new`}>
                <Button variant='contained' startIcon={<PersonAddIcon />}>
                  新增會員
                </Button>
              </Link>
            </Stack>
          </Stack>
          <DataTable
            tableName='會員管理'
            rows={rows}
            columns={columns}
            icon={GroupIcon}
            getId={row => row.member_id}
            sortModel={sortModel}
          />
        </>
      ) : null}
    </>
  )
}

export default Members
