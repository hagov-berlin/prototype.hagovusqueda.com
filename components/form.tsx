import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef } from "react";
import styles from "./form.module.css";
import { urlWithQueryParams } from "./utils";
import Button from "./button";

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

  const defaultValue = searchParams.get("q") || undefined;

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subtitle}>Buscador de dialogos en el historial de streams de HAA</h2>
      <div className={styles.mainForm}>
        <div className={styles.inputContainer}>
          <img className={styles.searchIcon} src="/search.png" />
          <input
            type="text"
            ref={inputRef}
            className={styles.input}
            disabled={props.loading}
            defaultValue={defaultValue}
            autoFocus={!defaultValue}
            placeholder='Por ej: "Morfleps"'
          />
        </div>
        <Button searchButton>BUSCAR</Button>
      </div>
    </form>
  );
}
