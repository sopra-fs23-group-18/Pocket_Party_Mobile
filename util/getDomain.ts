import {Platform} from 'react-native';
import {isProduction} from './isProduction';

export const getWsUrl = () => {
  const prodUrl = 'wss://sopra-fs23-group-18-server.oa.r.appspot.com';
  const devUrl =
    Platform.OS === 'android'
      ? 'ws://192.168.1.246:8080'
      : 'ws://Naseems-MacBook-Pro.local:8080';
  return isProduction() ? prodUrl : devUrl;
};
