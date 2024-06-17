
export const isValidUsername = (str) =>  str.trim().length > 0
export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path)
