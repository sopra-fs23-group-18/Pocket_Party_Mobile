import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');

  const onScanSuccess = (e: { data: React.SetStateAction<string>; }) => {
    setScanResult(e.data);
  };
  //TODO: do sth with scanresult
  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onScanSuccess}
        reactivate={true}
        reactivateTimeout={5000}
        showMarker={true}
        markerStyle={styles.markerStyle}
        cameraStyle={styles.cameraStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerStyle: {
    borderColor: '#FFF',
    borderRadius: 10,
  },
  cameraStyle: {
    height: '100%',
  },
});

export default QRScanner;
