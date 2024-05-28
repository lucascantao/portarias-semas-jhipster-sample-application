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
 * A Ajuda.
 */
@Entity
@Table(name = "ajudas")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ajuda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @NotNull
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "ajudas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ajudas", "assuntos" }, allowSetters = true)
    private Set<Topico> topicos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Ajuda id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Ajuda titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Set<Topico> getTopicos() {
        return this.topicos;
    }

    public void setTopicos(Set<Topico> topicos) {
        if (this.topicos != null) {
            this.topicos.forEach(i -> i.removeAjuda(this));
        }
        if (topicos != null) {
            topicos.forEach(i -> i.addAjuda(this));
        }
        this.topicos = topicos;
    }

    public Ajuda topicos(Set<Topico> topicos) {
        this.setTopicos(topicos);
        return this;
    }

    public Ajuda addTopico(Topico topico) {
        this.topicos.add(topico);
        topico.getAjudas().add(this);
        return this;
    }

    public Ajuda removeTopico(Topico topico) {
        this.topicos.remove(topico);
        topico.getAjudas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ajuda)) {
            return false;
        }
        return getId() != null && getId().equals(((Ajuda) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ajuda{" +
            "id=" + getId() +
            ", titulo='" + getTitulo() + "'" +
            "}";
    }
}
