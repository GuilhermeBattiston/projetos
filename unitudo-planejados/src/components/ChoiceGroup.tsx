import type { Option } from "../content.ts";
import type { BriefingField } from "../utils/briefing.ts";
import Photo from "./Photo.tsx";
interface Props {
  name: BriefingField;
  title: string;
  options: Option[];
  value: string;
  onChange: (name: BriefingField, value: string) => void;
  error?: string;
  visual?: boolean;
}
export default function ChoiceGroup({
  name,
  title,
  options,
  value,
  onChange,
  error,
  visual = false,
}: Props) {
  return (
    <fieldset
      className={`choice-group${visual ? " visual" : ""}`}
      id={`brief-${name}`}
      aria-describedby={error ? `error-${name}` : undefined}
    >
      <legend>
        {title}
        <span>*</span>
      </legend>
      <div className="choices">
        {options.map((option) => (
          <label
            className={`choice${value === option.id ? " selected" : ""}`}
            key={option.id}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(name, option.id)}
              aria-invalid={Boolean(error)}
            />
            {visual &&
              (option.image ? (
                <Photo name={option.image} alt="" />
              ) : (
                <span className="other-environment" aria-hidden="true">
                  +
                </span>
              ))}
            <span className="choice-label">{option.label}</span>
            <i aria-hidden="true" />
          </label>
        ))}
      </div>
      {error && (
        <p className="field-error" id={`error-${name}`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
