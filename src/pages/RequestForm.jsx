import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import CheckBox from "react-native-paper/lib/commonjs/components/Checkbox/Checkbox";
import Toast from "react-native-toast-message";
import axios from "axios";

const RequestForm = ({ handleFormClick, userLocation, onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    helpType: "",
    landmark: "",
    getLocation: false,
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      // If getLocation is true and userLocation exists, add it to formData
      const dataToSubmit = { ...formData };
      if (formData.getLocation && userLocation) {
        dataToSubmit.location = userLocation;
      }

      await axios.post("http://192.168.83.85:8080/api/request", dataToSubmit);
      setFormData({
        name: "",
        contactNumber: "",
        helpType: "",
        landmark: "",
        getLocation: false,
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
