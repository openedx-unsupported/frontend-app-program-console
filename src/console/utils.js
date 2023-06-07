/* eslint-disable prefer-regex-literals */

export function parseRegistrarJobName(registrarJobName) {
  const jobNameRe = new RegExp('^(.+?):(.+?):(.+?)$');
  const parsedJobName = jobNameRe.exec(registrarJobName);
  if (parsedJobName === null) {
    return null;
  }
  return {
    programKey: parsedJobName[1],
    jobType: parsedJobName[2],
    jobName: parsedJobName[3],
  };
}

/* Return whether a program should be displayed on the UploadPage.
 *
 * For now, only display programs that are writable.
 * In the future, this criteria will likely change.
 */
export function shouldProgramBeDisplayed(program) {
  return program.areEnrollmentsWritable || program.areReportsReadable;
}
