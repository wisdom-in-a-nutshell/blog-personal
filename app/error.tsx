"use client";

export default function AppError({
  error: _error,
  reset: _reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Oops! Something went wrong... maybe try refreshing?</p>
    </div>
  );
}
