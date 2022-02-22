import React, { ReactNode } from "react";
import { SyntaxHighlighterProps } from "react-syntax-highlighter";

const SPEED_CONSTANT = 35 / 1920; // ~ 0.01823

export interface ICodeLine extends SyntaxHighlighterProps {
  text: string;
}

/**
 * Returns only the components that are strings
 */
export function getStringComponentsOrChildren(components: ReactNode) {
  if (typeof components === "string") return [components];
  if (Array.isArray(components)) {
    return components?.filter(
      (comp) =>
        typeof comp.props?.children === "string" || typeof comp === "string"
    );
  }
  return [];
}

/**
 * Transforms a component into ICodeLines[]
 */
export function getCodeLines(
  component: ReactNode | string
): ICodeLine[] | undefined {
  if (typeof component === "string") {
    return component.split("\n").map((text) => ({
      text,
    }));
  } else if (
    React.isValidElement(component) &&
    typeof component.props.children === "string"
  ) {
    return component.props.children.split("\n").map((text: string) => ({
      text,
      ...component.props,
    }));
  }

  if (Array.isArray(component)) {
    const stringComponents = getStringComponentsOrChildren(component);

    const codeLines: ICodeLine[] = [];
    stringComponents.forEach((comp) => {
      const thisCodeLines = getCodeLines(comp);
      if (thisCodeLines) codeLines.push(...thisCodeLines);
    });
    return codeLines;
  }
};


export function getHowManyFitIn(base: HTMLElement, target: HTMLElement) {
  const { width: targetWidth } = target.getBoundingClientRect();
  return Math.ceil(targetWidth / base.offsetWidth);
}

export function getScrollAnimationStyles(
  container: HTMLElement | null,
  play = false
) {
  if (!container) return {};
  const { width: containerWidth } = container.getBoundingClientRect();
  return {
    animation: `scroll ${SPEED_CONSTANT * containerWidth}s linear 0s infinite`,
    animationPlayState: play ? "paused" : "running",
  };
};