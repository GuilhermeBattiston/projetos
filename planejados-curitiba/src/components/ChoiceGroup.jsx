import { KitchenPlan } from "./Shared.jsx";
export default function ChoiceGroup({
  name,
  title,
  choices,
  value,
  onChange,
  error,
  plans = false,
}) {
  return (
    <fieldset
      className={`choice-group ${plans ? "with-plans" : ""}`}
      id={`pref-${name}`}
      aria-describedby={error ? `error-${name}` : undefined}
    >
      <legend>
        {title}
        <span>*</span>
      </legend>
      <div className="choices">
        {choices.map((item) => (
          <label
            className={`choice ${value === item.id ? "selected" : ""}`}
            key={item.id}
          >
            <input
              type="radio"
              name={name}
              value={item.id}
              checked={value === item.id}
              onChange={() => onChange(name, item.id)}
              aria-invalid={Boolean(error)}
            />
            {plans && <KitchenPlan type={item.id} />}
            <span>{item.label}</span>
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
