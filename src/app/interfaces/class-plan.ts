export interface ClassPlan {
    uid: string,
    id: string,
    date: string,
    sectionName: string,
    sectionId: string,
    level: string,
    year: string,
    subject: string,
    intencion_pedagogica: string,
    estrategias: string[],
    inicio: {
        duracion: number,
        actividades: string[],
        recursos_necesarios: string[],
        layout: string,
    },
    desarrollo: {
        duracion: number,
        actividades: string[],
        recursos_necesarios: string[],
        layout: string,
    },
    cierre: {
        duracion: number,
        actividades: string[],
        recursos_necesarios: string[],
        layout: string,
    },
    complementarias: {
        actividades: string[],
        recursos_necesarios: string[],
        layout: string,
    },
    vocabulario: string[],
    lectura_recomendada: string,
    competencia: string,
}