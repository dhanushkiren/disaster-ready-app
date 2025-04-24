import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Credits = () => {
  const developers = [
    { name: 'Dhanush kiren R', role: 'Lead Developer' },
    { name: 'Ganeshkumar S', role: 'Backend Engineer' },
    { name: 'Vishalkumar S', role: 'UI/UX Designer' }
  ];

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Credits</Text>
        <View style={styles.underline} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subHeaderText}>Our Amazing Team</Text>
        
        {developers.map((dev, index) => (
          <View key={index} style={styles.developerCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{dev.name.charAt(0)}</Text>
            </View>
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>{dev.name}</Text>
              <Text style={styles.developerRole}>{dev.role}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.footerContainer}>
        {/* <TouchableOpacity 
          style={styles.button}
          onPress={() => Linking.openURL('https://yourappdomain.com')}
        >
          <Text style={styles.buttonText}>Visit Our Website</Text>
        </TouchableOpacity> */}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0</Text>
          <Text style={styles.copyrightText}>© 2025 All Rights Reserved</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5
  },
  underline: {
    height: 4,
    width: 100,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 2
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  },
  subHeaderText: {
    fontSize: 22,
    color: '#E0E0E0',
    marginBottom: 30,
    fontWeight: '600'
  },
  developerCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998'
  },
  developerInfo: {
    flex: 1
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  developerRole: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20
  },
  buttonText: {
    color: '#3b5998',
    fontSize: 16,
    fontWeight: 'bold'
  },
  versionContainer: {
    alignItems: 'center'
  },
  versionText: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 5
  },
  copyrightText: {
    color: '#E0E0E0',
    fontSize: 12,
    opacity: 0.8
  }
});

export default Credits;