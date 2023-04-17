import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';

const NameInputScreen = () => {
    const [name, setName] = useState('');

    const handleNameChange = (text: string) => {
        setName(text);
    };

    const handleReadyPress = () => {
        console.log('Button pressed');
        //TODO Sven: add functionality to button
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choose a nickname</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={handleNameChange}
            />
            <TouchableOpacity style={styles.button} onPress={handleReadyPress}>
                <Text style={styles.buttonText}>Ready</Text>
            </TouchableOpacity>
        </View>
    );
};
//TODO Sven: add icon
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    label: {
        fontFamily: 'Outfit',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        color: '#53A57D',
    },
    input: {
        width: '80%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
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
        fontFamily: 'Outfit',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 32,
        lineHeight: 40,
        color: '#FFFFFF',
    },
});

export default NameInputScreen;
