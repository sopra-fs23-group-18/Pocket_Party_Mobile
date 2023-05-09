import { Platform } from "react-native"
import { isProduction } from "./isProduction"

export const getWsUrl = () => {
    const prodUrl = 'wss://sopra-fs23-group-18-server.oa.r.appspot.com'
    const devUrl = "ws://localhost:8080" //"ws://10.0.2.2:8080" for android emulator
    return isProduction() ? prodUrl : devUrl
  }