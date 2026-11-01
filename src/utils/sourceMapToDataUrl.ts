export const sourceMapToDataUrl = (sourceMap: string) => {
  return `data:application/json;charset=utf-8;base64,${Buffer.from(sourceMap || '').toString('base64')}`;
};
