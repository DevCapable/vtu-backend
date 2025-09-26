import { CustomInternalServerException } from '@app/core/error';
import { generateRandomNumber } from '@app/core/util';

function generateAlphanumeric(length: number): string {
  if (typeof length !== 'number' || length < 1) {
    throw new CustomInternalServerException(
      `Length must be a positive number, got ${length}`,
    );
  }
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateCompetency(gender, yearJoined: number): string {
  const random4DigitNumber = generateRandomNumber(4);
  const alphanumeric8 = generateAlphanumeric(8);
  const genderTag = gender.toLowerCase() === 'male' ? 'M' : 'F';
  const generatedId = `CI-${random4DigitNumber}-${genderTag}-${alphanumeric8}-REG-${yearJoined}`;
  return generatedId;
}
