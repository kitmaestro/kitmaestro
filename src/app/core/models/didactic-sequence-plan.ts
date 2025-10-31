import { ActivityResource, DidacticSequenceBlock } from "../interfaces"
import { BaseModel } from "./base-model"
import { DidacticSequence } from "./didactic-sequence"

export interface DidacticSequencePlan extends BaseModel {
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
