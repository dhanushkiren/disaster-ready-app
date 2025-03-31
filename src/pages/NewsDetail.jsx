// NewsDetail.js
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
        {newsItem.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: newsItem.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content */}
        <Text style={styles.description}>{newsItem.description}</Text>
        <Text style={styles.content}>{newsItem.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#0284c7",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    color: "#0284c7",
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  imageContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 16,
    lineHeight: 24,
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});

export default NewsDetail;
