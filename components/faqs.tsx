import styles from "./faqs.module.css";

export default function FAQs() {
  return (
    <ul className={styles.faqs}>
      <li>
        <h3>¿Cómo funciona la búsqueda?</h3>
        <p>
          La búsqueda se realiza contra los subtitulos autogenerados de Youtube de todas las
          transmiciones hasta la fecha.
        </p>
      </li>
      <li>
        <h3>¿Por qué mi busqueda no tiene resultados?</h3>
        <p>Los subtitulos autogenerados de Youtube están lejos de ser perfectos.</p>
      </li>
    </ul>
  );
}
