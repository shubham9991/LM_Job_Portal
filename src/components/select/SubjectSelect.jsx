import React from "react";
import CreatableSelect from "react-select/creatable";

const CreatableMultiSelect = ({
  label,
  name,
  options = [],
  placeholder = "Select or type...",
  value = [],
  onChange,
  error,
}) => {
  const handleChange = (selected) => {
    const values = selected?.map((opt) => opt.value) || [];
    onChange(name, values); // expected to integrate with setValue
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <CreatableSelect
        isMulti
        options={options}
        onChange={handleChange}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={placeholder}
        isClearable
        defaultValue={options.filter((opt) => value.includes(opt.value))}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CreatableMultiSelect;
