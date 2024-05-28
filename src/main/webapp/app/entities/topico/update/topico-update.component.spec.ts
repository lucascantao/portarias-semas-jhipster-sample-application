import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAjuda } from 'app/entities/ajuda/ajuda.model';
import { AjudaService } from 'app/entities/ajuda/service/ajuda.service';
import { TopicoService } from '../service/topico.service';
import { ITopico } from '../topico.model';
import { TopicoFormService } from './topico-form.service';

import { TopicoUpdateComponent } from './topico-update.component';

describe('Topico Management Update Component', () => {
  let comp: TopicoUpdateComponent;
  let fixture: ComponentFixture<TopicoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let topicoFormService: TopicoFormService;
  let topicoService: TopicoService;
  let ajudaService: AjudaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TopicoUpdateComponent],
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
      .overrideTemplate(TopicoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TopicoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    topicoFormService = TestBed.inject(TopicoFormService);
    topicoService = TestBed.inject(TopicoService);
    ajudaService = TestBed.inject(AjudaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ajuda query and add missing value', () => {
      const topico: ITopico = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const ajudas: IAjuda[] = [{ id: '20291dbe-0e71-4633-907e-be1d67aade58' }];
      topico.ajudas = ajudas;
      const topicos: IAjuda[] = [{ id: '8e87190a-7942-4d00-b1a2-c5350a2f9e32' }];
      topico.topicos = topicos;

      const ajudaCollection: IAjuda[] = [{ id: '895a4c02-e32a-4686-953f-2fb040db1b22' }];
      jest.spyOn(ajudaService, 'query').mockReturnValue(of(new HttpResponse({ body: ajudaCollection })));
      const additionalAjudas = [...ajudas, ...topicos];
      const expectedCollection: IAjuda[] = [...additionalAjudas, ...ajudaCollection];
      jest.spyOn(ajudaService, 'addAjudaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ topico });
      comp.ngOnInit();

      expect(ajudaService.query).toHaveBeenCalled();
      expect(ajudaService.addAjudaToCollectionIfMissing).toHaveBeenCalledWith(
        ajudaCollection,
        ...additionalAjudas.map(expect.objectContaining),
      );
      expect(comp.ajudasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const topico: ITopico = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const ajuda: IAjuda = { id: 'c37aa348-018f-4b69-b4f8-a44875d2228c' };
      topico.ajudas = [ajuda];
      const topico: IAjuda = { id: 'a18b866e-b3ff-4d69-8671-3da553313758' };
      topico.topicos = [topico];

      activatedRoute.data = of({ topico });
      comp.ngOnInit();

      expect(comp.ajudasSharedCollection).toContain(ajuda);
      expect(comp.ajudasSharedCollection).toContain(topico);
      expect(comp.topico).toEqual(topico);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopico>>();
      const topico = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(topicoFormService, 'getTopico').mockReturnValue(topico);
      jest.spyOn(topicoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topico });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topico }));
      saveSubject.complete();

      // THEN
      expect(topicoFormService.getTopico).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(topicoService.update).toHaveBeenCalledWith(expect.objectContaining(topico));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopico>>();
      const topico = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(topicoFormService, 'getTopico').mockReturnValue({ id: null });
      jest.spyOn(topicoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topico: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topico }));
      saveSubject.complete();

      // THEN
      expect(topicoFormService.getTopico).toHaveBeenCalled();
      expect(topicoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopico>>();
      const topico = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(topicoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topico });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(topicoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAjuda', () => {
      it('Should forward to ajudaService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(ajudaService, 'compareAjuda');
        comp.compareAjuda(entity, entity2);
        expect(ajudaService.compareAjuda).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
