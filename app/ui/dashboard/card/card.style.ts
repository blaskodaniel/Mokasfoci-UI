"use client";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 20px;
  border-radius: 10px;
  padding: 20px;
  background-color: var(--bg-color-second);
  width: 100%;

  &:hover {
    background-color: var(--bg-color-third);
  }
`;
export const DataPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const DataTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;
export const DataValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
`;
export const DataInfo = styled.div`
  font-weight: 300;
`;
