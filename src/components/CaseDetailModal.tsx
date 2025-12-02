import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { X, AlertTriangle, MapPin, CreditCard, Sparkles, Shield, Phone } from 'lucide-react';
import { FraudAlert } from './Dashboard';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface CaseDetailModalProps {
  alert: FraudAlert;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (caseId: string, status: FraudAlert['status']) => void;
}

export function CaseDetailModal({ alert, open, onClose, onUpdateStatus }: CaseDetailModalProps) {
  const [xaiExplanation, setXaiExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(true);

  // Load XAI explanation when modal opens
  useEffect(() => {
    if (open && alert) {
      loadXAIExplanation();
    }
  }, [open, alert?.id]);

  const loadXAIExplanation = async () => {
    try {
      setLoadingExplanation(true);
      const explanation = await api.getXAIExplanation(alert);
      setXaiExplanation(explanation);
    } catch (err) {
      console.error('Failed to load XAI explanation:', err);
      // Use fallback explanation
      setXaiExplanation(api.getFallbackExplanation(alert));
    } finally {
      setLoadingExplanation(false);
    }
  };

  const getRiskColor = (score: number): 'error' | 'warning' | 'success' => {
    if (score >= 0.85) return 'error';
    if (score >= 0.75) return 'warning';
    return 'success';
  };

  const handleFreezeAccount = () => {
    onUpdateStatus(alert.id, 'frozen');
  };

  const handleMarkSafe = () => {
    onUpdateStatus(alert.id, 'resolved');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Fraud Case Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Transaction ID: {alert.transactionId}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Transaction Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CreditCard size={20} color="#3b82f6" />
                  <Typography variant="h6">Transaction Details</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Amount</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      NAD {alert.amount.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Risk Score</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`${(alert.riskScore * 100).toFixed(0)}% Risk`}
                        color={getRiskColor(alert.riskScore)}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Customer</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {alert.customerName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {alert.customerId}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Merchant</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {alert.merchantName}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Timestamp</Typography>
                    <Typography variant="body2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Location</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <MapPin size={16} />
                      <Typography variant="body2">{alert.location}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Technical Details</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5 }}>
                      IP: {alert.ipAddress}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      Device: {alert.deviceId}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Anomaly Indicators</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {alert.anomalyType.map((type, idx) => (
                        <Chip 
                          key={idx}
                          label={type.replace(/_/g, ' ')}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Aura XAI Explanation */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Sparkles size={20} color="#8b5cf6" />
                  <Typography variant="h6">Aura XAI Analysis</Typography>
                  <Chip label="AI Powered" size="small" color="secondary" />
                </Box>

                <Card 
                  sx={{ 
                    mb: 3,
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardContent>
                    {loadingExplanation ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={32} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Generating AI explanation...
                        </Typography>
                      </Box>
                    ) : (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.8,
                          color: 'text.primary',
                        }}
                      >
                        {xaiExplanation}
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Key Risk Factors:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          backgroundColor: 'error.main',
                          mt: 1,
                          flexShrink: 0,
                        }} 
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Amount Anomaly
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          NAD {alert.amount.toLocaleString()} vs avg NAD {alert.previousAvgAmount.toLocaleString()} 
                          ({Math.round((alert.amount / alert.previousAvgAmount) * 100)}% increase)
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          backgroundColor: 'warning.main',
                          mt: 1,
                          flexShrink: 0,
                        }} 
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Geographic Anomaly
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {alert.locationDistance}km from typical transaction locations
                        </Typography>
                      </Box>
                    </Box>

                    {alert.anomalyType.includes('unusual_time') && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: 'warning.main',
                            mt: 1,
                            flexShrink: 0,
                          }} 
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Time Pattern Anomaly
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Transaction outside normal customer activity hours
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Recommended Actions:
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    startIcon={<Shield size={20} />}
                    onClick={handleFreezeAccount}
                    disabled={alert.status === 'frozen'}
                    sx={{ 
                      py: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    {alert.status === 'frozen' ? 'Account Frozen' : 'Freeze Account'}
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<Phone size={20} />}
                    sx={{ 
                      py: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    Contact Customer
                  </Button>

                  <Button
                    variant="outlined"
                    color="success"
                    size="large"
                    fullWidth
                    onClick={handleMarkSafe}
                    disabled={alert.status === 'resolved'}
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {alert.status === 'resolved' ? 'Marked as Safe' : 'Mark as Safe'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}