import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import Geolocation from "react-native-geolocation-service";

const Details = ({ emergencyData, onClose, onDelete }) => {
  const [location, setLocation] = useState("Fetching...");

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation(`${latitude}, ${longitude}`);
      },
      (error) => {
        console.error("Error retrieving location:", error);
        setLocation("Location not available");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return (
    <Modal transparent={true} animationType="slide" visible={!!emergencyData}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Emergency Details</Text>
          <Text style={styles.text}>Name: {emergencyData.name}</Text>
          <Text style={styles.text}>
            Contact Number: {emergencyData.contactNumber}
          </Text>
          <Text style={styles.text}>Help Type: {emergencyData.helpType}</Text>
          <Text style={styles.text}>Co-ordinates: {location}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                Alert.alert("Done", "Emergency request completed.");
                onDelete();
              }}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#E0E7FF",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  doneButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Details;
