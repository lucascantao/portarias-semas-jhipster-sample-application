import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPortaria } from '../portaria.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../portaria.test-samples';

import { PortariaService, RestPortaria } from './portaria.service';

const requireRestSample: RestPortaria = {
  ...sampleWithRequiredData,
  data: sampleWithRequiredData.data?.format(DATE_FORMAT),
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
  deletedAt: sampleWithRequiredData.deletedAt?.toJSON(),
};

describe('Portaria Service', () => {
  let service: PortariaService;
  let httpMock: HttpTestingController;
  let expectedResult: IPortaria | IPortaria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PortariaService);
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

    it('should create a Portaria', () => {
      const portaria = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(portaria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Portaria', () => {
      const portaria = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(portaria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Portaria', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Portaria', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Portaria', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPortariaToCollectionIfMissing', () => {
      it('should add a Portaria to an empty array', () => {
        const portaria: IPortaria = sampleWithRequiredData;
        expectedResult = service.addPortariaToCollectionIfMissing([], portaria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portaria);
      });

      it('should not add a Portaria to an array that contains it', () => {
        const portaria: IPortaria = sampleWithRequiredData;
        const portariaCollection: IPortaria[] = [
          {
            ...portaria,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPortariaToCollectionIfMissing(portariaCollection, portaria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Portaria to an array that doesn't contain it", () => {
        const portaria: IPortaria = sampleWithRequiredData;
        const portariaCollection: IPortaria[] = [sampleWithPartialData];
        expectedResult = service.addPortariaToCollectionIfMissing(portariaCollection, portaria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portaria);
      });

      it('should add only unique Portaria to an array', () => {
        const portariaArray: IPortaria[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const portariaCollection: IPortaria[] = [sampleWithRequiredData];
        expectedResult = service.addPortariaToCollectionIfMissing(portariaCollection, ...portariaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const portaria: IPortaria = sampleWithRequiredData;
        const portaria2: IPortaria = sampleWithPartialData;
        expectedResult = service.addPortariaToCollectionIfMissing([], portaria, portaria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portaria);
        expect(expectedResult).toContain(portaria2);
      });

      it('should accept null and undefined values', () => {
        const portaria: IPortaria = sampleWithRequiredData;
        expectedResult = service.addPortariaToCollectionIfMissing([], null, portaria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portaria);
      });

      it('should return initial array if no Portaria is added', () => {
        const portariaCollection: IPortaria[] = [sampleWithRequiredData];
        expectedResult = service.addPortariaToCollectionIfMissing(portariaCollection, undefined, null);
        expect(expectedResult).toEqual(portariaCollection);
      });
    });

    describe('comparePortaria', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePortaria(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePortaria(entity1, entity2);
        const compareResult2 = service.comparePortaria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePortaria(entity1, entity2);
        const compareResult2 = service.comparePortaria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePortaria(entity1, entity2);
        const compareResult2 = service.comparePortaria(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
