// Permission codenames used in Registrar API.
export const PERMISSIONS = { // eslint-disable-line import/prefer-default-export
  readMetadata: 'read_metadata',
  readEnrollments: 'read_enrollments',
  writeEnrollments: 'write_enrollments',
  readReports: 'read_reports',
};

// The number of days counting back from today's date to use for
// limiting the reports requested by their creation date.
// Note that this is inclusive of the current date;
// therefore, a value of 6 represents 7 days of reports.
// This value should be 0 or a positive integer.
export const REPORT_DATE_OFFSET_DAYS = 6;
