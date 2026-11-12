export default function Converter() {
  return (
    <div className="flex flex-col items-center">
      {/* From */}
      <section>
        <h3 className="font-bold my-4 text-center">FROM</h3>
        <div className="flex flex-col gap-3">
          <SelectCountryField
            id="from-country"
            name="from-country"
            label="from-country"
          />
          <AmountConversion>
            <label htmlFor="amount-to-convert" className="mr-4">
              Amount
            </label>
            <input
              type="number"
              id="amount-to-convert"
              name="amount-to-convert"
              placeholder="Amount"
              className="border p-1 w-[50%] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoComplete="country-name"
            />
          </AmountConversion>
        </div>
      </section>

      {/* To */}
      <section>
        <h3 className="font-bold my-4 text-center">TO</h3>
        <div className="flex flex-col gap-3">
          <SelectCountryField
            id="to-country"
            name="to-country"
            label="to-country"
          />
          <AmountConversion>
            <label htmlFor="conversion-rate" className="mr-9.5">
              Rate
            </label>
            <input
              type="number"
              id="conversion-rate"
              name="conversion-rate"
              className="border p-1 w-[50%] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoComplete="country-name"
              disabled
            />
          </AmountConversion>
        </div>
      </section>
    </div>
  );
}

function SelectCountryField({ id, name, label }) {
  return (
    <div>
      <label htmlFor={label} className="mr-4">
        Country
      </label>
      <select
        name={name}
        id={id}
        className="border p-1 w-[50%] appearance-none text-center"
      >
        <option value="ghana">Ghana</option>
        <option value="america">america</option>
        <option value="canada">canada</option>
      </select>
    </div>
  );
}

function AmountConversion({ children }) {
  return <div>{children}</div>;
}
