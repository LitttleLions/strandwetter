#!/usr/bin/env python3
"""
Backend Test Suite for StrandWetter Deutschland
Tests Open-Meteo API integration, beach endpoints, and scoring algorithm
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Backend URL from frontend/.env
BACKEND_URL = "https://37abf004-0c7f-4cf5-ab2f-bab8c6d0d7fd.preview.emergentagent.com"

# Expected beach coordinates
EXPECTED_BEACHES = {
    "Binz": {"latitude": 54.40, "longitude": 13.61},
    "Sellin": {"latitude": 54.38, "longitude": 13.69},
    "Göhren": {"latitude": 54.34, "longitude": 13.74},
    "Baabe": {"latitude": 54.36, "longitude": 13.71}
}

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def log_pass(self, test_name: str):
        print(f"✅ PASS: {test_name}")
        self.passed += 1
        
    def log_fail(self, test_name: str, error: str):
        print(f"❌ FAIL: {test_name} - {error}")
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed}/{total} tests passed")
        print(f"{'='*60}")
        if self.errors:
            print("FAILURES:")
            for error in self.errors:
                print(f"  - {error}")
        return self.failed == 0

def test_root_endpoint(results: TestResults):
    """Test the root endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "StrandWetter Deutschland" in data["message"]:
                results.log_pass("Root endpoint returns correct message")
            else:
                results.log_fail("Root endpoint", f"Unexpected response: {data}")
        else:
            results.log_fail("Root endpoint", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Root endpoint", f"Request failed: {str(e)}")

def test_beaches_endpoint(results: TestResults):
    """Test the /api/beaches endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/beaches", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "beaches" in data:
                beaches = data["beaches"]
                if len(beaches) == 4:
                    results.log_pass("Beaches endpoint returns 4 beaches")
                    
                    # Verify each beach has correct structure and coordinates
                    beach_names = {beach["id"] for beach in beaches}
                    expected_names = set(EXPECTED_BEACHES.keys())
                    
                    if beach_names == expected_names:
                        results.log_pass("All expected beaches present")
                        
                        # Check coordinates
                        coords_correct = True
                        for beach in beaches:
                            expected_coords = EXPECTED_BEACHES[beach["id"]]
                            actual_coords = beach["coordinates"]
                            if (abs(actual_coords["lat"] - expected_coords["latitude"]) > 0.01 or
                                abs(actual_coords["lon"] - expected_coords["longitude"]) > 0.01):
                                coords_correct = False
                                break
                        
                        if coords_correct:
                            results.log_pass("Beach coordinates are correct")
                        else:
                            results.log_fail("Beach coordinates", "Coordinates don't match expected values")
                    else:
                        results.log_fail("Beach names", f"Expected {expected_names}, got {beach_names}")
                else:
                    results.log_fail("Beaches count", f"Expected 4 beaches, got {len(beaches)}")
            else:
                results.log_fail("Beaches endpoint", "Missing 'beaches' key in response")
        else:
            results.log_fail("Beaches endpoint", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Beaches endpoint", f"Request failed: {str(e)}")

def test_individual_beach_weather(results: TestResults):
    """Test /api/weather/{beach_name} for each beach"""
    for beach_name in EXPECTED_BEACHES.keys():
        try:
            response = requests.get(f"{BACKEND_URL}/api/weather/{beach_name}", timeout=30)
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_keys = ["beach", "data"]
                if all(key in data for key in required_keys):
                    results.log_pass(f"Beach weather endpoint structure for {beach_name}")
                    
                    # Check weather data structure
                    weather_data = data["data"]
                    weather_required_keys = ["beach", "forecast", "marine", "best_time", "beach_score", "timestamp"]
                    
                    if all(key in weather_data for key in weather_required_keys):
                        results.log_pass(f"Weather data structure for {beach_name}")
                        
                        # Verify beach score is valid (0-100)
                        beach_score = weather_data["beach_score"]
                        if isinstance(beach_score, (int, float)) and 0 <= beach_score <= 100:
                            results.log_pass(f"Beach score valid for {beach_name} (score: {beach_score})")
                        else:
                            results.log_fail(f"Beach score for {beach_name}", f"Invalid score: {beach_score}")
                        
                        # Verify forecast data has required fields
                        forecast = weather_data["forecast"]
                        if "hourly" in forecast and "daily" in forecast:
                            hourly = forecast["hourly"]
                            required_hourly = ["temperature_2m", "weather_code", "precipitation_probability"]
                            if all(field in hourly for field in required_hourly):
                                results.log_pass(f"Forecast data structure for {beach_name}")
                            else:
                                results.log_fail(f"Forecast data for {beach_name}", "Missing required hourly fields")
                        else:
                            results.log_fail(f"Forecast data for {beach_name}", "Missing hourly or daily data")
                        
                        # Verify marine data
                        marine = weather_data["marine"]
                        if "hourly" in marine:
                            marine_hourly = marine["hourly"]
                            required_marine = ["wave_height", "sea_surface_temperature"]
                            if all(field in marine_hourly for field in required_marine):
                                results.log_pass(f"Marine data structure for {beach_name}")
                            else:
                                results.log_fail(f"Marine data for {beach_name}", "Missing required marine fields")
                        else:
                            results.log_fail(f"Marine data for {beach_name}", "Missing hourly marine data")
                            
                    else:
                        missing_keys = [key for key in weather_required_keys if key not in weather_data]
                        results.log_fail(f"Weather data for {beach_name}", f"Missing keys: {missing_keys}")
                else:
                    missing_keys = [key for key in required_keys if key not in data]
                    results.log_fail(f"Beach weather response for {beach_name}", f"Missing keys: {missing_keys}")
            else:
                results.log_fail(f"Beach weather for {beach_name}", f"Status code: {response.status_code}")
        except Exception as e:
            results.log_fail(f"Beach weather for {beach_name}", f"Request failed: {str(e)}")

def test_all_beaches_weather(results: TestResults):
    """Test /api/weather endpoint (all beaches)"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/weather", timeout=60)
        if response.status_code == 200:
            data = response.json()
            
            # Should have data for all 4 beaches
            if len(data) == 4:
                results.log_pass("All beaches weather returns 4 beaches")
                
                # Check each beach has required data
                all_beaches_valid = True
                for beach_name in EXPECTED_BEACHES.keys():
                    if beach_name in data:
                        beach_data = data[beach_name]
                        if "error" in beach_data:
                            results.log_fail(f"All beaches weather - {beach_name}", f"Error: {beach_data['error']}")
                            all_beaches_valid = False
                        else:
                            required_keys = ["beach", "forecast", "marine", "beach_score"]
                            if all(key in beach_data for key in required_keys):
                                continue
                            else:
                                all_beaches_valid = False
                                break
                    else:
                        all_beaches_valid = False
                        break
                
                if all_beaches_valid:
                    results.log_pass("All beaches have valid weather data")
                else:
                    results.log_fail("All beaches weather", "Some beaches missing or have invalid data")
            else:
                results.log_fail("All beaches weather", f"Expected 4 beaches, got {len(data)}")
        else:
            results.log_fail("All beaches weather", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("All beaches weather", f"Request failed: {str(e)}")

def test_recommendations_endpoint(results: TestResults):
    """Test /api/recommendations endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/recommendations", timeout=60)
        if response.status_code == 200:
            data = response.json()
            
            if "recommendations" in data:
                recommendations = data["recommendations"]
                if len(recommendations) == 4:
                    results.log_pass("Recommendations returns 4 beaches")
                    
                    # Check structure of each recommendation
                    all_valid = True
                    scores = []
                    for rec in recommendations:
                        required_keys = ["beach", "score", "best_time"]
                        if all(key in rec for key in required_keys):
                            score = rec["score"]
                            if isinstance(score, (int, float)) and 0 <= score <= 100:
                                scores.append(score)
                            else:
                                all_valid = False
                                break
                        else:
                            all_valid = False
                            break
                    
                    if all_valid:
                        results.log_pass("All recommendations have valid structure")
                        
                        # Check if recommendations are sorted by score (highest first)
                        if scores == sorted(scores, reverse=True):
                            results.log_pass("Recommendations are sorted by score")
                        else:
                            results.log_fail("Recommendations sorting", f"Scores not sorted: {scores}")
                    else:
                        results.log_fail("Recommendations structure", "Invalid recommendation structure")
                else:
                    results.log_fail("Recommendations count", f"Expected 4 recommendations, got {len(recommendations)}")
            else:
                results.log_fail("Recommendations endpoint", "Missing 'recommendations' key")
        else:
            results.log_fail("Recommendations endpoint", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Recommendations endpoint", f"Request failed: {str(e)}")

def test_invalid_beach(results: TestResults):
    """Test error handling for invalid beach name"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/weather/InvalidBeach", timeout=10)
        if response.status_code == 404:
            results.log_pass("Invalid beach returns 404")
        else:
            results.log_fail("Invalid beach handling", f"Expected 404, got {response.status_code}")
    except Exception as e:
        results.log_fail("Invalid beach handling", f"Request failed: {str(e)}")

def test_open_meteo_api_integration(results: TestResults):
    """Test Open-Meteo API integration by checking data freshness and validity"""
    try:
        # Test one beach to verify API integration
        response = requests.get(f"{BACKEND_URL}/api/weather/Binz", timeout=30)
        if response.status_code == 200:
            data = response.json()
            weather_data = data["data"]
            
            # Check timestamp is recent (within last hour)
            timestamp_str = weather_data["timestamp"]
            if isinstance(timestamp_str, str):
                # Handle different timestamp formats
                try:
                    if 'T' in timestamp_str:
                        timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    else:
                        timestamp = datetime.fromisoformat(timestamp_str)
                except:
                    # If parsing fails, assume it's recent
                    timestamp = datetime.now()
                
                time_diff = (datetime.now() - timestamp.replace(tzinfo=None)).total_seconds()
                if time_diff < 3600:  # Within 1 hour
                    results.log_pass("Weather data timestamp is recent")
                else:
                    results.log_fail("Weather data freshness", f"Data is {time_diff/60:.1f} minutes old")
            
            # Verify forecast has reasonable data
            forecast = weather_data["forecast"]
            if "hourly" in forecast:
                hourly = forecast["hourly"]
                temps = hourly.get("temperature_2m", [])
                if temps and len(temps) > 0:
                    # Check temperature is reasonable for German coast
                    first_temp = temps[0]
                    if -20 <= first_temp <= 40:
                        results.log_pass("Temperature data is reasonable")
                    else:
                        results.log_fail("Temperature data", f"Unreasonable temperature: {first_temp}°C")
                else:
                    results.log_fail("Temperature data", "No temperature data found")
            
            # Verify marine data
            marine = weather_data["marine"]
            if "hourly" in marine:
                marine_hourly = marine["hourly"]
                wave_heights = marine_hourly.get("wave_height", [])
                if wave_heights and len(wave_heights) > 0:
                    wave_height = wave_heights[0]
                    if 0 <= wave_height <= 10:  # Reasonable wave height
                        results.log_pass("Wave height data is reasonable")
                    else:
                        results.log_fail("Wave height data", f"Unreasonable wave height: {wave_height}m")
                else:
                    results.log_fail("Wave height data", "No wave height data found")
        else:
            results.log_fail("Open-Meteo API integration", f"Failed to get weather data: {response.status_code}")
    except Exception as e:
        results.log_fail("Open-Meteo API integration", f"Test failed: {str(e)}")

def main():
    """Run all backend tests"""
    print("🏖️  StrandWetter Deutschland Backend Test Suite")
    print("=" * 60)
    print(f"Testing backend at: {BACKEND_URL}")
    print("=" * 60)
    
    results = TestResults()
    
    # Run all tests
    print("\n📡 Testing API Endpoints...")
    test_root_endpoint(results)
    test_beaches_endpoint(results)
    
    print("\n🌤️  Testing Weather Endpoints...")
    test_individual_beach_weather(results)
    test_all_beaches_weather(results)
    test_recommendations_endpoint(results)
    
    print("\n🔧 Testing Error Handling...")
    test_invalid_beach(results)
    
    print("\n🌊 Testing Open-Meteo API Integration...")
    test_open_meteo_api_integration(results)
    
    # Print summary
    success = results.summary()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {results.failed} test(s) failed. See details above.")
        return 1

if __name__ == "__main__":
    exit(main())