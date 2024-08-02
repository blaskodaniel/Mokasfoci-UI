"use client";

import Link from "next/link";
import styled from "styled-components";

export const Container = styled.div`
  position: sticky;
  height: 100svh;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;

  div {
    display: flex;
    flex-direction: column;
  }
`;
export const UserName = styled.span`
  font-size: 2rem;
  font-weight: 700;
`;
export const UserRole = styled.span`
  font-size: 1.5rem;
  font-weight: 300;
`;

export const Category = styled.span`
  color: var(--text-color-second);
  font-weight: bold;
  font-size: 1.3rem;
  margin: 10px 0;
`;

export const Menulink = styled(Link)<{ isactive: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px;
  border-radius: 10px;
  margin: 5px 0;
  ${({ isactive = "false" }) =>
    isactive === "true" && `background-color: #2e374a;`}

  &:hover {
    background-color: #2e374a;
  }
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
  background: none;

  &:hover {
    background-color: #2e374a;
  }
`;
