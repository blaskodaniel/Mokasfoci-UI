"use client";

import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: auto;
  grid-template-areas: "sidebar main";
  min-height: 100vh;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
export const LayoutMenu = styled.aside<{ isopen: string }>`
  grid-area: sidebar;
  background-color: var(--bg-color-second);
  padding: 0 20px;
  transition: width 0.3s ease-in-out;
  width: var(--sidebar-width);

  @media (max-width: 800px) {
    position: fixed;
    z-index: 1;
    min-height: 100vh;
    width: ${({ isopen }) =>
      isopen === "true" ? "var(--sidebar-width)" : "0"};
    padding: ${({ isopen }) => (isopen === "true" ? "0 20" : 0)}px;
    overflow: hidden;

    .show {
      width: var(--sidebar-width);
      padding: 0 20px;
    }
  }
`;
export const LayoutContent = styled.div`
  grid-area: main;
  padding: 1rem 20px;
  overflow-y: auto;
`;
