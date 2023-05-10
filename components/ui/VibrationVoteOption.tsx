import React from "react";
import { Circle, Polygon, Rect, Svg } from "react-native-svg";
import { TouchableOpacity } from "react-native";
export enum VibrationEnum {
    VIB_ONE,
    VIB_TWO,
    VIB_THREE

}

type VibrationVoteOptionProp = {
    vibration: VibrationEnum;
    onVote: (vibration: VibrationEnum) => void;
}

const ShapeOne = (): JSX.Element => {
    return (<Svg 
        width={100}
        height={100}
        fill="none">
        <Rect  x={0} y={0} width={100} height={100} fill="#00ffff" />
    </Svg>)
}
const ShapeTwo = (): JSX.Element => {
    return (<Svg 
        width={100}
        height={100}
        fill="none">
        <Circle cx={50} cy={50} r={50} fill="rgb(132, 0, 255)" />
    </Svg>)
}

const ShapeThree = (): JSX.Element => {
    return (<Svg 
        width={100}
        height={100}
        fill="none">
        <Polygon points="50,0 100,100 0,100" fill="#70DB8E" />
    </Svg>)
}

export const VibrationVoteOption = (props: VibrationVoteOptionProp): JSX.Element => {
    const {vibration ,onVote} = props;

    const getShape = (vibration: VibrationEnum) : JSX.Element => {
        switch (vibration) {
            case VibrationEnum.VIB_ONE:
                return ShapeOne();
            case VibrationEnum.VIB_TWO:
                return ShapeTwo();
            case VibrationEnum.VIB_THREE:
                return ShapeThree();
        }
    }

    return (
    <TouchableOpacity onPress={() => onVote(vibration)}>
        {getShape(vibration)}
    </TouchableOpacity>);

}