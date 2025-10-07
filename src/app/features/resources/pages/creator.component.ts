import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
	selector: 'app-creator',
	imports: [RouterModule],
	template: `<p>creator works!</p>`,
})
export class CreatorComponent implements OnInit {
	route = inject(ActivatedRoute);
	id = this.route.snapshot.paramMap.get('id');
	UserService = inject(UserService);
	creator$ = this.UserService.getSettings(this.id as string);

	ngOnInit() {
		this.creator$.subscribe((creator) => console.log(creator));
	}
}
