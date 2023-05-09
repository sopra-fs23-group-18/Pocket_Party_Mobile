import { View, StyleSheet, Animated, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';
interface Props {
    size: number;
    value: number;
  }
  
 export const PongGlyph = ({ size, value }: Props) => {
    const angle = -value * 45; // Convert value to angle in degrees
  
    return (
      <View style={[styles.container, { position: 'absolute', bottom: 0 }]}>
        <Svg width={size} height={size}>
          <Line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2}
            y2={size / 2 - size / 4}
            stroke="black"
            strokeWidth={5}
            strokeLinecap="round"
            transform={`rotate(${angle} ${size / 2} ${size / 2})`} // Rotate line based on angle
          />
        </Svg>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
  

