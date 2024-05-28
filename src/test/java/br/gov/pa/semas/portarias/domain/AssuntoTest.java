package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.AssuntoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssuntoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Assunto.class);
        Assunto assunto1 = getAssuntoSample1();
        Assunto assunto2 = new Assunto();
        assertThat(assunto1).isNotEqualTo(assunto2);

        assunto2.setId(assunto1.getId());
        assertThat(assunto1).isEqualTo(assunto2);

        assunto2 = getAssuntoSample2();
        assertThat(assunto1).isNotEqualTo(assunto2);
    }
}
