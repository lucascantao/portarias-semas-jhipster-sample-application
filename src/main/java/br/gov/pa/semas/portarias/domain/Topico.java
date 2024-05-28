package br.gov.pa.semas.portarias.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Topico.
 */
@Entity
@Table(name = "topicos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Topico implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @NotNull
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_topicos__ajuda",
        joinColumns = @JoinColumn(name = "topicos_id"),
        inverseJoinColumns = @JoinColumn(name = "ajuda_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "topicos" }, allowSetters = true)
    private Set<Ajuda> ajudas = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_topicos__assunto",
        joinColumns = @JoinColumn(name = "topicos_id"),
        inverseJoinColumns = @JoinColumn(name = "assunto_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "topicos" }, allowSetters = true)
    private Set<Assunto> assuntos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Topico id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Topico titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Set<Ajuda> getAjudas() {
        return this.ajudas;
    }

    public void setAjudas(Set<Ajuda> ajudas) {
        this.ajudas = ajudas;
    }

    public Topico ajudas(Set<Ajuda> ajudas) {
        this.setAjudas(ajudas);
        return this;
    }

    public Topico addAjuda(Ajuda ajuda) {
        this.ajudas.add(ajuda);
        return this;
    }

    public Topico removeAjuda(Ajuda ajuda) {
        this.ajudas.remove(ajuda);
        return this;
    }

    public Set<Assunto> getAssuntos() {
        return this.assuntos;
    }

    public void setAssuntos(Set<Assunto> assuntos) {
        this.assuntos = assuntos;
    }

    public Topico assuntos(Set<Assunto> assuntos) {
        this.setAssuntos(assuntos);
        return this;
    }

    public Topico addAssunto(Assunto assunto) {
        this.assuntos.add(assunto);
        return this;
    }

    public Topico removeAssunto(Assunto assunto) {
        this.assuntos.remove(assunto);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Topico)) {
            return false;
        }
        return getId() != null && getId().equals(((Topico) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Topico{" +
            "id=" + getId() +
            ", titulo='" + getTitulo() + "'" +
            "}";
    }
}
