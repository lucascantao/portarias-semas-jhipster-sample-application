import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITopico } from '../topico.model';

@Component({
  standalone: true,
  selector: 'jhi-topico-detail',
  templateUrl: './topico-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TopicoDetailComponent {
  topico = input<ITopico | null>(null);

  previousState(): void {
    window.history.back();
  }
}
