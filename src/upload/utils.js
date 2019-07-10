
export default function parseRegistrarJobName(registrarJobName) {
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
