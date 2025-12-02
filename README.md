# SentinelShield: Full-Stack Explainable AI Fraud Defense
### 🖥️ SentinelShield UI Screenshots

![SentinelShield Dashboard showing high-risk alerts, scores, and NAD amounts.](<img width="1896" height="909" alt="image" src="https://github.com/user-attachments/assets/2708c67a-1f4f-4871-82ff-d8c4661fd533" />
)

---

#### 2. Aura XAI Explanation and Case Details
![Detailed case view highlighting the Gemini-powered Aura XAI explanation and analyst action panel.](<img width="612" height="839" alt="image" src="https://github.com/user-attachments/assets/4148a276-d13b-4a36-8ed5-80f35218e33e" />
)

![FastAPI Swagger UI demonstrating the POST /transactions/ingest endpoint used for real-time transaction submission.](<img width="1145" height="703" alt="image" src="https://github.com/user-attachments/assets/b367d171-8334-4e39-9da4-55bf7812e6ee" />
)


A real-time banking fraud detection system for Namibia with Explainable AI (XAI) powered by Google Gemini.

## 🚀 Features

### Core Capabilities
- **Real-time Fraud Monitoring**: Live dashboard displaying high-risk transactions
- **Explainable AI (Aura)**: Natural language explanations for each fraud alert powered by Gemini
- **Risk Scoring**: Color-coded risk indicators (Red/Amber/Green) for instant triage
- **Case Management**: Analyst workflow with freeze/safe actions
- **Namibia Dollar (NAD) Support**: Formatted for local currency

### Technical Architecture
- **Frontend**: React with Material UI (dark theme optimized for analyst workflow)
- **Backend**: Supabase Edge Functions with Hono web framework
- **Database**: Supabase KV Store for persistent fraud case data
- **AI**: Google Gemini API for real-time XAI explanations
- **Currency**: Namibia Dollar (NAD)

## 📋 Setup Instructions

### 1. Initialize Sample Data
When you first open the application, click **"Initialize Sample Data"** to populate the system with 8 sample fraud alerts.

### 2. Configure Gemini API
To enable real-time AI explanations:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. The application will prompt you to enter your API key
3. Enter the key in the GEMINI_API_KEY field
4. Click "Save"

**Note**: Without the Gemini API key, the system will use fallback explanations (still functional but less sophisticated).

## 🎯 Using the System

### Dashboard Overview
The main dashboard displays:
- **Active Alerts**: Pending cases requiring review
- **At-Risk Amount**: Total NAD value of unresolved cases
- **Frozen Accounts**: Security-locked accounts
- **Resolved Today**: Successfully closed cases

### Reviewing Fraud Alerts

1. **View Alert List**: Sorted by risk score (highest first)
2. **Click on Alert**: Opens detailed case investigation modal
3. **Review Details**: 
   - Transaction amount in NAD
   - Customer information
   - Geographic and temporal anomalies
   - Risk score with color indicator

### Aura XAI Analysis
Each case includes an AI-generated explanation:
- **Primary Anomalies**: Specific patterns detected (e.g., "5x typical amount, 800km location anomaly")
- **Risk Context**: Why the pattern is suspicious
- **Recommended Action**: Immediate next steps for analyst

### Taking Action
Analysts can:
- **Freeze Account**: Immediately lock suspicious account
- **Contact Customer**: Initiate verification call
- **Mark as Safe**: Resolve false positive cases

### Creating New Alerts
1. Click **"New Alert"** button
2. Fill in transaction details:
   - Customer name and merchant
   - Transaction amount (NAD)
   - Location and distance from typical locations
   - Risk score (50-100%)
   - Anomaly types
3. Click **"Create Alert"** to add to queue

## 🔄 Real-time Features

- **Auto-refresh**: Click "Refresh" to update alert list
- **Live XAI**: Each case triggers fresh Gemini analysis
- **Status Updates**: Immediate UI updates when resolving cases
- **Persistent Storage**: All data saved to Supabase KV store

## 🎨 Design Principles

### Information Hierarchy
- Dark theme reduces eye strain during extended monitoring
- Critical data (amount, risk score) prominently displayed
- Clear visual separation between transaction data and AI insights

### Visual Coding
- **Red**: High risk (≥85%)
- **Amber/Yellow**: Medium risk (75-84%)
- **Green**: Lower risk (<75%)
- **Purple**: Frozen accounts

### Transparency (XAI UX)
- AI explanations displayed as dedicated, non-scrollable cards
- Plain language descriptions of ML decisions
- Builds analyst trust and supports compliance requirements

## 🛠️ Technical Details

### API Endpoints
- `GET /alerts` - Fetch all fraud alerts
- `GET /alerts/:id` - Get specific alert
- `POST /alerts` - Create new alert
- `PUT /alerts/:id/status` - Update alert status
- `POST /xai/explain` - Generate Gemini explanation
- `POST /initialize` - Load sample data
- `GET /stats` - Get dashboard statistics

### Data Model
Each fraud alert contains:
- Transaction ID and timestamp
- Amount (NAD), customer, merchant
- Risk score (0.0-1.0)
- Location and distance anomaly
- Anomaly type indicators
- IP address and device ID
- Previous average spending
- Status (pending/under_review/resolved/frozen)

## 🔐 Security Considerations

- All API keys stored as Supabase secrets
- CORS configured for secure cross-origin requests
- Authorization headers required for all API calls
- Sensitive customer data handling compliance-ready

## 📊 Process Improvement Metrics

**Goal**: Reduce manual review time via AI-driven transparency

- **Before**: Analysts manually analyze complex ML outputs
- **After**: Aura XAI provides instant, actionable 3-sentence summaries
- **Impact**: Faster case resolution, better compliance documentation

## 🌍 Namibia-Specific Features

- **NAD Currency**: All amounts displayed in Namibia Dollars
- **Regional Awareness**: Location anomalies calibrated for Southern Africa
- **Local Merchants**: Sample data includes regional businesses
- **Distance Calculations**: Windhoek-centric geography

## 🚦 Status Indicators

- **Pending** (Yellow): New alert awaiting review
- **Under Review** (Gray): Currently being investigated
- **Resolved** (Green): Determined to be safe/false positive
- **Account Frozen** (Red): Security lockdown active

## 📱 Responsive Design

The dashboard is optimized for:
- Desktop workstations (primary analyst interface)
- Tablet devices (on-the-go reviews)
- Maintains usability across screen sizes

## 🔮 Future Enhancements

Potential additions:
- Real-time Kafka/Pub/Sub streaming integration
- Historical trend analysis and reporting
- Multi-analyst collaboration features
- Mobile app for push notifications
- Advanced ML model retraining pipeline
- Customer communication portal

---

**Built for**: Namibian banking fraud analysts  
**Powered by**: React, Material UI, Supabase, Google Gemini  
**Currency**: NAD (Namibia Dollars)
