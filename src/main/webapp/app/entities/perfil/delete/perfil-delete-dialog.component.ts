import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPerfil } from '../perfil.model';
import { PerfilService } from '../service/perfil.service';

@Component({
  standalone: true,
  templateUrl: './perfil-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PerfilDeleteDialogComponent {
  perfil?: IPerfil;

  protected perfilService = inject(PerfilService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.perfilService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
