export enum InputType {
    SHAKE,
    TAP,
    ACCELEROMETER,
    GYROSCOPE
}

export type Input = {
    inputType: InputType,
    rawData?: { x: number, y: number, z: number },
    count?: { count: number },
    hasTapped?: { hasTapped: boolean }
}
