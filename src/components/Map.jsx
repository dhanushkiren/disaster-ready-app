import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const Map = ({ mapData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data Map</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {mapData.map((data, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: data.latitude || 0,
              longitude: data.longitude || 0,
            }}
          >
            <Callout>
              <View>
                <Text>Temperature: {data.temperature || "N/A"}</Text>
                <Text>Humidity: {data.humidity || "N/A"}</Text>
                <Text>
                  Earthquake Intensity: {data.earthquakeIntensity || "N/A"}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
});

export default Map;
