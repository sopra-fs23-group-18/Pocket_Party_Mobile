export enum InputType {
    SHAKE,
    TAP,
    PONG,
    RPS,
    STRATEGY,
    ACCELEROMETER,
    GYROSCOPE,
    VOTE
}

export type Input = {
    inputType: InputType,
    rawData?: { x: number, y: number, z: number },
    hasTapped?: { hasTapped: boolean },
    voteOption?: number, 
}
