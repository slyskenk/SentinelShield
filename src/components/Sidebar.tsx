import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Shield, LayoutDashboard, AlertTriangle, History, Settings, BarChart3 } from 'lucide-react';

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'history', label: 'Case History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DRAWER_WIDTH = 260;

export function Sidebar({ selectedView, onViewChange }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield size={28} color="white" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            SentinelShield
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Fraud Defense AI
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedView === item.id;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onViewChange(item.id)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'white' : 'text.secondary' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { fontWeight: isSelected ? 600 : 400 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
