type ValueType =
  | Record<string, any>
  | number
  | string
  | boolean
  | null
  | undefined
  | Array<any>;

export class StringHelper {
  static stringify(value: ValueType): string {
    if (typeof value === 'object') return JSON.stringify(value);

    return String(value);
  }

  static slugify(str: string, delimiter = '-') {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, delimiter)
      .replace(/^-+|-+$/g, '');
  }
}
