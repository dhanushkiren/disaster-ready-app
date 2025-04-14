import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import MapComponent from "../components/MapComponent";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { sampleEmergencies } from "../utils/SampleData"; // Import the sample data

const Home = () => {
  const [emergencies, setEmergencies] = useState([]);
  const navigation = useNavigation();
  const [showMap, setShowMap] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch emergencies data when component mounts
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      // This would be your actual API endpoint
      const response = await axios.get(
        "http://192.168.173.85:8080/api/request"
      );
      setEmergencies(response.data);
      console.log("Emergencies fetched:", response.data);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      // Use the imported sample data instead of hardcoding it here
      // setEmergencies(sampleEmergencies);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmergencies();
  };

  const handleCardPress = (emergency) => {
    navigation.navigate("EmergencyDetail", { emergency });
  };

  return (
    <SafeAreaView style={styles.container}>
      {showMap && (
        <View style={styles.mapContainer}>
          <MapComponent range={4} emergencies={emergencies} />
          <Text style={styles.overlayText}>
            {emergencies.length > 0
              ? `${emergencies.length} emergencies available`
              : "No emergencies currently available."}
          </Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Nearby Emergencies</Text>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0EA5E9"]}
              tintColor="#0EA5E9"
            />
          }
        >
          {emergencies.length > 0 ? (
            emergencies.map((emergency) => (
              <TouchableOpacity
                key={emergency.id}
                style={styles.card}
                onPress={() => handleCardPress(emergency)}
              >
                <View style={styles.iconContainer} />
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{emergency.helpType}</Text>
                  <Text style={styles.location}>{emergency.name}</Text>
                  <Text style={styles.location}>
                    {emergency.exactLocation
                      ? `Lat: ${emergency.exactLocation.lat}, Lon: ${emergency.exactLocation.lon}`
                      : "Not Provided"}
                  </Text>
                  <Text style={styles.contact}>
                    Contact: {emergency.contactNumber}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(emergency.timestamp).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noEmergenciesText}>
              No emergencies to display
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: "45%",
    position: "relative",
  },
  overlayText: {
    position: "absolute",
    bottom: 43,
    right: 18,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    marginTop: -35,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#B91C1C",
    borderRadius: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  noEmergenciesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 32,
  },
  requestHelpButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#0EA5E9",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  requestHelpText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Home;
