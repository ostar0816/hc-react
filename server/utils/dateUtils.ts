

export const parseDicomDate = function parseDicomDate(dicomDate) {
  const year = dicomDate.substring(0,4);
  const month = dicomDate.substring(4,6);
  const day = dicomDate.substring(6,8)
  return new Date(Date.UTC(year, month, day));
};