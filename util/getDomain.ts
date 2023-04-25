import { Platform } from "react-native"
import { isProduction } from "./isProduction"

export const getWsUrl = () => {
    const prodUrl = 'wss://sopra-fs23-group-18-server.oa.r.appspot.com'
    const devUrl = 'ws://10.28.241.184:8080' //'ws://10.28.241.184:8080' //ws:192.168.1.246:8080'
    return isProduction() ? prodUrl : devUrl
  }