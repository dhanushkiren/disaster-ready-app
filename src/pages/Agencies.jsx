import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import MapComponent from "../components/MapComponent";

const Agencies = () => {
  const [range, setRange] = useState(10);
  const [filteredAgencies, setFilteredAgencies] = useState([]);

  const allAgencies = [
    {
      id: 1,
      name: "Central Police Station",
      type: "Police",
      address: "123 Main St, Chennai",
      latitude: 13.0827,
      longitude: 80.1707,
    },
    {
      id: 2,
      name: "West District Police",
      type: "Police",
      address: "456 West St, Chennai",
      latitude: 13.0675,
      longitude: 80.2377,
    },
    {
      id: 3,
      name: "City Fire Station",
      type: "Fire",
      address: "789 Fire St, Chennai",
      latitude: 13.0657,
      longitude: 80.2057,
    },
    {
      id: 4,
      name: "General Hospital",
      type: "Hospital",
      address: "101 Health Ave, Chennai",
      latitude: 13.0701,
      longitude: 80.2302,
    },
    {
      id: 5,
      name: "Public Toilet - Park",
      type: "Public Toilet",
      address: "Near City Park, Chennai",
      latitude: 13.0625,
      longitude: 80.1802,
    },
  ];

  useEffect(() => {
    filterAgenciesByRange();
  }, [range]);

  const filterAgenciesByRange = () => {
    const userLocation = { latitude: 13.0800, longitude: 80.2000 }; // Example user location
    // const userLocation = { latitude: 8.72742, longitude: 77.6838 }; // Example user location

    const filtered = allAgencies.filter((agency) => {
      const distance = getDistance(userLocation, {
        latitude: agency.latitude,
        longitude: agency.longitude,
      });

      return distance <= range;
    });

    setFilteredAgencies(filtered);
  };

  const getDistance = (loc1, loc2) => {
    const R = 6371; // Earth radius in km
    const dLat = (loc2.latitude - loc1.latitude) * (Math.PI / 180);
    const dLon = (loc2.longitude - loc1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.latitude * (Math.PI / 180)) *
        Math.cos(loc2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleDetails = (agency) => {
    Alert.alert("Agency Details", `${agency.name}\n${agency.address}`);
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapComponent range={range} agencies={filteredAgencies} />
      </View>

      <View style={styles.content } >
      {/* List of Agencies */}
      <FlatList
        data={filteredAgencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={[styles.iconPlaceholder, { backgroundColor: getColor(item.type) }]} />
              <View style={styles.textContainer}>
                <Text style={styles.agencyName}>{item.name}</Text>
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
        onValueChange={setRange}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>

    </View>
  );
};

const getColor = (type) => {
  switch (type) {
    case "Police":
      return "blue";
    case "Fire":
      return "red";
    case "Hospital":
      return "green";
    case "Public Toilet":
      return "purple";
    default:
      return "gray";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  content: {
    paddingHorizontal: 15,
  },
  mapContainer: {
    height: "45%",
    position: "relative",
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
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  agencyName: {
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
});

export default Agencies;
