import { UniversalActivityRequirement } from './universal-activity-requirement'

export interface UniversalActivity {
	name: string
	description: string
	ready: boolean
	requirements: UniversalActivityRequirement[]
}
