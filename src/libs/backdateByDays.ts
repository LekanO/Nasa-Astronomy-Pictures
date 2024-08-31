export const backdateByDays = (number: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - number);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
