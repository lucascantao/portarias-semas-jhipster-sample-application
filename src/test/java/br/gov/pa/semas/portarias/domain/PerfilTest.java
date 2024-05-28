package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.PerfilTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PerfilTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Perfil.class);
        Perfil perfil1 = getPerfilSample1();
        Perfil perfil2 = new Perfil();
        assertThat(perfil1).isNotEqualTo(perfil2);

        perfil2.setId(perfil1.getId());
        assertThat(perfil1).isEqualTo(perfil2);

        perfil2 = getPerfilSample2();
        assertThat(perfil1).isNotEqualTo(perfil2);
    }
}
