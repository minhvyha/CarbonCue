import { MAX_HAR_BYTES, parseHar } from "@/lib/website-har";

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    if (event.data.size > MAX_HAR_BYTES) throw new Error("Choose a HAR file smaller than 50 MiB.");
    const summary = parseHar(await event.data.text());
    self.postMessage({ summary });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "Unable to read this capture." });
  }
  // The caller terminates the worker after the summary, releasing the raw file and parsed archive.
};
