import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {Platform} from 'react-native';
import {Subscription} from 'rxjs';
import {map, filter} from 'rxjs/operators';

var subscription: Subscription | null = null;

export const listenForShake = (onShake: () => void) => {
  setUpdateIntervalForType(SensorTypes.accelerometer, 100);
  var oldAcc = 0;
  var currentAcc = 0;
  var acceleration = 0;
  const correctionFactor = Platform.OS === 'ios' ? 9.8 : 1;
  subscription = accelerometer
    .pipe(
      map(({x, y, z}) => {
        x *= correctionFactor;
        y *= correctionFactor;
        z *= correctionFactor;
        return Math.sqrt(x * x + y * y + z * z);
      }),
      filter((acc: number, _) => {
        oldAcc = currentAcc;
        currentAcc = acc;
        const delta = currentAcc - oldAcc;
        acceleration = acceleration * 0.9 + delta;
        return acceleration > 12;
      }),
    )
    .subscribe(
      _ => onShake(),
      err => console.log(`Can't read from the accelerometer: ${err}`),
    );
};

export const stopInputReading = () => {
  if (subscription) {
    subscription.unsubscribe();
    console.log('Stoped reading input');
  }
};

// Input for Pong game
export const listenForPongInput = (onPongInput: (input: number) => void) => {
  const ROTATION_THRESHOLD = 2;

  setUpdateIntervalForType(SensorTypes.gyroscope, 100);
  subscription = gyroscope
    .pipe(
      map(({z}) => z),
      filter((z: number) => Math.abs(z) > ROTATION_THRESHOLD),
    )
    .subscribe(currentAngularVelocity => {
      // Determine the Pong input based on the angular velocity
      if (currentAngularVelocity < -ROTATION_THRESHOLD) {
        onPongInput(1);
      } else if (currentAngularVelocity > ROTATION_THRESHOLD) {
        onPongInput(-1);
      }
    });
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};
export const listenForNavigationInput = (onInput: (vec: Vector3) => void) => {
  // const NS2S: number = 1.0 / 1000000000.0;
  // const EPSILON: number = 0.000001;

  // let timestamp: number = 0.0;
  // let deltaRotationVector: number[] = [0.0, 0.0, 0.0, 1.0];

  setUpdateIntervalForType(SensorTypes.gyroscope, 100);
  subscription = gyroscope.subscribe(o => onInput({x: o.x, y: o.y, z: o.z}));
  // subscription = gyroscope.subscribe(event => {
  //   // This timestep's delta rotation to be multiplied by the current rotation
  //   // after computing it from the gyro sample data.
  //   if (timestamp !== 0 && event !== null) {
  //     const dT: number = (event.timestamp - timestamp) * NS2S;
  //     // Axis of the rotation sample, not normalized yet.
  //     let axisX: number = event.x;
  //     let axisY: number = event.y;
  //     let axisZ: number = event.z;

  //     // Calculate the angular speed of the sample
  //     const omegaMagnitude: number = Math.sqrt(
  //       axisX * axisX + axisY * axisY + axisZ * axisZ,
  //     );

  //     // Normalize the rotation vector if it's big enough to get the axis
  //     // (that is, EPSILON should represent your maximum allowable margin of error)
  //     if (omegaMagnitude > EPSILON) {
  //       axisX /= omegaMagnitude;
  //       axisY /= omegaMagnitude;
  //       axisZ /= omegaMagnitude;
  //     }

  //     // Integrate around this axis with the angular speed by the timestep
  //     // in order to get a delta rotation from this sample over the timestep
  //     // We will convert this axis-angle representation of the delta rotation
  //     // into a quaternion before turning it into the rotation matrix.
  //     const thetaOverTwo: number = (omegaMagnitude * dT) / 2.0;
  //     const sinThetaOverTwo: number = Math.sin(thetaOverTwo);
  //     const cosThetaOverTwo: number = Math.cos(thetaOverTwo);
  //     deltaRotationVector[0] = sinThetaOverTwo * axisX;
  //     deltaRotationVector[1] = sinThetaOverTwo * axisY;
  //     deltaRotationVector[2] = sinThetaOverTwo * axisZ;
  //     deltaRotationVector[3] = cosThetaOverTwo;
  //   }
  //   timestamp = event?.timestamp ? event.timestamp * 1.0 : 0.0;
  //   const deltaRotationMatrix: number[] = Array(9).fill(0);
  //   getRotationMatrixFromVector(deltaRotationMatrix, deltaRotationVector);

  // });
};

// function getRotationMatrixFromVector(
//   matrix: number[],
//   rotationVector: number[],
// ): void {
//   const q0: number = rotationVector[3];
//   const q1: number = rotationVector[0];
//   const q2: number = rotationVector[1];
//   const q3: number = rotationVector[2];

//   const sq_q1: number = 2 * q1 * q1;
//   const sq_q2: number = 2 * q2 * q2;
//   const sq_q3: number = 2 * q3 * q3;
//   const q1_q2: number = 2 * q1 * q2;
//   const q3_q0: number = 2 * q3 * q0;
//   const q1_q3: number = 2 * q1 * q3;
//   const q2_q0: number = 2 * q2 * q0;
//   const q2_q3: number = 2 * q2 * q3;
//   const q1_q0: number = 2 * q1 * q0;

//   matrix[0] = 1 - sq_q2 - sq_q3;
//   matrix[1] = q1_q2 - q3_q0;
//   matrix[2] = q1_q3 + q2_q0;

//   matrix[3] = q1_q2 + q3_q0;
//   matrix[4] = 1 - sq_q1 - sq_q3;
//   matrix[5] = q2_q3 - q1_q0;

//   matrix[6] = q1_q3 - q2_q0;
//   matrix[7] = q2_q3 + q1_q0;
//   matrix[8] = 1 - sq_q1 - sq_q2;
// }
