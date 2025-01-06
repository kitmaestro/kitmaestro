import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-cartesian-coordinates',
    imports: [
        InProgressComponent,
        MatCardModule,
        MatButtonModule,
    ],
    templateUrl: './cartesian-coordinates.component.html',
    styleUrl: './cartesian-coordinates.component.scss'
})
export class CartesianCoordinatesComponent {

}
