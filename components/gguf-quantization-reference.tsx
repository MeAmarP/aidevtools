import { ggufQuantizationTypes } from "@/lib/calculations";

export default function GgufQuantizationReference() {
  return (
    <details className="quant-reference">
      <summary>GGUF quantization types and meanings (32)</summary>
      <p>
        Meanings and formats follow the{" "}
        <a
          href="https://huggingface.co/docs/hub/gguf#quantization-types"
          target="_blank"
          rel="noreferrer"
        >
          Hugging Face GGUF reference
        </a>
        . Effective bits per weight are estimates; some tensor types are intended
        for intermediate or scalar data, not model weights.
      </p>
      <div className="quant-reference-scroll">
        <table aria-label="GGUF tensor types and meanings">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Meaning</th>
              <th scope="col">Effective bpw</th>
            </tr>
          </thead>
          <tbody>
            {ggufQuantizationTypes.map((type) => (
              <tr key={type.name}>
                <th scope="row"><code>{type.name}</code></th>
                <td>{type.meaning}</td>
                <td>{type.bitsPerWeight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}