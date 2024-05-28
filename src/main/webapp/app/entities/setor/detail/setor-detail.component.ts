import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISetor } from '../setor.model';

@Component({
  standalone: true,
  selector: 'jhi-setor-detail',
  templateUrl: './setor-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SetorDetailComponent {
  setor = input<ISetor | null>(null);

  previousState(): void {
    window.history.back();
  }
}
