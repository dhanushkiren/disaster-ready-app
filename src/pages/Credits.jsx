import React from 'react'
import { View, Text } from 'react-native'

const Credits = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Credits Page</Text>
      <Text style={{ marginTop: 10,textAlign: 'center' }}>Developed Dhanush kiren , Ganeshkumar and Vishalkumar</Text>
      <Text style={{ marginTop: 5 }}>Version 1.0</Text>
    </View>
  )
}

export default Credits