import { computed } from "vue";

export const useDateTime = () => {
  // 🕰️ Format to WIB (Asia/Jakarta timezone)
  const formatToWIB = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    };
    return new Intl.DateTimeFormat("id-ID", options)
      .format(date)
      .replace("pukul", " : ");
  };

  // 📆 Age calculator (fix: return a function, not computed ref)
  const ageCalculator = (inputDate?: string | Date, showMonths = false) => {
    if (!inputDate) return null; // Avoids errors if date is missing

    const startDate = new Date(inputDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    if (diffDays < 7) {
      return `${diffDays} days`;
    }

    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    if (!showMonths) {
      return `${weeks} weeks`;
    }

    const months = Math.floor(weeks / 4);
    const remainingWeeks = weeks % 4;

    if (months > 0) {
      return `${months} months, ${remainingWeeks} weeks`;
    }

    return `${weeks} weeks`;
  };

  return {
    formatToWIB,
    ageCalculator,
  };
};
