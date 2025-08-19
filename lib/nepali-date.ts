export interface NepaliDate {
  year: number
  month: number
  day: number
}

export interface EnglishDate {
  year: number
  month: number
  day: number
}

export interface DateConversionError extends Error {
  code: "INVALID_NEPALI_DATE" | "INVALID_ENGLISH_DATE" | "OUT_OF_RANGE"
  details?: string
}

// Nepali calendar data (BS 2000-2100)
const nepaliCalendarData: Record<number, number[]> = {
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2036: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2037: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2038: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2039: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2040: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2041: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2042: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2043: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2045: [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30],
  2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2047: [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 30, 30],
  2048: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2052: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2091: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2092: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2093: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2094: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2095: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 30],
  2096: [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2097: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2098: [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30],
  2099: [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30],
  2100: [31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30],
}

const nepaliMonthNames = [
  "बैशाख",
  "जेठ",
  "आषाढ",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत्र",
]

const nepaliDayNames = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"]

export function createDateConversionError(
  code: DateConversionError["code"],
  message: string,
  details?: string,
): DateConversionError {
  const error = new Error(message) as DateConversionError
  error.code = code
  error.details = details
  return error
}

export function isValidNepaliDate(nepaliDate: NepaliDate): boolean {
  const { year, month, day } = nepaliDate

  if (year < 2000 || year > 2100) return false
  if (month < 1 || month > 12) return false

  const monthData = nepaliCalendarData[year]
  if (!monthData) return false

  const daysInMonth = monthData[month - 1]
  return day >= 1 && day <= daysInMonth
}

export function englishToNepali(englishDate: Date): NepaliDate {
  try {
    // Reference date: 2000/1/1 BS = 1943/4/14 AD
    const referenceEnglish = new Date(1943, 3, 14) // April 14, 1943
    const referenceNepali = { year: 2000, month: 1, day: 1 }

    const diffTime = englishDate.getTime() - referenceEnglish.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      throw createDateConversionError(
        "OUT_OF_RANGE",
        "Date is before supported range",
        "Minimum supported date is April 14, 1943 AD",
      )
    }

    let nepaliYear = referenceNepali.year
    let nepaliMonth = referenceNepali.month
    let nepaliDay = referenceNepali.day + diffDays

    // Adjust for days overflow
    while (nepaliDay > 0) {
      const monthData = nepaliCalendarData[nepaliYear]
      if (!monthData) {
        throw createDateConversionError(
          "OUT_OF_RANGE",
          "Date is beyond supported range",
          `Maximum supported year is 2100 BS`,
        )
      }

      const daysInMonth = monthData[nepaliMonth - 1]

      if (nepaliDay <= daysInMonth) {
        break
      }

      nepaliDay -= daysInMonth
      nepaliMonth++

      if (nepaliMonth > 12) {
        nepaliMonth = 1
        nepaliYear++
      }
    }

    return { year: nepaliYear, month: nepaliMonth, day: nepaliDay }
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      throw error
    }
    throw createDateConversionError(
      "INVALID_ENGLISH_DATE",
      "Failed to convert English date to Nepali",
      error instanceof Error ? error.message : "Unknown error",
    )
  }
}

export function nepaliToEnglish(nepaliDate: NepaliDate): Date {
  try {
    if (!isValidNepaliDate(nepaliDate)) {
      throw createDateConversionError(
        "INVALID_NEPALI_DATE",
        "Invalid Nepali date provided",
        `Date: ${nepaliDate.year}/${nepaliDate.month}/${nepaliDate.day}`,
      )
    }

    // Reference date: 2000/1/1 BS = 1943/4/14 AD
    const referenceEnglish = new Date(1943, 3, 14) // April 14, 1943
    const referenceNepali = { year: 2000, month: 1, day: 1 }

    let totalDays = 0

    // Add days for complete years
    for (let year = referenceNepali.year; year < nepaliDate.year; year++) {
      const monthData = nepaliCalendarData[year]
      if (!monthData) {
        throw createDateConversionError("OUT_OF_RANGE", "Year not supported", `Year: ${year}`)
      }
      totalDays += monthData.reduce((sum, days) => sum + days, 0)
    }

    // Add days for complete months in the target year
    const targetYearData = nepaliCalendarData[nepaliDate.year]
    if (!targetYearData) {
      throw createDateConversionError("OUT_OF_RANGE", "Year not supported", `Year: ${nepaliDate.year}`)
    }

    for (let month = 1; month < nepaliDate.month; month++) {
      totalDays += targetYearData[month - 1]
    }

    // Add remaining days
    totalDays += nepaliDate.day - referenceNepali.day

    const resultDate = new Date(referenceEnglish)
    resultDate.setDate(resultDate.getDate() + totalDays)

    return resultDate
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      throw error
    }
    throw createDateConversionError(
      "INVALID_NEPALI_DATE",
      "Failed to convert Nepali date to English",
      error instanceof Error ? error.message : "Unknown error",
    )
  }
}

export function formatNepaliDate(nepaliDate: NepaliDate, format: "short" | "long" = "short"): string {
  const { year, month, day } = nepaliDate

  if (format === "long") {
    const monthName = nepaliMonthNames[month - 1]
    return `${day} ${monthName} ${year}`
  }

  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`
}

export function getCurrentNepaliDate(): NepaliDate {
  try {
    return englishToNepali(new Date())
  } catch (error) {
    console.warn("Current date is out of supported range, using fallback date")
    return { year: 2081, month: 1, day: 1 } // Safe fallback date
  }
}

export function getDaysInNepaliMonth(year: number, month: number): number {
  const monthData = nepaliCalendarData[year]
  if (!monthData || month < 1 || month > 12) {
    throw createDateConversionError("INVALID_NEPALI_DATE", "Invalid year or month", `Year: ${year}, Month: ${month}`)
  }
  return monthData[month - 1]
}

export { nepaliMonthNames, nepaliDayNames }
