# Currency Converter

Ever tried to work out what 250 US dollars is worth in Ghanaian cedis while a shop assistant waits? This small React app is built to answer that question. It pulls the list of world currencies from a live exchange-rate API and lets you pick a "from" and a "to" currency in a clean, mobile-friendly interface.

The project is a compact example of a few patterns every front-end developer meets sooner or later: fetching data on mount, handling loading and error states, and cancelling requests safely. If you are learning React or just want a tidy starting point for a converter, you are in the right place.

> **Project status:** the currency list, selectors and layout are working.

## Project Requirements

Before you start, make sure you have the following:

- **Node.js** 20 or newer, with **npm** (or another package manager you prefer)
- A free API key from [ExchangeRate-API](https://www.exchangerate-api.com/)
- A modern browser like Chrome, Edge, Firefox or Safari

## Dependencies

The source files show which tools the project relies on:

| Tool                                                                  | Role                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| [React](https://react.dev/)                                           | UI components and state (`useState`, `useEffect`)            |
| [Vite](https://vite.dev/)                                             | Dev server and build tool (the code reads `import.meta.env`) |
| [Tailwind CSS](https://tailwindcss.com/)                              | Utility-first styling, loaded with `@import "tailwindcss"`   |
| [ExchangeRate-API v6](https://www.exchangerate-api.com/docs/overview) | Source of the supported currency codes                       |
| Inter (Google Fonts)                                                  | Page typography                                              |

All packages are installed with a single `npm install`, so there is nothing to add by hand.

## Getting Started

### 1. Install the packages

```bash
npm install
```

### 2. Add your API key

Vite only exposes environment variables that start with `VITE_`. Create a `.env` file in the project root:

```bash
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

Keep this file out of version control by adding `.env` to your `.gitignore`. Restart the dev server whenever you change it, because Vite reads the file at startup.

## How to Run the Application

Start the development server:

```bash
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`. Open it in your browser and you should see the "Currency Converter" heading, followed by a **FROM** and a **TO** section.

To create an optimized production build and preview it locally:

```bash
npm run build
npm run preview
```

## How It Works

The app is split into three small components. Think of it like a kitchen: `App` is the head chef, `Header` plates the title, and `Converter` does the real cooking.

```text
src/
├── main.jsx               # mounts <App /> into the page
├── App.jsx                # composes Header + Converter
├── index.css              # Tailwind import and Inter font
└── components/
    ├── Header.jsx         # page title
    └── Converter.jsx      # data fetching, state and form fields
```

### Application state

`Converter` keeps track of everything with five pieces of state. Each one has a single, clear job:

```jsx
const [currencies, setCurrencies] = useState([]);
const [fromSelectedCurrency, setfromSelectedCurrency] = useState("USD");
const [toSelectedCurrency, setToSelectedCurrency] = useState("GHC");
const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
const [isError, setIsError] = useState(false);
```

The first holds the list of currencies, the next two hold the user's selections, and the last two drive the loading and error messages.

### Fetching currencies safely

When the component mounts, `useEffect` requests the supported currency codes. An `AbortController` is attached to the request so it can be cancelled if the component unmounts before the response arrives.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadCurrenciesData() {
    try {
      setIsLoadingCurrencies(true);
      setIsError(false);

      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/codes`,
        { signal: controller.signal },
      );

      if (!response.ok)
        throw new Error(`Currency API request failed: ${response.status}`);

      const results = await response.json();
      setCurrencies(
        results.supported_codes.map(([code, name]) => ({ code, name })),
      );
    } catch (error) {
      if (error.name === "AbortError") return;
      setIsError(true);
    } finally {
      if (!controller.signal.aborted) setIsLoadingCurrencies(false);
    }
  }

  loadCurrenciesData();
}, []);
```

A few details are worth noticing:

- `response.ok` catches HTTP errors, which `fetch` does not throw on its own.
- The API returns each currency as a `[code, name]` pair, and `map` turns those pairs into easy-to-read objects.
- An aborted request is not treated as a failure, so users never see a false error message.

### Loading and error states

Before rendering the form, the component returns early if the data is not ready. This keeps the main JSX free of conditionals.

```jsx
if (isError) return <p className="text-center">❌Data failed to load</p>;
```

### Controlled selectors

Each dropdown is a controlled input: its value comes from state, and every change updates that state. Both dropdowns are built from the same `currencies` array.

```jsx
<select
  name="from-country"
  id="from-country"
  value={fromSelectedCurrency}
  onChange={(e) => setfromSelectedCurrency(e.target.value)}
>
  {currencies.map((currency) => (
    <option key={currency.code} value={currency.code}>
      {currency.code} - {currency.name}
    </option>
  ))}
</select>
```

The result might look like this in the browser:

```text
FROM                          TO
[ USD - United States Dollar ]  [ GHS - Ghanaian Cedi ]
[ Amount                     ]  [ (result, read-only)  ]
```

## Current Limitations

This project is a work in progress, and a few things are worth knowing:

- **API key in the browser.** Variables prefixed with `VITE_` are bundled into the client code, so anyone can see them. This is fine for a free-tier learning project, but a production app should route requests through a small backend.

## Ideas for Next Steps

- Add a "swap currencies" button
- Cache the currency list in `localStorage` to save API calls
- Add tests with Vitest and React Testing Library

## Conclusion

You now have a clear picture of how this currency converter is put together: a Vite-powered React app that loads live data safely, handles loading and error states, and renders two controlled selectors styled with Tailwind. The foundation is solid, and the remaining work, adding the amount state and the conversion call, makes a great hands-on exercise.

If you try it out, find a bug or build the conversion feature, contributions are welcome. Open an issue, share your improvements in a pull request, and happy coding!
