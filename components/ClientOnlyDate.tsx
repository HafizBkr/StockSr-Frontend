"use client";

import React from "react";

interface ClientOnlyDateProps {
  date: Date | string | null | undefined;
  format?: Intl.DateTimeFormatOptions;
  locale?: string;
}

const defaultFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export default function ClientOnlyDate({
  date,
  format = defaultFormat,
  locale = "fr-FR",
}: ClientOnlyDateProps) {
  if (!date) return <span>N/A</span>;

  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return <span>Date invalide</span>;

  return (
    <span suppressHydrationWarning>
      {dateObj.toLocaleString(locale, format)}
    </span>
  );
}
