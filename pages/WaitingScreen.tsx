import { SvgXml } from "react-native-svg";
import { View, StyleSheet, Animated, Easing } from "react-native";

const WaitingScreen = ({ route }: { route: any }) => {
    const { avatar } = route.params;
    const spinValue = new Animated.Value(0);

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <SvgXml xml={avatar} style={styles.avatar} />
            <View style={styles.loader}>
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateY: -90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateY: 90 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -60 }, { translateY: -60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 60 }, { translateY: -60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: -60 }, { translateY: 60 }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.loaderItem,
                        { transform: [{ rotate: spin }, { translateX: 60 }, { translateY: 60 }] },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#53A57D"
    },
    avatar: {
        width: 100,
        height: 100,
    },
    loader: {
        position: "absolute",
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    loaderItem: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "pink",
    },
});

export default WaitingScreen;
