import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPerfil } from '../perfil.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../perfil.test-samples';

import { PerfilService, RestPerfil } from './perfil.service';

const requireRestSample: RestPerfil = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
  deletedAt: sampleWithRequiredData.deletedAt?.toJSON(),
};

describe('Perfil Service', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  let expectedResult: IPerfil | IPerfil[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PerfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Perfil', () => {
      const perfil = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(perfil).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Perfil', () => {
      const perfil = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(perfil).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Perfil', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Perfil', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Perfil', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPerfilToCollectionIfMissing', () => {
      it('should add a Perfil to an empty array', () => {
        const perfil: IPerfil = sampleWithRequiredData;
        expectedResult = service.addPerfilToCollectionIfMissing([], perfil);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(perfil);
      });

      it('should not add a Perfil to an array that contains it', () => {
        const perfil: IPerfil = sampleWithRequiredData;
        const perfilCollection: IPerfil[] = [
          {
            ...perfil,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPerfilToCollectionIfMissing(perfilCollection, perfil);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Perfil to an array that doesn't contain it", () => {
        const perfil: IPerfil = sampleWithRequiredData;
        const perfilCollection: IPerfil[] = [sampleWithPartialData];
        expectedResult = service.addPerfilToCollectionIfMissing(perfilCollection, perfil);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(perfil);
      });

      it('should add only unique Perfil to an array', () => {
        const perfilArray: IPerfil[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const perfilCollection: IPerfil[] = [sampleWithRequiredData];
        expectedResult = service.addPerfilToCollectionIfMissing(perfilCollection, ...perfilArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const perfil: IPerfil = sampleWithRequiredData;
        const perfil2: IPerfil = sampleWithPartialData;
        expectedResult = service.addPerfilToCollectionIfMissing([], perfil, perfil2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(perfil);
        expect(expectedResult).toContain(perfil2);
      });

      it('should accept null and undefined values', () => {
        const perfil: IPerfil = sampleWithRequiredData;
        expectedResult = service.addPerfilToCollectionIfMissing([], null, perfil, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(perfil);
      });

      it('should return initial array if no Perfil is added', () => {
        const perfilCollection: IPerfil[] = [sampleWithRequiredData];
        expectedResult = service.addPerfilToCollectionIfMissing(perfilCollection, undefined, null);
        expect(expectedResult).toEqual(perfilCollection);
      });
    });

    describe('comparePerfil', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePerfil(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePerfil(entity1, entity2);
        const compareResult2 = service.comparePerfil(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePerfil(entity1, entity2);
        const compareResult2 = service.comparePerfil(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePerfil(entity1, entity2);
        const compareResult2 = service.comparePerfil(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
