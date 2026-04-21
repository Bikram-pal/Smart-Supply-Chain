# traffic_service.py

import requests

# Replace with your actual TomTom API key
API_KEY = "YOUR_API_KEY"

BASE_URL = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"


def get_traffic(lat, lon):
    """
    Fetch traffic data from TomTom API and return structured response.

    Args:
        lat (float): Latitude
        lon (float): Longitude

    Returns:
        dict: {
            "current_speed": int,
            "free_flow_speed": int,
            "congestion_level": str
        }
    """

    # Validate inputs
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        raise ValueError("Invalid coordinates: must be float or int")

    try:
        params = {
            "point": f"{lat},{lon}",
            "key": API_KEY
        }

        response = requests.get(BASE_URL, params=params, timeout=5)

        # Check API response
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}")

        data = response.json()

        # Extract speeds
        flow_data = data.get("flowSegmentData", {})
        current_speed = flow_data.get("currentSpeed")
        free_flow_speed = flow_data.get("freeFlowSpeed")

        if current_speed is None or free_flow_speed is None:
            raise Exception("Invalid API response structure")

        # Calculate congestion level
        ratio = current_speed / free_flow_speed

        if ratio >= 0.8:
            congestion = "Low"
        elif ratio >= 0.5:
            congestion = "Moderate"
        else:
            congestion = "High"

        return {
            "current_speed": current_speed,
            "free_flow_speed": free_flow_speed,
            "congestion_level": congestion
        }

    except requests.exceptions.RequestException as e:
        raise Exception(f"Request failed: {str(e)}")

    except Exception as e:
        raise Exception(f"Traffic service error: {str(e)}")


# Example usage
if __name__ == "__main__":
    try:
        traffic = get_traffic(22.57, 88.36)
        print(traffic)
    except Exception as e:
        print(e)