import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SetorDetailComponent } from './setor-detail.component';

describe('Setor Management Detail Component', () => {
  let comp: SetorDetailComponent;
  let fixture: ComponentFixture<SetorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetorDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SetorDetailComponent,
              resolve: { setor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SetorDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load setor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SetorDetailComponent);

      // THEN
      expect(instance.setor()).toEqual(expect.objectContaining({ id: 123 }));
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
