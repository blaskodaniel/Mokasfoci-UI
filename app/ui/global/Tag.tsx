"use client";

import { TransactionType } from "enums/transactions";
import styled from "styled-components";

const Tag = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: TransactionType;
}) => {
  const getBackgroundColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.create:
        return "var(--color-green)";
      case TransactionType.modify:
        return "var(--color-yellow)";
      case TransactionType.remove:
        return "var(--color-red)";
      default:
        return "var(--color-gray)";
    }
  };

  return <TagItem type={getBackgroundColor(type)}>{children}</TagItem>;
};

export const TagItem = styled.span<{ type: string }>`
  border-radius: 5px;
  padding: 5px;
  font-size: 1.4rem;
  color: white;
  background-color: ${({ type }) => type};
`;

export default Tag;
