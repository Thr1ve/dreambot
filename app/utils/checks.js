
export const isUndefined = e => e === undefined;
export const areUndefined = (...args) => args.every(e => isUndefined(e));
export const isDefined = e => !isUndefined(e);
export const areDefined = (...args) => args.every(e => isDefined(e));

