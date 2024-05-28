package br.gov.pa.semas.portarias.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AssuntoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Assunto getAssuntoSample1() {
        return new Assunto().id(1L).nome("nome1");
    }

    public static Assunto getAssuntoSample2() {
        return new Assunto().id(2L).nome("nome2");
    }

    public static Assunto getAssuntoRandomSampleGenerator() {
        return new Assunto().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
