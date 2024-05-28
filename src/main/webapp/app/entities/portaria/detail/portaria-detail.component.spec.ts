import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PortariaDetailComponent } from './portaria-detail.component';

describe('Portaria Management Detail Component', () => {
  let comp: PortariaDetailComponent;
  let fixture: ComponentFixture<PortariaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortariaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PortariaDetailComponent,
              resolve: { portaria: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PortariaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortariaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load portaria on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PortariaDetailComponent);

      // THEN
      expect(instance.portaria()).toEqual(expect.objectContaining({ id: 123 }));
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
