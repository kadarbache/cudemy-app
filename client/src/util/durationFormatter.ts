const durationFormatterString = (totalSecondsDuration: number): string => {
  // If the duration is less than a minute, just show seconds
  if (totalSecondsDuration < 60) {
    return `${Math.round(totalSecondsDuration)} seconds`;
  }

  const totalMinutesInDuration = Math.floor(totalSecondsDuration / 60);
  const fullHours = Math.floor(totalMinutesInDuration / 60);
  const minutesAfterHours = totalMinutesInDuration % 60;
  const secondsAfterMinutes = Math.round(totalSecondsDuration % 60);

  const durationParts: string[] = [];

  // Add hours if present
  if (fullHours > 0) {
    durationParts.push(`${fullHours}h`);
  }

  // Add minutes if presents
  if (minutesAfterHours > 0) {
    durationParts.push(`${minutesAfterHours}m`);
  }

  // Add seconds if present, but only if no hours were present, or if you want high precision
  // For the current logic, we generally show seconds only if there are no hours.
  if (fullHours === 0 && secondsAfterMinutes > 0) {
    durationParts.push(`${secondsAfterMinutes}s`);
  }

  // Handle case for exactly 0, or if all parts were zero (shouldn't happen with the first check)
  if (durationParts.length === 0) {
    return "0 seconds"; // Fallback for edge cases or duration of 0
  }

  return durationParts.join(' : ');
};

export default durationFormatterString