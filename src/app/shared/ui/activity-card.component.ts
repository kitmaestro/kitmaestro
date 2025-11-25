import { Component, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MarkdownComponent } from "ngx-markdown";
import { DidacticActivity } from "../../core";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'app-activity-card',
    imports: [
        MarkdownComponent,
        MatIconModule,
        MatButtonModule,
    ],
    template: `
        @if (activity(); as activity) {
            <div class="activity-item">
                <div class="activity-header">
                    <h4>@if (index(); as i){ {{i}}<span>. </span> } {{ activity.title }} ({{ activity.durationInMinutes }} minutos)</h4>
                    <div class="activity-actions">
                        <button
                            mat-icon-button
                            color="primary"
                            (click)="viewActivityResources.emit(activity)"
                            title="Ver recursos"
                        >
                            <mat-icon>folder_open</mat-icon>
                        </button>
                    </div>
                </div>
                <markdown [data]="activity.description" />
                @if (activity.teacherNote) {
                    <div class="teacher-note">
                        <strong>Notas para el docente:</strong>
                        <markdown [data]="activity.teacherNote" />
                    </div>
                }
                <div class="activity-meta">
                    <span class="page-info">Páginas: {{ activity.startingPage }} - {{ activity.endingPage }}</span>
                    <span class="block-info">Bloque: {{ activity.blockTitle }}</span>
                    <span class="order-info">Orden: {{ activity.orderInBlock }}</span>
                </div>
                @if (activity.resources && activity.resources.length > 0) {
                    <div class="resources-preview">
                        <strong>Recursos:</strong>
                        <div class="resources-list">
                            @for (resource of activity.resources; track resource._id) {
                                <span class="resource-tag">{{ resource.title }}</span>
                            }
                        </div>
                    </div>
                }
            </div>
        }
    `,
    styles: `
        .tab-content {
			padding: 16px 0;
		}

		.content-item,
		.plan-item,
		.block-item,
		.activity-item {
			margin-bottom: 16px;
		}

		.page-info {
			color: rgba(0, 0, 0, 0.54);
			font-size: 14px;
		}

		.block-item {
			margin-left: 16px;
			border-left: 3px solid #3f51b5;
		}

		.activity-item {
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			padding: 16px;
			background-color: #fafafa;
			margin-bottom: 16px;
		}

		.activity-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
		}

		.activity-actions {
			display: flex;
			gap: 8px;
		}

		.teacher-note {
			background-color: #fff3e0;
			border-left: 4px solid #ff9800;
			padding: 12px;
			margin: 12px 0;
			border-radius: 4px;
		}

		.activity-meta {
			display: flex;
			gap: 16px;
			margin: 12px 0;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.6);
		}

		.resources-preview {
			margin-top: 12px;
		}

		.resources-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			margin-top: 8px;
		}

		.resource-tag {
			background-color: #e3f2fd;
			color: #1976d2;
			padding: 4px 8px;
			border-radius: 16px;
			font-size: 12px;
			border: 1px solid #bbdefb;
		}

		.form-section {
			margin-top: 32px;
			padding: 24px;
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			background-color: white;
		}

		.not-found {
			text-align: center;
			padding: 40px;
			color: rgba(0, 0, 0, 0.54);
		}

		.not-found mat-icon {
			font-size: 48px;
			width: 48px;
			height: 48px;
			margin-bottom: 16px;
		}

		h3,
		h4 {
			margin-top: 16px;
			margin-bottom: 8px;
			color: rgba(0, 0, 0, 0.87);
		}

		strong {
			color: rgba(0, 0, 0, 0.87);
		}
    `
})
export class ActivityCardComponent {
    index = input<number>()
    activity = input<DidacticActivity>()
    viewActivityResources = output<DidacticActivity>()
}