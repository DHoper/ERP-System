import { GridColDef, GridSortModel, GridValidRowModel } from '@mui/x-data-grid'
import DataTable from '../../views/dataTable/dataTable'
import { Avatar, Chip, IconButton } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { requestGetAll } from 'src/api/user/user'
import { UserIntersectionType } from 'src/types/UserTypes'
import { hexStringToBlobUrl } from 'src/utils/convert'

const groupType = ['資訊部', '人資部', '工程部']

const columns: GridColDef[] = [
  {
    field: 'account_id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    sortable: false
  },
  {
    field: 'avatar',
    headerName: '',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: params => (
      <Avatar
        alt="Member's Avatar"
        sx={{ width: 48, height: 48 }}
        src={params.row.head_portrait ? hexStringToBlobUrl(params.row.head_portrait) : ''}
      />
    )
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
    field: 'username',
    headerName: '帳戶名',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'group_id',
    headerName: '部門',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    renderCell: params => <span>{groupType[params.row.group_id]}</span>
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
      <div>
        <Link passHref href={`/users/user/${params.row.account_id}`}>
          <IconButton aria-label='edit'>
            <EditIcon color='info' />
          </IconButton>
        </Link>
      </div>
    )
  }
]

const Users = () => {
  const [rows, setRows] = useState<GridValidRowModel[][]>()
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'account_id',
      sort: 'desc'
    }
  ])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await requestGetAll()
        if (!responseData) throw new Error('User requestGetAll 取回空值')

        const rowsData: GridValidRowModel[][] = responseData.map((rowData: UserIntersectionType) => {
          return {
            ...rowData
          }
        })

        setRows(rowsData)
      } catch (error) {
        console.error(`執行 User requestGetAll 時發生錯誤:`, error)
      }
    }

    fetchUserData()
  }, [])

  const fake_rows: any[] = [
    {
      account_id: 1,
      avatar: 'avatar_url_1',
      nickname: 'John Doe',
      username: 'john_doe',
      group_id: 1,
      phone: '1234567890',
      email: 'john@example.com',
      isActive: true
    },
    {
      account_id: 2,
      avatar: 'avatar_url_2',
      nickname: 'Jane Smith',
      username: 'jane_smith',
      group_id: 2,
      phone: '0987654321',
      email: 'jane@example.com',
      isActive: false
    },
  ];

  return (
    <>
      {/* rows */ fake_rows && (
        <DataTable
          tableName='用戶管理'
          rows={fake_rows}
          columns={columns}
          icon={ManageAccountsIcon}
          sortModel={sortModel}
          getId={row => row.account_id}
        />
      )}
    </>
  )
}

export default Users
