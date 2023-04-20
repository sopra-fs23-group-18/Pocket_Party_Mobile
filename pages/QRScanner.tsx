import React, { Component, useState } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import NumberInputField from '../components/NumberInputfield';
import { Dimensions } from 'react-native';

export const QRScanner = (): JSX.Element => {
  const [scannercode, setScannercode] = useState('')

  const onSuccess = (e: { data: string; }) => {
    setScannercode(e.data);
  };


  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivateTimeout={3000}
      flashMode={RNCamera.Constants.FlashMode.auto}
      topContent={
        <Text style={styles.centerText}>
          Scan the QR-Code on the Pocket-Party host device!
        </Text>
      }
      bottomContent={
        <NumberInputField scannedCode={scannercode} />
      }
    />
  );

}

const styles = StyleSheet.create({
  centerText: {
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#53A57D',
    width: Dimensions.get('window').width / 2,
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
