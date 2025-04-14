import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

const NewsDetail = ({ newsItem, onClose }) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* News title */}
        <Text style={styles.title}>{newsItem.title}</Text>

        {/* Source and date */}
        <View style={styles.metaContainer}>
          <Text style={styles.source}>{newsItem.source?.name}</Text>
          <Text style={styles.date}>{formatDate(newsItem.publishedAt)}</Text>
        </View>

        {/* Image if available */}
        {newsItem.urlToImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: newsItem.urlToImage }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content */}
        {newsItem.description && (
          <Text style={styles.description}>{newsItem.description}</Text>
        )}

        {/* Full content */}
        {newsItem.content && (
          <Text style={styles.content}>{newsItem.content}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 15,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: "#0284c7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  source: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0284c7",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  imageContainer: {
    height: 250,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    lineHeight: 22,
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 20,
  },
});

export default NewsDetail;
