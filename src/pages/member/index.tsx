import { GridColDef } from '@mui/x-data-grid'
import DataTable from '../../views/dataTable/dataTable'
import { Button, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'

const columns: GridColDef[] = [
  {
    field: 'id',
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
      <img src={params.row.avatar} alt='Avatar' style={{ height: '75%', borderRadius: '50%', margin: 'auto' }} />
    )
  },
  {
    field: 'username',
    headerName: '會員名稱',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'department',
    headerName: '身分別',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true
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
          label={params.row.isActive}
          variant='outlined'
          icon={<CircleIcon sx={{ fontSize: 15 }} />}
          color={params.row.isActive === '啟用' ? 'success' : 'error'}
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
        <Link passHref href={`/member/information/${params.row.id}`}>
          <IconButton aria-label='edit'>
            <EditIcon color='info' />
          </IconButton>
        </Link>

        <IconButton aria-label='edit'>
          <DeleteIcon color='error' />
        </IconButton>
      </div>
    )
  }
]

const rows = [
  {
    id: 1,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '啟用'
  },
  {
    id: 2,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '啟用'
  },
  {
    id: 3,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '停用'
  },
  {
    id: 4,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '啟用'
  },
  {
    id: 5,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '停用'
  },
  {
    id: 6,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '啟用'
  },
  {
    id: 7,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '停用'
  },
  {
    id: 8,
    username: 'john_doe',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    department: 'Admin',
    email: 'john.doe@example.com',
    phone: '09778554112',
    isActive: '啟用'
  }
]
const UserTable = () => {
  return (
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
          <Link passHref href={`/member/information/new`}>
            <Button variant='contained' startIcon={<PersonAddIcon />}>
              新增會員
            </Button>
          </Link>
        </Stack>
      </Stack>

      <DataTable tableName='會員管理' rows={rows} columns={columns} icon={GroupIcon} />
    </>
  )
}

export default UserTable