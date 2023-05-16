export enum InputType {
    SHAKE,
    TAP,
    PONG,
    RPS,
    ACCELEROMETER,
    GYROSCOPE
}

export type Input = {
    inputType: InputType,
    rawData?: { x: number, y: number, z: number },
    hasTapped?: { hasTapped: boolean },
    degree?: { degree: number }
}
