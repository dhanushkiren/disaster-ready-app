import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Slider from "@react-native-community/slider";
import MapComponent from "../components/MapComponent";

const Agencies = () => {
  const [range, setRange] = useState(10);
  const [policeStations, setPoliceStations] = useState([
    {
      id: 1,
      name: "Central Police Station",
      address: "123 Main St, Chennai",
      latitude: 13.0827,
      longitude: 80.1707,
    },
    {
      id: 2,
      name: "West District Police",
      address: "456 West St, Chennai",
      latitude: 13.0675,
      longitude: 80.2377,
    },
  ]);

  const handleRangeChange = (value) => {
    setRange(value);
  };

  const handleDetails = (station) => {
    Alert.alert(
      "Police Station Details",
      `${station.name}\n${station.address}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.map}>
        <MapComponent range={range} />
      </View>
      {/* List of Police Stations */}
      <FlatList
        data={policeStations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconPlaceholder} />
              <View style={styles.textContainer}>
                <Text style={styles.stationName}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleDetails(item)}
                >
                  <Image
                    source={{
                      uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/240f6e6a16e2b112dbe4c58ee5e2db89f7364f44c30eb6e13d76348209d15675?",
                    }}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Get Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Range Slider */}
      <Text style={styles.rangeText}>Range: {range} km</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={range}
        onValueChange={handleRangeChange}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  map: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#1E90FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rangeText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  slider: {
    width: "90%",
    alignSelf: "center",
  },
  searchButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    height: "30%",
  },
});

export default Agencies;
