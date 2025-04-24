import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = ({ user }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(user);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/chat")
      .then((response) => setChatMessages(response.data))
      .catch((error) => console.error(error));

    socket.on("message", (msg) => {
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("message", newMessage);
      axios
        .post("http://localhost:5000/api/chat", {
          text: newMessage,
          user: loggedInUser,
          editable: true,
        })
        .then((response) =>
          console.log("Message sent: ", response.data.message)
        )
        .catch((error) => console.error("Error: ", error));
      setNewMessage("");
    }
  };

  const deleteMessage = (messageId) => {
    axios
      .delete(`http://localhost:5000/api/chat/${messageId}`)
      .then((response) =>
        console.log("Message deleted: ", response.data.message)
      )
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Chat</Text>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              {item.text} - {item.user}
            </Text>
            {loggedInUser && loggedInUser === item.user && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteMessage(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  messageText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Chat;
