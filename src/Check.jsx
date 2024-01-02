import React, { useState, useEffect, useReducer } from "react";
import {
  MdClear,
  MdKeyboardArrowDown,
  MdOutlineHistory,
  MdOutlineSettingsSystemDaydream,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import { inventory } from "./data";
import { VehicleCard } from "./VehicleCard";

const burienAPI = {
  name: "Burien",
  "X-Algolia-API-Key": "179608f32563367799314290254e3e44",
  "X-Algolia-Application-Id": "SEWJN80HTN",
  index:
    "rairdonshondaofburien-legacymigration0222_production_inventory_high_to_low",
};

const rairdonAPI = {
  name: "Rairdon",
  "X-Algolia-API-Key": "ec7553dd56e6d4c8bb447a0240e7aab3",
  "X-Algolia-Application-Id": "V3ZOVI2QFZ",
  index: "rairdonautomotivegroup_production_inventory_low_to_high",
};

export const Check = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [api, setAPI] = useState(burienAPI);
  const [total, setTotal] = useState(0);

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
        `https://${api["X-Algolia-Application-Id"]}-dsn.algolia.net/1/indexes/${api.index}/query`,
        {
          headers: {
            "X-Algolia-API-Key": api["X-Algolia-API-Key"],
            "X-Algolia-Application-Id": api["X-Algolia-Application-Id"],
          },
          method: "POST",
          body: JSON.stringify({
            hitsPerPage: 10,
            query: query,
            facets: [
              "features",
              "our_price",
              "lightning.lease_monthly_payment",
              "lightning.finance_monthly_payment",
              "type",
              "api_id",
              "year",
              "make",
              "model",
              "model_number",
              "trim",
              "body",
              "doors",
              "miles",
              "ext_color_generic",
              "features",
              "lightning.isSpecial",
              "lightning.locations",
              "lightning.status",
              "lightning.class",
              "fueltype",
              "engine_description",
              "transmission_description",
              "metal_flags",
              "city_mpg",
              "hw_mpg",
              "days_in_stock",
              "ford_SpecialVehicle",
              "lightning.locations.meta_location",
              "ext_color",
              "title_vrp",
              "int_color",
              "certified",
              "lightning",
              "location",
              "drivetrain",
              "int_options",
              "ext_options",
              "cylinders",
              "vin",
              "stock",
              "msrp",
              "our_price_label",
              "finance_details",
              "lease_details",
              "thumbnail",
              "link",
              "objectID",
              "algolia_sort_order",
              "date_modified",
              "hash",
            ],
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          setResults(data.hits);
          setTotal(data.nbHits);
        });
    }, 1000);

    setLoading(true);
    performSearch();
    setLoading(false);
    return () => {};
  }, [query, api]);

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <>
      <MenuBar
        setQuery={setQuery}
        query={query}
        handleChange={handleChange}
        api={api}
        setAPI={setAPI}
        total={total}
      />
      <div className="flex flex-col md:space-y-1 md:px-4">
        {isLoading && <div>Loading....</div>}
        {results.map((r, i) => (
          <VehicleCard num={i} key={r?.stock || i} v={r} />
        ))}
      </div>

      {/* <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre> */}
    </>
  );
};

const MenuBar = ({
  setQuery,
  query,
  handleChange,
  api,
  setAPI,
  total,
  ...props
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <div className="flex ">
        <div className="border flex-grow m-2 md:m-4 rounded-lg focus-within:outline-2 focus-within:bg-white focus-within:bg-opacity-20  border-white border-opacity-25 flex items-center space-x-2 text-xl px-2">
          <MdSearch />
          <input
            className="bg-transparent px-2 py-1 w-full outline-none"
            value={query}
            onChange={handleChange}
            placeholder="Search HoBI...."
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
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            className="border rounded-full p-1 text-2xl mr-3 ml-1 bg-white border-opacity-20 opacity-80 border-white bg-opacity-0 hover:bg-opacity-20 transition-all"
          >
            <MdSettings />
          </button>
        </div>
      </div>
      {settingsOpen && (
        <Settings
          api={api}
          setAPI={setAPI}
          total={total}
          setSettingsOpen={setSettingsOpen}
        />
      )}
    </>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return { ...state, [action.payload.settingName]: action.payload.value };
    default:
      return state;
  }
};

const Settings = ({ api, setAPI, total, setSettingsOpen, ...props }) => {
  // Load settings data from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("settingsData");
    if (storedData) {
      dispatch({ type: "LOAD_DATA", payload: JSON.parse(storedData) });
    }
  }, []);

  // Define state and dispatch for managing local data
  const [state, dispatch] = useReducer(reducer, settingsObj);

  // Update setting value
  const updateSetting = (settingName, value) => {
    dispatch({ type: "UPDATE_SETTING", payload: { settingName, value } });
  };

  // Save data to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem("settingsData", JSON.stringify(state));
  }, [state]);

  return (
    <div className="mx-2 mb-4 rounded border-white border-opacity-20 border  py-0.5">
      <div className="flex justify-between items-center opacity-80 border-b border-white border-opacity-20 px-4 pb-0.5">
        <div className="flex items-center space-x-2">
          <MdSettings /> <span>Settings</span>
        </div>
        <button
          type="button"
          className="flex"
          onClick={() => setSettingsOpen(false)}
        >
          <MdClear />
        </button>
      </div>
      <div className="flex text-xs">
        <button
          className={`py-2 px-4 m-2 border border-white border-opacity-20 rounded-xl ${
            api.name === burienAPI.name ? "bg-blue-500" : ""
          }`}
          onClick={() => setAPI(burienAPI)}
        >
          {burienAPI.name}
        </button>
        <button
          className={`py-2 px-4 m-2 border border-white border-opacity-20 rounded-xl ${
            api.name === rairdonAPI.name ? "bg-red-500" : ""
          }`}
          onClick={() => setAPI(rairdonAPI)}
        >
          {rairdonAPI.name}
        </button>
        <div className="p-2 m-2">Total results: {total.toString()}</div>
      </div>
      {false &&
        state.map((setting) => (
          <div key={setting.id}>
            <h3>{setting.settingName}</h3>
            <p>{setting.description}</p>
            {setting.type === "numeric" ? (
              <input
                className="bg-red-500"
                type="number"
                value={state[setting.settingName] || 0}
                onChange={(e) =>
                  updateSetting(setting.settingName, e.target.value)
                }
              />
            ) : setting.type === "selection" ? (
              <select
                value={state[setting.settingName] || ""}
                onChange={(e) =>
                  updateSetting(setting.settingName, e.target.value)
                }
              >
                {/* Render options based on your specific requirements */}
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            ) : setting.type === "options" ? (
              /* Render options based on your specific requirements */
              <div>
                <input
                  type="radio"
                  id={`option1_${setting.id}`}
                  name={`options_${setting.id}`}
                  value="option1"
                  checked={state[setting.settingName] === "option1"}
                  onChange={() => updateSetting(setting.settingName, "option1")}
                />
                <label htmlFor={`option1_${setting.id}`}>Option 1</label>
                <br />
                <input
                  type="radio"
                  id={`option2_${setting.id}`}
                  name={`options_${setting.id}`}
                  value="option2"
                  checked={state[setting.settingName] === "option2"}
                  onChange={() => updateSetting(setting.settingName, "option2")}
                />
                <label htmlFor={`option2_${setting.id}`}>Option 2</label>
                <br />
                <input
                  type="radio"
                  id={`option3_${setting.id}`}
                  name={`options_${setting.id}`}
                  value="option3"
                  checked={state[setting.settingName] === "option3"}
                  onChange={() => updateSetting(setting.settingName, "option3")}
                />
                <label htmlFor={`option3_${setting.id}`}>Option 3</label>
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
};

const settingsObj = [
  {
    id: "hitsPerPage",
    settingName: "Hits per Page",
    type: "numeric",
    description: "Adjust the number of search results displayed per page.",
    value: 10,
  },
  {
    id: "facets",
    settingName: "Facets",
    type: "selection",
    description: "Choose which facets to display for filtering search results.",
    value: [
      "features",
      "our_price",
      "lightning.lease_monthly_payment",
      "lightning.finance_monthly_payment",
      "type",
      "api_id",
      "year",
      "make",
      "model",
      "model_number",
      "trim",
      "body",
      "doors",
      "miles",
      "ext_color_generic",
      "features",
      "lightning.isSpecial",
      "lightning.locations",
      "lightning.status",
      "lightning.class",
      "fueltype",
      "engine_description",
      "transmission_description",
      "metal_flags",
      "city_mpg",
      "hw_mpg",
      "days_in_stock",
      "ford_SpecialVehicle",
      "lightning.locations.meta_location",
      "ext_color",
      "title_vrp",
      "int_color",
      "certified",
      "lightning",
      "location",
      "drivetrain",
      "int_options",
      "ext_options",
      "cylinders",
      "vin",
      "stock",
      "msrp",
      "our_price_label",
      "finance_details",
      "lease_details",
      "thumbnail",
      "link",
      "objectID",
      "algolia_sort_order",
      "date_modified",
      "hash",
    ],
  },
  {
    id: "searchDebounceTime",
    settingName: "Debounce Time",
    type: "numeric",
    description: "Set the delay between user input and search query execution.",
    value: 1000,
  },
  {
    id: "sorting",
    settingName: "Sorting Options",
    type: "options",
    description: "Select the attribute and order for sorting search results.",
    value: { attribute: "price", order: "asc" },
    hidden: true,
  },
  {
    id: "storeSelection",
    settingName: "Store Selection",
    type: "selection",
    options: [
      {
        name: "Burien",
        "X-Algolia-API-Key": "179608f32563367799314290254e3e44",
        "X-Algolia-Application-Id": "SEWJN80HTN",
        index:
          "rairdonshondaofburien-legacymigration0222_production_inventory_high_to_low",
      },
      {
        name: "Rairdon",
        "X-Algolia-API-Key": "ec7553dd56e6d4c8bb447a0240e7aab3",
        "X-Algolia-Application-Id": "V3ZOVI2QFZ",
        index: "rairdonautomotivegroup_production_inventory_low_to_high",
      },
    ],
    description:
      "Choose a preferred store for searching within a specific dealership.",
    value: 0,
  },
];
