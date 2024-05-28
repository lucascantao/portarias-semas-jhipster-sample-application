package br.gov.pa.semas.portarias.domain;

import java.util.UUID;

public class AjudaTestSamples {

    public static Ajuda getAjudaSample1() {
        return new Ajuda().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).titulo("titulo1");
    }

    public static Ajuda getAjudaSample2() {
        return new Ajuda().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).titulo("titulo2");
    }

    public static Ajuda getAjudaRandomSampleGenerator() {
        return new Ajuda().id(UUID.randomUUID()).titulo(UUID.randomUUID().toString());
    }
}
