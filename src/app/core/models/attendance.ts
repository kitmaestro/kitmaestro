import { BaseModel } from './base-model'
import { ClassSection } from './class-section'
import { Student } from './student'

export interface Attendance extends BaseModel {
	section: ClassSection
	student: Student
	month: number
	year: number
	data: {
		date: number
		attendance: 'PRESENTE' | 'TARDE' | 'AUSENTE' | 'EXCUSA' | 'FERIADO'
	}[]
}

export interface AttendanceWeek {
	week: number
	days: {
		dayOfTheWeek: string // lun,mar,mie,jue,vie,sab,dom
		date: string
	}[]
}

export interface AttendanceCalendar {
	daysPerWeek: number
	weeks: AttendanceWeek[]
}
