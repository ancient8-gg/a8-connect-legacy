export const makeShorter = (value: string) => {
  return `${value?.substring(0, 5)}...${value?.substring(value.length - 3, value.length)}`;
}