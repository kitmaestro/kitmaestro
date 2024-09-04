import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.scss'
})
export class CreatorComponent implements OnInit {
  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');
  userSettingsService = inject(UserSettingsService);
  creator$ = this.userSettingsService.getSettings(this.id as string);

  ngOnInit() {
    this.creator$.subscribe(creator => console.log(creator))
  }
}