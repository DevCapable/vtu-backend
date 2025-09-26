import { snakeCase } from 'typeorm/util/StringUtils';
import pluralize, { singular } from 'pluralize';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomNamingStrategy extends SnakeNamingStrategy {
  tableName(className: string, customName: string): string {
    const tableName = customName || pluralize(snakeCase(className));
    return tableName.toUpperCase();
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ) {
    const singularTableName = singular(tableName);
    const joinTableColumnName = snakeCase(
      singularTableName + '_' + (columnName || propertyName),
    );
    return joinTableColumnName.toUpperCase();
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ) {
    const columnName =
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName || snakeCase(propertyName));

    return columnName.toUpperCase();
  }

  relationName(propertyName: string) {
    return snakeCase(propertyName).toUpperCase();
  }

  joinColumnName(relationName: string, referencedColumnName: string) {
    return snakeCase(relationName + '_' + referencedColumnName).toUpperCase();
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ) {
    return snakeCase(
      firstTableName +
        '_' +
        firstPropertyName.replace(/\./gi, '_') +
        '_' +
        secondTableName,
    ).toUpperCase();
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ) {
    return snakeCase(
      parentTableName + '_' + parentTableIdPropertyName,
    ).toUpperCase();
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string) {
    const eagerJoinRelationAlias =
      alias + '__' + propertyPath.replace('.', '_');
    return eagerJoinRelationAlias.toUpperCase();
  }
}
