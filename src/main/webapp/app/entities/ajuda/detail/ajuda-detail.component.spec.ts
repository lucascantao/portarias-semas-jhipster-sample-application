import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { AjudaDetailComponent } from './ajuda-detail.component';

describe('Ajuda Management Detail Component', () => {
  let comp: AjudaDetailComponent;
  let fixture: ComponentFixture<AjudaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjudaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AjudaDetailComponent,
              resolve: { ajuda: () => of({ id: '9fec3727-3421-4967-b213-ba36557ca194' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AjudaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjudaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ajuda on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AjudaDetailComponent);

      // THEN
      expect(instance.ajuda()).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
