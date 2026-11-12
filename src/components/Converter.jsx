import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_FREECURRENCY_API_KEY;

export default function Converter() {
  // array to store the currencies data
  const [currencies, setCurrencies] = useState([]);

  // an array to contain the selected currency we want to convert from
  const [fromSelectedCurrency, setfromSelectedCurrency] = useState("USD");

  // an array to contain the selected currency we want to convert to
  const [toSelectedCurrency, setToSelectedCurrency] = useState("GHC");

  // state to show whether currencies has been loaded or not
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);

  // state to display an error or not
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadCurrenciesData() {
      try {
        setIsLoadingCurrencies(true);
        setIsError(false);

        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/codes`,
        );

        // check if the server responded to an error
        if (!response.ok)
          throw new Error(`Currency API request failed: ${response.status}`);

        const results = await response.json();
        setCurrencies(
          Object.values(
            results.supported_codes.map(([code, name]) => ({ code, name })),
            0,
          ),
        );
      } catch (error) {
        console.error("data failed to load", error);
        setIsError(true);
      } finally {
        setIsLoadingCurrencies(false);
      }
    }

    loadCurrenciesData();
  }, []);

  // if the currency is loading, return a message
  if (isLoadingCurrencies)
    return <p className="text-center">Loading data...</p>;

  // if there is an error, return a message
  if (isError) return <p className="text-center">❌Data failed to load</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* From */}
      <section>
        <h3 className="font-bold my-4 text-center">FROM</h3>
        <div className="flex flex-col gap-3">
          <SelectCountryField>
            <select
              name="from-country"
              id="from-country"
              value={fromSelectedCurrency}
              className="w-full p-1 lg:cursor-pointer text-center border"
              onChange={(e) => setfromSelectedCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </SelectCountryField>
          <AmountConversion>
            <input
              type="number"
              id="amount-to-convert"
              name="amount-to-convert"
              placeholder="Amount"
              className="border p-1 w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoComplete="country-name"
            />
          </AmountConversion>
        </div>
      </section>

      {/* To */}
      <section>
        <h3 className="font-bold my-4 text-center">TO</h3>
        <div className="flex flex-col gap-3">
          <SelectCountryField>
            <select
              name="to-country"
              id="to-country"
              value={toSelectedCurrency}
              className="w-full p-1 lg:cursor-pointer text-center border"
              onChange={(e) => setToSelectedCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </SelectCountryField>
          <AmountConversion>
            <input
              type="number"
              id="conversion-rate"
              name="conversion-rate"
              className="border p-1 w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoComplete="country-name"
              disabled
            />
          </AmountConversion>
        </div>
      </section>
    </div>
  );
}

function SelectCountryField({ children }) {
  return <div>{children}</div>;
}

function AmountConversion({ children }) {
  return <div>{children}</div>;
}
