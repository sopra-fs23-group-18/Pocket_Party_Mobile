import { NavigationProp, NavigatorScreenParams, TypedNavigator } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps, } from "@react-navigation/native-stack/lib/typescript/src/types";
import React from "react";
import { Button, Text, View } from "react-native";


// type JoinScreenProps = {
//     navigation: NativeStackScreenProps<any>,
// }

export const JoinScreen = (props: NativeStackScreenProps<any>): JSX.Element => {
    const { navigation } = props;

    const onButtonPress = (_: Event) => {
        navigation.navigate('Shake');
    }
    const goToTap = (_: Event) => {
        navigation.navigate('Tap');
    }

    const goToWebRTC = (_: Event) => {
        navigation.navigate('WebRTC');
    }

    const goToQRScanner = (_: Event) => {
        navigation.navigate('QRScanner');
        
    const goToNIS = (_: Event) => {
        navigation.navigate('NameInputScreen');
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Go to shake detection" onPress={onButtonPress} />
            <Button title="Go to WebRTC demo" onPress={goToWebRTC} />
            <Button title="Go to Tap" onPress={goToTap} />
            <Button title="Go to QRScanner" onPress={goToQRScanner} />
            <Button title="Go to NameInputScreen" onPress={goToNIS} />

        </View>)
}
