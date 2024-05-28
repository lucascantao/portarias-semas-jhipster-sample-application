import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPortaria } from '../portaria.model';
import { PortariaService } from '../service/portaria.service';

@Component({
  standalone: true,
  templateUrl: './portaria-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PortariaDeleteDialogComponent {
  portaria?: IPortaria;

  protected portariaService = inject(PortariaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.portariaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
