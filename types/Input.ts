export enum InputType{
    SHAKE,
    ACCELEROMETER,
    GYROSCOPE
}

export type Input = {
    inputType: InputType,
    rawData?: {x: number, y: number, z: number}
}