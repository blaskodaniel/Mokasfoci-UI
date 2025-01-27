"use client";
import { DateTimePicker } from "@ui/dashboard/components/DateTimePicker/dateTimePicker";
import React, { useState } from "react";
import { ColumnProps } from "./types";

const DatePickerCell = <T,>({
  getValue,
  column,
  row,
  table,
}: ColumnProps<T>) => {
  const [date, setDate] = useState<Date | undefined>(new Date(getValue()));

  const onChange = (newDate: Date | undefined) => {
    setDate(newDate);
    table.options.meta?.updateData(row.index, column.id, newDate);
  };

  return (
    <DateTimePicker
      value={date}
      onChange={onChange}
      granularity="minute"
      displayFormat={{ hour24: "MMM dd. HH:mm" }}
      className="w-[180px]"
    />
  );
};

export default DatePickerCell;
