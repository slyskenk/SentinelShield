import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { Eye } from 'lucide-react';
import { FraudAlert } from './Dashboard';

interface AlertsTableProps {
  alerts: FraudAlert[];
  onCaseClick: (alert: FraudAlert) => void;
}

export function AlertsTable({ alerts, onCaseClick }: AlertsTableProps) {
  const getRiskColor = (score: number): 'error' | 'warning' | 'success' => {
    if (score >= 0.85) return 'error';
    if (score >= 0.75) return 'warning';
    return 'success';
  };

  const getStatusColor = (status: FraudAlert['status']): 'default' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'default';
      case 'resolved': return 'success';
      case 'frozen': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: FraudAlert['status']): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'under_review': return 'Under Review';
      case 'resolved': return 'Resolved';
      case 'frozen': return 'Account Frozen';
      default: return status;
    }
  };

  // Sort alerts by risk score (highest first) and timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (b.riskScore !== a.riskScore) {
      return b.riskScore - a.riskScore;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Fraud Alert Queue
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Real-time monitoring of high-risk transactions
            </Typography>
          </Box>
          <Chip 
            label={`${sortedAlerts.length} Alerts`} 
            color="primary" 
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Risk Score</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAlerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'action.hover',
                      cursor: 'pointer'
                    } 
                  }}
                  onClick={() => onCaseClick(alert)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {alert.transactionId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(alert.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {alert.customerName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {alert.customerId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      NAD {alert.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${(alert.riskScore * 100).toFixed(0)}%`}
                      color={getRiskColor(alert.riskScore)}
                      size="small"
                      sx={{ fontWeight: 700, minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {alert.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(alert.status)}
                      color={getStatusColor(alert.status)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCaseClick(alert);
                      }}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark', color: 'white' }
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
