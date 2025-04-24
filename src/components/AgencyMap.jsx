// components/MapComponent.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

const AgencyMap = ({ range, onAgenciesFetched }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      const userLoc = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(userLoc);
      fetchNearbyAgencies(userLoc.latitude, userLoc.longitude, range);
    })();
  }, [range]);

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
  
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyAgencies = async (lat, lon, radius) => {
    setLoading(true);
    const overpassQuery = `
      [out:json];
      (
        node["amenity"~"hospital|police|fire_station"](around:${radius * 1000},${lat},${lon});
      );
      out body;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      const json = await response.json();
      const fetchedAgencies = json.elements.map((el) => {
        const distance = haversineDistance(
          { latitude: lat, longitude: lon },
          { latitude: el.lat, longitude: el.lon }
        );
      
        return {
          id: el.id,
          name: el.tags.name || "Unnamed",
          type: el.tags.amenity,
          latitude: el.lat,
          longitude: el.lon,
          distance,
        };
      });
      fetchedAgencies.sort((a, b) => a.distance - b.distance);

      setAgencies(fetchedAgencies);
      onAgenciesFetched(fetchedAgencies);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return <ActivityIndicator size="large" color="#1E90FF" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          ...location,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        <Circle
          center={location}
          radius={range * 1000}
          strokeColor="rgba(30,144,255,0.5)"
          fillColor="rgba(30,144,255,0.2)"
        />
        {agencies.map((agency) => (
          <Marker
            key={agency.id}
            coordinate={{
              latitude: agency.latitude,
              longitude: agency.longitude,
            }}
            title={agency.name}
            description={agency.type}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: "100%", width: "100%" },
});

export default AgencyMap;
