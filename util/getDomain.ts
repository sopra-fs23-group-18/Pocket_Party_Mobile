import { Platform } from "react-native"
import { isProduction } from "./isProduction"

export const getWsUrl = () => {
    const prodUrl = 'wss://my-server-url.oa.r.appspot.com/' // TODO: insert your prod url for server (once deployed)
    const devUrl = Platform.OS === "android" ? 'ws://localhost:8080' : 'ws://localhost:8080';
    return isProduction() ? prodUrl : devUrl
  }