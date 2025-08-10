import { FormEvent, useRef } from "react";
import styles from "./form.module.css";

type FormProps = {
  onSubmit: (searchTerm: string) => void;
};

export default function Form(props: FormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;
    props.onSubmit(inputRef.current.value);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subtitle}>Buscar en el Archivo Hagovero</h2>
      <input type="text" ref={inputRef} className={styles.input} />
    </form>
  );
}
