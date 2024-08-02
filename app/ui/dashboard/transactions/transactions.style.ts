"use client";

import { TransactionType } from "enums/transactions";
import Image from "next/image";
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  background-color: var(--bg-color-second);
  border-radius: 10px;
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;

  td {
    padding: 10px;
  }

  .name {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const Avatart = styled(Image)`
  object-fit: cover;
  border-radius: 50%;
`;
