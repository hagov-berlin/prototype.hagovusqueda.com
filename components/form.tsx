import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import styles from "./form.module.css";
import { defaultParams, urlWithQueryParams } from "./utils";
import Button from "./button";
import { useHagovSearchParams } from "./hooks";

type FormProps = {
  loading: boolean;
};

export default function Form(props: FormProps) {
  const { searchTerm, show, ignoreAccents, matchWholeWords } = useHagovSearchParams();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(
    show !== defaultParams.show ||
      ignoreAccents !== defaultParams.ignoreAccents ||
      matchWholeWords !== defaultParams.matchWholeWords
  );
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreAccentsRef = useRef<HTMLInputElement>(null);
  const matchWholeWordsRef = useRef<HTMLInputElement>(null);
  const showHAARef = useRef<HTMLInputElement>(null);
  const showHYFRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !inputRef.current ||
      !ignoreAccentsRef.current ||
      !matchWholeWordsRef.current ||
      !showHAARef.current ||
      !showHYFRef.current ||
      props.loading
    )
      return;
    const searchTerm = inputRef.current.value;
    const ignoreAccents = ignoreAccentsRef.current.checked;
    const matchWholeWords = matchWholeWordsRef.current.checked;
    const show = showHAARef.current.checked ? "HAA" : "HYF";
    const newUrl = urlWithQueryParams({
      ...defaultParams,
      searchTerm,
      ignoreAccents,
      matchWholeWords,
      show,
    });
    router.push(newUrl, { scroll: false });
  };

  const advancedOptionsClassName = `${styles.advancedOptions} ${
    showAdvancedOptions ? styles.advancedOptionsVisible : ""
  }`;

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subtitle}>Buscador de dialogos en el historial de streams</h2>
      <div>
        <div className={styles.mainForm}>
          <div className={styles.inputContainer}>
            <img className={styles.searchIcon} src="/search.png" />
            <input
              type="text"
              ref={inputRef}
              className={styles.input}
              disabled={props.loading}
              defaultValue={searchTerm}
              autoFocus={!searchTerm}
              placeholder='Por ej: "Morfleps"'
            />
          </div>
          <Button searchButton>BUSCAR</Button>
        </div>
        <div className={styles.advancedOptionsToggleContainer}>
          <button
            className={styles.advancedOptionsButton}
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            disabled={props.loading}
          >
            Busqueda avanzada
          </button>
        </div>
      </div>
      <div className={advancedOptionsClassName}>
        <label>
          <input type="checkbox" defaultChecked={ignoreAccents} ref={ignoreAccentsRef} />
          Ignorar acentos
        </label>
      </div>
      <div className={advancedOptionsClassName}>
        <label>
          <input type="checkbox" defaultChecked={matchWholeWords} ref={matchWholeWordsRef} />
          Buscar palabras completas
        </label>
      </div>
      <div className={advancedOptionsClassName}>
        <label>Buscar en</label>
        <label>
          <input type="radio" name="show" defaultChecked={show === "HAA"} ref={showHAARef} />
          Hay Algo Ahi
        </label>
        <label>
          <input type="radio" name="show" defaultChecked={show === "HYF"} ref={showHYFRef} />
          Horrible y Fascinante
        </label>
      </div>
    </form>
  );
}
