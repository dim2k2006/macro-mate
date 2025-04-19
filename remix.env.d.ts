/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { ComponentType } from "react";

declare global {
  /**
   * CSS modules
   */
  interface CSSModuleClasses {
    [key: string]: string;
  }

  // For CSS modules
  declare module "*.css" {
    const classes: CSSModuleClasses;
    export default classes;
  }
}

