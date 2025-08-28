import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import styles from "./form.module.css";
import { defaultParams, urlWithQueryParams } from "./utils";
import Button from "./button";
import { useHagovSearchParams } from "./hooks";
import { Show } from "@/data/types";
import { AVAILABLE_SHOWS } from "@/data/shows";

type FormProps = {
  loading: boolean;
};

export default function Form(props: FormProps) {
  const { searchTerm, show, ignoreAccents, matchWholeWords } = useHagovSearchParams();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(
    ignoreAccents !== defaultParams.ignoreAccents ||
      matchWholeWords !== defaultParams.matchWholeWords
  );
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreAccentsRef = useRef<HTMLInputElement>(null);
  const matchWholeWordsRef = useRef<HTMLInputElement>(null);
  const showSelectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !inputRef.current ||
      !ignoreAccentsRef.current ||
      !matchWholeWordsRef.current ||
      !showSelectRef.current ||
      props.loading
    )
      return;
    const searchTerm = inputRef.current.value;
    const ignoreAccents = ignoreAccentsRef.current.checked;
    const matchWholeWords = matchWholeWordsRef.current.checked;
    const show = showSelectRef.current.value as Show;
    const newUrl = urlWithQueryParams({
      ...defaultParams,
      searchTerm,
      ignoreAccents,
      matchWholeWords,
      show,
    });
    router.push(newUrl, { scroll: false });
  };

  const optionalAdvancedOptionsClassName = `${styles.advancedOptions} ${
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
      <div className={optionalAdvancedOptionsClassName}>
        <label>
          <input
            type="checkbox"
            defaultChecked={ignoreAccents}
            ref={ignoreAccentsRef}
            disabled={props.loading}
          />
          Ignorar acentos
        </label>
      </div>
      <div className={optionalAdvancedOptionsClassName}>
        <label>
          <input
            type="checkbox"
            defaultChecked={matchWholeWords}
            ref={matchWholeWordsRef}
            disabled={props.loading}
          />
          Buscar palabras completas
        </label>
      </div>
      <div className={`${styles.advancedOptions} ${styles.advancedOptionsVisible}`}>
        <label>Buscar en</label>
        <select ref={showSelectRef} disabled={props.loading} defaultValue={show}>
          {Object.entries(AVAILABLE_SHOWS)
            .sort()
            .map(([showKey, showName]) => {
              if (showKey === "MAGA" && show !== "MAGA") return null;
              return (
                <option key={showKey} value={showKey}>
                  {showName}
                </option>
              );
            })}
        </select>
      </div>
    </form>
  );
}
