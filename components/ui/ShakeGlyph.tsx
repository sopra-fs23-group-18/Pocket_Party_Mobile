import React from "react"
import Svg, { Rect } from "react-native-svg"

export const ShakeGlyph = (props: any) => (
  <Svg
    width={199}
    height={257}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={0.652}
      y={0.304}
      width={118.29}
      height={231.877}
      rx={9.5}
      transform="matrix(.94529 -.32624 .35836 .93358 -.073 39.15)"
      stroke="#000"
      strokeOpacity={0.2}
    />
    <Rect
      x={0.652}
      y={0.304}
      width={94.432}
      height={185.111}
      rx={9.5}
      transform="matrix(.94529 -.32624 .35836 .93358 18.584 56.614)"
      stroke="#000"
      strokeOpacity={0.2}
    />
    <Rect
      x={74.497}
      y={9.721}
      width={119}
      height={243}
      rx={9.5}
      transform="rotate(-1 74.497 9.72)"
      stroke="#000"
    />
    <Rect
      x={85.923}
      y={33.507}
      width={95}
      height={194}
      rx={9.5}
      transform="rotate(-1 85.923 33.507)"
      stroke="#000"
    />
  </Svg>
)
