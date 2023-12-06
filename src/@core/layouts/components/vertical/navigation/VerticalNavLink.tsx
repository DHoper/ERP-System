// ** React Imports
import { ElementType, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/@core/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { Collapse, List } from '@mui/material'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  // borderTopRightRadius: 100,
  // borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  // ** Hooks
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const IconTag: ReactNode = item.icon

  const isNavLinkActive = (path = item.path) => {
    if (router.pathname === path || handleURLQueries(router, path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <Link passHref={!!item.path} href={item.path ? `${item.path}` : '/'}>
        <MenuNavLink
          alignItems='flex-start'
          component={'a'}
          className={isNavLinkActive() ? 'active' : ''}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            setOpen(!open)
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            pl: 7,
            '&:hover, &:focus': { '& > svg': { opacity: open ? 1 : 0 } },
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
          }}
        >
          <ListItemIcon
            sx={{
              mr: 2.5,
              color: 'text.primary',
              transition: 'margin .25s ease-in-out'
            }}
          >
            <UserIcon icon={IconTag} />
          </ListItemIcon>
          <MenuItemTextMetaWrapper>
            <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
            {item.badgeContent ? (
              <Chip
                label={'item.badgeContent'}
                color={item.badgeColor || 'primary'}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  marginLeft: 1.25,
                  '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
          {item.subList && (
            <ExpandMoreIcon
              sx={{
                opacity: 0,
                transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                transition: '0.2s'
              }}
            />
          )}
        </MenuNavLink>
      </Link>

      {item.subList && (
        <Collapse in={open}>
          <List>
            {item.subList.map((subItem, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  className='nav-link'
                  disabled={subItem.disabled || false}
                  sx={{ px: '0 !important' }}
                >
                  <Link passHref href={subItem.path === undefined ? '/' : `${subItem.path}`}>
                    <MenuNavLink
                      component={'a'}
                      className={isNavLinkActive(subItem.path) ? 'active' : ''}
                      {...(subItem.openInNewTab ? { target: '_blank' } : null)}
                      onClick={e => {
                        if (subItem.path === undefined) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                        if (navVisible) {
                          toggleNavVisibility()
                        }
                      }}
                      sx={{
                        pl: 7,
                        ...(subItem.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          mr: 2.5,
                          color: 'text.primary',
                          transition: 'margin .25s ease-in-out'
                        }}
                      >
                        <ArrowRightIcon fontSize='small' />
                      </ListItemIcon>

                      <MenuItemTextMetaWrapper>
                        <Typography sx={{ fontSize: '.75rem' }} {...(themeConfig.menuTextTruncate && { noWrap: true })}>
                          {subItem.title}
                        </Typography>
                        {subItem.badgeContent ? (
                          <Chip
                            label={'subItem.badgeContent'}
                            color={subItem.badgeColor || 'primary'}
                            sx={{
                              height: 20,
                              fontWeight: 500,
                              marginLeft: 1.25,
                              '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                            }}
                          />
                        ) : null}
                      </MenuItemTextMetaWrapper>
                    </MenuNavLink>
                  </Link>
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
  )
}

export default VerticalNavLink
