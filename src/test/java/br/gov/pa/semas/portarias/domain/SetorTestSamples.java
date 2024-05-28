package br.gov.pa.semas.portarias.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SetorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Setor getSetorSample1() {
        return new Setor().id(1L).nome("nome1").sigla("sigla1");
    }

    public static Setor getSetorSample2() {
        return new Setor().id(2L).nome("nome2").sigla("sigla2");
    }

    public static Setor getSetorRandomSampleGenerator() {
        return new Setor().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString()).sigla(UUID.randomUUID().toString());
    }
}
