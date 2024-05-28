import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISetor } from '../setor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../setor.test-samples';

import { SetorService, RestSetor } from './setor.service';

const requireRestSample: RestSetor = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
  deletedAt: sampleWithRequiredData.deletedAt?.toJSON(),
};

describe('Setor Service', () => {
  let service: SetorService;
  let httpMock: HttpTestingController;
  let expectedResult: ISetor | ISetor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SetorService);
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

    it('should create a Setor', () => {
      const setor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(setor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Setor', () => {
      const setor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(setor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Setor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Setor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Setor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSetorToCollectionIfMissing', () => {
      it('should add a Setor to an empty array', () => {
        const setor: ISetor = sampleWithRequiredData;
        expectedResult = service.addSetorToCollectionIfMissing([], setor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(setor);
      });

      it('should not add a Setor to an array that contains it', () => {
        const setor: ISetor = sampleWithRequiredData;
        const setorCollection: ISetor[] = [
          {
            ...setor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSetorToCollectionIfMissing(setorCollection, setor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Setor to an array that doesn't contain it", () => {
        const setor: ISetor = sampleWithRequiredData;
        const setorCollection: ISetor[] = [sampleWithPartialData];
        expectedResult = service.addSetorToCollectionIfMissing(setorCollection, setor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(setor);
      });

      it('should add only unique Setor to an array', () => {
        const setorArray: ISetor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const setorCollection: ISetor[] = [sampleWithRequiredData];
        expectedResult = service.addSetorToCollectionIfMissing(setorCollection, ...setorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const setor: ISetor = sampleWithRequiredData;
        const setor2: ISetor = sampleWithPartialData;
        expectedResult = service.addSetorToCollectionIfMissing([], setor, setor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(setor);
        expect(expectedResult).toContain(setor2);
      });

      it('should accept null and undefined values', () => {
        const setor: ISetor = sampleWithRequiredData;
        expectedResult = service.addSetorToCollectionIfMissing([], null, setor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(setor);
      });

      it('should return initial array if no Setor is added', () => {
        const setorCollection: ISetor[] = [sampleWithRequiredData];
        expectedResult = service.addSetorToCollectionIfMissing(setorCollection, undefined, null);
        expect(expectedResult).toEqual(setorCollection);
      });
    });

    describe('compareSetor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSetor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSetor(entity1, entity2);
        const compareResult2 = service.compareSetor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSetor(entity1, entity2);
        const compareResult2 = service.compareSetor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSetor(entity1, entity2);
        const compareResult2 = service.compareSetor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
