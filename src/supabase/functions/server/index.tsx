import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-13630cb6/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all fraud alerts
app.get("/make-server-13630cb6/alerts", async (c) => {
  try {
    const alerts = await kv.getByPrefix("alert:");
    console.log(`Retrieved ${alerts.length} alerts`);
    return c.json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single alert by ID
app.get("/make-server-13630cb6/alerts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const alert = await kv.get(`alert:${id}`);
    
    if (!alert) {
      return c.json({ success: false, error: "Alert not found" }, 404);
    }
    
    return c.json({ success: true, data: alert });
  } catch (error) {
    console.error("Error fetching alert:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create new fraud alert
app.post("/make-server-13630cb6/alerts", async (c) => {
  try {
    const alertData = await c.req.json();
    
    // Generate alert ID if not provided
    if (!alertData.id) {
      const timestamp = Date.now();
      alertData.id = `CASE-${timestamp.toString(36).toUpperCase()}`;
    }
    
    // Add creation timestamp
    alertData.createdAt = new Date().toISOString();
    
    // Save to KV store
    await kv.set(`alert:${alertData.id}`, alertData);
    
    console.log(`Created alert: ${alertData.id}`);
    return c.json({ success: true, data: alertData });
  } catch (error) {
    console.error("Error creating alert:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update alert status
app.put("/make-server-13630cb6/alerts/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    
    // Get existing alert
    const alert = await kv.get(`alert:${id}`);
    
    if (!alert) {
      return c.json({ success: false, error: "Alert not found" }, 404);
    }
    
    // Update status and timestamp
    alert.status = status;
    alert.updatedAt = new Date().toISOString();
    
    // Save updated alert
    await kv.set(`alert:${id}`, alert);
    
    console.log(`Updated alert ${id} status to: ${status}`);
    return c.json({ success: true, data: alert });
  } catch (error) {
    console.error("Error updating alert status:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Generate XAI explanation using Gemini
app.post("/make-server-13630cb6/xai/explain", async (c) => {
  try {
    const { alert } = await c.req.json();
    
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY not found in environment");
      return c.json({ 
        success: false, 
        error: "Gemini API key not configured" 
      }, 500);
    }
    
    // Construct the prompt for Gemini
    const prompt = `You are Aura, an Explainable AI assistant for a banking fraud detection system in Namibia. Analyze this transaction and provide a clear, actionable explanation for fraud analysts.

Transaction Details:
- Amount: NAD ${alert.amount.toLocaleString()} (Customer's typical amount: NAD ${alert.previousAvgAmount.toLocaleString()})
- Location: ${alert.location} (${alert.locationDistance}km from typical locations)
- Merchant: ${alert.merchantName}
- Time: ${new Date(alert.timestamp).toLocaleString()}
- Risk Score: ${(alert.riskScore * 100).toFixed(0)}%
- Anomaly Types: ${alert.anomalyType.join(", ")}

Provide a THREE-SENTENCE explanation that:
1. Identifies the primary anomalies with specific numbers (e.g., "5x typical amount, 800km location anomaly")
2. Explains why this pattern is suspicious
3. Suggests the immediate analyst action (freeze account, contact customer, or monitor)

Be concise, specific, and action-oriented.`;

    console.log("Calling Gemini API for XAI explanation...");
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return c.json({ 
        success: false, 
        error: `Gemini API error: ${response.status} - ${errorText}` 
      }, 500);
    }
    
    const data = await response.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate explanation";
    
    console.log("Generated XAI explanation successfully");
    
    return c.json({ 
      success: true, 
      explanation: explanation.trim() 
    });
  } catch (error) {
    console.error("Error generating XAI explanation:", error);
    return c.json({ 
      success: false, 
      error: `Error generating explanation: ${String(error)}` 
    }, 500);
  }
});

// Initialize database with sample data
app.post("/make-server-13630cb6/initialize", async (c) => {
  try {
    // Check if already initialized
    const existingAlerts = await kv.getByPrefix("alert:");
    
    if (existingAlerts.length > 0) {
      return c.json({ 
        success: true, 
        message: "Database already initialized",
        count: existingAlerts.length 
      });
    }
    
    // Sample alerts data
    const sampleAlerts = [
      {
        id: 'CASE-001',
        transactionId: 'TXN-94F72A3E',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        amount: 47500,
        currency: 'NAD',
        customerName: 'Johannes Nambala',
        customerId: 'CUST-89234',
        riskScore: 0.94,
        status: 'pending',
        location: 'Cape Town, South Africa',
        merchantName: 'Premium Electronics ZA',
        anomalyType: ['high_amount', 'unusual_location', 'unusual_time'],
        ipAddress: '102.219.45.128',
        deviceId: 'DEV-X9K2L',
        previousAvgAmount: 8200,
        locationDistance: 1450,
      },
      {
        id: 'CASE-002',
        transactionId: 'TXN-28B9E1F5',
        timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
        amount: 31200,
        currency: 'NAD',
        customerName: 'Maria Santos',
        customerId: 'CUST-71522',
        riskScore: 0.89,
        status: 'under_review',
        location: 'Johannesburg, South Africa',
        merchantName: 'Luxury Fashion SA',
        anomalyType: ['high_amount', 'unusual_location'],
        ipAddress: '196.42.177.93',
        deviceId: 'DEV-M4N8P',
        previousAvgAmount: 5400,
        locationDistance: 1350,
      },
      {
        id: 'CASE-003',
        transactionId: 'TXN-5C7D2A91',
        timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
        amount: 89300,
        currency: 'NAD',
        customerName: 'David Uukongo',
        customerId: 'CUST-45289',
        riskScore: 0.96,
        status: 'pending',
        location: 'Lagos, Nigeria',
        merchantName: 'Global Tech Solutions',
        anomalyType: ['high_amount', 'unusual_location', 'new_merchant', 'unusual_time'],
        ipAddress: '41.203.72.184',
        deviceId: 'DEV-R7Q3W',
        previousAvgAmount: 12500,
        locationDistance: 3200,
      },
      {
        id: 'CASE-004',
        transactionId: 'TXN-A3F8D2B7',
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        amount: 22800,
        currency: 'NAD',
        customerName: 'Sarah Kamati',
        customerId: 'CUST-93841',
        riskScore: 0.81,
        status: 'pending',
        location: 'Gaborone, Botswana',
        merchantName: 'International Hotel Group',
        anomalyType: ['high_amount', 'unusual_location'],
        ipAddress: '168.167.82.15',
        deviceId: 'DEV-T2Y5K',
        previousAvgAmount: 4200,
        locationDistance: 850,
      },
      {
        id: 'CASE-005',
        transactionId: 'TXN-9E2F7C4A',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        amount: 15600,
        currency: 'NAD',
        customerName: 'Peter Nghidinwa',
        customerId: 'CUST-62157',
        riskScore: 0.78,
        status: 'resolved',
        location: 'Windhoek, Namibia',
        merchantName: 'Windhoek Electronics',
        anomalyType: ['high_amount'],
        ipAddress: '105.234.19.44',
        deviceId: 'DEV-W8H9L',
        previousAvgAmount: 3800,
        locationDistance: 15,
      },
      {
        id: 'CASE-006',
        transactionId: 'TXN-B7D1E9F3',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        amount: 54200,
        currency: 'NAD',
        customerName: 'Anna Shikongo',
        customerId: 'CUST-38472',
        riskScore: 0.92,
        status: 'frozen',
        location: 'Durban, South Africa',
        merchantName: 'Coastal Jewelers',
        anomalyType: ['high_amount', 'unusual_location', 'unusual_time'],
        ipAddress: '197.85.133.201',
        deviceId: 'DEV-E4P7M',
        previousAvgAmount: 6700,
        locationDistance: 1680,
      },
      {
        id: 'CASE-007',
        transactionId: 'TXN-C8E2D5A6',
        timestamp: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
        amount: 38900,
        currency: 'NAD',
        customerName: 'Thomas Hamutenya',
        customerId: 'CUST-51293',
        riskScore: 0.87,
        status: 'pending',
        location: 'Lusaka, Zambia',
        merchantName: 'Premium Auto Parts',
        anomalyType: ['high_amount', 'unusual_location'],
        ipAddress: '196.44.98.176',
        deviceId: 'DEV-N5K8R',
        previousAvgAmount: 7800,
        locationDistance: 1120,
      },
      {
        id: 'CASE-008',
        transactionId: 'TXN-D4F9A2E7',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        amount: 19400,
        currency: 'NAD',
        customerName: 'Linda Shipanga',
        customerId: 'CUST-74138',
        riskScore: 0.76,
        status: 'resolved',
        location: 'Swakopmund, Namibia',
        merchantName: 'Coastal Resort & Spa',
        anomalyType: ['high_amount'],
        ipAddress: '105.235.44.92',
        deviceId: 'DEV-L2B9V',
        previousAvgAmount: 3200,
        locationDistance: 360,
      },
    ];
    
    // Store all sample alerts
    for (const alert of sampleAlerts) {
      await kv.set(`alert:${alert.id}`, alert);
    }
    
    console.log(`Initialized database with ${sampleAlerts.length} sample alerts`);
    
    return c.json({ 
      success: true, 
      message: "Database initialized successfully",
      count: sampleAlerts.length 
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get statistics
app.get("/make-server-13630cb6/stats", async (c) => {
  try {
    const alerts = await kv.getByPrefix("alert:");
    
    const stats = {
      total: alerts.length,
      pending: alerts.filter(a => a.status === 'pending').length,
      underReview: alerts.filter(a => a.status === 'under_review').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      frozen: alerts.filter(a => a.status === 'frozen').length,
      totalAtRisk: alerts
        .filter(a => a.status === 'pending')
        .reduce((sum, a) => sum + a.amount, 0),
    };
    
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
