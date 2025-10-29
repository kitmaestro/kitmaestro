export interface TableOfContentsItem {
    title: string
    startingPage: number
    topics: {
        title: string
        startingPage: number
        order: number
    }[]
}
