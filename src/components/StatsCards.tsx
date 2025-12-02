import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AlertTriangle, Shield, TrendingUp, Clock } from 'lucide-react';
import { FraudAlert } from './Dashboard';

interface StatsCardsProps {
  alerts: FraudAlert[];
}

export function StatsCards({ alerts }: StatsCardsProps) {
  const activeAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const resolvedToday = alerts.filter(a => a.status === 'resolved').length;
  const frozenAccounts = alerts.filter(a => a.status === 'frozen').length;
  const totalAmount = alerts
    .filter(a => a.status === 'pending')
    .reduce((sum, a) => sum + a.amount, 0);

  const stats = [
    {
      title: 'Active Alerts',
      value: activeAlerts,
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      title: 'At-Risk Amount',
      value: `NAD ${(totalAmount / 1000).toFixed(1)}K`,
      subtitle: 'Pending review',
      icon: TrendingUp,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Frozen Accounts',
      value: frozenAccounts,
      subtitle: 'Security locked',
      icon: Shield,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Resolved Today',
      value: resolvedToday,
      subtitle: 'Cases closed',
      icon: Clock,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} color={stat.color} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
