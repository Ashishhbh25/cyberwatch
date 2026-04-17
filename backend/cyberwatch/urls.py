from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/incidents/', views.incidents, name='incidents'),
    path('api/incidents/<int:incident_id>/', views.incident_detail, name='incident_detail'),
    path('api/stats/', views.stats, name='stats'),
    path('api/search/', views.search, name='search'),
    path('api/sectors/', views.sectors, name='sectors'),
    path('api/attack-types/', views.attack_types, name='attack_types'),
    path('api/threat-actors/', views.threat_actors, name='threat_actors'),
    path('api/subscribe/', views.subscribe, name='subscribe'),
    path('api/premium-signup/', views.premium_signup, name='premium_signup'),
]