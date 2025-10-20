export interface ConversationLine {
	id: number
	a?: string
	b?: string
}

export interface EnglishConversation {
	id: number
	title: string
	level: number
	topic?: string
	talk: ConversationLine[]
}
