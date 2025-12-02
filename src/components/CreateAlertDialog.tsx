import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { AlertTriangle, Plus } from 'lucide-react';
import { FraudAlert } from './Dashboard';

interface CreateAlertDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (alert: Partial<FraudAlert>) => void;
}

const ANOMALY_TYPES = [
  'high_amount',
  'unusual_location',
  'unusual_time',
  'new_merchant',
  'velocity',
];

const LOCATIONS = [
  'Windhoek, Namibia',
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
  'Lagos, Nigeria',
  'Gaborone, Botswana',
  'Lusaka, Zambia',
  'Durban, South Africa',
  'Swakopmund, Namibia',
];

export function CreateAlertDialog({ open, onClose, onCreate }: CreateAlertDialogProps) {
  const [amount, setAmount] = useState(25000);
  const [customerName, setCustomerName] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [location, setLocation] = useState('Windhoek, Namibia');
  const [riskScore, setRiskScore] = useState(0.85);
  const [selectedAnomalies, setSelectedAnomalies] = useState<string[]>(['high_amount', 'unusual_location']);
  const [previousAvgAmount, setPreviousAvgAmount] = useState(5000);
  const [locationDistance, setLocationDistance] = useState(850);

  const handleSubmit = () => {
    const newAlert: Partial<FraudAlert> = {
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      amount,
      currency: 'NAD',
      customerName,
      customerId: `CUST-${Math.floor(Math.random() * 90000) + 10000}`,
      riskScore,
      status: 'pending',
      location,
      merchantName,
      anomalyType: selectedAnomalies,
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      deviceId: `DEV-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      previousAvgAmount,
      locationDistance,
    };

    onCreate(newAlert);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setAmount(25000);
    setCustomerName('');
    setMerchantName('');
    setLocation('Windhoek, Namibia');
    setRiskScore(0.85);
    setSelectedAnomalies(['high_amount', 'unusual_location']);
    setPreviousAvgAmount(5000);
    setLocationDistance(850);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create New Fraud Alert
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Simulate a new suspicious transaction
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., John Smith"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Merchant Name"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="e.g., Electronics Store"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                label="Location"
              >
                {LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Transaction Amount (NAD)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Avg Amount (NAD)"
              type="number"
              value={previousAvgAmount}
              onChange={(e) => setPreviousAvgAmount(Number(e.target.value))}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location Distance (km)"
              type="number"
              value={locationDistance}
              onChange={(e) => setLocationDistance(Number(e.target.value))}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Risk Score: {(riskScore * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={riskScore}
              onChange={(_, value) => setRiskScore(value as number)}
              min={0.5}
              max={1.0}
              step={0.01}
              marks={[
                { value: 0.5, label: '50%' },
                { value: 0.75, label: '75%' },
                { value: 0.85, label: '85%' },
                { value: 1.0, label: '100%' },
              ]}
              color={riskScore >= 0.85 ? 'error' : riskScore >= 0.75 ? 'warning' : 'success'}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Anomaly Types</InputLabel>
              <Select
                multiple
                value={selectedAnomalies}
                onChange={(e) => setSelectedAnomalies(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Anomaly Types" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value.replace(/_/g, ' ')} size="small" />
                    ))}
                  </Box>
                )}
              >
                {ANOMALY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!customerName || !merchantName}
          startIcon={<AlertTriangle size={18} />}
        >
          Create Alert
        </Button>
      </DialogActions>
    </Dialog>
  );
}
