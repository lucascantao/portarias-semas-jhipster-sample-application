import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { SetorService } from '../service/setor.service';
import { ISetor } from '../setor.model';
import { SetorFormService } from './setor-form.service';

import { SetorUpdateComponent } from './setor-update.component';

describe('Setor Management Update Component', () => {
  let comp: SetorUpdateComponent;
  let fixture: ComponentFixture<SetorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let setorFormService: SetorFormService;
  let setorService: SetorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SetorUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SetorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SetorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    setorFormService = TestBed.inject(SetorFormService);
    setorService = TestBed.inject(SetorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const setor: ISetor = { id: 456 };

      activatedRoute.data = of({ setor });
      comp.ngOnInit();

      expect(comp.setor).toEqual(setor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISetor>>();
      const setor = { id: 123 };
      jest.spyOn(setorFormService, 'getSetor').mockReturnValue(setor);
      jest.spyOn(setorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ setor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: setor }));
      saveSubject.complete();

      // THEN
      expect(setorFormService.getSetor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(setorService.update).toHaveBeenCalledWith(expect.objectContaining(setor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISetor>>();
      const setor = { id: 123 };
      jest.spyOn(setorFormService, 'getSetor').mockReturnValue({ id: null });
      jest.spyOn(setorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ setor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: setor }));
      saveSubject.complete();

      // THEN
      expect(setorFormService.getSetor).toHaveBeenCalled();
      expect(setorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISetor>>();
      const setor = { id: 123 };
      jest.spyOn(setorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ setor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(setorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
