package br.gov.pa.semas.portarias.domain;

import static br.gov.pa.semas.portarias.domain.PerfilTestSamples.*;
import static br.gov.pa.semas.portarias.domain.SetorTestSamples.*;
import static br.gov.pa.semas.portarias.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.gov.pa.semas.portarias.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = getUsuarioSample1();
        Usuario usuario2 = new Usuario();
        assertThat(usuario1).isNotEqualTo(usuario2);

        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);

        usuario2 = getUsuarioSample2();
        assertThat(usuario1).isNotEqualTo(usuario2);
    }

    @Test
    void perfilTest() throws Exception {
        Usuario usuario = getUsuarioRandomSampleGenerator();
        Perfil perfilBack = getPerfilRandomSampleGenerator();

        usuario.setPerfil(perfilBack);
        assertThat(usuario.getPerfil()).isEqualTo(perfilBack);

        usuario.perfil(null);
        assertThat(usuario.getPerfil()).isNull();
    }

    @Test
    void setorTest() throws Exception {
        Usuario usuario = getUsuarioRandomSampleGenerator();
        Setor setorBack = getSetorRandomSampleGenerator();

        usuario.setSetor(setorBack);
        assertThat(usuario.getSetor()).isEqualTo(setorBack);

        usuario.setor(null);
        assertThat(usuario.getSetor()).isNull();
    }
}
