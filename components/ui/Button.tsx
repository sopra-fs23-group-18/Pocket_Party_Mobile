import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native/";

type ButtonProps = {
    onPress: () => void,
    text: string
}

export const Button = (props: ButtonProps): JSX.Element => {
    const { onPress, text } = props
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        width: 0.8 * Dimensions.get('window').width,
        height: 0.1 * Dimensions.get('window').height,
        borderRadius: 13,
        backgroundColor: '#53A57D',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.05 * Dimensions.get('window').height,
        position: 'absolute',
        bottom: 0.1 * Dimensions.get('window').height,
    },
    buttonText: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 32,
        lineHeight: 40,
        color: '#FFFFFF',
    },
});
