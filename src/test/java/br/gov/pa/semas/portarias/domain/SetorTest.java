package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.SetorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SetorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Setor.class);
        Setor setor1 = getSetorSample1();
        Setor setor2 = new Setor();
        assertThat(setor1).isNotEqualTo(setor2);

        setor2.setId(setor1.getId());
        assertThat(setor1).isEqualTo(setor2);

        setor2 = getSetorSample2();
        assertThat(setor1).isNotEqualTo(setor2);
    }
}
