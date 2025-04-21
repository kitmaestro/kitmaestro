import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-in-progress',
	imports: [RouterLink, MatButtonModule],
	template: `
		<div class="v-container">
			<div class="v-centered">
				<img
					src="assets/undraw_freelancer_re_irh4.svg"
					alt=""
					style="width: 200px"
				/>
				<p>
					{{ feature }} se encuentra en desarrollo, de momento no
					est&aacute; disponible. Apreciamos su comprensi&oacute;n.
				</p>
				<p>
					Mantente pendiente, las actualizaciones se publican
					<a
						[routerLink]="['/updates']"
						mat-raised-button
						color="accent"
						>aqu&iacute;</a
					>
				</p>
			</div>
		</div>
	`,
	styles: `
		.v-container {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			bottom: 0;
			margin: 20px auto;
			width: 90%;
		}

		.v-centered {
			text-align: center;

			p {
				margin-top: 32px;
			}
		}
	`,
})
export class InProgressComponent {
	@Input() feature = 'Esta herramienta';
}
