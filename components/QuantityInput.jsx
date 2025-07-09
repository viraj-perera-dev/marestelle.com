import { Plus, Minus } from "lucide-react";

function QuantityInput({ label, name, value, onChange, min = 0 }) {
  const handleIncrease = () => {
    onChange({ target: { name, value: value + 1 } });
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange({ target: { name, value: value - 1 } });
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="block font-medium text-neutral-700 text-md text-start ">
        {label}:
        {label === "Bambini" && (
          <span className="text-xs text-neutral-800 text-start ms-2">
            (fino a 12 anni)
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrease}
          className="w-10 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-700"
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          name={name}
          min={min}
          value={value}
          onChange={onChange}
          className="w-full text-center border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          disabled
        />

        <button
          type="button"
          onClick={handleIncrease}
          className="w-10 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default QuantityInput;
