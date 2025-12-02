import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { Shield, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface SetupGuideProps {
  open: boolean;
  onClose: () => void;
}

export function SetupGuide({ open, onClose }: SetupGuideProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome to SentinelShield
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              AI-Powered Fraud Defense for Namibian Banking
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          SentinelShield is a real-time fraud detection system with Explainable AI, designed specifically for
          monitoring NAD (Namibia Dollar) transactions.
        </Typography>

        <Card sx={{ mb: 3, backgroundColor: 'primary.dark' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Database size={20} color="#3b82f6" />
              <Typography variant="h6">Step 1: Initialize Data</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Click "Initialize Sample Data" to load 8 sample fraud alerts from the Namibian banking system.
              This includes high-risk transactions from locations like Cape Town, Lagos, and Johannesburg.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, backgroundColor: 'secondary.dark' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Sparkles size={20} color="#8b5cf6" />
              <Typography variant="h6">Step 2: Configure Gemini AI (Optional)</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              For live AI-powered explanations, you'll need a Gemini API key. The system will work without it
              using fallback explanations, but Gemini provides more sophisticated fraud analysis.
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'background.default', p: 1, borderRadius: 1 }}>
              Get your key: https://makersuite.google.com/app/apikey
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <CheckCircle2 size={20} color="#10b981" />
              <Typography variant="h6">Key Features</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>•</Typography>
                <Typography variant="body2">
                  <strong>Real-time Monitoring:</strong> Live dashboard of suspicious NAD transactions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>•</Typography>
                <Typography variant="body2">
                  <strong>Aura XAI Assistant:</strong> Plain language explanations of fraud patterns
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>•</Typography>
                <Typography variant="body2">
                  <strong>Risk Scoring:</strong> Color-coded alerts (Red ≥85%, Amber ≥75%, Green &lt;75%)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>•</Typography>
                <Typography variant="body2">
                  <strong>Analyst Actions:</strong> Freeze accounts, contact customers, or mark as safe
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>•</Typography>
                <Typography variant="body2">
                  <strong>Geographic Anomalies:</strong> Detection of unusual transaction locations across Southern Africa
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          <strong>Pro Tip:</strong> The system uses a dark theme optimized for extended monitoring sessions.
          High-contrast colors help analysts quickly identify critical cases.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{ 
              px: 4,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Get Started
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}