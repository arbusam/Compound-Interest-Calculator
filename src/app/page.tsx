"use client";

import { useEffect, useRef, useState } from "react";
import { Frequency } from "@/types/frequency";
import Graph from "./graph";
import { Datepicker } from "flowbite-react";

export default function Home() {
  const [initialDeposit, setInitialDeposit] = useState("");
  const [regularDeposit, setRegularDeposit] = useState("");
  const [years, setYears] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [inflationRate, setInflationRate] = useState("3%");
  const [depositShowDropdown, setDepositShowDropdown] = useState(false);
  const [compoundShowDropdown, setCompoundShowDropdown] = useState(false);
  const [regularDepositFrequency, setRegularDepositFrequency] = useState(
    Frequency.Monthly,
  );
  const [compoundFrequency, setCompoundFrequency] = useState(Frequency.Monthly);

  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [useCustomRegularDeposits, setUseCustomRegularDeposits] =
    useState(false);

  const [useRegularDepositEndDateChange, setUseRegularDepositEndDateChange] =
    useState(false);

  const [annualPromotionRate, setAnnualPromotionRate] = useState("");
  const [regularDepositEndDate, setRegularDepositEndDate] = useState<Date>(
    new Date(),
  );

  const depositDropdownRef = useRef<HTMLDivElement>(null);
  const compoundDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        depositDropdownRef.current &&
        !depositDropdownRef.current.contains(event.target as Node)
      ) {
        setDepositShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [depositShowDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        compoundDropdownRef.current &&
        !compoundDropdownRef.current.contains(event.target as Node)
      ) {
        setCompoundShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [compoundShowDropdown]);

  const handleInitialDepositChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    if (!value.startsWith("$")) {
      value = "$" + value.replace("$", "");
    }

    const regex = /^\$\d*\.?\d{0,2}$/;

    if (regex.test(value)) {
      setInitialDeposit(value);
    }
  };

  const handleRegularDepositChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    if (!value.startsWith("$")) {
      value = "$" + value.replace("$", "");
    }

    const regex = /^\$\d*\.?\d{0,2}$/;

    if (regex.test(value)) {
      setRegularDeposit(value);
    }
  };

  const handleYearsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    const regex = /^\d*$/;

    if (regex.test(value)) {
      if (Number(value) > 99) {
        value = "99";
      }
      setYears(value);
    }
  };

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    const regex = /^(?!.*\..*\.)\d*\.?\d*%?$/;

    if (regex.test(value)) {
      setInterestRate(value);
    }
  };

  const handleInflationRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    const regex = /^(?!.*\..*\.)\d*\.?\d*%?$/;

    if (regex.test(value)) {
      setInflationRate(value);
    }
  };

  const handleInitialDepositBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    while (
      value.startsWith("$0") &&
      value.length > 2 &&
      !value.replace("$0", "").startsWith(".")
    ) {
      value = "$" + value.slice(2);
    }

    if (value.includes(".") && value.split(".")[1].length === 0) {
      value = value.replace(".", "");
    }

    if (value.includes(".") && value.split(".")[1] === "0") {
      value = value.replace(".0", "");
    }

    if (value.includes(".") && value.split(".")[1] === "00") {
      value = value.replace(".00", "");
    }

    if (value === "$" || value === "") {
      value = "$0";
    }

    setInitialDeposit(value);
  };

  const handleRegularDepositBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    while (
      value.startsWith("$0") &&
      value.length > 2 &&
      !value.replace("$0", "").startsWith(".")
    ) {
      value = "$" + value.slice(2);
    }

    if (value.includes(".") && value.split(".")[1].length === 0) {
      value = value.replace(".", "");
    }

    if (value.includes(".") && value.split(".")[1] === "0") {
      value = value.replace(".0", "");
    }

    if (value.includes(".") && value.split(".")[1] === "00") {
      value = value.replace(".00", "");
    }

    if (value === "$" || value === "") {
      value = "$0";
    }

    setRegularDeposit(value);
  };

  const handleInterestRateBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    while (
      value.startsWith("0") &&
      value.length > 1 &&
      !value.startsWith(".")
    ) {
      value = value.slice(1);
    }

    if (
      value.includes(".") &&
      value.split(".")[1].replace("%", "").length === 0
    ) {
      value = value.replace(".", "");
    }

    if (value.includes(".")) {
      const [integerPart, fractionalPartWithPercent] = value.split(".");
      let fractionalPart = fractionalPartWithPercent.replace("%", "");

      while (fractionalPart.endsWith("0")) {
        fractionalPart = fractionalPart.slice(0, -1);
      }

      if (fractionalPart === "") {
        value = integerPart;
      } else {
        value = integerPart + "." + fractionalPart;
      }

      if (fractionalPartWithPercent.endsWith("%")) {
        value += "%";
      }
    }

    if (value === "" || value === "." || value === "%") {
      value = "0%";
    }

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (!value.endsWith("%")) {
      value = value + "%";
    }

    setInterestRate(value);
  };

  const handleInflationRateBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    while (
      value.startsWith("0") &&
      value.length > 1 &&
      !value.startsWith(".")
    ) {
      value = value.slice(1);
    }

    if (value.includes(".") && value.split(".")[1].length === 0) {
      value = value.replace(".", "");
    }

    if (value.includes(".")) {
      const [integerPart, fractionalPartWithPercent] = value.split(".");
      let fractionalPart = fractionalPartWithPercent.replace("%", "");

      while (fractionalPart.endsWith("0")) {
        fractionalPart = fractionalPart.slice(0, -1);
      }

      if (fractionalPart === "") {
        value = integerPart;
      } else {
        value = integerPart + "." + fractionalPart;
      }

      if (fractionalPartWithPercent.endsWith("%")) {
        value += "%";
      }
    }

    if (value === "" || value === "." || value === "%") {
      value = "0%";
    }

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (!value.endsWith("%")) {
      value = value + "%";
    }

    setInflationRate(value);
  };

  const handleDepositDropdownToggled = () => {
    setDepositShowDropdown(!depositShowDropdown);
  };

  const handleCompoundDropdownToggled = () => {
    setCompoundShowDropdown(!compoundShowDropdown);
  };

  const handleDepoistDropdownItemClicked = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const value = event.currentTarget.textContent;
    if (value) {
      setRegularDepositFrequency(value as Frequency);
    }
    setDepositShowDropdown(false);
  };

  const handleCompoundDropdownItemClicked = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const value = event.currentTarget.textContent;
    if (value) {
      setCompoundFrequency(value as Frequency);
    }
    setCompoundShowDropdown(false);
  };

  const handleUseCustomRegularDepositsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUseCustomRegularDeposits(event.target.checked);
  };

  const handleAnnualPromotionRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    const regex = /^(?!.*\..*\.)\d*\.?\d*%?$/;

    if (regex.test(value)) {
      setAnnualPromotionRate(value);
    }
  };

  const handleAnnualPromotionRateBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;

    while (
      value.startsWith("0") &&
      value.length > 1 &&
      !value.startsWith(".")
    ) {
      value = value.slice(1);
    }

    if (
      value.includes(".") &&
      value.split(".")[1].replace("%", "").length === 0
    ) {
      value = value.replace(".", "");
    }

    if (value.includes(".")) {
      const [integerPart, fractionalPartWithPercent] = value.split(".");
      let fractionalPart = fractionalPartWithPercent.replace("%", "");

      while (fractionalPart.endsWith("0")) {
        fractionalPart = fractionalPart.slice(0, -1);
      }

      if (fractionalPart === "") {
        value = integerPart;
      } else {
        value = integerPart + "." + fractionalPart;
      }

      if (fractionalPartWithPercent.endsWith("%")) {
        value += "%";
      }
    }

    if (value === "" || value === "." || value === "%") {
      value = "0%";
    }

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (!value.endsWith("%")) {
      value = value + "%";
    }

    setAnnualPromotionRate(value);
  };

  const handleUseRegularDepositEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUseRegularDepositEndDateChange(event.target.checked);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col items-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-center text-4xl font-bold">
          Advanced Compound Interest Calculator
        </h1>
        <h2 className="text-center text-xl mt-2 mb-5">
          Find the best strategy to help your money will grow, adapted to
          changes in your life.
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="mt-5">
          <div className="flex flex-col items-left mt-5 ml-5">
            <label
              htmlFor="initialDeposit"
              className="block mb-2 text-md font-semibold"
            >
              Initial Deposit
            </label>
            <input
              id="initialDeposit"
              type="text"
              value={initialDeposit}
              placeholder="$"
              onChange={handleInitialDepositChange}
              onBlur={handleInitialDepositBlur}
              className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col items-left mt-5 ml-5">
            <label
              htmlFor="regularDeposit"
              className="block mb-2 text-md font-semibold"
            >
              Regular Deposit
            </label>
            <input
              id="regularDeposit"
              type="text"
              value={regularDeposit}
              placeholder="$"
              onChange={handleRegularDepositChange}
              onBlur={handleRegularDepositBlur}
              className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col items-left mt-5 ml-5">
            <label htmlFor="years" className="block mb-2 text-md font-semibold">
              Number of Years
            </label>
            <input
              id="years"
              type="text"
              value={years}
              onChange={handleYearsChange}
              className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-5">
          <div
            className="flex flex-col items-left mt-5 ml-5"
            ref={depositDropdownRef}
          >
            <label
              htmlFor="regularDepositFrequency"
              className="block mb-2 text-md font-semibold"
            >
              Regular Deposit Frequency
            </label>
            <div className="relative inline-block">
              <button
                id="regularDepositFrequency"
                onClick={handleDepositDropdownToggled}
                data-dropdown-toggle="dropdown"
                className="text-gray-900 border w-full border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 h-10 text-center inline-flex items-center bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="button"
              >
                {regularDepositFrequency}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {depositShowDropdown && (
                <div
                  id="dropdown"
                  className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li>
                      <button
                        onClick={handleDepoistDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Daily}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDepoistDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Weekly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDepoistDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Fortnightly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDepoistDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Monthly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDepoistDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Annually}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div
            className="flex flex-col items-left mt-5 ml-5"
            ref={compoundDropdownRef}
          >
            <label
              htmlFor="compoundFrequency"
              className="block mb-2 text-md font-semibold"
            >
              Compound Frequency
            </label>
            <div className="relative inline-block">
              <button
                id="compoundFrequency"
                onClick={handleCompoundDropdownToggled}
                data-dropdown-toggle="dropdown"
                className="text-gray-900 border w-full border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 h-10 text-center inline-flex items-center bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="button"
              >
                {compoundFrequency}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {compoundShowDropdown && (
                <div
                  id="dropdown"
                  className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li>
                      <button
                        onClick={handleCompoundDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Daily}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleCompoundDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Weekly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleCompoundDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Fortnightly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleCompoundDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Monthly}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleCompoundDropdownItemClicked}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {Frequency.Annually}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-col items-left mt-5 ml-5">
            <label
              htmlFor="initialDeposit"
              className="block mb-2 text-md font-semibold"
            >
              Annual Interest Rate
            </label>
            <input
              id="initialDeposit"
              type="text"
              value={interestRate}
              onChange={handleInterestRateChange}
              onBlur={handleInterestRateBlur}
              className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col items-left mt-3 ml-5">
            <label
              htmlFor="regularDeposit"
              className="block text-md font-semibold"
            >
              Annual Inflation Rate
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 mb-1">
              If unsure, leave it at 3%
            </p>
            <input
              id="regularDeposit"
              type="text"
              value={inflationRate}
              onChange={handleInflationRateChange}
              onBlur={handleInflationRateBlur}
              className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center mt-5">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => {
            setAdvancedOptionsOpen(!advancedOptionsOpen);
          }}
        >
          Advanced Options
          {advancedOptionsOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>
      </div>

      {advancedOptionsOpen && (
        <div className="flex flex-col mt-5 w-1/3">
          <div className="flex items-center">
            <input
              id="checkbox"
              type="checkbox"
              value=""
              checked={useCustomRegularDeposits}
              onChange={handleUseCustomRegularDepositsChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="checkbox"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Use Custom Regular Deposits
            </label>
          </div>
          {useCustomRegularDeposits && (
            <div>
              <div className="flex flex-col items-left mt-5 ml-1">
                <label
                  htmlFor="annualPromotionRate"
                  className="block mb-2 text-md font-semibold"
                >
                  Annual Promotion Rate
                </label>
                <input
                  id="annualPromotionRate"
                  type="text"
                  value={annualPromotionRate}
                  onChange={handleAnnualPromotionRateChange}
                  onBlur={handleAnnualPromotionRateBlur}
                  className="block p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />

                <div className="flex items-center mt-5">
                  <input
                    id="retirementCheckbox"
                    type="checkbox"
                    value=""
                    checked={useRegularDepositEndDateChange}
                    onChange={handleUseRegularDepositEndDateChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="retirementCheckbox"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Use Regular Deposit End Date (Retirement)
                  </label>
                </div>

                {useRegularDepositEndDateChange && (
                  <div>
                    <label
                      htmlFor="regularDepositEndDatePicker"
                      className="block text-md font-semibold mt-3"
                    >
                      Regular Deposit End Date
                    </label>
                    <Datepicker
                      id="regularDepositEndDatePicker"
                      className="mt-2"
                      defaultValue={new Date()}
                      showClearButton={false}
                      minDate={new Date()}
                      value={regularDepositEndDate ?? new Date()}
                      onChange={(date) =>
                        setRegularDepositEndDate(
                          Array.isArray(date) ? date[0] : (date as Date),
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10" />
      {initialDeposit !== "" &&
        regularDeposit !== "" &&
        years !== "" &&
        interestRate !== "" && (
          <Graph
            years={Number(years)}
            initialDeposit={Number(initialDeposit.replace("$", ""))}
            regularDeposit={Number(regularDeposit.replace("$", ""))}
            interestRate={Number(interestRate.replace("%", ""))}
            inflationRate={Number(inflationRate.replace("%", ""))}
            regularDepositFrequency={regularDepositFrequency}
            compoundFrequency={compoundFrequency}
            annualPromotionRate={
              useCustomRegularDeposits
                ? Number(annualPromotionRate.replace("%", ""))
                : undefined
            }
            regularDepositEndDate={
              useCustomRegularDeposits && useRegularDepositEndDateChange
                ? regularDepositEndDate
                : undefined
            }
          />
        )}
      {/* TODO: Add disclaimer below graph and in footer */}
    </div>
  );
}
