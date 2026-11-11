export default function Converter() {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* From */}
      <section className="flex flex-col gap-4">
        <h3 className="text-center font-bold">From:</h3>
        <div className="flex flex-col gap-4">
          <AmountConversion />
          <SelectCountryField
            id="from-country"
            name="from-country"
            label="from-country"
          />
        </div>
      </section>

      {/* To */}
      <section className="flex flex-col gap-4">
        <h3 className="text-center font-bold">To</h3>
        <SelectCountryField
          id="to-country"
          name="to-country"
          label="to-country"
        />
      </section>
    </div>
  );
}

function SelectCountryField({ id, name, label }) {
  return (
    <div>
      <label htmlFor={label} className="mr-4">
        Country:
      </label>
      <select name={name} id={id} className="border">
        <option value="">Select</option>
        <option value="ghana">Ghana</option>
        <option value="america">america</option>
        <option value="canada">canada</option>
      </select>
    </div>
  );
}

function AmountConversion() {
  return (
    <div>
      <label htmlFor="Amount" className="mr-4">
        Amount
      </label>
      <input
        type="text"
        id="Amount"
        name="Amount"
        placeholder=" Enter Amount"
        className="border"
        autoComplete="country-name"
      />
    </div>
  );
}
