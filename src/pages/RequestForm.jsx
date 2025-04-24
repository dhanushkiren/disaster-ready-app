import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location"; // Import Expo Location API
import CheckBox from "react-native-paper/lib/commonjs/components/Checkbox/Checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import Toast from "react-native-toast-message";
import axios from "axios";

const RequestForm = ({ handleFormClick, onRequestSubmitted }) => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    helpType: "",
    landmark: "",
    getLocation: false,
    location: null, // Store lat, lon
  });

  useEffect(() => {
    // Get or generate user ID
    const getUserId = async () => {
      try {
        let storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          storedUserId = uuid.v4();
          await AsyncStorage.setItem("userId", storedUserId);
        }
        setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching user ID", error);
      }
    };

    getUserId();
  }, []);

  // Function to get location when the checkbox is clicked
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission to access location denied.",
        });
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      console.error("Error getting location:", error);
      Toast.show({ type: "error", text1: "Failed to get location" });
    }
  };

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));

    // If the user clicks "Get Location", fetch lat/lon
    if (key === "getLocation" && value === true) {
      getLocation();
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.contactNumber || !formData.helpType) {
      Toast.show({
        type: "error",
        text1: "Please fill in all the required fields.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let updatedLocation = formData.location;

    if (formData.getLocation && !updatedLocation) {
      const { coords } = await Location.getCurrentPositionAsync({});
      updatedLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    }

    try {
      const dataToSubmit = {
        ...formData,
        userId,
        exactLocation: updatedLocation
          ? { lat: updatedLocation.latitude, lon: updatedLocation.longitude } // Rename correctly
          : null,
      };
      delete dataToSubmit.location; // Include userId
      console.log("Data to submit:", dataToSubmit);

      // Send request to backend
      await axios.post("http://192.168.157.85:8080/api/request", dataToSubmit);

      setFormData({
        name: "",
        contactNumber: "",
        helpType: "",
        landmark: "",
        getLocation: false,
        location: null,
      });

      Toast.show({ type: "success", text1: "Request successfully raised!" });

      if (onRequestSubmitted) {
        onRequestSubmitted();
      } else {
        handleFormClick();
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Toast.show({ type: "error", text1: "Failed to submit request" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleFormClick}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Request Emergency Help</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={formData.contactNumber}
        onChangeText={(text) => handleChange("contactNumber", text)}
        keyboardType="phone-pad"
        placeholder="Enter contact number"
      />

      <Text style={styles.label}>Help Type (Food, Evacuation, etc.)</Text>
      <TextInput
        style={styles.input}
        value={formData.helpType}
        onChangeText={(text) => handleChange("helpType", text)}
        placeholder="Describe the help you need"
      />

      <Text style={styles.label}>Landmark</Text>
      <TextInput
        style={styles.input}
        value={formData.landmark}
        onChangeText={(text) => handleChange("landmark", text)}
        placeholder="Enter a nearby landmark"
      />

      <View style={styles.checkboxContainer}>
        <CheckBox
          status={formData.getLocation ? "checked" : "unchecked"}
          onPress={() => handleChange("getLocation", !formData.getLocation)}
        />
        <Text>Click to get exact location</Text>
      </View>

      {/* Show Latitude and Longitude if available */}
      {formData.location && (
        <Text style={styles.locationText}>
          Location: {formData.location.latitude}, {formData.location.longitude}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Raise Request</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#0284c7",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4f46e5",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    height: 45,
    borderColor: "#0284c7",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#0284c7",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RequestForm;
