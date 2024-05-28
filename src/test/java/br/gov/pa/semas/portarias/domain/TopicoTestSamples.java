package br.gov.pa.semas.portarias.domain;

import java.util.UUID;

public class TopicoTestSamples {

    public static Topico getTopicoSample1() {
        return new Topico().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).titulo("titulo1");
    }

    public static Topico getTopicoSample2() {
        return new Topico().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).titulo("titulo2");
    }

    public static Topico getTopicoRandomSampleGenerator() {
        return new Topico().id(UUID.randomUUID()).titulo(UUID.randomUUID().toString());
    }
}
