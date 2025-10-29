export interface ActivityResource {
    resourceType: 'VIDEO' | 'ARTICLE' | 'BOOK' | 'WEBSITE' | 'OTHER'
    title: string
    description: string
    source: string
    url?: string
    content?: string
}
