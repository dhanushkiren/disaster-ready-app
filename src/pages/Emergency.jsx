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
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import Toast from "react-native-toast-message";
import axios from "axios";
import Details from "./Details";
import RequestForm from "./RequestForm";
import NewsDetail from "./NewsDetail";
import * as Location from "expo-location";
import { sampleNewsData } from "../utils/SampleData";

const Emergency = () => {
  const [emergencyData, setEmergencyData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("myRequests");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [page, setPage] = useState(1); // Added state for page
  const [newsLoading, setNewsLoading] = useState(false); // To handle loading state when fetching more news

  useEffect(() => {
    fetchEmergencyData();
    initializeLocationServices();
    if (activeTab === "news") {
      fetchNews(page); // Load news on first load
    }
  }, [activeTab]);

  const initializeLocationServices = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      fetchUserLocation();
    } catch (error) {
      console.error("Error initializing location services:", error);
      setLocationPermission(false);
    }
  };

  const fetchUserLocation = async () => {
    try {
      if (!locationPermission) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (location && location.coords) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  // New function to handle the "Get Location" button press
  const handleGetLocation = (item) => {
    if (!userLocation || !item.exactLocation) return;

    // Only update routeCoordinates but don't change selectedEmergency here
    const emergencyLocation = {
      latitude: item.exactLocation.lat,
      longitude: item.exactLocation.lon,
    };

    setRouteCoordinates([userLocation, emergencyLocation]);
  };

  const handleLocation = (item) => {
    if (!userLocation || !item.exactLocation) return;

    setSelectedEmergency(item); // Set selectedEmergency only when "Show Route" is clicked

    const emergencyLocation = {
      latitude: item.exactLocation.lat,
      longitude: item.exactLocation.lon,
    };

    setRouteCoordinates([userLocation, emergencyLocation]); // Set route coordinates
  };

  const fetchEmergencyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://192.168.157.85:8080/api/request/accepted"
      );
      setEmergencyData(response.data);
    } catch (error) {
      console.error("Error fetching emergency data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNews = async (page) => {
    try {
      setNewsLoading(true); // Set news loading state to true
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=health&page=${page}&apiKey=f8765b8cf96242e3b9f0944a5a30238c`
      );

      if (response.data?.articles) {
        setNewsData((prevData) => [...prevData, ...response.data.articles]); // Append new data to existing data
      } else {
        setNewsData(sampleNewsData);
      }
    } catch (error) {
      // console.error("Error fetching news:", error);
      setNewsData(sampleNewsData);
    } finally {
      setNewsLoading(false); // Reset news loading state
      setRefreshing(false);
    }
  };

  const onEndReached = () => {
    if (!newsLoading) {
      // Avoid multiple requests while already loading
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        fetchNews(newPage); // Fetch next page
        return newPage;
      });
    }
  };

  const handleDeleteEmergency = async () => {
    console.log("delete id : ",selectedEmergency.id);
    try {
      await axios.delete(
        `http://192.168.157.85:8080/api/requests/${selectedEmergency.id}`
      );
      setEmergencyData((prev) =>
        prev.filter((data) => data.id !== selectedEmergency.id)
      );
      setSelectedEmergency(null);
      setRouteCoordinates([]); // Clear route coordinates when emergency is deleted
       Toast.show({ type: "success", text1: "Emergency request deleted successfully..👍" });

    } catch (error) {
      console.error("Error deleting emergency:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === "myRequests") {
      fetchEmergencyData();
      fetchUserLocation();
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
            <Text style={styles.details}>
              Location:{" "}
              {item.exactLocation
                ? `Lat: ${item.exactLocation.lat}, Lon: ${item.exactLocation.lon}`
                : "Not Provided"}
            </Text>
            <Text style={styles.status}>
              Status:{" "}
              <Text style={getStatusStyle(item.status)}>
                {item.status || "Pending"}
              </Text>
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLocation(item)} // "Show Route" button
              >
                <Text style={styles.buttonText}>Show Route</Text>
              </TouchableOpacity>

              {/* New "Get Location" button, doesn't trigger setting selectedEmergency */}
              <TouchableOpacity
                style={[styles.button, styles.getLocationButton]}
                onPress={() => handleGetLocation(item)} // "Get Location" button
              >
                <Text style={styles.buttonText}>Get Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
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
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />

            {emergencyData.map(
              (data, index) =>
                data.exactLocation && (
                  <React.Fragment key={data.id || index}>
                    <Marker
                      coordinate={{
                        latitude: data.exactLocation.lat,
                        longitude: data.exactLocation.lon,
                      }}
                      title={data.helpType}
                      description={data.name}
                      pinColor="#DC2626"
                      onPress={() => handleLocation(data)}
                    />
                    <Circle
                      center={userLocation}
                      radius={20 * 100}
                      strokeColor="rgba(135,206,235,0.8)"
                      fillColor="rgba(135,206,235,0.35)"
                    />
                  </React.Fragment>
                )
            )}

            {/* Draw Route using Polyline */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="blue"
                strokeWidth={4}
              />
            )}
          </MapView>
        </View>
      )}

      {activeTab === "myRequests" && !userLocation && (
        <View style={styles.locationWarning}>
          <Text style={styles.locationWarningText}>
            Location services are unavailable. Some features will be limited.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        {activeTab === "myRequests" ? "Your Requests" : "Emergency News"}
      </Text>

      <FlatList
        data={activeTab === "myRequests" ? emergencyData : newsData}
        keyExtractor={(item, index) =>
          `${item.url || item.title || `news-${index}`} - ${index}`
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
        onEndReached={onEndReached} // Trigger when reaching the end of the list
        onEndReachedThreshold={0.9} // Load more when the list is 50% from the bottom
      />

      {selectedEmergency && (
        <Details
          emergencyData={selectedEmergency}
          userLocation={userLocation} // Pass userLocation to Details
          onClose={() => {
            setSelectedEmergency(null);
            setRouteCoordinates([]); // Clear route when closing details
          }}
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
  locationWarning: {
    backgroundColor: "#FEF3C7",
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  locationWarningText: {
    color: "#92400E",
    textAlign: "center",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5,
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
