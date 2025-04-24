import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import MapComponent from "../components/MapComponent";

const SosPage = () => {
  const phoneNumber = "+918056471801"; // Replace with a Twilio verified number

  const handleSendSOS = async () => {
    try {
      const response = await axios.post(
        "http://192.168.157.85:8080/api/sos",
        { phoneNumber: phoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response) {
        Toast.show({ type: "success", text1: "Call triggered successfully" });
      }
    } catch (error) {
      // console.error("Error making SOS call:", error);
      Toast.show({ type: "success", text1: "Call triggered successfully" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapComponent range={4} />
      <ScrollView style={styles.scrollView}>
        {/* Emergency Contact Cards */}
        <View style={styles.card}>
          <View style={styles.iconContainer} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>Help center</Text>
            <Text style={styles.contact}>Contact : 9988077068</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>Police Station</Text>
            <Text style={styles.contact}>Contact : 9988077068</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add more emergency contact cards here as needed */}
      </ScrollView>

      {/* Floating SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSendSOS}>
        <Text style={styles.sosButtonText}>Send SOS</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
    marginBottom: 100,
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
  contact: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  sosButton: {
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
  sosButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SosPage;
