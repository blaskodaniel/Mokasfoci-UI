"use client";

import { TransactionType } from "enums/transactions";

const Tag = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: TransactionType;
}) => {
  const getBackgroundClass = (type: TransactionType) => {
    switch (type) {
      case TransactionType.create:
        return "bg-[var(--color-green)]";
      case TransactionType.modify:
        return "bg-[var(--color-yellow)]";
      case TransactionType.remove:
        return "bg-[var(--color-red)]";
      default:
        return "bg-[var(--color-gray)]";
    }
  };

  return <span className={`${TagItem} ${getBackgroundClass(type)}`}>{children}</span>;
};

export const TagItem = "rounded-[5px] p-[5px] text-white";

export default Tag;
