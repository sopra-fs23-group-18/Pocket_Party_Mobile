import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import NumberInputField from '../components/NumberInputfield';

export default class QRScanner extends Component {
  onSuccess = (e: { data: string; }) => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        reactivateTimeout={3000}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Scan the QR-Code on the Pocket-Party host device!
          </Text>
        }
        bottomContent={
          <NumberInputField />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    fontFamily: 'Outfit',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#53A57D'
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
