import { ReactNode } from "react";

export interface CardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  description?: string;
}
