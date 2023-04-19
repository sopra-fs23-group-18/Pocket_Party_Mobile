import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

type Props = {
    scannedCode: string;
};

const NumberInputField = ({ scannedCode }: Props) => {
    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (scannedCode != '') {
            setValue(parseInt(scannedCode));
        }
    }, [scannedCode]);

    const handleTextChange = (text: string) => {
        const parsedValue = parseInt(text);
        if (!isNaN(parsedValue)) {
            setValue(parsedValue);
            const length = value?.toString().length;
            if (length == 6) {
                //TODO Sven: set right number
                //TODO Sven: send number to backend for joining lobby
            }
        } else {
            setValue(undefined);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter your code"
                placeholderTextColor={'#ffffff'}
                value={value?.toString() ?? ''}
                onChangeText={handleTextChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: Dimensions.get('window').height / 18,
        width: '80%',
        borderWidth: 1,
        borderColor: '#ffffff',
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#53A57D',
        marginVertical: 10,
        color: '#ffffff',
    },
});

export default NumberInputField;
