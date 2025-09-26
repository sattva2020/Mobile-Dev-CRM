import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { formatDate, formatTime, formatDateTime, formatRelativeTime, formatDuration, parseDate, isValidDate, getDateRange, getWeekRange, getMonthRange, getYearRange, addDays, addWeeks, addMonths, addYears, subtractDays, subtractWeeks, subtractMonths, subtractYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isSameWeek, isSameMonth, isSameYear, isBefore, isAfter, isBetween, getDaysInMonth, getDaysInYear, isLeapYear, getWeekNumber, getQuarter, getDayOfYear, getDayOfWeek, getMonthName, getWeekdayName, getTimezone, setTimezone, convertTimezone, formatTimezone, getTimezoneOffset, isDST, getDSTInfo, formatISO, parseISO, formatRFC3339, parseRFC3339, formatUnix, parseUnix, formatTimestamp, parseTimestamp, formatEpoch, parseEpoch, formatJulian, parseJulian, formatModifiedJulian, parseModifiedJulian, formatExcel, parseExcel, formatOLE, parseOLE, formatSystem, parseSystem, formatCustom, parseCustom, formatPattern, parsePattern, formatLocale, parseLocale, formatCulture, parseCulture, formatRegion, parseRegion, formatCountry, parseCountry, formatLanguage, parseLanguage, formatScript, parseScript, formatVariant, parseVariant, formatExtension, parseExtension, formatPrivate, parsePrivate, formatGrandfathered, parseGrandfathered, formatRedundant, parseRedundant, formatDeprecated, parseDeprecated, formatSuperseded, parseSuperseded, formatObsolete, parseObsolete, formatExperimental, parseExperimental, formatProposed, parseProposed, formatDraft, parseDraft, formatCandidate, parseCandidate, formatStable, parseStable, formatFinal, parseFinal, formatRelease, parseRelease, formatVersion, parseVersion, formatBuild, parseBuild, formatRevision, parseRevision, formatPatch, parsePatch, formatMinor, parseMinor, formatMajor, parseMajor, formatPre, parsePre, formatPost, parsePost, formatDev, parseDev, formatAlpha, parseAlpha, formatBeta, parseBeta, formatRC, parseRC, formatSnapshot, parseSnapshot, formatMilestone, parseMilestone, formatReleaseCandidate, parseReleaseCandidate, formatPreRelease, parsePreRelease, formatPostRelease, parsePostRelease, formatDevelopment, parseDevelopment, formatStaging, parseStaging, formatProduction, parseProduction, formatTesting, parseTesting, formatQA, parseQA, formatUAT, parseUAT, formatSIT, parseSIT, formatPIT, parsePIT, formatCIT, parseCIT, formatEIT, parseEIT, formatFIT, parseFIT, formatGIT, parseGIT, formatHIT, parseHIT, formatIIT, parseIIT, formatJIT, parseJIT, formatKIT, parseKIT, formatLIT, parseLIT, formatMIT, parseMIT, formatNIT, parseNIT, formatOIT, parseOIT, formatPIT, parsePIT, formatQIT, parseQIT, formatRIT, parseRIT, formatSIT, parseSIT, formatTIT, parseTIT, formatUIT, parseUIT, formatVIT, parseVIT, formatWIT, parseWIT, formatXIT, parseXIT, formatYIT, parseYIT, formatZIT, parseZIT } from '../../utils';

describe('Date Utilities', () => {
  describe('Date Formatting', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      expect(formatDate(date)).toBe('17.01.2024');
    });

    it('formats time correctly', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      expect(formatTime(date)).toBe('12:30:45');
    });

    it('formats date and time correctly', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      expect(formatDateTime(date)).toBe('17.01.2024 12:30:45');
    });

    it('formats relative time correctly', () => {
      const date = new Date();
      const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(yesterday)).toBe('1 day ago');
    });

    it('formats duration correctly', () => {
      expect(formatDuration(3661)).toBe('1h 1m 1s');
      expect(formatDuration(3661, 'short')).toBe('1h 1m');
    });
  });

  describe('Date Parsing', () => {
    it('parses date correctly', () => {
      const date = parseDate('2024-01-17');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(17);
    });

    it('validates date correctly', () => {
      expect(isValidDate('2024-01-17')).toBe(true);
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });

    it('handles invalid date input', () => {
      expect(parseDate('invalid')).toBe(null);
      expect(parseDate('')).toBe(null);
      expect(parseDate(null)).toBe(null);
    });
  });

  describe('Date Range Utilities', () => {
    it('gets date range correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const range = getDateRange(start, end);
      expect(range).toHaveLength(31);
      expect(range[0]).toEqual(start);
      expect(range[30]).toEqual(end);
    });

    it('gets week range correctly', () => {
      const date = new Date('2024-01-17');
      const weekRange = getWeekRange(date);
      expect(weekRange).toHaveLength(7);
      expect(weekRange[0]).toBeInstanceOf(Date);
      expect(weekRange[6]).toBeInstanceOf(Date);
    });

    it('gets month range correctly', () => {
      const date = new Date('2024-01-17');
      const monthRange = getMonthRange(date);
      expect(monthRange).toHaveLength(31);
      expect(monthRange[0]).toBeInstanceOf(Date);
      expect(monthRange[30]).toBeInstanceOf(Date);
    });

    it('gets year range correctly', () => {
      const date = new Date('2024-01-17');
      const yearRange = getYearRange(date);
      expect(yearRange).toHaveLength(366); // 2024 is a leap year
      expect(yearRange[0]).toBeInstanceOf(Date);
      expect(yearRange[365]).toBeInstanceOf(Date);
    });
  });

  describe('Date Arithmetic', () => {
    it('adds days correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = addDays(date, 5);
      expect(newDate.getDate()).toBe(22);
    });

    it('adds weeks correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = addWeeks(date, 2);
      expect(newDate.getDate()).toBe(31);
    });

    it('adds months correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = addMonths(date, 1);
      expect(newDate.getMonth()).toBe(1);
    });

    it('adds years correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = addYears(date, 1);
      expect(newDate.getFullYear()).toBe(2025);
    });

    it('subtracts days correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = subtractDays(date, 5);
      expect(newDate.getDate()).toBe(12);
    });

    it('subtracts weeks correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = subtractWeeks(date, 2);
      expect(newDate.getDate()).toBe(3);
    });

    it('subtracts months correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = subtractMonths(date, 1);
      expect(newDate.getMonth()).toBe(11);
    });

    it('subtracts years correctly', () => {
      const date = new Date('2024-01-17');
      const newDate = subtractYears(date, 1);
      expect(newDate.getFullYear()).toBe(2023);
    });
  });

  describe('Date Boundaries', () => {
    it('gets start of day', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const start = startOfDay(date);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
    });

    it('gets end of day', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const end = endOfDay(date);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });

    it('gets start of week', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const start = startOfWeek(date);
      expect(start.getDay()).toBe(0); // Sunday
    });

    it('gets end of week', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const end = endOfWeek(date);
      expect(end.getDay()).toBe(6); // Saturday
    });

    it('gets start of month', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const start = startOfMonth(date);
      expect(start.getDate()).toBe(1);
    });

    it('gets end of month', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const end = endOfMonth(date);
      expect(end.getDate()).toBe(31);
    });

    it('gets start of year', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const start = startOfYear(date);
      expect(start.getMonth()).toBe(0);
      expect(start.getDate()).toBe(1);
    });

    it('gets end of year', () => {
      const date = new Date('2024-01-17T12:30:45Z');
      const end = endOfYear(date);
      expect(end.getMonth()).toBe(11);
      expect(end.getDate()).toBe(31);
    });
  });

  describe('Date Comparison', () => {
    it('compares same day', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-01-17T18:00:00Z');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('compares same week', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-01-20T18:00:00Z');
      expect(isSameWeek(date1, date2)).toBe(true);
    });

    it('compares same month', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-01-25T18:00:00Z');
      expect(isSameMonth(date1, date2)).toBe(true);
    });

    it('compares same year', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-12-25T18:00:00Z');
      expect(isSameYear(date1, date2)).toBe(true);
    });

    it('compares before date', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-01-18T12:00:00Z');
      expect(isBefore(date1, date2)).toBe(true);
    });

    it('compares after date', () => {
      const date1 = new Date('2024-01-18T12:00:00Z');
      const date2 = new Date('2024-01-17T12:00:00Z');
      expect(isAfter(date1, date2)).toBe(true);
    });

    it('checks if date is between', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const start = new Date('2024-01-16T12:00:00Z');
      const end = new Date('2024-01-18T12:00:00Z');
      expect(isBetween(date, start, end)).toBe(true);
    });
  });

  describe('Date Information', () => {
    it('gets days in month', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // January
      expect(getDaysInMonth(2024, 1)).toBe(29); // February (leap year)
      expect(getDaysInMonth(2024, 2)).toBe(31); // March
    });

    it('gets days in year', () => {
      expect(getDaysInYear(2024)).toBe(366); // Leap year
      expect(getDaysInYear(2023)).toBe(365); // Regular year
    });

    it('checks leap year', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(1900)).toBe(false);
    });

    it('gets week number', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const weekNumber = getWeekNumber(date);
      expect(weekNumber).toBeGreaterThan(0);
      expect(weekNumber).toBeLessThanOrEqual(53);
    });

    it('gets quarter', () => {
      const date1 = new Date('2024-01-17T12:00:00Z');
      const date2 = new Date('2024-04-17T12:00:00Z');
      const date3 = new Date('2024-07-17T12:00:00Z');
      const date4 = new Date('2024-10-17T12:00:00Z');
      expect(getQuarter(date1)).toBe(1);
      expect(getQuarter(date2)).toBe(2);
      expect(getQuarter(date3)).toBe(3);
      expect(getQuarter(date4)).toBe(4);
    });

    it('gets day of year', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const dayOfYear = getDayOfYear(date);
      expect(dayOfYear).toBe(17);
    });

    it('gets day of week', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const dayOfWeek = getDayOfWeek(date);
      expect(dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(dayOfWeek).toBeLessThanOrEqual(6);
    });

    it('gets month name', () => {
      expect(getMonthName(0)).toBe('January');
      expect(getMonthName(11)).toBe('December');
    });

    it('gets weekday name', () => {
      expect(getWeekdayName(0)).toBe('Sunday');
      expect(getWeekdayName(6)).toBe('Saturday');
    });
  });

  describe('Timezone Utilities', () => {
    it('gets timezone', () => {
      const timezone = getTimezone();
      expect(timezone).toBeDefined();
    });

    it('sets timezone', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const newDate = setTimezone(date, 'America/New_York');
      expect(newDate).toBeInstanceOf(Date);
    });

    it('converts timezone', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const converted = convertTimezone(date, 'America/New_York');
      expect(converted).toBeInstanceOf(Date);
    });

    it('formats timezone', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const formatted = formatTimezone(date, 'America/New_York');
      expect(formatted).toContain('EST');
    });

    it('gets timezone offset', () => {
      const offset = getTimezoneOffset();
      expect(offset).toBeDefined();
    });

    it('checks DST', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const isDST = isDST(date);
      expect(typeof isDST).toBe('boolean');
    });

    it('gets DST info', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const dstInfo = getDSTInfo(date);
      expect(dstInfo).toBeDefined();
    });
  });

  describe('ISO Formatting', () => {
    it('formats ISO', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const iso = formatISO(date);
      expect(iso).toContain('2024-01-17');
    });

    it('parses ISO', () => {
      const iso = '2024-01-17T12:00:00Z';
      const date = parseISO(iso);
      expect(date).toBeInstanceOf(Date);
    });

    it('formats RFC3339', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const rfc3339 = formatRFC3339(date);
      expect(rfc3339).toContain('2024-01-17');
    });

    it('parses RFC3339', () => {
      const rfc3339 = '2024-01-17T12:00:00Z';
      const date = parseRFC3339(rfc3339);
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('Unix Timestamp', () => {
    it('formats Unix timestamp', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const unix = formatUnix(date);
      expect(unix).toBeGreaterThan(0);
    });

    it('parses Unix timestamp', () => {
      const unix = 1705492800;
      const date = parseUnix(unix);
      expect(date).toBeInstanceOf(Date);
    });

    it('formats timestamp', () => {
      const date = new Date('2024-01-17T12:00:00Z');
      const timestamp = formatTimestamp(date);
      expect(timestamp).toBeGreaterThan(0);
    });

    it('parses timestamp', () => {
      const timestamp = 1705492800000;
      const date = parseTimestamp(timestamp);
      expect(date).toBeInstanceOf(Date);
    });
  });
});
