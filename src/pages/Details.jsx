import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from "react-native";

const Details = ({ emergencyData, userLocation, onClose, onDelete }) => {
  const handleCall = () => {
    if (emergencyData.contactNumber) {
      const phoneNumber = `tel:${emergencyData.contactNumber}`;
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          if (!supported) {
            console.error("Phone number is not available");
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch((err) => console.error("Error calling:", err));
    }
  };

  const handleNavigation = () => {
    if (!emergencyData.exactLocation || !userLocation) {
      alert("Location information is not available");
      return;
    }

    const { lat, lon } = emergencyData.exactLocation;
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    
    // Use different formats for iOS and Android
    const url = Platform.select({
      ios: `maps://app?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}(Emergency Location)&mode=d`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          alert("Maps application not available");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening maps:", err));
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>{emergencyData.helpType}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Requester:</Text>
            <Text style={styles.value}>{emergencyData.name}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{emergencyData.description || "No description provided"}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{emergencyData.contactNumber}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>
              {emergencyData.exactLocation
                ? `Latitude: ${emergencyData.exactLocation.lat}, Longitude: ${emergencyData.exactLocation.lon}`
                : "Location not available"}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.statusValue,
                {
                  color:
                    emergencyData.status === "Approved"
                      ? "#22C55E"
                      : emergencyData.status === "Rejected"
                      ? "#DC2626"
                      : "#F59E0B",
                },
              ]}
            >
              {emergencyData.status || "Pending"}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={handleCall}
            >
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.navigateButton]}
              onPress={handleNavigation}
            >
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.buttonText}>Delete Request</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 22,
    color: "#666",
  },
  infoSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  callButton: {
    backgroundColor: "#10B981",
    flex: 1,
    marginRight: 5,
  },
  navigateButton: {
    backgroundColor: "#3B82F6",
    flex: 1,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Details;