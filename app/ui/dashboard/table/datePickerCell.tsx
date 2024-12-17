"use client";

import { DateTimePicker } from "@ui/global/dateTimePicker";
import * as React from "react";

export function DatePickerCell() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      granularity="minute"
      displayFormat={{ hour24: "MMM dd - HH:mm" }}
      className="w-[180px]"
    />
  );
}
