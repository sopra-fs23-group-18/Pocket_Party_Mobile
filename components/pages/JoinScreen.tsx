import {NativeStackScreenProps, } from "@react-navigation/native-stack/lib/typescript/src/types";
import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { Button } from "../ui/Button";


// type JoinScreenProps = {
//     navigation: NativeStackScreenProps<any>,
// }

export const JoinScreen = (props: NativeStackScreenProps<any>): JSX.Element => {
    const { navigation } = props;

    const onButtonPress = (_: GestureResponderEvent) => {
        navigation.navigate('Shake');
    }
    const goToTap = (_: GestureResponderEvent) => {
        navigation.navigate('Tap');
    }

    const goToWebRTC = (_: GestureResponderEvent) => {
        navigation.navigate('WebRTC');
    }

    const goToQRScanner = () => {
        navigation.navigate('QRScanner');
    }
    const goToNIS = (_: GestureResponderEvent) => {
        navigation.navigate('NameInputScreen');
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <Button onPress={goToQRScanner} text="Join a game"/>
        </View>)
};
