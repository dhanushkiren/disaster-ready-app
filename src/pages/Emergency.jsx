import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import Details from "./Details";
import RequestForm from "./RequestForm";
import NewsDetail from "./NewsDetail"; // Import the new component
import * as Location from "expo-location";
import { sampleNewsData } from "../utils/SampleData"; // Import the sample data

const Emergency = () => {
  const [emergencyData, setEmergencyData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null); // New state for selected news
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("myRequests"); // "myRequests" or "news"
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchEmergencyData();
    fetchUserLocation();
    if (activeTab === "news") {
      fetchNews();
    }
  }, [activeTab]);

  const fetchUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchEmergencyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/request");
      setEmergencyData(response.data);
    } catch (error) {
      console.error("Error fetching emergency data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Using a free news API - replace with your preferred API
      const response = await axios.get(
        "https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=YOUR_API_KEY"
      );

      // If API fails, use sample data
      if (response.data?.articles) {
        setNewsData(response.data.articles);
      } else {
        // Use sample data from separate file
        setNewsData(sampleNewsData);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      // Use sample news data on error
      setNewsData(sampleNewsData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteEmergency = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/request/${selectedEmergency._id}`
      );
      setEmergencyData((prev) =>
        prev.filter((data) => data._id !== selectedEmergency._id)
      );
      setSelectedEmergency(null);
    } catch (error) {
      console.error("Error deleting emergency:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === "myRequests") {
      fetchEmergencyData();
    } else {
      fetchNews();
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderItem = ({ item }) => {
    if (activeTab === "myRequests") {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setSelectedEmergency(item)}
        >
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>Contact: {item.contactNumber}</Text>
            <Text style={styles.details}>Help: {item.helpType}</Text>
            <Text style={styles.status}>
              Status:{" "}
              <Text style={getStatusStyle(item.status)}>
                {item.status || "Pending"}
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedEmergency(item)}
            >
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    } else {
      // News item with click to view detail
      return (
        <TouchableOpacity
          style={styles.newsCard}
          onPress={() => setSelectedNews(item)}
        >
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
          <View style={styles.newsFooter}>
            <Text style={styles.newsSource}>{item.source?.name}</Text>
            <Text style={styles.newsDate}>{formatDate(item.publishedAt)}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { color: "#22C55E" };
      case "Rejected":
        return { color: "#DC2626" };
      case "In Progress":
        return { color: "#F59E0B" };
      default:
        return { color: "#3B82F6" };
    }
  };

  // Handle different view states
  if (showRequestForm) {
    return (
      <RequestForm
        handleFormClick={() => setShowRequestForm(false)}
        userLocation={userLocation}
        onRequestSubmitted={() => {
          setShowRequestForm(false);
          fetchEmergencyData();
        }}
      />
    );
  }

  if (selectedNews) {
    return (
      <NewsDetail
        newsItem={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Options */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "myRequests" && styles.activeTab]}
          onPress={() => setActiveTab("myRequests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myRequests" && styles.activeTabText,
            ]}
          >
            My Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "news" && styles.activeTab]}
          onPress={() => setActiveTab("news")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "news" && styles.activeTabText,
            ]}
          >
            News
          </Text>
        </TouchableOpacity>
      </View>

      {/* Request Help Button (Only for "My Requests") */}
      {activeTab === "myRequests" && (
        <TouchableOpacity
          style={styles.requestHelpButton}
          onPress={() => setShowRequestForm(true)}
        >
          <Text style={styles.requestHelpText}>Request Help</Text>
        </TouchableOpacity>
      )}

      {activeTab === "myRequests" && userLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            />
            {emergencyData.map(
              (data) =>
                data.location && (
                  <Marker
                    key={data._id}
                    coordinate={{
                      latitude: data.location.latitude || 0,
                      longitude: data.location.longitude || 0,
                    }}
                    title={data.helpType}
                    description={data.name}
                    pinColor="#DC2626"
                  />
                )
            )}
          </MapView>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        {activeTab === "myRequests" ? "Your Requests" : "Emergency News"}
      </Text>

      <FlatList
        data={activeTab === "myRequests" ? emergencyData : newsData}
        keyExtractor={(item) =>
          activeTab === "myRequests"
            ? item._id?.toString()
            : item.id?.toString() || item.title
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0284c7"]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0284c7" />
            </View>
          ) : (
            <Text style={styles.noDataText}>
              {activeTab === "myRequests"
                ? "No emergency requests available"
                : "No news available"}
            </Text>
          )
        }
      />

      {/* Show Emergency Details */}
      {selectedEmergency && (
        <Details
          emergencyData={selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          onDelete={handleDeleteEmergency}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#0284c7",
  },
  tabText: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  activeTabText: {
    color: "#fff",
  },
  requestHelpButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  requestHelpText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  newsSource: {
    fontSize: 12,
    color: "#0284c7",
    fontWeight: "bold",
  },
  newsDate: {
    fontSize: 12,
    color: "#888",
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    paddingVertical: 20,
  },
});

export default Emergency;
