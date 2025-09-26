import * as crypto from 'crypto';

export const generateSHA512 = (input: string): string => {
  const hash = crypto.createHash('sha512');
  hash.update(input);
  return hash.digest('hex');
};
