import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdOutlineHistory } from "react-icons/md";
import { VINComponent } from "./VINdisplay";

export const VehicleCard = ({ v, num, ...props }) => {
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
          <span className="text-sm ">
            <VINComponent vin={v?.vin} />
          </span>
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
            {/* <div className="opacity-20">{num + 1}</div> */}
            <a
              href={`http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DEY_0&vin=${v?.vin}`}
              target="_blank"
              aria-describedby="audioeye_new_window_message"
              className="rounded-full border p-2 border-white border-opacity-25 hover:bg-white hover:bg-opacity-20"
            >
              <MdOutlineHistory />
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
