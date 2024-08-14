"use client";

import styled from "styled-components";

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`;
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-color-third);
  padding: 35px;
  margin-top: 10%;
  height: fit-content;
`;
export const LoginButton = styled.button`
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: var(--button-color-blue);
  color: var(--text-color);
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
`;
export const LoginTitle = styled.h1`
  margin-bottom: 15px;
`;
export const LoginInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--bg-color);
  color: var(--text-color);
`;
export const LoginError = styled.p<{
  margintop?: number;
  textcenter?: boolean;
}>`
  color: var(--color-red);
  margin-bottom: 10px;
  font-size: 1.3rem;
  width: 100%;
  padding-left: 2px;
  ${({ margintop }) => margintop && `margin-top: ${margintop}px;`}
  ${({ textcenter }) => textcenter && `text-align: center;`}
`;
export const LoginLabel = styled.label`
  margin-bottom: 5px;
  font-size: 1.3rem;
  padding-left: 3px;
  width: 100%;
`;
