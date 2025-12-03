export function getSessionId(): string {
  let sessionId = localStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
}

export function trackSessionDuration() {
  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    return duration;
  };
}
