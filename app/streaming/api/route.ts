function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  let i = 0;
  while (true) {
    yield encoder.encode(++i + "\n");
    await sleep(1000);
  }
}

export async function GET() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);
  return new Response(stream, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
