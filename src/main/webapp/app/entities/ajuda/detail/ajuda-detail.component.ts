import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAjuda } from '../ajuda.model';

@Component({
  standalone: true,
  selector: 'jhi-ajuda-detail',
  templateUrl: './ajuda-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AjudaDetailComponent {
  ajuda = input<IAjuda | null>(null);

  previousState(): void {
    window.history.back();
  }
}
