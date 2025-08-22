import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import styles from "./form.module.css";
import { defaultParams, urlWithQueryParams } from "./utils";
import Button from "./button";
import { useHagovSearchParams } from "./hooks";
import { Show } from "@/data/types";

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
          <input
            type="checkbox"
            defaultChecked={ignoreAccents}
            ref={ignoreAccentsRef}
            disabled={props.loading}
          />
          Ignorar acentos
        </label>
      </div>
      <div className={advancedOptionsClassName}>
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
      <div className={advancedOptionsClassName}>
        <label>Buscar en</label>
        <select ref={showSelectRef} disabled={props.loading}>
          <option value="CS" selected={show === "CS"}>
            Costa Stream
          </option>
          <option value="ESPECIAL" selected={show === "ESPECIAL"}>
            Especiales Blender
          </option>
          <option value="HAA" selected={show === "HAA"}>
            Hay Algo Ahi
          </option>
          <option value="HYF" selected={show === "HYF"}>
            Horrible y Fascinante
          </option>
          <option value="SCDY" selected={show === "SCDY"}>
            San Clemente del Youtube
          </option>
        </select>
      </div>
    </form>
  );
}
