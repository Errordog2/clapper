import { Plane } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

import {
  useTimeline
} from "@/hooks"

import { Cells } from "./Cells"
import { Cursor } from "./Cursor"
import { Grid } from "./Grid"
import { LeftBarTrackScale } from "./LeftBarTrackScale"
import { TopBarTimeScale } from "./TopBarTimeScale"

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimeline(s => s.setContainerSize)
  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

  const contentHeight = useTimeline(s => s.contentHeight)
  const contentWidth = useTimeline(s => s.contentWidth)
  const cellWidth = useTimeline(s => s.cellWidth)
  const durationInMsPerStep = useTimeline(s => s.durationInMsPerStep)
  const createClip = useTimeline(s => s.createClip)

  // console.log(`re-rendering <Timeline>`)
  return (
    <mesh
      position={[0,0,0]}
    >
      <Plane
        args={[contentWidth, contentHeight]}
        position={[
          -(size.width / 2),
          0,
          -1
        ]}
        onDoubleClick={(event) => {
          event.stopPropagation()
          if (!cellWidth || !durationInMsPerStep) { return }
          const cursorX = event.point.x + (width / 2)
          const startTimeInMs = Math.max(0, (cursorX / cellWidth) * durationInMsPerStep)
          void createClip({ startTimeInMs })
        }}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
        />
        <Grid />
        <TopBarTimeScale />
        <LeftBarTrackScale />
        <Cells />
        <Cursor />
      </Plane>
    </mesh>
  );
};
