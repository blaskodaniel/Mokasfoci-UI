"use client";

import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
`;
export const LayoutMenu = styled.div`
  flex: 1;
  background-color: var(--bg-color-second);
  padding: 0 2%;
  max-width: 300px;
  color: var(--text-color);
`;
export const LayoutContent = styled.div`
  flex: 5;
  padding: 1rem 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
`;
