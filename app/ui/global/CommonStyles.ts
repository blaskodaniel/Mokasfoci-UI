"use client";

import styled from "styled-components";
import Image from "next/image";

export const Title = styled.h2`
  color: var(--text-color-second);
  font-weight: 400;
  margin-bottom: 10px;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 15px;
`;

export const AvatarImg = styled(Image)`
  object-fit: cover;
  border-radius: 50%;
`;
