import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Tool {
	name: string;
	description: string[];
	premium: boolean;
}

interface Stage {
	name: string;
	description: string;
	tools: Tool[];
}

@Component({
	selector: 'app-roadmap',
	imports: [
		MatListModule,
		MatButtonModule,
		MatCardModule,
		RouterModule,
		CommonModule,
		MatExpansionModule,
		MatIconModule,
	],
	template: `
		<div style="margin: 20px">
			<mat-card style="margin-top: 0">
				<mat-card-header>
					<h2 mat-card-title>Roadmap de Desarrollo de KitMaestro</h2>
				</mat-card-header>
				<mat-card-content>
					<p>
						Aqui te presentamos los planes de desarrollo de este proyecto
						para los proximos tres a&ntilde;os (2024 - 2026).
					</p>
				</mat-card-content>
			</mat-card>
			<ng-container *ngFor="let stage of stages">
				<mat-card>
					<mat-card-header>
						<h3 mat-card-title>{{ stage.name }}</h3>
					</mat-card-header>
					<mat-card-content>
						<p>
							{{ stage.description }}
						</p>
					</mat-card-content>
				</mat-card>

				<mat-accordion>
					<mat-expansion-panel hideToggle *ngFor="let tool of stage.tools">
						<mat-expansion-panel-header>
							<mat-panel-title>{{ tool.name }}</mat-panel-title>
							<mat-panel-description
								style="color: #3f51b5"
								*ngIf="tool.premium"
								><mat-icon>star</mat-icon> Herramienta
								Premium</mat-panel-description
							>
						</mat-expansion-panel-header>
						<div>
							<mat-list>
								<mat-list-item *ngFor="let item of tool.description">{{
									item
								}}</mat-list-item>
							</mat-list>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</ng-container>

			<mat-card>
				<mat-card-content>
					<h3>Tu tambi&eacute;n puedes participar</h3>
					<p>
						En KitMaestro, valoramos enormemente tu opinión y tus ideas para
						hacer de nuestra plataforma la mejor herramienta para docentes.
						Queremos que sepas que tus sugerencias son fundamentales para
						nosotros y que estamos comprometidos a escuchar y considerar
						cada una de ellas.
					</p>
					<p>
						Si tienes alguna idea brillante para una nueva herramienta,
						función o característica que te gustaría ver en KitMaestro, ¡te
						invitamos a compartirla con nosotros! Puedes escribirnos a
						<a href="mailto:orgalay.dev@gmail.com"
							>orgalay.dev&#64;gmail.com</a
						>
						y estaremos encantados de escuchar lo que tienes en mente.
					</p>
					<p>
						Tu retroalimentación es esencial para seguir mejorando y
						adaptando KitMaestro a tus necesidades y deseos. Juntos, podemos
						hacer de KitMaestro una plataforma excepcional que potencie la
						labor docente y el aprendizaje de nuestros estudiantes.
					</p>
					<p>
						¡Esperamos con entusiasmo escuchar todas tus increíbles ideas!
					</p>
					<p>Gracias por formar parte de la comunidad KitMaestro.</p>
				</mat-card-content>
			</mat-card>
		</div>
	`,
	styles: `
		p {
			font-size: 16px;
			font-family: Roboto, sans-serif;
			line-height: 1.5;
			margin-top: 20px;
			margin-bottom: 20px;
		}

		mat-card {
			margin-top: 32px;
			margin-bottom: 32px;
		}
	`,
})
export class RoadmapComponent {
	stages: Stage[] = [
		{
			name: 'Etapa Inicial (2024)',
			description:
				'Para la etapa inicial del proyecto, estarán disponibles estas herramientas.',
			tools: [
				{
					name: 'Gestión de Asistencia',
					description: [
						'Registro de asistencia de estudiantes.',
						'Generación de informes de asistencia y estadísticas.',
					],
					premium: false,
				},
				{
					name: 'Planificación de Clases',
					description: [
						'Asistente de creacion de unidades de aprendizaje',
						'Asistente de creacion de planes diarios',
						'Creación y gestión de horarios de clases.',
						'Integración con calendarios para recordatorios y planificación a largo plazo.',
					],
					premium: true,
				},
				{
					name: 'Comunicación con Padres',
					description: [
						'Mensajería directa o a través de notificaciones para informar sobre el progreso del estudiante.',
						'Creación de informes automáticos para compartir con los padres.',
					],
					premium: true,
				},
				{
					name: 'Banco de Recursos Educativos',
					description: [
						'Almacenamiento y distribución de recursos educativos entre maestros.',
						'Clasificación por temas y niveles educativos.',
					],
					premium: false,
				},
				{
					name: 'Evaluación Formativa',
					description: [
						'Herramientas interactivas para evaluar el entendimiento en tiempo real.',
						'Retroalimentación inmediata para los estudiantes.',
					],
					premium: true,
				},
				{
					name: 'Seguimiento del Desarrollo del Estudiante',
					description: [
						'Creación de perfiles individuales para estudiantes con seguimiento de su progreso a lo largo del tiempo. ',
						'Graficos y estadísticas visuales del rendimiento del estudiante. ',
					],
					premium: true,
				},
				{
					name: 'Organizador de Eventos Escolares',
					description: [
						'Planificación y promoción de eventos escolares.',
						'Registro de participantes y seguimiento de asistencia.',
					],
					premium: true,
				},
				{
					name: 'Herramientas de Colaboración entre Maestros',
					description: [
						'Espacio de colaboración para compartir ideas y estrategias de enseñanza.',
						'Creación de proyectos colaborativos entre maestros.',
					],
					premium: false,
				},
				{
					name: 'Gestión de Tareas',
					description: [
						'Seguimiento de tareas asignadas a los estudiantes.',
						'Recordatorios automáticos para fechas de entrega.',
					],
					premium: false,
				},
				{
					name: 'Adaptación a la Diversidad',
					description: [
						'Herramientas para adaptar materiales educativos según las necesidades específicas de los estudiantes.',
						'Recursos para la enseñanza inclusiva.',
					],
					premium: true,
				},
				{
					name: 'Seguridad y Privacidad',
					description: [
						'Herramientas para gestionar la seguridad de los datos de los estudiantes. ',
						'Seguimiento y alertas de posibles problemas de seguridad. ',
					],
					premium: true,
				},
				{
					name: 'Encuestas y Retroalimentación',
					description: [
						'Creación de encuestas para recopilar opiniones de estudiantes y padres.',
						'Recopilación de retroalimentación anónima para mejorar la enseñanza.',
					],
					premium: true,
				},
			],
		},
		{
			name: 'Actualizaciones del segundo año (2025)',
			description:
				'Durante el segundo año del proyecto, se iran agregando los instrumentos mencionados acontinuación.',
			tools: [
				{
					name: 'Integración con Plataformas Educativas Externas',
					description: [
						'Conexión con plataformas de aprendizaje en línea y recursos educativos externos. ',
					],
					premium: false,
				},
				{
					name: 'Autoevaluación para Maestros',
					description: [
						'Herramientas que permitan a los maestros evaluar su propio desempeño y buscar áreas de mejora.',
					],
					premium: false,
				},
				{
					name: 'Registro de Logros Estudiantiles',
					description: [
						'Seguimiento de los logros y reconocimientos de los estudiantes. ',
						'Generación de certificados y reconocimientos. ',
					],
					premium: false,
				},
				{
					name: 'Planificación de Excursiones',
					description: [
						'Herramienta para planificar y organizar excursiones escolares.',
						'Gestión de permisos y logística.',
					],
					premium: false,
				},
				{
					name: 'Monitoreo de Salud Estudiantil',
					description: [
						'Registro de problemas de salud de los estudiantes.',
						'Alertas automáticas para condiciones médicas específicas.',
					],
					premium: false,
				},
				{
					name: 'Aprendizaje Basado en Juegos',
					description: [
						'Integración de juegos educativos para hacer el aprendizaje más interactivo y divertido.',
					],
					premium: true,
				},
				{
					name: 'Plataforma de Colaboración con Estudiantes',
					description: [
						'Espacio para que los estudiantes colaboren entre ellos en proyectos y tareas.',
						'Foros y salas de discusión.',
					],
					premium: false,
				},
				{
					name: 'Gestión de Permisos y Ausencias',
					description: [
						'Herramientas para solicitar y aprobar permisos y ausencias.',
						'Registro centralizado de la disponibilidad del personal docente.',
					],
					premium: false,
				},
				{
					name: 'Gestión de Proyectos de Investigación',
					description: [
						'Plataforma para planificar y realizar proyectos de investigación en colaboración con estudiantes.',
						'Seguimiento del progreso y resultados de proyectos.',
					],
					premium: false,
				},
				{
					name: 'Biblioteca Virtual',
					description: [
						'Acceso a una biblioteca digital con libros, artículos y recursos educativos.',
						'Reservas y recomendaciones de libros.',
					],
					premium: true,
				},
				{
					name: 'Herramienta de Evaluación de Competencias',
					description: [
						'Evaluación y seguimiento de las competencias clave de los estudiantes.',
						'Retroalimentación detallada sobre el desarrollo de habilidades específicas.',
					],
					premium: true,
				},
				{
					name: 'Plataforma de Tutorías',
					description: [
						'Programación y seguimiento de sesiones de tutoría.',
						'Registro de notas y avances en las tutorías.',
					],
					premium: true,
				},
				{
					name: 'Simulaciones Educativas',
					description: [
						'Integración de simulaciones interactivas para mejorar la comprensión de conceptos.',
						'Creación de escenarios educativos virtuales.',
					],
					premium: true,
				},
				{
					name: 'Diario de Aprendizaje para Estudiantes',
					description: [
						'Espacio digital donde los estudiantes puedan registrar su progreso y reflexiones diarias.',
						'Comentarios y seguimiento del maestro.',
					],
					premium: false,
				},
				{
					name: 'Seguimiento del Bienestar Estudiantil',
					description: [
						'Herramienta para evaluar el bienestar emocional y social de los estudiantes.',
						'Recursos y actividades para promover el bienestar.',
					],
					premium: true,
				},
				{
					name: 'Herramientas de Aprendizaje Multilingües',
					description: [
						'Soporte para estudiantes que hablan diferentes idiomas.',
						'Actividades y recursos adaptados a diferentes niveles de competencia lingüística.',
					],
					premium: true,
				},
				{
					name: 'Laboratorio Virtual',
					description: [
						'Plataforma para realizar experimentos virtuales.',
						'Recopilación de datos y análisis de resultados.',
					],
					premium: true,
				},
			],
		},
		{
			name: 'Actualizaciones 3ra Etapa',
			description:
				'Para el año 2026, está prevista la implementacion el siguiente grupo de herramientas.',
			tools: [
				{
					name: 'Gestión de Intervenciones',
					description: [
						'Seguimiento de intervenciones personalizadas para estudiantes con necesidades especiales.',
						'Colaboración con profesionales de apoyo.',
					],
					premium: true,
				},
				{
					name: 'Herramienta de Creación de Contenidos Educativos',
					description: [
						'Editor de contenido interactivo para crear lecciones personalizadas.',
						'Compartir y reutilizar material entre maestros.',
					],
					premium: false,
				},
				{
					name: 'Asistente de Creación de Exámenes',
					description: [
						'Generador de exámenes personalizables con diversas opciones de formato.',
						'Banco de preguntas y análisis de resultados.',
					],
					premium: true,
				},
				{
					name: 'Gestión de Clubes y Actividades Extracurriculares',
					description: [
						'Registro de estudiantes en clubes y actividades.',
						'Calendario de eventos y seguimiento de participación.',
					],
					premium: true,
				},
				{
					name: 'Juntas Virtuales de Profesores',
					description: [
						'Espacio para programar y llevar a cabo reuniones virtuales entre profesores.',
						'Compartir recursos y discutir estrategias de enseñanza.',
					],
					premium: true,
				},
				{
					name: 'Herramientas de Realidad Aumentada (AR) para Educación',
					description: [
						'Integración de experiencias de aprendizaje en realidad aumentada.',
						'Recorridos virtuales y objetos 3D para mejorar la comprensión.',
					],
					premium: true,
				},
				{
					name: 'Plataforma de Voluntariado Estudiantil',
					description: [
						'Registro y seguimiento de horas de voluntariado estudiantil.',
						'Reconocimientos y certificaciones por servicio comunitario.',
					],
					premium: false,
				},
				{
					name: 'Herramientas de Resolución de Conflictos',
					description: [
						'Sistema para gestionar y resolver conflictos entre estudiantes.',
						'Recursos para promover la resolución pacífica de problemas.',
					],
					premium: false,
				},
				{
					name: 'Gestión de Recursos Tecnológicos en el Aula',
					description: [
						'Seguimiento de dispositivos tecnológicos asignados a estudiantes.',
						'Recursos para integrar la tecnología de manera efectiva en el aula.',
					],
					premium: false,
				},
				{
					name: 'Generador de Lecciones Interactivas',
					description: [
						'Creación de lecciones con elementos interactivos como quizzes y actividades.',
						'Evaluación en tiempo real del progreso de los estudiantes.',
					],
					premium: true,
				},
				{
					name: 'Herramientas de Educación Financiera para Estudiantes',
					description: [
						'Módulos educativos sobre finanzas personales y habilidades financieras básicas.',
						'Simuladores para enseñar conceptos financieros de manera práctica.',
					],
					premium: true,
				},
			],
		},
	];
}
