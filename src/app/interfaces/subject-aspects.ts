export interface SubjectAspectEntry {
    topic: string,
    aspects: string[],
}

export interface SubjectAspects {
    primary: Array<SubjectAspectEntry[]>,
    highSchool: Array<SubjectAspectEntry[]>
}