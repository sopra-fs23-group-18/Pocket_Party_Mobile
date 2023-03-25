import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShakeGlyph } from "../components/ShakeGlyph";
import { listenForShake, stopInputReading } from "../util/InputHandler";


export const ShakeScreen = (): JSX.Element => {
    const onShake = () => {
        console.log("Shake detectd");
    }

    useEffect(() => {
        listenForShake(onShake);
        //unmount 
        return () => {
            stopInputReading();
        }
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>Shake</Text>
            <ShakeGlyph/> 
        </View>)
}

const styles = StyleSheet.create({
    title: {
        position: "absolute",
        width: 195,
        height: 72,
        top: 50,

        fontFamily: 'Quicksand',
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 40,
        lineHeight: 50,
        textAlign: "center",

        color: "#53A57D",
    }
})