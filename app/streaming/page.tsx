"use client";

import { useEffect, useState } from "react";

const decoder = new TextDecoder();

export default function Page() {
  const [output, setOutput] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) {
      return;
    }
    (async () => {
      const response = await fetch("/streaming/api");
      if (response.body === null) {
        return;
      }
      const reader = response.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        setOutput((output) => output + decoder.decode(value));
      }
    })();
  }, [started]);

  return (
    <div>
      <h1>Streaming</h1>
      <button onClick={() => setStarted(true)}>Start</button>
      <pre>{output}</pre>
    </div>
  );
}
