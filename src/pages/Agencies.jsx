import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import Slider from "@react-native-community/slider";
import AgencyMap from "../components/AgencyMap";

const Agencies = () => {
  const [range, setRange] = useState(5);
  const [tempRange, setTempRange] = useState(5);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSliderComplete = () => setRange(tempRange);

  const handleAgencyPress = (agency) => {
    setSelectedAgency(agency);
    setModalVisible(true);
  };

  const openInGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <AgencyMap range={range} onAgenciesFetched={setAgencies} />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.rangeText}>Range: {tempRange} km</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={tempRange}
          onValueChange={setTempRange}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1E90FF"
        />
      </View>

      <FlatList
        data={agencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAgencyPress(item)}>
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.distance}>{item.distance?.toFixed(2)} km away</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAgency?.name}</Text>
            <Text>Latitude: {selectedAgency?.latitude}</Text>
            <Text>Longitude: {selectedAgency?.longitude}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                openInGoogleMaps(selectedAgency.latitude, selectedAgency.longitude);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Get Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalClose}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { height: "45%" },
  sliderContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  rangeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slider: {
    width: "90%",
  },
  card: {
    backgroundColor: "#f0f0f0",
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  type: {
    fontSize: 14,
    color: "#666",
  },
  distance: {
    marginTop: 5,
    fontSize: 13,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalClose: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#888",
    borderRadius: 8,
  },
});

export default Agencies;
