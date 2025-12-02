import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Bell, Search } from 'lucide-react';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material/styles';

export function TopBar() {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha('#fff', 0.05),
              '&:hover': {
                backgroundColor: alpha('#fff', 0.08),
              },
              marginRight: 2,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                padding: '0 16px',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={18} />
            </Box>
            <InputBase
              placeholder="Search transactions, cases..."
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '10px 10px 10px 0',
                  paddingLeft: `calc(1em + 32px)`,
                  width: '100%',
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label="Live Monitoring" 
            color="success" 
            size="small"
            sx={{ 
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 2,
              }
            }}
          />
          
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sarah Mitchell
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Senior Analyst
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'primary.main'
              }}
            >
              SM
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
