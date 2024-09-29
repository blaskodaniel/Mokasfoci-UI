"use client";

import Link from "next/link";
import styled from "styled-components";

export const Container = styled.div`
  position: sticky;
  top: 0;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  position: sticky;
  top: 0;

  div {
    display: flex;
    flex-direction: column;
  }
`;

export const IconInMobile = styled.div`
  svg {
    display: none;
    @media (max-width: 800px) {
      display: block;
    }
  }
`;

export const UserName = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`;
export const UserRole = styled.span`
  font-weight: 300;
`;

export const Category = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color-second);
  font-weight: bold;
  margin: 10px 0;
  cursor: pointer;

  div {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

export const Menulink = styled(Link)<{ isactive: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  ${({ isactive = "false" }) =>
    isactive === "true" && `background-color: #2e374a;`}

  &:hover {
    background-color: #2e374a;
  }
  transition: all 0.4s ease;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px;
  border-radius: 10px;
  margin: 5px 0;
  width: 100%;
  cursor: pointer;
  color: white;
  background: none;

  &:hover {
    background-color: #2e374a;
  }
`;

export const List = styled.div<{ isopen: boolean; elemtsCount: number }>`
  opacity: ${({ isopen }) => (isopen ? 1 : 0)};
  height: ${({ isopen, elemtsCount }) => (isopen ? elemtsCount * 50 : 0)}px;
  overflow: hidden;
  transition: all 0.4s ease;
`;
