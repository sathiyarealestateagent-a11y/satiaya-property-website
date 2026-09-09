import type { KeyboardEvent } from 'react';

export function handleHorizontalTabKey<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  values: readonly T[],
  currentValue: T,
  onChange: (value: T) => void,
) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

  event.preventDefault();
  const currentIndex = values.indexOf(currentValue);
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? values.length - 1
        : event.key === 'ArrowRight'
          ? (currentIndex + 1) % values.length
          : (currentIndex - 1 + values.length) % values.length;

  onChange(values[nextIndex]);
  const tabs =
    event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
      '[role="tab"]',
    );
  tabs?.[nextIndex]?.focus();
}
