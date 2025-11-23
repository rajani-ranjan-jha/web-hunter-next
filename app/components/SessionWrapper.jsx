"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";


export function SessionWrapper({children}) {
  return <SessionProvider>{children}</SessionProvider>;
}