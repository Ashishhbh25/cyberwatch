# India Cyber Threat Dashboard - Specification

## Project Overview
- **Project name**: India Cyber Threat Dashboard
- **Type**: Single-page web application (React + Django)
- **Core functionality**: Display cyber attacks and ransomware incidents in India with search capabilities
- **Target users**: Security professionals, researchers, general public interested in cybersecurity threats

## Data Model

### Attack Incident
- id: unique identifier
- company_name: company targeted
- attack_type: ransomware/malware/DDoS/phishing/brute force
- threat_actor: group responsible (LockBit, INC Ransom, etc.)
- date: attack date
- sector: industry sector (Manufacturing, Healthcare, Finance, etc.)
- status: status (Confirmed/Alleged)
- description: incident details
- impact: financial/operational impact
- location: city/state

### Attack Stats
- total_attacks_2025: 265 million
- ransomware_incidents_2025: 201
- top_cities: Mumbai, Kolkata, New Delhi
- top_states: Maharashtra, Gujarat, Delhi
- sectors_most_affected: Education, Healthcare, Manufacturing

## UI/UX Specification

### Layout Structure
- **Header**: Fixed top navigation with logo and title
- **Hero Section**: Interactive globe/map visualization with stats
- **Search Bar**: Prominent search with filters
- **Main Content**: Card-based incident display grid
- **Sidebar**: Stats and filters panel

### Visual Design
- **Color Palette**:
  - Background: #0a0e17 (deep navy)
  - Card background: #131a2b
  - Primary accent: #00ff88 (cyber green)
  - Secondary accent: #ff3366 (alert red)
  - Warning: #ffaa00 (amber)
  - Text primary: #ffffff
  - Text secondary: #8892a7
  - Border: #1e2a45

- **Typography**:
  - Headings: "Orbitron", monospace (tech/cyber feel)
  - Body: "Exo 2", sans-serif
  - Stats/numbers: "Share Tech Mono", monospace

- **Visual Effects**:
  - Glowing borders on hover
  - Animated scanning lines
  - Matrix-style rain effect on hero
  - Card hover: scale + glow
  - Pulse animations on live data

### Components

1. **Header**
   - Logo with pulse animation
   - Title: "CYBER WATCH INDIA"
   - Live clock

2. **Stats Banner**
   - Large animated counters
   - Comparison bars
   - Trend indicators

3. **Search Bar**
   - Search input with icon
   - Filter dropdowns (Attack Type, Sector, Date Range)
   - Clear filters button

4. **Attack Card**
   - Company logo/icon
   - Attack type badge
   - Threat actor name
   - Date and location
   - Sector tag
   - Expand for details

5. **Filter Sidebar**
   - Attack type checkboxes
   - Sector checkboxes
   - Date range slider
   - Threat actor list

## Functionality

### Core Features
1. **Search**: Real-time search by company name, threat actor, or description
2. **Filter**: Filter by attack type, sector, date range, threat actor
3. **Sort**: Sort by date, company name, impact level
4. **View Modes**: Grid view / List view
5. **Stats Display**: Live statistics dashboard
6. **Detail View**: Click card to see full incident details

### API Endpoints (Django)
- GET /api/incidents/ - List all incidents
- GET /api/incidents/{id}/ - Get incident details
- GET /api/stats/ - Get statistics
- GET /api/search/?q= - Search incidents

## Acceptance Criteria
- [ ] Application runs on localhost:3000 (React) and localhost:8000 (Django)
- [ ] All 15+ major incidents displayed
- [ ] Search returns relevant results in real-time
- [ ] Filters work correctly
- [ ] UI is responsive and modern
- [ ] No console errors
- [ ] All stats display correctly