import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';


export const TapScreen = (): JSX.Element => {
    var counter = 0;

    const sendTappingToWeb = (_: Event) => {
        counter++;
        console.log("Send tapping to web. Count: " + counter);
    } 
    return (
        <View style={styles.screen}>
      <TouchableOpacity
        onPress={sendTappingToWeb}
        style={styles.fullScreenButton}>
        <Text style = {styles.bigBlue}>Tap</Text>
      </TouchableOpacity>
    </View>)
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 80,
      },
    
    fullScreenButton: {
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'orange',
    },
  });
  