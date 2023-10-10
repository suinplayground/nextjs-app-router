"use client";
import { useEffect, useState } from "react";
import { increment, serverDate, submitForm, throwError } from "./action";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useFormState as useFormState } from "react-dom";

export default function Home() {
  return (
    <main>
      <Increment />
      <ThrowError />
      <Form />
      <ServerDate />
    </main>
  );
}

function Increment() {
  const [number, setNumber] = useState(0);
  return (
    <div>
      <button
        onClick={async () => {
          const n = await increment(number);
          setNumber(n);
        }}
      >
        Increment
      </button>
      {number}
    </div>
  );
}

function ThrowError() {
  return (
    <div>
      <button
        onClick={async () => {
          await throwError();
        }}
      >
        Throws error
      </button>
    </div>
  );
}

function Form() {
  const [state, formAction] = useFormState(submitForm, {});
  return (
    <form action={formAction}>
      <FormInner />
      <pre>state = {JSON.stringify(state, null, 2)}</pre>
    </form>
  );
}

function FormInner() {
  const { pending, method } = useFormStatus();
  return (
    <>
      <input type="text" name="foo" />
      <button type="submit" aria-disabled={pending}>
        Submit
      </button>
      <pre>status = {JSON.stringify({ method, pending }, null, 2)}</pre>
    </>
  );
}

function ServerDate() {
  const [date, setDate] = useState("");
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  useEffect(() => {
    (async () => {
      if (!started) {
        return;
      }
      const timer = setInterval(async () => {
        const date = await serverDate();
        setDate(date);
      }, 1000);
      setTimer(timer);

      setDate(date);
    })();
  }, [started]);
  return (
    <div>
      <button onClick={() => setStarted(true)}>Start</button>
      <time>{date}</time>
    </div>
  );
}
