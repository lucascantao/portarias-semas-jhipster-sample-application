import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAssunto } from '../assunto.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../assunto.test-samples';

import { AssuntoService, RestAssunto } from './assunto.service';

const requireRestSample: RestAssunto = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
  deletedAt: sampleWithRequiredData.deletedAt?.toJSON(),
};

describe('Assunto Service', () => {
  let service: AssuntoService;
  let httpMock: HttpTestingController;
  let expectedResult: IAssunto | IAssunto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AssuntoService);
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

    it('should create a Assunto', () => {
      const assunto = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(assunto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Assunto', () => {
      const assunto = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(assunto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Assunto', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Assunto', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Assunto', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAssuntoToCollectionIfMissing', () => {
      it('should add a Assunto to an empty array', () => {
        const assunto: IAssunto = sampleWithRequiredData;
        expectedResult = service.addAssuntoToCollectionIfMissing([], assunto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assunto);
      });

      it('should not add a Assunto to an array that contains it', () => {
        const assunto: IAssunto = sampleWithRequiredData;
        const assuntoCollection: IAssunto[] = [
          {
            ...assunto,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAssuntoToCollectionIfMissing(assuntoCollection, assunto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Assunto to an array that doesn't contain it", () => {
        const assunto: IAssunto = sampleWithRequiredData;
        const assuntoCollection: IAssunto[] = [sampleWithPartialData];
        expectedResult = service.addAssuntoToCollectionIfMissing(assuntoCollection, assunto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assunto);
      });

      it('should add only unique Assunto to an array', () => {
        const assuntoArray: IAssunto[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const assuntoCollection: IAssunto[] = [sampleWithRequiredData];
        expectedResult = service.addAssuntoToCollectionIfMissing(assuntoCollection, ...assuntoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const assunto: IAssunto = sampleWithRequiredData;
        const assunto2: IAssunto = sampleWithPartialData;
        expectedResult = service.addAssuntoToCollectionIfMissing([], assunto, assunto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assunto);
        expect(expectedResult).toContain(assunto2);
      });

      it('should accept null and undefined values', () => {
        const assunto: IAssunto = sampleWithRequiredData;
        expectedResult = service.addAssuntoToCollectionIfMissing([], null, assunto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assunto);
      });

      it('should return initial array if no Assunto is added', () => {
        const assuntoCollection: IAssunto[] = [sampleWithRequiredData];
        expectedResult = service.addAssuntoToCollectionIfMissing(assuntoCollection, undefined, null);
        expect(expectedResult).toEqual(assuntoCollection);
      });
    });

    describe('compareAssunto', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAssunto(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAssunto(entity1, entity2);
        const compareResult2 = service.compareAssunto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAssunto(entity1, entity2);
        const compareResult2 = service.compareAssunto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAssunto(entity1, entity2);
        const compareResult2 = service.compareAssunto(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
