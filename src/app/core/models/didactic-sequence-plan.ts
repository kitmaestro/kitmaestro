import { ActivityResource, DidacticSequenceBlock } from "../interfaces"
import { DidacticSequence } from "./didactic-sequence"

export interface DidacticSequencePlan {
    didacticSequence: DidacticSequence
    title: string
    description: string
    specificCompetencies: {
        name: string
        description: string
    }[]
    additionalResources: ActivityResource[]
    blocks: DidacticSequenceBlock[]
}
