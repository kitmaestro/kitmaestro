import { Component, computed, input, Input, OnInit } from '@angular/core';
import {
	CompetenceEntry,
	ContentBlock,
	ClassSection,
	User,
	MainTheme,
	ClassPlan,
} from '../../../core';
import { UnitPlan } from '../../../core/models'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-unit-plan',
	imports: [PretifyPipe],
	template: `
		@if (unitPlan) {
			<div style="padding-top: 16px; min-width: 8.5in">
				<table
					style="
						border-collapse: collapse;
						border: 1px solid #ccc;
						table-layout: fixed;
					"
				>
					@if (!isPrintView) {
						<caption class="text-center bold">
							{{
								unitPlan.title
							}}
						</caption>
					}
					<tbody>
						<tr>
							<td style="width: calc(100% / 6)">
								<b>Centro Educativo</b>
							</td>
							<td colspan="5">
								@if (section) {
									<span>{{ user?.schoolName }}</span>
								} @else {
									<span>{{ unitPlan.user.schoolName }}</span>
								}
							</td>
						</tr>
						<tr>
							<td colspan="2" style="width: 33.33%">
								<b>Docente</b>:
								{{ user ? user.title : unitPlan.user.title }}.
								{{ user ? user.firstname : unitPlan.user.firstname }}
								{{ user ? user.lastname : unitPlan.user.lastname }}
							</td>
							<td colspan="2" style="width: 33.33%">
								@if (unitPlan.sections && unitPlan.sections.length) {
									<b>Grados y Secciones</b>:
									@for (section of unitPlan.sections; track $index) {
										<span
											>{{ $index > 0 ? ", " : ""
											}}{{ section.name }}</span
										>
									}
								} @else {
									<b>Grado y Secci&oacute;n</b>:
									@if (section) {
										<span>{{ section.name }}</span>
									} @else if (unitPlan.section) {
										<span>{{ unitPlan.section.name }}</span>
									} @else {
										<span>Indeterminado</span>
									}
								}
							</td>
							<td colspan="2" style="width: 33.33%">
								<b>Tiempo Asignado</b>: {{ unitPlan.duration }} Semana{{
									unitPlan.duration > 1 ? "s" : ""
								}}
							</td>
						</tr>
						<tr>
							<td><b>Situaci&oacute;n de Aprendizaje</b></td>
							<td colspan="5">{{ unitPlan.learningSituation }}</td>
						</tr>
						<!-- header competencias fundamentales -->
						<tr>
							<td colspan="6" class="text-center">
								<b>Competencias Fundamentales</b>
							</td>
						</tr>
						<!-- competencias fundamentales -->
						@if (planIsForPrimary()) {
							<tr>
								<td class="text-center" colspan="2">Comunicativa</td>
								<td class="text-center" colspan="2">
									Pensamiento Lógico, Creativo y Crítico; Resolución
									de Problemas; Tecnológica y Científica
								</td>
								<td class="text-center" colspan="2">
									Ética y Ciudadana; Desarrollo Personal y Espiritual;
									Ambiental y de la Salud
								</td>
							</tr>
						} @else {
							<tr>
								<td colspan="6" style="padding: 0">
									<div style="display: flex">
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Comunicativa
										</div>
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Pensamiento Lógico, Creativo y Crítico
										</div>
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Resolución de Problemas
										</div>
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Tecnológica y Científica
										</div>
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Ética y Ciudadana
										</div>
										<div
											style="
												text-align: center;
												border-right: 1px solid #ccc;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Desarrollo Personal y Espiritual
										</div>
										<div
											style="
												text-align: center;
												width: 100%;
												flex: 1 1 auto;
											"
										>
											Ambiental y de la Salud
										</div>
									</div>
								</td>
							</tr>
						}
						<!-- header competencias especificas -->
						<tr>
							<td colspan="6" class="bold text-center">
								Competencias Específicas del Grado
							</td>
						</tr>
						<!-- compentencias especificas -->
						@if (planIsForPrimary()) {
							<tr>
								<td colspan="2">
									@for (
										comp of competence.length
											? competence
											: unitPlan.competence;
										track comp._id
									) {
										@if (comp.name === "Comunicativa") {
											@if (unitPlan.subjects.length > 1) {
												<p class="bold">
													{{ comp.subject | pretify }}
												</p>
											}
											<ul
												style="
													margin: 0;
													padding: 0;
													list-style: none;
												"
											>
												@for (el of comp.entries; track el) {
													<li>- {{ el }}</li>
												}
											</ul>
										}
									}
								</td>
								<td colspan="2">
									@for (
										comp of competence.length
											? competence
											: unitPlan.competence;
										track comp._id
									) {
										@if (comp.name.includes("Pensamiento")) {
											@if (unitPlan.subjects.length > 1) {
												<p class="bold">
													{{ comp.subject | pretify }}
												</p>
											}
											<ul
												style="
													margin: 0 0 24px;
													padding: 0;
													list-style: none;
												"
											>
												@for (el of comp.entries; track el) {
													<li>- {{ el }}</li>
												}
											</ul>
										}
									}
								</td>
								<td colspan="2">
									@for (
										comp of competence.length
											? competence
											: unitPlan.competence;
										track comp._id
									) {
										@if (comp.name.includes("Ciudadana")) {
											@if (unitPlan.subjects.length > 1) {
												<p class="bold">
													{{ comp.subject | pretify }}
												</p>
											}
											<ul
												style="
													margin: 0 0 24px;
													padding: 0;
													list-style: none;
												"
											>
												@for (el of comp.entries; track el) {
													<li>- {{ el }}</li>
												}
											</ul>
										}
									}
								</td>
							</tr>
						} @else {
							<tr>
								<td colspan="6" style="padding: 0">
									<div style="display: flex">
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (comp.name === "Comunicativa") {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name === "Pensamiento Logico"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name ===
													"Resolucion De Problemas"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name === "Ciencia Y Tecnologia"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name === "Etica Y Ciudadana"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name ===
													"Desarrollo Personal Y Espiritual"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
											"
										>
											@for (
												comp of competence.length
													? competence
													: unitPlan.competence;
												track comp._id
											) {
												@if (
													comp.name ===
													"Ambiental Y De La Salud"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ comp.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0 0 24px;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															el of comp.entries;
															track el
														) {
															<li>- {{ el }}</li>
														}
													</ul>
												}
											}
										</div>
									</div>
								</td>
							</tr>
						}
						<!-- header criterios de evaluacion -->
						<tr>
							<td colspan="6" class="bold text-center">
								Criterios de Evaluaci&oacute;n
							</td>
						</tr>
						@if (planIsForPrimary()) {
							<tr>
								<td colspan="2">
									@for (
										row of competence.length
											? competence
											: unitPlan.competence;
										track $index
									) {
										@if (row.name === "Comunicativa") {
											@if (unitPlan.subjects.length > 1) {
												<h4 class="bold">
													{{ row.subject | pretify }}
												</h4>
											}
											<ul
												style="
													margin: 0;
													padding: 0;
													list-style: none;
												"
											>
												@for (
													criterion of row.criteria;
													track criterion
												) {
													@if (criterion) {
														<li>- {{ criterion }}</li>
													}
												}
											</ul>
										}
									}
								</td>
								<td colspan="2">
									@for (
										row of competence.length
											? competence
											: unitPlan.competence;
										track $index
									) {
										@if (row.name.includes("Pensamiento")) {
											@if (unitPlan.subjects.length > 1) {
												<h4 class="bold">
													{{ row.subject | pretify }}
												</h4>
											}
											<ul
												style="
													margin: 0;
													padding: 0;
													list-style: none;
												"
											>
												@for (
													criterion of row.criteria;
													track criterion
												) {
													@if (criterion) {
														<li>- {{ criterion }}</li>
													}
												}
											</ul>
										}
									}
								</td>
								<td colspan="2">
									@for (
										row of competence.length
											? competence
											: unitPlan.competence;
										track $index
									) {
										@if (row.name.includes("Ciudadana")) {
											@if (unitPlan.subjects.length > 1) {
												<h4 class="bold">
													{{ row.subject | pretify }}
												</h4>
											}
											<ul
												style="
													margin: 0;
													padding: 0;
													list-style: none;
												"
											>
												@for (
													criterion of row.criteria;
													track criterion
												) {
													@if (criterion) {
														<li>- {{ criterion }}</li>
													}
												}
											</ul>
										}
									}
								</td>
							</tr>
						} @else {
							<tr>
								<td colspan="6" style="padding: 0">
									<div style="display: flex">
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (row.name === "Comunicativa") {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (
													row.name === "Pensamiento Logico"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (
													row.name ===
													"Resolucion De Problemas"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (
													row.name === "Ciencia Y Tecnologia"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (row.name === "Etica Y Ciudadana") {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
												border-right: 1px solid #ccc;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (
													row.name ===
													"Desarrollo Personal Y Espiritual"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
										<div
											style="
												flex: 1 1 auto;
												padding: 12px;
												width: 100%;
											"
										>
											@for (
												row of competence.length
													? competence
													: unitPlan.competence;
												track $index
											) {
												@if (
													row.name ===
													"Ambiental Y De La Salud"
												) {
													@if (unitPlan.subjects.length > 1) {
														<p class="bold">
															{{ row.subject | pretify }}
														</p>
													}
													<ul
														style="
															margin: 0;
															padding: 0;
															list-style: none;
														"
													>
														@for (
															criterion of row.criteria;
															track criterion
														) {
															@if (criterion) {
																<li>
																	- {{ criterion }}
																</li>
															}
														}
													</ul>
												}
											}
										</div>
									</div>
								</td>
							</tr>
						}
						<tr>
							<td class="bold">
								Eje{{
									unitPlan.subjects.length === 1 ? "" : "s"
								}}
								Transversal{{
									unitPlan.subjects.length === 1 ? "" : "es"
								}}
							</td>
							<td colspan="5">
								@for (
									theme of mainThemes.length
										? mainThemes
										: unitPlan.mainThemes;
									track $index
								) {
									@if (unitPlan.subjects.length > 1) {
										<h4 class="bold">
											{{ theme.subject | pretify }}:
										</h4>
									}
									<ul style="margin: 0; padding: 0; list-style: none">
										@for (topic of theme.topics; track topic) {
											<li>- {{ topic }}</li>
										}
									</ul>
								}
							</td>
						</tr>
						<tr>
							<td class="bold">
								&Aacute;rea{{
									unitPlan.subjects.length === 1 ? "" : "s"
								}}
								Curricular{{
									unitPlan.subjects.length === 1 ? "" : "es"
								}}
							</td>
							<td colspan="5">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (subject of unitPlan.subjects; track subject) {
										<li>{{ subject | pretify }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td class="bold">
								Estrategias de Ense&ntilde;anza y Aprendizaje
							</td>
							<td colspan="5">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										strategy of removeDuplicates(
											unitPlan.strategies
										);
										track strategy
									) {
										<li>- {{ strategy }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td class="bold">Indicadores de Logro</td>
							<td colspan="5">
								@for (
									content of contents.length
										? contents
										: unitPlan.contents;
									track content._id
								) {
									@if (unitPlan.subjects.length > 1) {
										<p>
											<b>{{ content.subject | pretify }}</b>
										</p>
									}
									<ul style="margin: 0; padding: 0; list-style: none">
										@for (
											indicator of content.achievement_indicators;
											track $index
										) {
											<li>- {{ indicator }}</li>
										}
									</ul>
								}
							</td>
						</tr>
						<tr>
							<td class="bold text-center" colspan="6">Contenidos</td>
						</tr>
						<tr>
							<td class="bold text-center" colspan="2">Conceptuales</td>
							<td class="bold text-center" colspan="2">
								Procedimentales
							</td>
							<td class="bold text-center" colspan="2">Actitudinales</td>
						</tr>
						<tr>
							<td colspan="2">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										block of contents.length
											? contents
											: unitPlan.contents;
										track block
									) {
										@if (unitPlan.subjects.length === 1) {
											@for (
												content of block.concepts;
												track content
											) {
												<li>- {{ content }}</li>
											}
										} @else {
											<li>
												<b>{{ block.subject | pretify }}</b>
											</li>
											<ul>
												@for (
													content of block.concepts;
													track content
												) {
													<li>{{ content }}</li>
												}
											</ul>
										}
									}
								</ul>
							</td>
							<td colspan="2">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										block of contents.length
											? contents
											: unitPlan.contents;
										track block
									) {
										@if (unitPlan.subjects.length === 1) {
											@for (
												content of block.procedures;
												track content
											) {
												<li>- {{ content }}</li>
											}
										} @else {
											<li>
												<b>{{ block.subject | pretify }}</b>
											</li>
											<ul>
												@for (
													content of block.procedures;
													track content
												) {
													<li>{{ content }}</li>
												}
											</ul>
										}
									}
								</ul>
							</td>
							<td colspan="2">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										block of contents.length
											? contents
											: unitPlan.contents;
										track block
									) {
										@if (unitPlan.subjects.length === 1) {
											@for (
												content of block.attitudes;
												track content
											) {
												<li>- {{ content }}</li>
											}
										} @else {
											<li>
												<b>{{ block.subject | pretify }}</b>
											</li>
											<ul>
												@for (
													content of block.attitudes;
													track content
												) {
													<li>{{ content }}</li>
												}
											</ul>
										}
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td class="bold text-center" colspan="6">Actividades</td>
						</tr>
						@if (classPlans().length) {
							<tr>
								<td><b>Fecha</b></td>
								<td><b>Actividades de Aprendizaje</b></td>
								<td><b>Evidencia</b></td>
								<td>
									<b>Tecnicas e Instrumentos de Evaluaci&oacute;n</b>
								</td>
								<td><b>Metacognicion</b></td>
								<td><b>Recursos</b></td>
							</tr>
							@for (plan of classPlans(); track plan._id) {
								<tr>
									<td></td>
									<td>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											<li><b>Inicio</b></li>
											@for (
												activity of plan.introduction
													.activities;
												track activity
											) {
												<li>- {{ activity }}</li>
											}
										</ul>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											<li><b>Desarrollo</b></li>
											@for (
												activity of plan.main.activities;
												track activity
											) {
												<li>- {{ activity }}</li>
											}
										</ul>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											<li><b>Cierre</b></li>
											@for (
												activity of plan.closing.activities;
												track activity
											) {
												<li>- {{ activity }}</li>
											}
										</ul>
									</td>
									<td>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										></ul>
									</td>
									<td>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											@for (
												instrument of unitPlan.instruments;
												track instrument
											) {
												<li>- {{ instrument }}</li>
											}
										</ul>
									</td>
									<td>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											<li>
												- ¿Qué te aprendiste de este tema hoy?
											</li>
											<li>
												- ¿Qué tan importante es este tema a lo
												largo de sus vidas?
											</li>
											<li>
												- ¿Qué te pareció el tema del día de
												hoy?
											</li>
											<li>
												- ¿Cómo aprendí estos conocimientos?
											</li>
											<li>
												- ¿Cuál fue la parte que más te
												intereso?
											</li>
											<li>
												- ¿Como nos beneficiamos de los
												conocimientos aprendido hoy?
											</li>
											<li>
												- ¿En qué nos ayuda para convivir mejor
												este tema?
											</li>
										</ul>
									</td>
									<td>
										<ul
											style="
												margin: 0;
												padding: 0;
												list-style: none;
											"
										>
											@for (
												resource of plan.introduction.resources;
												track resource
											) {
												<li>- {{ resource }}</li>
											}
											@for (
												resource of plan.main.resources;
												track resource
											) {
												<li>- {{ resource }}</li>
											}
											@for (
												resource of plan.closing.resources;
												track resource
											) {
												<li>- {{ resource }}</li>
											}
										</ul>
									</td>
								</tr>
							}
						} @else {
							<tr>
								<td class="bold text-center" colspan="2">
									De Ense&ntilde;anza
								</td>
								<td class="bold text-center" colspan="2">
									De Aprendizaje
								</td>
								<td class="bold text-center" colspan="2">
									De Evaluaci&oacute;n
								</td>
							</tr>
							<tr>
								<td colspan="2">
									<ul style="margin: 0; padding: 0; list-style: none">
										@for (
											activityList of unitPlan.teacherActivities;
											track activityList
										) {
											@if (unitPlan.subjects.length === 1) {
												@for (
													activity of activityList.activities;
													track $index
												) {
													<li>- {{ activity }}</li>
												}
											} @else {
												<li class="bold">
													{{ activityList.subject | pretify }}
												</li>
												<ul
													style="
														margin: 0;
														padding: 0;
														list-style: none;
													"
												>
													@for (
														activity of activityList.activities;
														track $index
													) {
														<li>- {{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</td>
								<td colspan="2">
									<ul style="margin: 0; padding: 0; list-style: none">
										@for (
											activityList of unitPlan.studentActivities;
											track activityList
										) {
											@if (unitPlan.subjects.length === 1) {
												@for (
													activity of activityList.activities;
													track $index
												) {
													<li>- {{ activity }}</li>
												}
											} @else {
												<li class="bold">
													{{ activityList.subject | pretify }}
												</li>
												<ul
													style="
														margin: 0;
														padding: 0;
														list-style: none;
													"
												>
													@for (
														activity of activityList.activities;
														track $index
													) {
														<li>- {{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</td>
								<td colspan="2">
									<ul style="margin: 0; padding: 0; list-style: none">
										@for (
											activityList of unitPlan.evaluationActivities;
											track activityList
										) {
											@if (unitPlan.subjects.length === 1) {
												@for (
													activity of activityList.activities;
													track $index
												) {
													<li>- {{ activity }}</li>
												}
											} @else {
												<li class="bold">
													{{ activityList.subject | pretify }}
												</li>
												<ul
													style="
														margin: 0;
														padding: 0;
														list-style: none;
													"
												>
													@for (
														activity of activityList.activities;
														track $index
													) {
														<li>- {{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</td>
							</tr>
						}
						<tr>
							<td colspan="3" class="bold text-center">
								T&eacute;cnicas e Instrumentos de Evaluaci&oacute;n
							</td>
							<td colspan="3" class="bold text-center">
								Medios y Recursos
							</td>
						</tr>
						<tr>
							<td colspan="3">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										instrument of unitPlan.instruments;
										track instrument
									) {
										<li>- {{ instrument }}</li>
									}
								</ul>
							</td>
							<td colspan="3">
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										resource of unitPlan.resources;
										track resource
									) {
										<li>- {{ resource }}</li>
									}
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		}
	`,
	styles: `
		td,
		th,
		caption {
			border: 1px solid #ccc;
			padding: 10px;
			line-height: 1.5;
			font-size: 12pt;
		}

		td {
			vertical-align: top;
		}

		th,
		caption {
			font-weight: bold;
			text-align: center;
		}

		caption {
			border-bottom: none;
		}

		.text-center {
			text-align: center;
		}

		.font-bold,
		.bold {
			font-weight: bold;
		}
	`,
})
export class UnitPlanComponent implements OnInit {
	@Input() unitPlan: UnitPlan | null = null;
	@Input() section: ClassSection | null = null;
	@Input() user: User | null = null;
	@Input() contents: ContentBlock[] = [];
	@Input() competence: CompetenceEntry[] = [];
	@Input() mainThemes: MainTheme[] = [];
	classPlans = input<ClassPlan[]>([]);

	public isPrintView = window.location.href.includes('print');
	planIsForPrimary = computed<boolean>(() => {
		if (this.section) {
			return this.section.level.toLowerCase() == 'primaria';
		}
		const plan = this.unitPlan;
		if (plan) {
			if (plan.section) {
				return plan.section.level.toLowerCase() == 'primaria';
			}
			if (plan.sections.length > 0) {
				return plan.sections[0].level.toLowerCase() == 'primaria';
			}
		}
		return false;
	});

	removeDuplicates(strings: string[]): string[] {
		const seen = new Set<string>();

		return strings.filter((str) => {
			if (!seen.has(str)) {
				seen.add(str);
				return true;
			}
			return false;
		});
	}

	removeCompetenceDuplicates(competence: CompetenceEntry[]): string[] {
		const seen = new Set<string>();

		return competence
			.map((c) => c.name)
			.filter((str) => {
				if (!seen.has(str)) {
					seen.add(str);
					return true;
				}
				return false;
			});
	}

	subjectValue(subject: string) {
		if (subject === 'LENGUA_ESPANOLA') {
			return 1;
		}
		if (subject === 'MATEMATICA') {
			return 2;
		}
		if (subject === 'CIENCIAS_SOCIALES') {
			return 3;
		}
		if (subject === 'CIENCIAS_NATURALES') {
			return 4;
		}
		if (subject === 'INGLES') {
			return 5;
		}
		if (subject === 'FRANCES') {
			return 6;
		}
		if (subject === 'FORMACION_HUMANA') {
			return 7;
		}
		if (subject === 'EDUCACION_FISICA') {
			return 8;
		}
		if (subject === 'EDUCACION_ARTISTICA') {
			return 9;
		}
		return 10;
	}

	ngOnInit() {
		setTimeout(() => {
			this.unitPlan?.competence.sort(
				(a, b) =>
					this.subjectValue(a.subject) - this.subjectValue(b.subject),
			);
			this.unitPlan?.contents.sort(
				(a, b) =>
					this.subjectValue(a.subject) - this.subjectValue(b.subject),
			);
			// join all contents and indicators of the same subject
			if (this.unitPlan) {
				const found: string[] = [];
				const reduceContents = (
					prev: ContentBlock[],
					curr: ContentBlock,
				) => {
					if (found.includes(curr.subject)) {
						const old = prev.find(
							(block) => block.subject === curr.subject,
						);
						if (old) {
							old.concepts = this.removeDuplicates([
								...old.concepts,
								...curr.concepts,
							]);
							old.procedures = this.removeDuplicates([
								...old.procedures,
								...curr.procedures,
							]);
							old.attitudes = this.removeDuplicates([
								...old.attitudes,
								...curr.attitudes,
							]);
							old.achievement_indicators = this.removeDuplicates([
								...old.achievement_indicators,
								...curr.achievement_indicators,
							]);
						}
					} else {
						found.push(curr.subject);
						prev.push(curr);
					}
					return prev;
				};
				this.unitPlan.contents = this.unitPlan.contents.reduce(
					reduceContents,
					[] as ContentBlock[],
				);
			}
		}, 0);
	}
}
