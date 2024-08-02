"use client";

import styled from "styled-components";
import { Breakpoints } from "util/responsive";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Section = styled.div<{ gap?: string }>`
  display: flex;
  gap: ${({ gap = "20px" }) => gap};

  @media (max-width: ${Breakpoints.tablet}) {
    flex-direction: column;
  }
`;
