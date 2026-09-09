export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  return origin === new URL(request.url).origin;
}

export function safeInternalPath(value: string | null, fallback: string) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return fallback;
  }

  return value;
}
