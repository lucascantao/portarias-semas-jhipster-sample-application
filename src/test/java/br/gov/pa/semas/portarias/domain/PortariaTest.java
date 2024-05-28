package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.AssuntoTestSamples.*;
import static br.gov.pa.semas.portarias.domain.PortariaTestSamples.*;
import static br.gov.pa.semas.portarias.domain.SetorTestSamples.*;
import static br.gov.pa.semas.portarias.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PortariaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Portaria.class);
        Portaria portaria1 = getPortariaSample1();
        Portaria portaria2 = new Portaria();
        assertThat(portaria1).isNotEqualTo(portaria2);

        portaria2.setId(portaria1.getId());
        assertThat(portaria1).isEqualTo(portaria2);

        portaria2 = getPortariaSample2();
        assertThat(portaria1).isNotEqualTo(portaria2);
    }

    @Test
    void assuntoTest() throws Exception {
        Portaria portaria = getPortariaRandomSampleGenerator();
        Assunto assuntoBack = getAssuntoRandomSampleGenerator();

        portaria.setAssunto(assuntoBack);
        assertThat(portaria.getAssunto()).isEqualTo(assuntoBack);

        portaria.assunto(null);
        assertThat(portaria.getAssunto()).isNull();
    }

    @Test
    void setorTest() throws Exception {
        Portaria portaria = getPortariaRandomSampleGenerator();
        Setor setorBack = getSetorRandomSampleGenerator();

        portaria.setSetor(setorBack);
        assertThat(portaria.getSetor()).isEqualTo(setorBack);

        portaria.setor(null);
        assertThat(portaria.getSetor()).isNull();
    }

    @Test
    void usuarioTest() throws Exception {
        Portaria portaria = getPortariaRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        portaria.setUsuario(usuarioBack);
        assertThat(portaria.getUsuario()).isEqualTo(usuarioBack);

        portaria.usuario(null);
        assertThat(portaria.getUsuario()).isNull();
    }

    @Test
    void updatedByTest() throws Exception {
        Portaria portaria = getPortariaRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        portaria.setUpdatedBy(usuarioBack);
        assertThat(portaria.getUpdatedBy()).isEqualTo(usuarioBack);

        portaria.updatedBy(null);
        assertThat(portaria.getUpdatedBy()).isNull();
    }

    @Test
    void deletedByTest() throws Exception {
        Portaria portaria = getPortariaRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        portaria.setDeletedBy(usuarioBack);
        assertThat(portaria.getDeletedBy()).isEqualTo(usuarioBack);

        portaria.deletedBy(null);
        assertThat(portaria.getDeletedBy()).isNull();
    }
}
