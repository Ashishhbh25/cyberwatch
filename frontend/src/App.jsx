import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { FaShieldAlt, FaSearch, FaExclamationTriangle, FaIndustry, FaCalendar, FaMapMarkerAlt, FaUserSecret, FaServer, FaFilter, FaTimes, FaHdd, FaLock, FaEye, FaBolt, FaVirus, FaEnvelope, FaBell, FaShare, FaTwitter, FaLinkedin, FaWhatsapp, FaLink, FaMoneyBillWave, FaCrown, FaChartLine, FaDotCircle, FaGamepad, FaFilePdf, FaCheck, FaTimesCircle, FaBug, FaExternalLinkAlt } from 'react-icons/fa'
import './App.css'

const API_BASE = 'https://cyberwatch-backend-9xak.onrender.com/api'

const THREAT_ACTORS = [
  { name: "LockBit", alias: "LockBit 5.0", color: "#ff3366", attacks: 150, specialty: "Double extortion", countries: 140 },
  { name: "INC Ransom", alias: "INC Ransom", color: "#ff6600", attacks: 85, specialty: "Critical infrastructure", countries: 45 },
  { name: "Akira", alias: "Akira", color: "#aa00ff", attacks: 70, specialty: "Ransomware-as-a-Service", countries: 50 },
  { name: "Qilin", alias: "Qilin", color: "#ffaa00", attacks: 55, specialty: "Healthcare focus", countries: 30 },
  { name: "Hunters", alias: "Hunters International", color: "#00ffaa", attacks: 45, specialty: "Data theft", countries: 25 },
  { name: "Sinobi", alias: "Sinobi", color: "#ff0066", attacks: 50, specialty: "IT service providers", countries: 35 },
  { name: "Play", alias: "Play", color: "#0066ff", attacks: 40, specialty: "MFA bypass", countries: 20 },
  { name: "Medusa", alias: "Medusa", color: "#66ff00", attacks: 35, specialty: "Zero-day exploits", countries: 18 },
]

const COMPANY_RISK_DATA = [
  { name: "Tata", sector: "IT Services", riskScore: 85, attacks: 3 },
  { name: "Reliance", sector: "Conglomerate", riskScore: 72, attacks: 1 },
  { name: "Infosys", sector: "IT Services", riskScore: 90, attacks: 2 },
  { name: "Wipro", sector: "IT Services", riskScore: 88, attacks: 2 },
  { name: "HDFC", sector: "Banking", riskScore: 78, attacks: 2 },
  { name: "ICICI", sector: "Banking", riskScore: 82, attacks: 3 },
  { name: "TCS", sector: "IT Services", riskScore: 75, attacks: 1 },
  { name: "Mahindra", sector: "Automotive", riskScore: 65, attacks: 1 },
  { name: "L&T", sector: "Construction", riskScore: 70, attacks: 2 },
  { name: "Vodafone", sector: "Telecom", riskScore: 58, attacks: 1 },
  { name: "Airtel", sector: "Telecom", riskScore: 62, attacks: 1 },
  { name: "Mistry", sector: "Chemicals", riskScore: 55, attacks: 0 },
]

const ZERO_DAY_VULNS = [
  { id: "CVE-2025-61882", name: "Fortinet SSL-VPN", severity: "CRITICAL", cvss: 9.8, affected: "Fortinet FortiOS", exploit: "Active", date: "2025-12-20", description: "Remote code execution via malformed HTTP request" },
  { id: "CVE-2025-41212", name: "Cisco IOS XE", severity: "CRITICAL", cvss: 10.0, affected: "Cisco IOS XE", exploit: "Active", date: "2025-11-15", description: "Web UI command injection" },
  { id: "CVE-2025-8901", name: "Ivanti Connect", severity: "HIGH", cvss: 9.1, affected: "Ivanti Connect Secure", exploit: "Patched", date: "2025-10-08", description: "SQL injection leading to RCE" },
  { id: "CVE-2025-7701", name: "SAP NetWeaver", severity: "HIGH", cvss: 8.8, affected: "SAP NetWeaver", exploit: "No", date: "2025-09-22", description: "Authentication bypass in ABAP" },
  { id: "CVE-2025-6502", name: "VMware vCenter", severity: "CRITICAL", cvss: 9.2, affected: "vCenter Server 7.0", exploit: "Active", date: "2025-08-30", description: "Arbitrary file write vulnerability" },
  { id: "CVE-2025-5401", name: "Atlassian Confluence", severity: "HIGH", cvss: 8.5, affected: "Confluence Data Center", exploit: "Patched", date: "2025-08-12", description: "OGNL injection - Logo vulnerability" },
  { id: "CVE-2025-3301", name: "Pulse Secure", severity: "MEDIUM", cvss: 6.8, affected: "Pulse Connect Secure", exploit: "No", date: "2025-07-25", description: "Privilege escalation via SAML" },
  { id: "CVE-2025-2201", name: "WordPress WP-GraphQL", severity: "HIGH", cvss: 8.2, affected: "WP-GraphQL Plugin", exploit: "Active", date: "2025-07-10", description: "SQL injection in GraphQL queries" },
]

function App() {
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')
  const [showModal, setShowModal] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [emailSubscribe, setEmailSubscribe] = useState('')
  const [subscribeMsg, setSubscribeMsg] = useState('')
  const [premiumMsg, setPremiumMsg] = useState('')
  const [showAd, setShowAd] = useState(true)
  const [activeFeature, setActiveFeature] = useState('dashboard')
  const [riskSearch, setRiskSearch] = useState('')
  const [riskResult, setRiskResult] = useState(null)

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchData = async () => {
    try {
      const [incidentsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/incidents/`),
        axios.get(`${API_BASE}/stats/`)
      ])
      setIncidents(incidentsRes.data.results)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIncidents = useCallback(() => {
    return incidents.filter(incident => {
      const matchesType = selectedType === 'all' || incident.attack_type.toLowerCase() === selectedType.toLowerCase()
      const matchesSector = selectedSector === 'all' || incident.sector.toLowerCase() === selectedSector.toLowerCase()
      const matchesSearch = !search || 
        incident.company_name.toLowerCase().includes(search.toLowerCase()) ||
        incident.threat_actor.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSector && matchesSearch
    })
  }, [incidents, selectedType, selectedSector, search])

  const getAttackIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'ransomware': return <FaLock />
      case 'malware': return <FaVirus />
      case 'data breach': return <FaEye />
      case 'cloud breach': return <FaServer />
      case 'ddos attack': return <FaBolt />
      case 'phishing': return <FaUserSecret />
      case 'brute force': return <FaLock />
      default: return <FaExclamationTriangle />
    }
  }

  const getSeverityClass = (type) => {
    switch(type.toLowerCase()) {
      case 'ransomware': return 'severity-critical'
      case 'data breach': return 'severity-high'
      case 'malware': return 'severity-high'
      default: return 'severity-medium'
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Scanning threat landscape...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="scan-line"></div>
      
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FaShieldAlt className="logo-icon" />
            <span className="logo-text">CYBER WATCH <span className="logo-india">INDIA</span></span>
          </div>
          <div className="header-stats">
            <div className="live-indicator">
              <span className="pulse"></span>
              LIVE
            </div>
            <div className="clock">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">INDIA cyber THREAT MONITOR</h1>
          <p className="hero-subtitle">Real-time tracking of cyber attacks and ransomware incidents</p>
          
          {stats && (
            <div className="stats-grid">
              <div className="stat-card main-stat">
                <div className="stat-value">{formatNumber(stats.total_attacks_2025)}</div>
                <div className="stat-label">Total Cyber Attacks (2025)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.ransomware_incidents_2025}</div>
                <div className="stat-label">Ransomware Incidents</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatNumber(stats.daily_detections)}</div>
                <div className="stat-label">Daily Detections</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.minute_detections}</div>
                <div className="stat-label">Per Minute</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="hero-visual">
          <div className="globe-container">
            <div className="globe"></div>
            <div className="globe-ring ring-1"></div>
            <div className="globe-ring ring-2"></div>
            <div className="globe-ring ring-3"></div>
          </div>
        </div>
      </section>

      {stats && (
        <section className="insights-section">
          <div className="insight-card">
            <h3>Top Targeted Cities</h3>
            <div className="insight-bars">
              {stats.top_cities.map((city, i) => (
                <div key={i} className="insight-bar">
                  <span className="bar-label">{city.name}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: `${(city.detections / stats.top_cities[0].detections) * 100}%`}}></div>
                  </div>
                  <span className="bar-value">{formatNumber(city.detections)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="insight-card">
            <h3>Top Affected Sectors</h3>
            <div className="sector-tags">
              {stats.top_sectors.map((sector, i) => (
                <span key={i} className="sector-tag" style={{animationDelay: `${i * 0.1}s`}}>
                  {sector.name} <small>{sector.percentage}%</small>
                </span>
              ))}
            </div>
          </div>
          <div className="insight-card">
            <h3>Attack Types</h3>
            <div className="attack-types">
              {stats.attack_types.map((type, i) => (
                <span key={i} className="attack-type-badge">
                  {type.name} <small>{type.percentage}%</small>
                </span>
              ))}
            </div>
          </div>
          <div className="insight-card highlight">
            <h3>Ransomware Growth</h3>
            <div className="growth-stat">{stats.ransomware_growth}</div>
            <p className="growth-note">{stats.manufacturers_paid_ransom} of manufacturers paid ransom</p>
          </div>
        </section>
      )}

      <section className="unique-features">
        <div className="feature-nav">
          <button className={activeFeature === 'dashboard' ? 'active' : ''} onClick={() => setActiveFeature('dashboard')}>
            <FaChartLine /> Live Dashboard
          </button>
          <button className={activeFeature === 'risk' ? 'active' : ''} onClick={() => setActiveFeature('risk')}>
            <FaSearch /> Risk Checker
          </button>
          <button className={activeFeature === 'actors' ? 'active' : ''} onClick={() => setActiveFeature('actors')}>
            <FaUserSecret /> Threat Actors
          </button>
          <button className={activeFeature === 'simulator' ? 'active' : ''} onClick={() => setActiveFeature('simulator')}>
            <FaGamepad /> Attack Simulator
          </button>
          <button className={activeFeature === 'zeroday' ? 'active' : ''} onClick={() => setActiveFeature('zeroday')}>
            <FaBug /> Zero Day
          </button>
        </div>

        {activeFeature === 'risk' && (
          <div className="risk-checker">
            <h2><FaShieldAlt /> Check Your Company Risk Score</h2>
            <p className="feature-desc">Enter any Indian company name to check their cybersecurity risk level based on attack history</p>
            <div className="risk-search-box">
              <input 
                type="text" 
                placeholder="Enter company name (e.g., Tata, Infosys, HDFC)" 
                value={riskSearch}
                onChange={(e) => setRiskSearch(e.target.value)}
              />
              <button onClick={() => {
                const found = COMPANY_RISK_DATA.find(c => c.name.toLowerCase().includes(riskSearch.toLowerCase()))
                setRiskResult(found || null)
              }}>Check Risk</button>
            </div>
            {riskResult && (
              <div className="risk-result">
                <div className="risk-score-circle" style={{background: riskResult.riskScore > 80 ? 'var(--alert-red)' : riskResult.riskScore > 60 ? 'var(--alert-amber)' : 'var(--accent-primary)'}}>
                  {riskResult.riskScore}
                </div>
                <div className="risk-details">
                  <h3>{riskResult.name}</h3>
                  <p>Sector: {riskResult.sector}</p>
                  <p>Previous Attacks: {riskResult.attacks}</p>
                  <div className="risk-level">
                    Risk Level: {riskResult.riskScore > 80 ? 'HIGH' : riskResult.riskScore > 60 ? 'MEDIUM' : 'LOW'}
                  </div>
                </div>
              </div>
            )}
            {!riskResult && riskSearch && (
              <p className="no-result">Company not found in database. <a href="#">Request to add</a></p>
            )}
            <div className="known-companies">
              <p>Popular searches:</p>
              <div className="company-chips">
                {COMPANY_RISK_DATA.slice(0, 6).map(c => (
                  <span key={c.name} onClick={() => { setRiskSearch(c.name); setRiskResult(c) }}>{c.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeFeature === 'actors' && (
          <div className="threat-actors-view">
            <h2><FaUserSecret /> Active Threat Groups in India</h2>
            <div className="actors-grid">
              {THREAT_ACTORS.map(actor => (
                <div key={actor.name} className="actor-card">
                  <div className="actor-header" style={{borderColor: actor.color}}>
                    <div className="actor-icon" style={{background: actor.color}}>{actor.name[0]}</div>
                    <div>
                      <h3>{actor.name}</h3>
                      <span className="actor-alias">{actor.alias}</span>
                    </div>
                  </div>
                  <div className="actor-stats">
                    <div className="actor-stat">
                      <span className="stat-num">{actor.attacks}</span>
                      <span className="stat-label">Attacks</span>
                    </div>
                    <div className="actor-stat">
                      <span className="stat-num">{actor.countries}</span>
                      <span className="stat-label">Countries</span>
                    </div>
                  </div>
                  <div className="actor-specialty">
                    <span>Specialty: {actor.specialty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeFeature === 'simulator' && (
          <div className="simulator-view">
            <h2><FaGamepad /> Cyber Attack Simulator</h2>
            <p className="feature-desc">See how different cyber attacks work in real-time</p>
            <div className="simulator-stage">
              <div className="sim-network">
                <div className="sim-server"><FaServer /></div>
                <div className="sim-pc pc-1"><FaHdd /></div>
                <div className="sim-pc pc-2"><FaHdd /></div>
                <div className="sim-pc pc-3"><FaHdd /></div>
                <div className="sim-hacker">👨‍💻</div>
              </div>
              <div className="sim-controls">
                <button className="sim-btn ransomware" onClick={() => alert('🔒 RANSOMWARE SIMULATION: Files get encrypted! Pay 50 BTC to recover.')}>
                  <FaLock /> Simulate Ransomware
                </button>
                <button className="sim-btn ddos" onClick={() => alert('⚠️ DDoS SIMULATION: Server overloaded with traffic from 10,000 bots!')}>
                  <FaBolt /> Simulate DDoS
                </button>
                <button className="sim-btn phishing" onClick={() => alert('🎣 PHISHING SIMULATION: User clicked fake link! Credentials stolen.')}>
                  <FaUserSecret /> Simulate Phishing
                </button>
                <button className="sim-btn malware" onClick={() => alert('🦠 MALWARE SIMULATION: Backdoor installed! Data being exfiltrated...')}>
                  <FaVirus /> Simulate Malware
                </button>
              </div>
            </div>
          </div>
        )}

        {activeFeature === 'zeroday' && (
          <div className="zeroday-view">
            <h2><FaBug /> Active Zero-Day Vulnerabilities</h2>
            <p className="feature-desc">Known vulnerabilities being actively exploited - patch immediately if affected</p>
            <div className="zeroday-table">
              <div className="table-header">
                <span>CVE ID</span>
                <span>Name</span>
                <span>Severity</span>
                <span>CVSS</span>
                <span>Affected</span>
                <span>Exploit</span>
              </div>
              {ZERO_DAY_VULNS.map(vuln => (
                <div key={vuln.id} className={`table-row severity-${vuln.severity.toLowerCase()}`}>
                  <span className="cve-id"><a href="#">{vuln.id}</a></span>
                  <span className="vuln-name">{vuln.name}</span>
                  <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
                  <span className="cvss-score" style={{color: vuln.cvss >= 9 ? 'var(--alert-red)' : vuln.cvss >= 7 ? 'var(--alert-amber)' : 'var(--text-secondary)'}}>
                    {vuln.cvss}
                  </span>
                  <span className="affected">{vuln.affected}</span>
                  <span className={`exploit-status ${vuln.exploit.toLowerCase()}`}>
                    {vuln.exploit === 'Active' ? <><FaExclamationTriangle /> Active</> : vuln.exploit === 'Patched' ? <><FaCheck /> Patched</> : <><FaTimesCircle /> No</>}
                  </span>
                </div>
              ))}
            </div>
            <div className="zeroday-info">
              <FaExclamationTriangle /> <strong>Warning:</strong> These vulnerabilities are actively exploited by threat actors. Update your systems immediately.
            </div>
          </div>
        )}
      </section>

      <section className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search companies, threat actors, or keywords..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <FaFilter />
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Attack Types</option>
              <option value="ransomware">Ransomware</option>
              <option value="malware">Malware</option>
              <option value="data breach">Data Breach</option>
              <option value="ddos attack">DDoS</option>
              <option value="phishing">Phishing</option>
            </select>
          </div>
          <div className="filter-group">
            <FaIndustry />
            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
              <option value="all">All Sectors</option>
              <option value="it services">IT Services</option>
              <option value="banking & finance">Banking</option>
              <option value="financial services">Financial Services</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="telecommunications">Telecom</option>
              <option value="government">Government</option>
            </select>
          </div>
        </div>
      </section>

      <section className="incidents-section">
        <h2 className="section-title">
          <FaExclamationTriangle /> Recent Incidents
          <span className="incident-count">{filteredIncidents().length}</span>
        </h2>
        
        <div className="incidents-grid">
          {filteredIncidents().map((incident, index) => (
            <div 
              key={incident.id} 
              className="incident-card"
              style={{animationDelay: `${index * 0.05}s`}}
              onClick={() => setShowModal(incident)}
            >
              <div className="card-header">
                <div className={`attack-badge ${getSeverityClass(incident.attack_type)}`}>
                  {getAttackIcon(incident.attack_type)}
                  {incident.attack_type}
                </div>
                <span className={`status ${incident.status.toLowerCase()}`}>{incident.status}</span>
              </div>
              <h3 className="company-name">{incident.company_name}</h3>
              <div className="threat-actor">
                <FaUserSecret /> {incident.threat_actor}
              </div>
              <p className="description">{incident.description.substring(0, 80)}...</p>
              <div className="card-meta">
                <span><FaCalendar /> {incident.date}</span>
                <span><FaMapMarkerAlt /> {incident.location}</span>
              </div>
              <div className="sector-tag-small">{incident.sector}</div>
            </div>
          ))}
        </div>
        
        {filteredIncidents().length === 0 && (
          <div className="no-results">
            <p>No incidents found matching your criteria</p>
            <button onClick={() => {setSearch(''); setSelectedType('all'); setSelectedSector('all')}}>
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>
              <FaTimes />
            </button>
            <div className={`modal-badge ${getSeverityClass(showModal.attack_type)}`}>
              {getAttackIcon(showModal.attack_type)}
              {showModal.attack_type}
            </div>
            <h2>{showModal.company_name}</h2>
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Threat Actor</span>
                <span className="detail-value"><FaUserSecret /> {showModal.threat_actor}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value"><FaCalendar /> {showModal.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-value"><FaMapMarkerAlt /> {showModal.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sector</span>
                <span className="detail-value"><FaIndustry /> {showModal.sector}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`detail-value status ${showModal.status.toLowerCase()}`}>{showModal.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Impact</span>
                <span className="detail-value"><FaHdd /> {showModal.impact}</span>
              </div>
            </div>
            <div className="modal-description">
              <h4>Description</h4>
              <p>{showModal.description}</p>
            </div>
            {showModal.data_stolen && showModal.data_stolen !== 'N/A' && (
              <div className="modal-data">
                <h4>Data Exposed</h4>
                <p>{showModal.data_stolen}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <FaEnvelope className="newsletter-icon" />
            <h3>Get Daily Cyber Threat Alerts</h3>
            <p>Subscribe for free daily alerts on latest cyber attacks in India</p>
          </div>
          <form className="newsletter-form" onSubmit={async (e) => { 
            e.preventDefault()
            try {
              await axios.post(`${API_BASE}/subscribe/`, { email: emailSubscribe })
              setSubscribeMsg('Thanks! You will receive alerts soon.')
              setEmailSubscribe('')
            } catch (err) {
              setSubscribeMsg('Error! Try again.')
            }
          }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={emailSubscribe}
              onChange={(e) => setEmailSubscribe(e.target.value)}
              required
            />
            <button type="submit"><FaBell /> Subscribe Free</button>
          </form>
          {subscribeMsg && <p className="subscribe-msg">{subscribeMsg}</p>}
        </div>
      </section>

      <section className="ads-section">
        <div className="ad-banner">
          <span className="ad-label">Advertisement</span>
          <div className="ad-content">
            <h4>Protect Your Business from Cyber Attacks</h4>
            <p>Get enterprise-grade security solutions. Contact us for a free security audit.</p>
            <button>Get Free Quote</button>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-card">
          <FaCrown className="premium-icon" />
          <h3>Premium Threat Intelligence</h3>
          <ul>
            <li>Real-time API Access</li>
            <li>Dark Web Monitoring</li>
            <li>Custom Alerts</li>
            <li>Weekly Reports</li>
          </ul>
          <div className="premium-price">₹150/month</div>
          <button className="premium-btn" onClick={async () => {
              const email = prompt('Enter your email for premium access:')
              if (email) {
                try {
                  await axios.post(`${API_BASE}/premium-signup/`, { email, plan: 'premium' })
                  alert('Thanks! We will contact you for payment.')
                } catch (err) {
                  alert('Error! Try again.')
                }
              }
            }}>Upgrade Now</button>
        </div>
      </section>

      <section className="share-section">
        <h3>Share This Dashboard</h3>
        <div className="share-buttons">
          <button className="share-btn twitter"><FaTwitter /> Twitter</button>
          <button className="share-btn linkedin"><FaLinkedin /> LinkedIn</button>
          <a href="https://wa.me/918709748884?text=Hi%20CyberWatch%20India,%20I%20want%20premium%20subscription!" className="share-btn whatsapp"><FaWhatsapp /> WhatsApp</a>
          <button className="share-btn link"><FaLink /> Copy Link</button>
        </div>
      </section>

      <footer className="footer">
        <p>India Cyber Threat Dashboard - Monitoring {stats?.total_attacks_2025 ? formatNumber(stats.total_attacks_2025) : '265M'}+ cyber attacks</p>
        <p className="footer-contact">Contact: +91 8709748884 | Email: contact@ashishtech.in</p>
        <p className="footer-note">Data sourced from public reports and security research</p>
        <div className="footer-links">
          <a href="https://wa.me/918709748884">WhatsApp</a>
          <a href="mailto:contact@ashishtech.in">Email Us</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}

export default App