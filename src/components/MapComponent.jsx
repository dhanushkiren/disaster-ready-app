import React, { useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import * as Location from "expo-location";

const MapComponent = ({ range, emergencies = [] }) => {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]); // Update region when location changes

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
    
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Ensure map centers on user's location
        showsUserLocation={true}
        followsUserLocation={true} // Enables continuous tracking
        initialRegion={{
          latitude: 20.5937, // Default center (India)
          longitude: 78.9629,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {location && (
          <>
            <Marker coordinate={location} title="You are here" pinColor="red" />
            <Circle
              center={location}
              radius={range * 100}
              strokeColor="rgba(135,206,235,0.8)"
              fillColor="rgba(135,206,235,0.35)"
            />
          </>
        )}

        {emergencies
          .filter(
            (emergency) =>
              emergency.exactLocation &&
              typeof emergency.exactLocation.lat === "number" &&
              typeof emergency.exactLocation.lon === "number"
          ) // Filter out invalid locations
          .map((emergency, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: emergency.exactLocation.lat,
                longitude: emergency.exactLocation.lon,
              }}
              title={emergency.helpType}
              description={emergency.name}
              pinColor="blue"
            />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: "80%", margin: 20 },
});

export default MapComponent;
