package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.AjudaTestSamples.*;
import static br.gov.pa.semas.portarias.domain.TopicoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AjudaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ajuda.class);
        Ajuda ajuda1 = getAjudaSample1();
        Ajuda ajuda2 = new Ajuda();
        assertThat(ajuda1).isNotEqualTo(ajuda2);

        ajuda2.setId(ajuda1.getId());
        assertThat(ajuda1).isEqualTo(ajuda2);

        ajuda2 = getAjudaSample2();
        assertThat(ajuda1).isNotEqualTo(ajuda2);
    }

    @Test
    void topicoTest() throws Exception {
        Ajuda ajuda = getAjudaRandomSampleGenerator();
        Topico topicoBack = getTopicoRandomSampleGenerator();

        ajuda.addTopico(topicoBack);
        assertThat(ajuda.getTopicos()).containsOnly(topicoBack);
        assertThat(topicoBack.getAjudas()).containsOnly(ajuda);

        ajuda.removeTopico(topicoBack);
        assertThat(ajuda.getTopicos()).doesNotContain(topicoBack);
        assertThat(topicoBack.getAjudas()).doesNotContain(ajuda);

        ajuda.topicos(new HashSet<>(Set.of(topicoBack)));
        assertThat(ajuda.getTopicos()).containsOnly(topicoBack);
        assertThat(topicoBack.getAjudas()).containsOnly(ajuda);

        ajuda.setTopicos(new HashSet<>());
        assertThat(ajuda.getTopicos()).doesNotContain(topicoBack);
        assertThat(topicoBack.getAjudas()).doesNotContain(ajuda);
    }
}
