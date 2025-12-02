import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { RefreshCw, Database, Plus } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { AlertsTable } from './AlertsTable';
import { CaseDetailModal } from './CaseDetailModal';
import { CreateAlertDialog } from './CreateAlertDialog';
import { SetupGuide } from './SetupGuide';
import { api } from '../services/api';

export interface FraudAlert {
  id: string;
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  customerName: string;
  customerId: string;
  riskScore: number;
  status: 'pending' | 'under_review' | 'resolved' | 'frozen';
  location: string;
  merchantName: string;
  anomalyType: string[];
  ipAddress: string;
  deviceId: string;
  previousAvgAmount: number;
  locationDistance: number;
}

export function Dashboard() {
  const [selectedCase, setSelectedCase] = useState<FraudAlert | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
  }, []);

  // Show setup guide on first load if no alerts
  useEffect(() => {
    if (!loading && alerts.length === 0 && !error) {
      const hasSeenGuide = localStorage.getItem('sentinel_setup_seen');
      if (!hasSeenGuide) {
        setShowSetupGuide(true);
        localStorage.setItem('sentinel_setup_seen', 'true');
      }
    }
  }, [loading, alerts.length, error]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.initializeDatabase();
      await loadAlerts();
    } catch (err) {
      console.error('Failed to initialize database:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (newAlert: Partial<FraudAlert>) => {
    try {
      const createdAlert = await api.createAlert(newAlert);
      setAlerts(prev => [createdAlert, ...prev]);
    } catch (err) {
      console.error('Failed to create alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    }
  };

  const handleCaseClick = (alert: FraudAlert) => {
    setSelectedCase(alert);
  };

  const handleCaseUpdate = async (caseId: string, newStatus: FraudAlert['status']) => {
    try {
      await api.updateAlertStatus(caseId, newStatus);
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === caseId ? { ...alert, status: newStatus } : alert
        )
      );
      
      if (selectedCase?.id === caseId) {
        setSelectedCase({ ...selectedCase, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update alert status');
    }
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading fraud alerts...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            startIcon={<RefreshCw size={18} />}
          >
            Retry
          </Button>
          {alerts.length === 0 && (
            <Button 
              variant="outlined" 
              onClick={handleInitialize}
              startIcon={<Database size={18} />}
            >
              Initialize Sample Data
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            No fraud alerts found
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleInitialize}
              startIcon={<Database size={18} />}
              size="large"
            >
              Initialize Sample Data
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setCreateDialogOpen(true)}
              startIcon={<Plus size={18} />}
              size="large"
            >
              Create Alert
            </Button>
          </Box>
        </Box>

        <SetupGuide open={showSetupGuide} onClose={() => setShowSetupGuide(false)} />

        <CreateAlertDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreateAlert}
        />
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => setCreateDialogOpen(true)}
          startIcon={<Plus size={18} />}
        >
          New Alert
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          disabled={refreshing}
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshCw size={18} />}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatsCards alerts={alerts} />
        </Grid>
        
        <Grid item xs={12}>
          <AlertsTable alerts={alerts} onCaseClick={handleCaseClick} />
        </Grid>
      </Grid>

      {selectedCase && (
        <CaseDetailModal
          alert={selectedCase}
          open={!!selectedCase}
          onClose={handleCloseModal}
          onUpdateStatus={handleCaseUpdate}
        />
      )}

      <CreateAlertDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateAlert}
      />
    </>
  );
}