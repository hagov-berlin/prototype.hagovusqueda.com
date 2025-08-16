import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef } from "react";
import styles from "./form.module.css";
import { urlWithQueryParams } from "./utils";

type FormProps = {
  loading: boolean;
};

export default function Form(props: FormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current || props.loading) return;
    const searchTerm = inputRef.current.value;
    const newUrl = urlWithQueryParams({
      searchTerm,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subtitle}>Buscar en el Archivo Hagovero</h2>
      <div className={styles.mainForm}>
        <div className={styles.inputContainer}>
          <img className={styles.searchIcon} src="/search.png" />
          <input
            type="text"
            ref={inputRef}
            className={styles.input}
            disabled={props.loading}
            defaultValue={searchParams.get("q") || undefined}
            placeholder='Por ej: "Morfleps"'
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Buscar
        </button>
      </div>
    </form>
  );
}
