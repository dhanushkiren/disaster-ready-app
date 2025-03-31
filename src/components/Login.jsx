import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation } from "@react-navigation/native";

const Login = ({ setUser, showRegistration }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/auth/login", loginData)
      .then((response) => {
        console.log(response.data.message);
        setUser(loginData.username);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.label}>Username or Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Username or Email"
        value={loginData.username}
        onChangeText={(text) => setLoginData({ ...loginData, username: text })}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={loginData.password}
        onChangeText={(text) => setLoginData({ ...loginData, password: text })}
      />
      <View style={styles.rememberContainer}>
        <CheckBox value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.rememberText}>Remember me</Text>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/94d04b0d749df12e17f3c92bc5ef1c9fd999046fd1915f961de04a35a8617ddc?",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account?</Text>
      <TouchableOpacity onPress={showRegistration}>
        <Text style={styles.signupLink}>Sign up now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  rememberText: {
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
  },
  signupLink: {
    color: "blue",
    fontWeight: "bold",
  },
});

export default Login;
