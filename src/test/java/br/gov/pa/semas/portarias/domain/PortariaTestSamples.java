package br.gov.pa.semas.portarias.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PortariaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Portaria getPortariaSample1() {
        return new Portaria().id(1L).numero(1L);
    }

    public static Portaria getPortariaSample2() {
        return new Portaria().id(2L).numero(2L);
    }

    public static Portaria getPortariaRandomSampleGenerator() {
        return new Portaria().id(longCount.incrementAndGet()).numero(longCount.incrementAndGet());
    }
}
