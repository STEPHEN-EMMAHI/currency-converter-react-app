<div align="center">
  <h1>Currency Converter</h1>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![API](https://img.shields.io/badge/ExchangeRate--API-v6-2E7D32?style=for-the-badge)

[Requirements](#-project-requirements) · [Getting Started](#-getting-started) · [How It Works](#-how-it-works) · [Roadmap](#-roadmap)

## </div>

## 👋 Introduction

Ever tried to work out what 250 US dollars is worth in Ghanaian cedis while a shop assistant waits? This small React app is built to answer that question. It pulls the list of world currencies from a live exchange-rate API and lets you pick a "from" and a "to" currency in a clean, mobile-friendly interface.

It is also a great learning codebase. In a handful of files you get a real-world tour of `useEffect` data fetching, loading and error states, request cancellation with `AbortController`, and Tailwind CSS utility styling.

---

## 📋 Project Requirements

| Requirement                               | Why you need it                                 |
| ----------------------------------------- | ----------------------------------------------- |
| **Node.js** (current LTS recommended)     | Runs the Vite dev server and build              |
| **npm** (or another Node package manager) | Installs dependencies                           |
| **ExchangeRate-API key**                  | Authenticates requests to the `/codes` endpoint |
| A modern browser                          | Uses `fetch` and `AbortController`              |

You can get a free API key by signing up at [exchangerate-api.com](https://www.exchangerate-api.com/).

---

## 📦 Dependencies

| Package               | Role                                                |
| --------------------- | --------------------------------------------------- |
| `react` / `react-dom` | UI components and rendering                         |
| `vite`                | Dev server and bundler (provides `import.meta.env`) |
| `tailwindcss`         | Utility-first styling, imported in `src/index.css`  |

The **Inter** font is loaded from Google Fonts in `src/index.css`, so no extra install is needed.

---

## 🚀 Getting Started

### 1. Install packages

```bash
npm install
```

### 2. Add your API key

Create a file named `.env` in the project root:

```bash
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

> [!IMPORTANT]
> Vite only exposes variables that start with `VITE_`. Keep your `.env` file out of version control, and remember that anything bundled into a browser app is visible to users. A free-tier key is fine here, but never ship a sensitive key this way.

### 3. Run the app

```bash
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`. Open it and you should see the converter with two dropdowns.

> [!TIP]
> These commands assume the default Vite scripts. If yours differ, check the `scripts` section of `package.json`.

---

## 🗂 Project Structure

```text
src/
├── main.jsx                 # Entry point, mounts <App /> in StrictMode
├── App.jsx                  # Layout: Header + Converter
├── index.css                # Tailwind import and Inter font
└── components/
    ├── Header.jsx           # Page title
    └── Converter.jsx        # State, data fetching and the form UI
```

Think of `App` as the frame on a wall: it holds `Header` and `Converter` and does nothing else. All the interesting work lives in `Converter`.

---

## 🔍 How It Works

### State at a glance

`Converter` keeps five pieces of state. Each one answers a single question.

| State                  | Question it answers                          |
| ---------------------- | -------------------------------------------- |
| `currencies`           | Which currencies can the user pick?          |
| `fromSelectedCurrency` | What are we converting from? (default `USD`) |
| `toSelectedCurrency`   | What are we converting to? (default `GHS`)   |
| `isLoadingCurrencies`  | Are we still waiting for the API?            |
| `isError`              | Did something go wrong?                      |

### Fetching currencies safely

When the component mounts, an effect calls the `/codes` endpoint. An `AbortController` cancels the request if the component unmounts first, like hanging up the phone before the other person answers.

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

A few details worth noticing:

- `response.ok` catches HTTP errors, because `fetch` only rejects on network failures.
- An aborted request is treated as normal, not as an error.
- The `finally` block skips the loading update after an abort, avoiding a state update on an unmounted component.
  > [!NOTE]
  > The API returns `supported_codes` as pairs such as `["USD", "United States Dollar"]`. The `map` call turns each pair into an object with `code` and `name`, which is easier to render.

### Early returns for loading and errors

Rather than nesting conditions inside the JSX, the component returns early. The main form only renders once data is ready.

```jsx
if (isError) return <p className="text-center">❌Data failed to load</p>;
```

### Rendering the dropdowns

Each dropdown is a controlled `select`. React owns the value, and every change flows back through state.

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

The "To" section mirrors this and pairs it with a disabled number input that will display the converted amount.

### Styling with Tailwind

Styles are plain utility classes, so there are no separate CSS files to chase. The number inputs hide their browser spinners using arbitrary variants:

```jsx
className="border p-1 w-full text-center
  [appearance:textfield]
  [&::-webkit-outer-spin-button]:appearance-none
  [&::-webkit-inner-spin-button]:appearance-none"
```

---

## 🧭 Roadmap

- [ ] Add a swap button for the two currencies
- [ ] Debounce amount changes to avoid extra requests
- [ ] Extract `SelectCountryField` and `AmountConversion` into shared components with real props

---

## 🔧 Troubleshooting

| Symptom                       | Likely cause                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "Data failed to load" appears | Missing or invalid `VITE_EXCHANGE_RATE_API_KEY`, or a network problem. Check the browser console for the status code. |
| Key changes are ignored       | Restart `npm run dev`. Vite reads `.env` at startup.                                                                  |
| Dropdowns are empty           | The API response did not include `supported_codes`. Check your key and plan limits.                                   |

---

## 🎉 Conclusion

You now have the full picture: a small React app that fetches currency data safely, handles loading and error states cleanly, and styles itself with Tailwind.

If you try the project, spot a bug, or build on the roadmap, open an issue or a pull request. Feedback and ideas are very welcome. Happy converting! 💸
