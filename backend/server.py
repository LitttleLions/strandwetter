from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import aiohttp
import asyncio
from datetime import datetime, timedelta
import json
from enum import Enum

app = FastAPI(title="StrandWetter Deutschland API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.strandwetter
weather_collection = db.weather_data

# Beach coordinates for Rügen
BEACHES = {
    "Binz": {"latitude": 54.40, "longitude": 13.61, "name": "Binz"},
    "Sellin": {"latitude": 54.38, "longitude": 13.69, "name": "Sellin"},
    "Göhren": {"latitude": 54.34, "longitude": 13.74, "name": "Göhren"},
    "Baabe": {"latitude": 54.36, "longitude": 13.71, "name": "Baabe"}
}

class WeatherData(BaseModel):
    beach: str
    timestamp: datetime
    current_weather: Dict[str, Any]
    forecast: Dict[str, Any]
    marine_data: Dict[str, Any]
    best_time: Optional[str] = None
    beach_score: Optional[float] = None

class BeachRecommendation(BaseModel):
    beach: str
    score: float
    best_time: str
    reasons: List[str]

async def fetch_weather_data(beach_name: str, coordinates: Dict[str, float]) -> Dict[str, Any]:
    """Fetch weather data from Open-Meteo API"""
    lat = coordinates["latitude"]
    lon = coordinates["longitude"]
    
    # Forecast API URL
    forecast_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,"
        f"weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,is_day"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,"
        f"apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,"
        f"wind_speed_10m_max,wind_direction_10m_dominant"
        f"&timezone=Europe/Berlin&forecast_days=3"
    )
    
    # Marine API URL
    marine_url = (
        f"https://api.open-meteo.com/v1/marine"
        f"?latitude={lat}&longitude={lon}"
        f"&hourly=wave_height,wave_direction,wave_period,sea_surface_temperature"
        f"&timezone=Europe/Berlin&forecast_days=3"
    )
    
    try:
        async with aiohttp.ClientSession() as session:
            # Fetch both APIs concurrently
            forecast_task = session.get(forecast_url)
            marine_task = session.get(marine_url)
            
            forecast_response, marine_response = await asyncio.gather(forecast_task, marine_task)
            
            if forecast_response.status == 200 and marine_response.status == 200:
                forecast_data = await forecast_response.json()
                marine_data = await marine_response.json()
                
                # Calculate beach score and best time
                best_time, beach_score = calculate_beach_recommendation(forecast_data, marine_data)
                
                return {
                    "beach": beach_name,
                    "forecast": forecast_data,
                    "marine": marine_data,
                    "best_time": best_time,
                    "beach_score": beach_score,
                    "timestamp": datetime.now()
                }
            else:
                raise HTTPException(status_code=500, detail=f"API Error: {forecast_response.status}/{marine_response.status}")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather API Error: {str(e)}")

def calculate_beach_recommendation(forecast_data: Dict, marine_data: Dict) -> tuple:
    """Calculate the best beach time and overall beach score"""
    try:
        hourly_temps = forecast_data["hourly"]["temperature_2m"]
        hourly_precip = forecast_data["hourly"]["precipitation_probability"]
        hourly_uv = forecast_data["hourly"]["uv_index"]
        hourly_clouds = forecast_data["hourly"]["cloud_cover"]
        hourly_wind = forecast_data["hourly"]["wind_speed_10m"]
        hourly_times = forecast_data["hourly"]["time"]
        
        best_score = 0
        best_time = None
        
        # Only consider daytime hours (6 AM to 8 PM)
        current_date = datetime.now().date()
        
        for i, time_str in enumerate(hourly_times[:24]):  # First 24 hours
            hour = datetime.fromisoformat(time_str.replace('Z', '+00:00')).hour
            
            if 6 <= hour <= 20:  # Daytime hours
                temp = hourly_temps[i] if i < len(hourly_temps) else 15
                precip = hourly_precip[i] if i < len(hourly_precip) else 100
                uv = hourly_uv[i] if i < len(hourly_uv) else 10
                clouds = hourly_clouds[i] if i < len(hourly_clouds) else 100
                wind = hourly_wind[i] if i < len(hourly_wind) else 30
                
                # Calculate score based on ideal beach conditions
                score = 0
                
                # Temperature score (ideal: 20-28°C)
                if 20 <= temp <= 28:
                    score += 30
                elif 18 <= temp <= 32:
                    score += 20
                elif 15 <= temp <= 35:
                    score += 10
                
                # Precipitation score (lower is better)
                if precip <= 10:
                    score += 25
                elif precip <= 30:
                    score += 15
                elif precip <= 50:
                    score += 5
                
                # UV score (moderate UV is good)
                if 3 <= uv <= 6:
                    score += 20
                elif 1 <= uv <= 8:
                    score += 15
                elif uv < 1:
                    score += 5
                
                # Cloud cover score (some clouds are okay)
                if clouds <= 30:
                    score += 15
                elif clouds <= 60:
                    score += 10
                elif clouds <= 80:
                    score += 5
                
                # Wind score (gentle breeze is ideal)
                if 5 <= wind <= 15:
                    score += 10
                elif wind <= 25:
                    score += 5
                
                if score > best_score:
                    best_score = score
                    best_time = time_str
        
        # Format best time for German display
        if best_time:
            best_time_dt = datetime.fromisoformat(best_time.replace('Z', '+00:00'))
            best_time = best_time_dt.strftime("%H:%M")
        
        return best_time, round(best_score, 1)
        
    except Exception as e:
        print(f"Error calculating beach recommendation: {e}")
        return None, 0.0

def get_weather_description(weather_code: int) -> str:
    """Convert weather code to German description"""
    weather_codes = {
        0: "Sonnig",
        1: "Überwiegend sonnig",
        2: "Teilweise bewölkt",
        3: "Bewölkt",
        45: "Nebelig",
        48: "Gefrierender Nebel",
        51: "Leichter Sprühregen",
        53: "Sprühregen",
        55: "Dichter Sprühregen",
        61: "Leichter Regen",
        63: "Regen",
        65: "Starker Regen",
        71: "Leichter Schneefall",
        73: "Schneefall",
        75: "Starker Schneefall",
        77: "Schneekörner",
        80: "Leichte Regenschauer",
        81: "Regenschauer",
        82: "Starke Regenschauer",
        95: "Gewitter",
        96: "Gewitter mit Hagel",
        99: "Starkes Gewitter mit Hagel"
    }
    return weather_codes.get(weather_code, "Unbekannt")

@app.get("/")
async def root():
    return {"message": "StrandWetter Deutschland API", "version": "1.0.0"}

@app.get("/api/beaches")
async def get_beaches():
    """Get list of available beaches"""
    return {
        "beaches": [
            {"id": key, "name": value["name"], "coordinates": {"lat": value["latitude"], "lon": value["longitude"]}}
            for key, value in BEACHES.items()
        ]
    }

@app.get("/api/weather/{beach_name}")
async def get_beach_weather(beach_name: str):
    """Get current weather data for a specific beach"""
    if beach_name not in BEACHES:
        raise HTTPException(status_code=404, detail="Beach not found")
    
    try:
        # Check cache first
        cached_data = await weather_collection.find_one(
            {"beach": beach_name},
            sort=[("timestamp", -1)]
        )
        
        # Use cached data if it's less than 30 minutes old
        if cached_data and (datetime.now() - cached_data["timestamp"]).seconds < 1800:
            return {
                "beach": beach_name,
                "data": cached_data,
                "cached": True
            }
        
        # Fetch fresh data
        weather_data = await fetch_weather_data(beach_name, BEACHES[beach_name])
        
        # Cache the data
        await weather_collection.insert_one({
            "beach": beach_name,
            "timestamp": datetime.now(),
            "data": weather_data
        })
        
        return {
            "beach": beach_name,
            "data": weather_data,
            "cached": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather")
async def get_all_beaches_weather():
    """Get weather data for all beaches"""
    results = {}
    
    for beach_name in BEACHES.keys():
        try:
            weather_data = await fetch_weather_data(beach_name, BEACHES[beach_name])
            results[beach_name] = weather_data
        except Exception as e:
            results[beach_name] = {"error": str(e)}
    
    return results

@app.get("/api/recommendations")
async def get_beach_recommendations():
    """Get beach recommendations for all beaches"""
    recommendations = []
    
    for beach_name in BEACHES.keys():
        try:
            weather_data = await fetch_weather_data(beach_name, BEACHES[beach_name])
            
            recommendations.append({
                "beach": beach_name,
                "score": weather_data["beach_score"],
                "best_time": weather_data["best_time"],
                "current_temp": weather_data["forecast"]["hourly"]["temperature_2m"][0],
                "current_weather": get_weather_description(weather_data["forecast"]["hourly"]["weather_code"][0])
            })
            
        except Exception as e:
            recommendations.append({
                "beach": beach_name,
                "score": 0,
                "error": str(e)
            })
    
    # Sort by score (highest first)
    recommendations.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    return {"recommendations": recommendations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)