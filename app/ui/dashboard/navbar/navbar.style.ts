"use client";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
  background-color: var(--bg-color-second);
  border-radius: 10px;
  margin-bottom: 15px;
`;
export const Title = styled.div`
  font-size: 1.5rem;
  color: var(--text-color-second);
  text-transform: capitalize;
`;
export const Menu = styled.div`
  button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: none;
  }
`;
