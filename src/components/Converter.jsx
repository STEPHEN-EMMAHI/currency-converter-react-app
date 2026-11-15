import { useEffect, useState } from "react";

const exchangeRateApiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

export default function Converter() {
  // List of currencies returned by the API.
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  // Currency code selected in the FROM field.
  const [fromCurrencyCode, setFromCurrencyCode] = useState("USD");

  // Currency code selected in the TO field.
  const [toCurrencyCode, setToCurrencyCode] = useState("GHS");

  // Whether an API request is in progress.
  const [isLoading, setIsLoading] = useState(true);

  // Whether an API request has failed.
  const [hasError, setHasError] = useState(false);

  // Amount entered in the FROM field.
  const [amountToConvert, setAmountToConvert] = useState("");

  // Exchange rate returned for the selected currency pair.
  const [conversionRate, setConversionRate] = useState("");

  // Calculate the displayed value from the TO currency code and exchange rate.
  const convertedAmount =
    amountToConvert !== "" && conversionRate !== ""
      ? (Number(amountToConvert) * Number(conversionRate)).toFixed(2)
      : "";

  useEffect(() => {
    const abortController = new AbortController();

    async function loadAvailableCurrencies() {
      try {
        setIsLoading(true);
        setHasError(false);

        const apiResponse = await fetch(
          `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/codes`,
          { signal: abortController.signal },
        );

        // Reject unsuccessful currency-list responses.
        if (!apiResponse.ok)
          throw new Error(`Currency API request failed: ${apiResponse.status}`);

        const currencyData = await apiResponse.json();
        setAvailableCurrencies(
          Object.values(
            currencyData.supported_codes.map(
              ([currencyCode, currencyName]) => ({
                code: currencyCode,
                name: currencyName,
              }),
            ),
            0,
          ),
        );
      } catch (caughtError) {
        if (caughtError.name === "AbortError") {
          return;
        }
        setHasError(true);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAvailableCurrencies();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadConversionRate() {
      try {
        setIsLoading(true);
        setHasError(false);

        const apiResponse = await fetch(
          `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/pair/${fromCurrencyCode}/${toCurrencyCode}`,
          {
            signal: abortController.signal,
          },
        );

        if (!apiResponse.ok)
          throw new Error(`Rate api request failed': ${apiResponse.status}`);

        const exchangeRateData = await apiResponse.json();
        setConversionRate(exchangeRateData.conversion_rate);
      } catch (caughtError) {
        if (caughtError.name === "AbortError") return;
        setHasError(true);
      } finally {
        setIsLoading(false);
        if (!abortController.signal.aborted);
      }
    }

    loadConversionRate();

    return () => abortController.abort();
  }, [fromCurrencyCode, toCurrencyCode]);

  // Show an error message if an API request fails.
  if (hasError) return <p className="text-center">❌Data failed to load</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* From */}
      <section>
        <h3 className="font-bold my-4 text-center">FROM</h3>
        <div className="flex flex-col gap-3 max-md:mx-12">
          <SelectCountryField>
            <select
              name="from-country"
              id="from-country"
              value={fromCurrencyCode}
              className="w-full p-1 lg:cursor-pointer text-center border"
              onChange={(event) => setFromCurrencyCode(event.target.value)}
            >
              {availableCurrencies.map((currency) => (
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
              value={amountToConvert}
              className="border p-1 w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoComplete="country-name"
              onChange={(event) => setAmountToConvert(event.target.value)}
            />
          </AmountConversion>
        </div>
      </section>

      {/* To */}
      <section>
        <h3 className="font-bold my-4 text-center">TO</h3>
        <div className="flex flex-col gap-3 max-md:mx-12">
          <SelectCountryField>
            <select
              name="to-country"
              id="to-country"
              value={toCurrencyCode}
              className="w-full p-1 lg:cursor-pointer text-center border"
              onChange={(event) => setToCurrencyCode(event.target.value)}
            >
              {availableCurrencies.map((currency) => (
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
              value={convertedAmount}
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
