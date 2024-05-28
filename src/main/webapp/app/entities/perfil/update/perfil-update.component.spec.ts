import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { PerfilService } from '../service/perfil.service';
import { IPerfil } from '../perfil.model';
import { PerfilFormService } from './perfil-form.service';

import { PerfilUpdateComponent } from './perfil-update.component';

describe('Perfil Management Update Component', () => {
  let comp: PerfilUpdateComponent;
  let fixture: ComponentFixture<PerfilUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let perfilFormService: PerfilFormService;
  let perfilService: PerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PerfilUpdateComponent],
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
      .overrideTemplate(PerfilUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PerfilUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    perfilFormService = TestBed.inject(PerfilFormService);
    perfilService = TestBed.inject(PerfilService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const perfil: IPerfil = { id: 456 };

      activatedRoute.data = of({ perfil });
      comp.ngOnInit();

      expect(comp.perfil).toEqual(perfil);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerfil>>();
      const perfil = { id: 123 };
      jest.spyOn(perfilFormService, 'getPerfil').mockReturnValue(perfil);
      jest.spyOn(perfilService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ perfil });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: perfil }));
      saveSubject.complete();

      // THEN
      expect(perfilFormService.getPerfil).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(perfilService.update).toHaveBeenCalledWith(expect.objectContaining(perfil));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerfil>>();
      const perfil = { id: 123 };
      jest.spyOn(perfilFormService, 'getPerfil').mockReturnValue({ id: null });
      jest.spyOn(perfilService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ perfil: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: perfil }));
      saveSubject.complete();

      // THEN
      expect(perfilFormService.getPerfil).toHaveBeenCalled();
      expect(perfilService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerfil>>();
      const perfil = { id: 123 };
      jest.spyOn(perfilService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ perfil });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(perfilService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
