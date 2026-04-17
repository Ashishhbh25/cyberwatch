from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import os
from pathlib import Path
from datetime import datetime

INCIDENTS = [
    {
        "id": 1,
        "company_name": "Tata Technologies",
        "attack_type": "Ransomware",
        "threat_actor": "Hunters International",
        "date": "2025-01-31",
        "sector": "IT Services",
        "status": "Confirmed",
        "description": "Ransomware attack affecting internal IT systems. Operations temporarily suspended.",
        "impact": "$500M estimated",
        "location": "Pune, Maharashtra",
        "data_stolen": "1.4 TB (alleged)"
    },
    {
        "id": 2,
        "company_name": "Granules India",
        "attack_type": "Ransomware",
        "threat_actor": "LockBit",
        "date": "2023-06-17",
        "sector": "Pharmaceutical",
        "status": "Confirmed",
        "description": "Major pharmaceutical company targeted with $91M extortion demand.",
        "impact": "$91M extortion",
        "location": "Hyderabad, Telangana",
        "data_stolen": "Confidential data"
    },
    {
        "id": 3,
        "company_name": "Larsen & Toubro (L&T)",
        "attack_type": "Data Breach",
        "threat_actor": "INC Ransom",
        "date": "2026-02-24",
        "sector": "Construction & Engineering",
        "status": "Alleged",
        "description": "Major construction conglomerate data allegedly leaked. 400 GB data exfiltration claimed.",
        "impact": "400 GB data leaked",
        "location": "Mumbai, Maharashtra",
        "data_stolen": "400 GB"
    },
    {
        "id": 4,
        "company_name": "Flamagas India Pvt. Ltd.",
        "attack_type": "Ransomware",
        "threat_actor": "LockBit 5.0",
        "date": "2026-03-21",
        "sector": "Manufacturing",
        "status": "Confirmed",
        "description": "Manufacturing firm targeted by LockBit 5.0 ransomware group.",
        "impact": "Data exfiltration",
        "location": "Gujarat",
        "data_stolen": "Confidential files"
    },
    {
        "id": 5,
        "company_name": "ICICI Bank",
        "attack_type": "Malware",
        "threat_actor": "Bashe",
        "date": "2025-01-15",
        "sector": "Banking & Finance",
        "status": "Confirmed",
        "description": "Third-party vendor portal compromise leading to credential theft.",
        "impact": "Credential exposure",
        "location": "Mumbai, Maharashtra",
        "data_stolen": "Customer credentials"
    },
    {
        "id": 6,
        "company_name": "Angel One",
        "attack_type": "Cloud Breach",
        "threat_actor": "Unknown",
        "date": "2025-03-01",
        "sector": "Financial Services",
        "status": "Confirmed",
        "description": "AWS cloud infrastructure breach exposing customer data.",
        "impact": "Data exposure",
        "location": "Mumbai, Maharashtra",
        "data_stolen": "Customer data"
    },
    {
        "id": 7,
        "company_name": "Nippon India MF",
        "attack_type": "Cyber Attack",
        "threat_actor": "Unknown",
        "date": "2025-02-15",
        "sector": "Mutual Fund",
        "status": "Confirmed",
        "description": "Major outage lasting 12 days due to cyber attack.",
        "impact": "12-day service disruption",
        "location": "Mumbai, Maharashtra",
        "data_stolen": "N/A"
    },
    {
        "id": 8,
        "company_name": "Indian IT Services Company",
        "attack_type": "Ransomware",
        "threat_actor": "Sinobi",
        "date": "2026-01-15",
        "sector": "IT Services",
        "status": "Alleged",
        "description": "IT services company targeted. Access to Hyper-V servers and VMs gained. 150 GB+ data stolen.",
        "impact": "150 GB+ data",
        "location": "Bangalore, Karnataka",
        "data_stolen": "150 GB"
    },
    {
        "id": 9,
        "company_name": "Quick Heal Technologies",
        "attack_type": "Threat Report",
        "threat_actor": "N/A",
        "date": "2025-12-04",
        "sector": "Cybersecurity",
        "status": "Report",
        "description": "Released India Cyber Threat Report 2026: 265 million cyber attacks recorded in 2025.",
        "impact": "265M attacks",
        "location": "Pune, Maharashtra",
        "data_stolen": "N/A"
    },
    {
        "id": 10,
        "company_name": "Indian Healthcare Organization",
        "attack_type": "Ransomware",
        "threat_actor": "Akira",
        "date": "2025-08-20",
        "sector": "Healthcare",
        "status": "Confirmed",
        "description": "Healthcare organization ransomware attack leading to data encryption.",
        "impact": "Data encryption",
        "location": "Delhi",
        "data_stolen": "Patient data"
    },
    {
        "id": 11,
        "company_name": "Indian Manufacturing Firm",
        "attack_type": "Ransomware",
        "threat_actor": "Qilin",
        "date": "2025-09-10",
        "sector": "Manufacturing",
        "status": "Confirmed",
        "description": "Manufacturing sector targeted by Qilin ransomware group.",
        "impact": "Operations disrupted",
        "location": "Gujarat",
        "data_stolen": "Corporate data"
    },
    {
        "id": 12,
        "company_name": "Indian Education Institution",
        "attack_type": "DDoS Attack",
        "threat_actor": "NoName057(16)",
        "date": "2025-11-05",
        "sector": "Education",
        "status": "Confirmed",
        "description": "Educational institution targeted by hacktivist group DDoS attack.",
        "impact": "Service disruption",
        "location": "Kolkata, West Bengal",
        "data_stolen": "N/A"
    },
    {
        "id": 13,
        "company_name": "Indian Bank",
        "attack_type": "Phishing",
        "threat_actor": "Unknown",
        "date": "2025-07-22",
        "sector": "Banking",
        "status": "Confirmed",
        "description": "Phishing campaign targeting bank customers leading to credential theft.",
        "impact": "Customer data risk",
        "location": "Mumbai, Maharashtra",
        "data_stolen": "Credentials"
    },
    {
        "id": 14,
        "company_name": "Indian Telecom Company",
        "attack_type": "Data Breach",
        "threat_actor": "Anonymous",
        "date": "2026-02-10",
        "sector": "Telecommunications",
        "status": "Confirmed",
        "description": "Telecom company data breach exposing subscriber information.",
        "impact": "Subscriber data exposure",
        "location": "New Delhi",
        "data_stolen": "Subscriber records"
    },
    {
        "id": 15,
        "company_name": "Indian Government Portal",
        "attack_type": "Brute Force",
        "threat_actor": "APT27",
        "date": "2025-10-15",
        "sector": "Government",
        "status": "Confirmed",
        "description": "Government portal targeted with brute force attacks.",
        "impact": "Portal compromise",
        "location": "New Delhi",
        "data_stolen": "N/A"
    }
]

STATS = {
    "total_attacks_2025": 265520000,
    "ransomware_incidents_2025": 201,
    "malware_detections": 265520000,
    "endpoints_protected": 8000000,
    "daily_detections": 727000,
    "minute_detections": 505,
    "top_cities": [
        {"name": "Mumbai", "detections": 36100000},
        {"name": "Kolkata", "detections": 20000000},
        {"name": "New Delhi", "detections": 15400000}
    ],
    "top_states": [
        {"name": "Maharashtra", "detections": 36100000},
        {"name": "Gujarat", "detections": 24100000},
        {"name": "Delhi", "detections": 15400000}
    ],
    "top_sectors": [
        {"name": "Education", "percentage": 47},
        {"name": "Healthcare", "percentage": 20},
        {"name": "Manufacturing", "percentage": 27}
    ],
    "attack_types": [
        {"name": "Trojans", "percentage": 70},
        {"name": "File Infectors", "percentage": 15},
        {"name": "Cryptojacking", "percentage": 10},
        {"name": "Network Exploits", "percentage": 5}
    ],
    "ransomware_growth": "+31.4%",
    "manufacturers_paid_ransom": "65%"
}

@require_http_methods(["GET"])
def incidents(request):
    attack_type = request.GET.get('attack_type')
    sector = request.GET.get('sector')
    search = request.GET.get('q', '')
    
    filtered = INCIDENTS.copy()
    
    if attack_type and attack_type != 'all':
        filtered = [i for i in filtered if i['attack_type'].lower() == attack_type.lower()]
    
    if sector and sector != 'all':
        filtered = [i for i in filtered if i['sector'].lower() == sector.lower()]
    
    if search:
        search = search.lower()
        filtered = [i for i in filtered if search in i['company_name'].lower() or 
                  search in i['threat_actor'].lower() or 
                  search in i['description'].lower()]
    
    return JsonResponse({"count": len(filtered), "results": filtered})

@require_http_methods(["GET"])
def incident_detail(request, incident_id):
    incident = next((i for i in INCIDENTS if i['id'] == incident_id), None)
    if incident:
        return JsonResponse(incident)
    return JsonResponse({"error": "Incident not found"}, status=404)

@require_http_methods(["GET"])
def stats(request):
    return JsonResponse(STATS)

@require_http_methods(["GET"])
def search(request):
    query = request.GET.get('q', '').lower()
    if not query:
        return JsonResponse({"results": []})
    
    results = [i for i in INCIDENTS if query in i['company_name'].lower() or 
              query in i['threat_actor'].lower() or 
              query in i['description'].lower() or
              query in i['sector'].lower()]
    
    return JsonResponse({"count": len(results), "results": results})

@require_http_methods(["GET"])
def sectors(request):
    sectors_list = list(set(i['sector'] for i in INCIDENTS))
    return JsonResponse({"sectors": sorted(sectors_list)})

@require_http_methods(["GET"])
def attack_types(request):
    types_list = list(set(i['attack_type'] for i in INCIDENTS))
    return JsonResponse({"attack_types": sorted(types_list)})

@require_http_methods(["GET"])
def threat_actors(request):
    actors_list = list(set(i['threat_actor'] for i in INCIDENTS if i['threat_actor'] != 'N/A'))
    return JsonResponse({"threat_actors": sorted(actors_list)})

@csrf_exempt
@require_http_methods(["POST"])
def subscribe(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        
        if not email or '@' not in email:
            return JsonResponse({"success": False, "message": "Invalid email"}, status=400)
        
        base_dir = Path(__file__).resolve().parent.parent
        subs_file = base_dir / 'subscriptions.json'
        
        subscriptions = []
        if subs_file.exists():
            with open(subs_file, 'r') as f:
                subscriptions = json.load(f)
        
        if email in subscriptions:
            return JsonResponse({"success": True, "message": "Already subscribed!"})
        
        subscriptions.append({"email": email, "date": datetime.now().isoformat()})
        
        with open(subs_file, 'w') as f:
            json.dump(subscriptions, f, indent=2)
        
        return JsonResponse({"success": True, "message": "Subscribed successfully!"})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def premium_signup(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        plan = data.get('plan', 'basic')
        
        if not email or '@' not in email:
            return JsonResponse({"success": False, "message": "Invalid email"}, status=400)
        
        base_dir = Path(__file__).resolve().parent.parent
        premium_file = base_dir / 'premium_signups.json'
        
        signups = []
        if premium_file.exists():
            with open(premium_file, 'r') as f:
                signups = json.load(f)
        
        signups.append({"email": email, "plan": plan, "date": datetime.now().isoformat()})
        
        with open(premium_file, 'w') as f:
            json.dump(signups, f, indent=2)
        
        return JsonResponse({"success": True, "message": "Premium signup received! We'll contact you."})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)