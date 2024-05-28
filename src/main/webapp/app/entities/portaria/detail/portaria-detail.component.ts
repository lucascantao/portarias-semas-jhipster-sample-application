import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPortaria } from '../portaria.model';

@Component({
  standalone: true,
  selector: 'jhi-portaria-detail',
  templateUrl: './portaria-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PortariaDetailComponent {
  portaria = input<IPortaria | null>(null);

  previousState(): void {
    window.history.back();
  }
}
