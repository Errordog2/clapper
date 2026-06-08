import { describe, expect, it } from "bun:test"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "../src/hooks/useTimeline"
import { getDefaultState } from "../src/utils/getDefaultState"

describe("timeline track and clip creation", () => {
  it("creates an empty track and recomputes timeline content", () => {
    useTimeline.setState(getDefaultState(), true)

    const trackId = useTimeline.getState().createTrack({
      name: "Dialogue",
      category: ClapSegmentCategory.DIALOGUE,
    })

    const state = useTimeline.getState()
    expect(trackId).toBe(0)
    expect(state.tracks[trackId].name).toBe("Dialogue")
    expect(state.tracks[trackId].occupied).toBe(false)
    expect(state.contentHeight).toBeGreaterThan(0)
  })

  it("creates a clip on a new track when no track is requested", async () => {
    useTimeline.setState(getDefaultState(), true)

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      startTimeInMs: 1000,
      durationInMs: 2500,
      label: "Door knock",
    })

    const state = useTimeline.getState()
    expect(state.segments).toHaveLength(1)
    expect(state.segments[0].id).toBe(clip.id)
    expect(clip.track).toBe(0)
    expect(clip.startTimeInMs).toBe(1000)
    expect(clip.endTimeInMs).toBe(3500)
    expect(state.tracks[clip.track].name).toBe("SOUND")
  })

  it("reuses an existing same-category track when it has room", async () => {
    useTimeline.setState(getDefaultState(), true)
    const trackId = useTimeline.getState().createTrack({
      name: "IMAGE",
      category: ClapSegmentCategory.IMAGE,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.IMAGE,
      startTimeInMs: 1000,
      durationInMs: 1000,
      label: "Storyboard frame",
    })

    const state = useTimeline.getState()
    expect(clip.track).toBe(trackId)
    expect(state.tracks[trackId].occupied).toBe(true)
    expect(state.segments[0].track).toBe(trackId)
  })

  it("creates a clip on a requested track and materializes missing tracks", async () => {
    useTimeline.setState(getDefaultState(), true)

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.IMAGE,
      track: 4,
      label: "Storyboard frame",
    })

    const state = useTimeline.getState()
    expect(clip.track).toBe(4)
    expect(state.tracks[4].name).toBe("IMAGE")
    expect(state.tracks[4].isPreview).toBe(true)
    expect(state.segments[0].track).toBe(4)
  })
})
