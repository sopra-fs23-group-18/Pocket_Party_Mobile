import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { Subscription } from "rxjs";
import { map, filter } from "rxjs/operators"; 


var subscription: Subscription | null  = null;

export const listenForShake = (onShake: () => void) => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); 
    var oldAcc = 0;
    var currentAcc = 0;
    var acceleration = 0;
    subscription = accelerometer.pipe(
        map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)),
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
    if(subscription){
        subscription.unsubscribe();
        console.log("Stoped reading input");
        
    }
}