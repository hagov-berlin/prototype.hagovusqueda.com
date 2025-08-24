export function timeToSeconds(rawTimeString: string, videoId: string) {
  if (!rawTimeString.includes(","))
    throw new Error(`Cannot parse "${rawTimeString}" at ${videoId}`);
  const [timeString] = rawTimeString.split(",");
  const [hoursString, minutesString, secondsString] = timeString.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  return seconds + minutes * 60 + hours * 60 * 60;
}
