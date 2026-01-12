
export const formatTime = (timestamp: string | number) => {
   const date = new Date(timestamp);
   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' });
};


const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export function formatDuration(ms: number): string {
  if (ms % DAY === 0) {
    return `${ms / DAY}Days`;
  }

  if (ms % HOUR === 0) {
    return `${ms / HOUR}Hours`;
  }

  if (ms % MINUTE === 0) {
    return `${ms / MINUTE}Minutes`;
  }

  if (ms % SECOND === 0) {
    return `${ms / SECOND}Seconds`;
  }

  return `${ms}ms`;
}
