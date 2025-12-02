import { projectId, publicAnonKey } from '../utils/supabase/info';
import { FraudAlert } from '../components/Dashboard';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-13630cb6`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Unknown error occurred');
  }

  return result.data as T;
}

export const api = {
  // Get all alerts
  async getAlerts(): Promise<FraudAlert[]> {
    try {
      const alerts = await fetchApi<FraudAlert[]>('/alerts');
      return alerts || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Get single alert
  async getAlert(id: string): Promise<FraudAlert> {
    try {
      return await fetchApi<FraudAlert>(`/alerts/${id}`);
    } catch (error) {
      console.error(`Error fetching alert ${id}:`, error);
      throw error;
    }
  },

  // Create new alert
  async createAlert(alert: Partial<FraudAlert>): Promise<FraudAlert> {
    try {
      return await fetchApi<FraudAlert>('/alerts', {
        method: 'POST',
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  // Update alert status
  async updateAlertStatus(id: string, status: FraudAlert['status']): Promise<FraudAlert> {
    try {
      return await fetchApi<FraudAlert>(`/alerts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error(`Error updating alert ${id} status:`, error);
      throw error;
    }
  },

  // Get XAI explanation from Gemini
  async getXAIExplanation(alert: FraudAlert): Promise<string> {
    try {
      const result = await fetchApi<{ explanation: string }>('/xai/explain', {
        method: 'POST',
        body: JSON.stringify({ alert }),
      });
      return result.explanation;
    } catch (error) {
      console.error('Error getting XAI explanation:', error);
      // Return fallback explanation if Gemini fails
      return this.getFallbackExplanation(alert);
    }
  },

  // Fallback explanation when Gemini is unavailable
  getFallbackExplanation(alert: FraudAlert): string {
    const anomalies = [];
    
    if (alert.amount > alert.previousAvgAmount * 3) {
      anomalies.push(`Transaction amount (NAD ${alert.amount.toLocaleString()}) is ${Math.round(alert.amount / alert.previousAvgAmount)}x the customer's typical spending of NAD ${alert.previousAvgAmount.toLocaleString()}`);
    }
    
    if (alert.locationDistance > 500) {
      anomalies.push(`${alert.locationDistance}km geographical anomaly detected from usual transaction locations`);
    }
    
    if (alert.anomalyType.includes('unusual_time')) {
      anomalies.push('Transaction occurred outside normal activity hours');
    }

    const action = alert.riskScore >= 0.90 
      ? 'Immediate account freeze recommended pending customer verification'
      : alert.riskScore >= 0.85
      ? 'Contact customer immediately to verify transaction authenticity'
      : 'Monitor account for additional suspicious activity within next 24 hours';

    return `${anomalies.join('. ')}. ${action}.`;
  },

  // Initialize database with sample data
  async initializeDatabase(): Promise<{ count: number }> {
    try {
      return await fetchApi<{ count: number }>('/initialize', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  },

  // Get statistics
  async getStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    frozen: number;
    totalAtRisk: number;
  }> {
    try {
      return await fetchApi('/stats');
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};
