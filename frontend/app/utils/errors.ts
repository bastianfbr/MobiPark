/** Extrait le message `{ "error": "..." }` renvoyé par le backend, sinon `fallback`. */
export function errorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  const data = (error as { data?: { error?: string } } | null)?.data
  return data?.error ?? fallback
}

export function errorStatus(error: unknown): number | undefined {
  return (error as { statusCode?: number, status?: number } | null)?.statusCode
    ?? (error as { status?: number } | null)?.status
}
