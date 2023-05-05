import React, { useState, useEffect } from "react";
import { inventory } from "./data";

export const Check = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const performSearch = debounce(() => {
    fetch(
      "https://SEWJN80HTN-dsn.algolia.net/1/indexes/rairdonshondaofburien-legacymigration0222_production_inventory_high_to_low/query",
      {
        headers: {
          "X-Algolia-API-Key": "179608f32563367799314290254e3e44",
          "X-Algolia-Application-Id": "SEWJN80HTN",
        },
        method: "POST",
        body: JSON.stringify({
          query: query,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => setResults(data.hits));
  }, 500);

  useEffect(() => {
    performSearch();
  }, [query]);

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <>
      <div className="border m-4 rounded-lg  border-white border-opacity-25">
        <input
          className="bg-transparent p-4 w-full"
          value={query}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col space-y-1 px-4">
        {results.map((r) => (
          <>
            <div className="flex space-x-2 justify-between border border-white hover:bg-white hover:bg-opacity-20 transition-all border-opacity-20 rounded pr-2 p-1">
              <div className="min-w-24 w-24 h-16 overflow-hidden">
                <img className="w-full h-auto" src={r.thumbnail} />
              </div>
              <div className="flex flex-col  flex-grow">
                <a href={r.link}>{`${r.year} ${r.make} ${r.model}`}</a>
                <span className="text-sm opacity-30">{r.vin}</span>
                <span className="text-xs">{r.miles} miles</span>
              </div>
              <div>
                <span>${r.our_price}</span>
              </div>
            </div>
            {/* <pre className="text-xs">{JSON.stringify(r, null, 2)}</pre> */}
          </>
        ))}
      </div>

      {/* <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre> */}
    </>
  );
};

function checkInventory(query) {
  fetch(
    "https://SEWJN80HTN-dsn.algolia.net/1/indexes/rairdonshondaofburien-legacymigration0222_production_inventory_high_to_low/query",
    {
      headers: {
        "X-Algolia-API-Key": "179608f32563367799314290254e3e44",
        "X-Algolia-Application-Id": "SEWJN80HTN",
      },
      method: "POST",
      body: JSON.stringify({
        query: "YOUR_SEARCH_QUERY",
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data.hits));
}
