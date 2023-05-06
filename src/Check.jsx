import React, { useState, useEffect } from "react";
import {
  MdClear,
  MdKeyboardArrowDown,
  MdOutlineHistory,
  MdSearch,
} from "react-icons/md";
import { inventory } from "./data";

export const Check = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(true);

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  useEffect(() => {
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
    }, 1000);

    setLoading(true);
    performSearch();
    setLoading(false);
    return () => {};
  }, [query]);

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <>
      <div className="border m-2 md:m-4 rounded-lg focus-within:outline-2 focus-within:bg-white focus-within:bg-opacity-20  border-white border-opacity-25 flex items-center space-x-2 text-xl px-2">
        <MdSearch />
        <input
          className="bg-transparent px-2 py-1 w-full outline-none"
          value={query}
          onChange={handleChange}
          placeholder="Search Honda of Burien Inventory...."
        />
        {query.length > 0 && (
          <button
            className="border rounded-full p-0.5 bg-white bg-opacity-0 hover:bg-opacity-20 transition-all"
            onClick={() => setQuery("")}
          >
            <MdClear />
          </button>
        )}
      </div>
      <div className="flex flex-col md:space-y-1 md:px-4">
        {isLoading && <div>Loading....</div>}
        {results.map((r, i) => (
          <VehicleCard key={r?.stock || i} v={r} />
        ))}
      </div>

      {/* <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre> */}
    </>
  );
};

const VehicleCard = ({ v, ...props }) => {
  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen((v) => !v);

  return (
    <>
      <div className="w-full max-w-full flex space-x-2 justify-between border border-white hover:bg-white hover:bg-opacity-20 transition-all border-opacity-20 md:rounded pr-2 p-1">
        <div className="min-w-24 w-24 h-full flex-shrink-0 overflow-hidden">
          <img className="w-full h-auto" src={v?.thumbnail} />
        </div>
        <div className="flex flex-col justify-between items-start flex-grow truncate">
          <a
            className="whitespace-pre-wrap text-sm  hover:underline"
            href={v?.link}
            target="_blank"
          >
            {`${v?.year} ${v?.make} ${v?.model}`}{" "}
            <span className="opacity-40">{v?.trim}</span>
            {v?.certified > 0 && (
              <span className="mx-2 border rounded text-xs px-1 py-0 bg-blue-600 bg-opacity-50">
                CPO
              </span>
            )}
          </a>

          <span className="text-sm opacity-30">{v?.vin}</span>
          <div className="flex space-x-4 text-xs">
            {v?.miles ? (
              <span className="text-xs">{parseMileage(v.miles)}</span>
            ) : (
              ""
            )}
            {/* {v?.location && (
              <span className="text-xs uppercase">{v.location}</span>
            )} */}
            {v?.lightning?.status && (
              <span className="text-xs uppercase">{v.lightning.status}</span>
            )}
            {v?.days_in_stock && (
              <span className="text-xs opacity-50 ">
                {v.days_in_stock} days
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end ">
          <span>
            {v?.our_price && isNaN(v.our_price) ? "CALL" : "$" + v?.our_price}
          </span>
          <div className="flex space-x-2">
            <a
              href={`http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DEY_0&vin=${v?.vin}`}
              target="_blank"
              aria-describedby="audioeye_new_window_message"
              className="rounded-full border p-2 border-white border-opacity-25 hover:bg-white hover:bg-opacity-20"
            >
              <MdOutlineHistory
                className={`transition-all  ${isOpen ? "rotate-180" : ""}`}
              />
            </a>
            <button
              onClick={toggleOpen}
              className="rounded-full border p-2 border-white border-opacity-25 hover:bg-white hover:bg-opacity-20"
            >
              <MdKeyboardArrowDown
                className={`transition-all  ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <pre className="bg-white bg-opacity-10 rounded border border-white border-opacity-20 text-xs w-full overflow-x-scroll">
          {JSON.stringify(v, null, 2)}
        </pre>
      )}
      {/*  */}
    </>
  );
};

function parseMileage(mileage) {
  return (
    Math.floor(Number(mileage.toString().replace(/\D/g, "")) / 1000) + "k miles"
  );
}
