"use client";

export function getCurrentDate(): string {
  const date = new Date();
  const dayOfTheWeek = date.toLocaleString("en-us", { weekday: "long" });
  const month = date.toLocaleString("en-us", { month: "long" });
  const dayOfTheMonth = date.getDate();

  const lastDigitOfDay = dayOfTheMonth % 10;
  const suffix =
    ~~((dayOfTheMonth % 100) / 10) === 1
      ? "th"
      : lastDigitOfDay === 1
      ? "st"
      : lastDigitOfDay === 2
      ? "nd"
      : lastDigitOfDay === 3
      ? "rd"
      : "th";

  return dayOfTheWeek + ", " + month + " " + dayOfTheMonth + suffix;
}
