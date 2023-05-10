export enum InputType {
    SHAKE,
    TAP,
    PONG,
    ACCELEROMETER,
    GYROSCOPE,
    VOTE
}

export type Input = {
    inputType: InputType,
    rawData?: { x: number, y: number, z: number },
    hasTapped?: { hasTapped: boolean },
    degree?: { degree: number },
    voteOption?: number, 
}
