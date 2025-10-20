export interface EvaluationSection {
	title: string
	instructions: string
	questions: {
		type: 'multiple_choice' | 'open_ended' | 'calculation'
		stem: string
		options?: string[]
	}[]
}
