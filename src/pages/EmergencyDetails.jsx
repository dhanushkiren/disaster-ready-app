import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapComponent from "../components/MapComponent";
import axios from "axios";

const EmergencyDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { emergency } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAccept = async () => {
    try {
      // API call to mark emergency as accepted
      await axios.put(
        `http://192.168.157.85:8080/api/request/${emergency.id}/accept`
      );

      Alert.alert(
        "Emergency Accepted",
        "You have accepted to help with this emergency.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeMain"),
          },
        ]
      );
    } catch (error) {
      console.error("Error accepting emergency:", error);

      // For demo purposes, show success anyway
      Alert.alert(
        "Emergency Accepted",
        "You have accepted to help with this emergency.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapComponent range={2} centerLocation={emergency.location} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.iconLarge} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{emergency.type}</Text>
            <Text style={styles.timestamp}>
              {formatDate(emergency.timestamp)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Emergency Details</Text>
          <Text style={styles.detailText}>
            Location:{" "}
            {emergency.exactLocation
              ? `Lat: ${emergency.exactLocation.lat}, Lon: ${emergency.exactLocation.lon}`
              : "Not Provided"}
          </Text>
          <Text style={styles.detailText}>
            Contact: {emergency.contactNumber}
          </Text>
          <Text style={styles.description}>{emergency.landmark}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
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
    height: "30%",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconLarge: {
    width: 100,
    height: 100,
    backgroundColor: "#B91C1C",
    borderRadius: 50,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
  detailsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginTop: 12,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    backgroundColor: "#6B7280",
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: "#10B981",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EmergencyDetail;
