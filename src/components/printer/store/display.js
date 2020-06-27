import { useStoreon } from "storeon/preact"

export default store => {
    store.on("@init", () => ({
        showTemperatures: false,
        showFlow: false,
        showFeedRate: false,
        showFans: false,
        showExtruders: false,
    }))
    store.on("panel/showtemperatures", ({ showTemperatures }, newstate) => {
        const { dispatch } = useStoreon()
        if (newstate) dispatch("panel/add", "temperatures")
        else dispatch("panel/remove", "temperatures")
        return { showTemperatures: newstate }
    })
    store.on("panel/showflow", ({ showFlow }, newstate) => {
        const { dispatch } = useStoreon()
        if (newstate) dispatch("panel/add", "flow")
        else dispatch("panel/remove", "flow")
        return { showFlow: newstate }
    })
    store.on("panel/showfeedrate", ({ showFeedRate }, newstate) => {
        const { dispatch } = useStoreon()
        if (newstate) dispatch("panel/add", "feedrate")
        else dispatch("panel/remove", "feedrate")
        return { showFeedRate: newstate }
    })
    store.on("panel/showfan", ({ showFan }, newstate) => {
        const { dispatch } = useStoreon()
        if (newstate) dispatch("panel/add", "fan")
        else dispatch("panel/remove", "fan")
        return { showFan: newstate }
    })
    store.on("panel/showextruders", ({ showExtruders }, newstate) => {
        const { dispatch } = useStoreon()
        if (newstate) dispatch("panel/add", "extruders")
        else dispatch("panel/remove", "extruders")
        return { showExtruders: newstate }
    })
}