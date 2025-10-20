import { BaseModel } from './base-model'
import { User } from './user'

export interface DidacticResource extends BaseModel {
	title: string
	description: string
	grade: string[]
	level: string[]
	subject: string[]
	downloadLink: string
	status: 'draft' | 'preview' | 'public'
	preview: string
	author: User
	price: number
	likes: number
	keywords: string[]
	dislikes: number
	downloads: number
	bookmarks: number
}
