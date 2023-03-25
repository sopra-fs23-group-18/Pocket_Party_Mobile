import { NavigationProp, NavigatorScreenParams, TypedNavigator } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps,  } from "@react-navigation/native-stack/lib/typescript/src/types";
import React from "react";
import { Button, Text, View } from "react-native";


// type JoinScreenProps = {
//     navigation: NativeStackScreenProps<any>,
// }

export const JoinScreen = (props: NativeStackScreenProps<any>): JSX.Element => {
    const {navigation} = props;

    const onButtonPress = (_: Event) => {
        navigation.navigate('Shake');
    } 

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Go to shake detection" onPress={onButtonPress}/>
        </View>)
}