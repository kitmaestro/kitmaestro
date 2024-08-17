export interface Update {
    title: string,
    date: Date,
    type: 'notice' | 'feature' | 'bug',
    description: string,
    content: string,
    author: string,
    actions: {
        label: string,
        link: string[],
    }[],
}
