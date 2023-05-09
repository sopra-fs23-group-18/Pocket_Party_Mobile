import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { Platform } from "react-native";
import { Subscription} from "rxjs";
import { map, filter } from "rxjs/operators";



var subscription: Subscription | null = null;

export const listenForShake = (onShake: () => void) => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    var oldAcc = 0;
    var currentAcc = 0;
    var acceleration = 0;
    const correctionFactor = (Platform.OS === 'ios' ? 9.8 : 1)
    subscription = accelerometer
        .pipe(
            map(({ x, y, z }) => {
                x *= correctionFactor;
                y *= correctionFactor;
                z *= correctionFactor;
                return Math.sqrt(x * x + y * y + z * z)}),
            filter((acc: number, _) => {
                oldAcc = currentAcc;
                currentAcc = acc;
                const delta = currentAcc - oldAcc;
                acceleration = acceleration * 0.9 + delta;
                return acceleration > 12;
            }))
        .subscribe(
            _ => onShake(),
            err => console.log(`Can't read from the accelerometer: ${err}`))
}

export const stopInputReading = () => {
    if (subscription) {
        subscription.unsubscribe();
        console.log("Stoped reading input");

    }
}

// Input for Pong game
export const listenForPongInput = (onPongInput: (input: number) => void) => {
  const ROTATION_THRESHOLD = 3;

  setUpdateIntervalForType(SensorTypes.gyroscope, 100);
  subscription = gyroscope
    .pipe(
      map(({ x }) => x),
      filter((x: number) => Math.abs(x) > ROTATION_THRESHOLD)
    )
    .subscribe((currentAngularVelocity) => {
      // Determine the Pong input based on the angular velocity
      if (currentAngularVelocity < -ROTATION_THRESHOLD) {
        onPongInput(1);
      } else if (currentAngularVelocity > ROTATION_THRESHOLD ) {
        onPongInput(-1);
      }
    });
};



  