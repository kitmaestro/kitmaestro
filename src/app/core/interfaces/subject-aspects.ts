export interface SubjectAspectEntry {
	topic: string
	aspects: string[]
}

export interface SubjectAspects {
	primary: SubjectAspectEntry[][]
	highSchool: SubjectAspectEntry[][]
}
