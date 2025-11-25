import { Component, input } from '@angular/core';

@Component({
	selector: 'app-loading',
	imports: [],
	template: `
		@if (loading()) {
			<div class="loading-back">
				<img
					src="/assets/loading.gif"
					style="width: 96px"
					alt="Loading..."
				/>
			</div>
		}
	`,
	styles: `
		.loading-back {
			display: flex;
			background-color: #fff;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 20000;
			justify-content: center;
			align-items: center;
		}
	`,
})
export class LoadingComponent {
	loading = input<boolean>(true);
}
