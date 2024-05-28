import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITopico } from '../topico.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../topico.test-samples';

import { TopicoService } from './topico.service';

const requireRestSample: ITopico = {
  ...sampleWithRequiredData,
};

describe('Topico Service', () => {
  let service: TopicoService;
  let httpMock: HttpTestingController;
  let expectedResult: ITopico | ITopico[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TopicoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Topico', () => {
      const topico = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(topico).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Topico', () => {
      const topico = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(topico).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Topico', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Topico', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Topico', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTopicoToCollectionIfMissing', () => {
      it('should add a Topico to an empty array', () => {
        const topico: ITopico = sampleWithRequiredData;
        expectedResult = service.addTopicoToCollectionIfMissing([], topico);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topico);
      });

      it('should not add a Topico to an array that contains it', () => {
        const topico: ITopico = sampleWithRequiredData;
        const topicoCollection: ITopico[] = [
          {
            ...topico,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTopicoToCollectionIfMissing(topicoCollection, topico);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Topico to an array that doesn't contain it", () => {
        const topico: ITopico = sampleWithRequiredData;
        const topicoCollection: ITopico[] = [sampleWithPartialData];
        expectedResult = service.addTopicoToCollectionIfMissing(topicoCollection, topico);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topico);
      });

      it('should add only unique Topico to an array', () => {
        const topicoArray: ITopico[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const topicoCollection: ITopico[] = [sampleWithRequiredData];
        expectedResult = service.addTopicoToCollectionIfMissing(topicoCollection, ...topicoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const topico: ITopico = sampleWithRequiredData;
        const topico2: ITopico = sampleWithPartialData;
        expectedResult = service.addTopicoToCollectionIfMissing([], topico, topico2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topico);
        expect(expectedResult).toContain(topico2);
      });

      it('should accept null and undefined values', () => {
        const topico: ITopico = sampleWithRequiredData;
        expectedResult = service.addTopicoToCollectionIfMissing([], null, topico, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topico);
      });

      it('should return initial array if no Topico is added', () => {
        const topicoCollection: ITopico[] = [sampleWithRequiredData];
        expectedResult = service.addTopicoToCollectionIfMissing(topicoCollection, undefined, null);
        expect(expectedResult).toEqual(topicoCollection);
      });
    });

    describe('compareTopico', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTopico(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareTopico(entity1, entity2);
        const compareResult2 = service.compareTopico(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareTopico(entity1, entity2);
        const compareResult2 = service.compareTopico(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareTopico(entity1, entity2);
        const compareResult2 = service.compareTopico(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
