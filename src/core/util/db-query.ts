import * as _ from 'lodash';
import { omit, pick } from './functions';
import { Brackets, Like, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const newbuildSearchQuery = (options: any, searchableCols: string[]) => {
  let where: any = {};
  const accountIdCondition: any = {};
  const statusCondition: any = {};
  let searchArray: any[] = [];

  if (options && Object.keys(options).length > 0) {
    Object.keys(options).forEach((key) => {
      const searchValue = options[key];

      if (key === 'accountId') {
        accountIdCondition[key] = parseInt(searchValue, 10);
      }

      if (key === 'status') {
        statusCondition[key] = searchValue;
      }

      if (key === 'search') {
        searchableCols.forEach((col) => {
          let data: any;

          if (!col.toLowerCase().includes('id')) {
            data = {
              [col]: Like(`%${searchValue}%`),
            };
          }

          if (col.includes('.')) {
            const [relation, column, subColumn] = col.split('.');
            if (subColumn) {
              data = {
                [`${relation}`]: {
                  [`.${column}`]: {
                    [`${subColumn}`]: Like(`%${searchValue}%`),
                  },
                },
              };
            } else {
              data = {
                [`${relation}`]: {
                  [`${column}`]: Like(`%${searchValue}%`),
                },
              };
            }
          }

          if (['company', 'operator', 'individual'].includes(col)) {
            data = {
              account: {
                name: Like(`%${searchValue}%`),
              },
            };
          }

          searchArray.push(data);
        });

        // Clear where, as it will be populated from searchArray
        where = {};
      } else {
        if (searchableCols.includes(key)) {
          if (key.includes('Id')) {
            where[key] = parseInt(searchValue, 10);
          } else if (key !== 'status') {
            where[key] = Like(`%${searchValue}%`);
          }
        }
      }
    });

    // Merge accountId and status conditions into each object in searchArray
    if (searchArray.length > 0) {
      searchArray = searchArray.map((condition) => ({
        ...condition,
        ...accountIdCondition,
        ...statusCondition,
        ...where,
      }));
    } else {
      searchArray = {
        ...accountIdCondition,
        ...statusCondition,
        ...where,
      };
    }
  }

  return searchArray;
};

export const buildSearchQuery = (
  options: Record<string, string>,
  searchableCols: string[],
) => {
  const where = {};

  if (options) {
    Object.entries(options).forEach(([key, searchValue]) => {
      if (key === 'accountId') {
        where['accountId'] = parseInt(searchValue, 10);
      }

      if (key === 'status') {
        where['status'] = searchValue;
      }

      if (key === 'search') {
        const orArray = searchableCols.map((searchableCol) => {
          if (!searchableCol.toLowerCase().includes('id')) {
            return {
              [searchableCol]: Like(`%${searchValue}%`),
            };
          }

          if (searchableCol.includes('.')) {
            const [relation, column, subColumn] = searchableCol.split('.');
            if (subColumn) {
              return {
                [relation]: {
                  [column]: {
                    [subColumn]: Like(`%${searchValue}%`),
                  },
                },
              };
            } else {
              return {
                [relation]: {
                  [column]: Like(`%${searchValue}%`),
                },
              };
            }
          }

          if (['company', 'operator', 'individual'].includes(searchableCol)) {
            return {
              account: {
                [searchableCol]: {
                  name: Like(`%${searchValue}%`),
                },
              },
            };
          }

          return null;
        });

        where['OR'] = orArray.filter((item) => item !== null);
      } else {
        if (searchableCols.includes(key)) {
          if (key.includes('Id')) {
            where[key] = parseInt(searchValue, 10);
          } else if (key !== 'status') {
            where[key] = Like(`%${searchValue}%`);
          }
        }
      }
    });
  }

  return where;
};

export const buildSearchQueryBuilder = (
  options: Record<string, any>,
  searchableCols: string[],
  queryBuilder: SelectQueryBuilder<any>,
  manyToManyRelations: string[] = [], // Array of column names indicating many-to-many relationships
  alias = 'entity', // Pass the alias to the function
): void => {
  if (!options) {
    return;
  }

  Object.entries(options).forEach(([key, searchValue]) => {
    const column = `${alias}.${key}`;

    if (key === 'accountId' && searchValue) {
      if (manyToManyRelations.includes('account')) {
        queryBuilder
          .leftJoin(`${alias}.accounts`, 'account')
          .andWhere('account.id = :accountId', { accountId: searchValue });
      } else {
        queryBuilder.andWhere(`${column} = :${key}`, { [key]: searchValue });
      }
    }

    if (key === 'search') {
      // Remove status from searchableCols
      if (searchableCols.includes('status')) {
        searchableCols = searchableCols.filter((col) => col !== 'status');
      }

      const orArray = searchableCols.map((searchableCol) => {
        if (!searchableCol.includes('.')) {
          return `UPPER(${alias}.${searchableCol}) LIKE UPPER(:${searchableCol})`;
        }

        if (searchableCol.includes('.')) {
          const [relation, col, subCol] = searchableCol.split('.');
          if (manyToManyRelations.includes(relation)) {
            // Handle many-to-many relationship
            return `${alias}.${col} IN (:...${relation})`;
          }
          const joinedColumn = subCol
            ? `${relation}.${col}.${subCol}`
            : `${relation}.${col}`;
          return `UPPER(${joinedColumn}) LIKE UPPER(:${searchableCol})`;
        }

        if (['company', 'operator', 'individual'].includes(searchableCol)) {
          return `UPPER(${alias}.account.${searchableCol}.name) LIKE UPPER(:${searchableCol})`;
        }

        return null;
      });

      if (orArray.length > 0) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere(
              orArray.join(' OR '),
              searchableCols.reduce((acc, col) => {
                acc[col] = `%${searchValue}%`;
                return acc;
              }, {}),
            );
          }),
        );
      }
    } else {
      if (searchableCols.includes(key)) {
        if (key.includes('Id')) {
          queryBuilder.andWhere(`${column} = :${key}`, { [key]: searchValue });
        } else if (key === 'status') {
          queryBuilder.andWhere(`${column} = :${key}`, { [key]: searchValue });
        } else {
          queryBuilder.andWhere(`UPPER(${column}) LIKE UPPER(:${key})`, {
            [key]: `%${searchValue}%`,
          });
        }
      }
    }
  });
};

export const buildQueryOptions = (option) => {
  const searchQuery = omit(option.query, ['limit', 'page', 'sort_by']);
  let options = {
    limit: option.limit,
    offset: option.skip,
    key: option.key,
    dir: option.dir,
  };
  options = _.merge(options, searchQuery);
  return options;
};

export const buildRelationsOld = (relations: string[]) => {
  if (relations.length) {
    const relationObj = {};
    relations.forEach((relation) => {
      if (relation.includes('.')) {
        const parts = relation.split('.');
        let nestedObj = relationObj;

        for (let i = 0; i < parts.length; i++) {
          nestedObj[parts[i]] = {};
          nestedObj = nestedObj[parts[i]].include || nestedObj[parts[i]];
        }
      } else {
        relationObj[relation] = true;
      }
    });

    return relationObj;
  }
};

export const buildFillable = (data, fillable) =>
  fillable.length ? pick(data, fillable) : data;

export const buildRelations = <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  relations: string[],
  alias = 'entity',
) => {
  const addedAliases = new Set<string>();

  const processRelation = (relation: string, currentAlias: string) => {
    const parts = relation.split('.');
    const subAlias = parts[0];
    const remaining = parts.slice(1).join('.');

    if (!addedAliases.has(subAlias)) {
      qb.leftJoinAndSelect(`${currentAlias}.${subAlias}`, subAlias);
      addedAliases.add(subAlias);
    }

    if (remaining) {
      processRelation(remaining, subAlias);
    }
  };

  relations.forEach((relation) => {
    processRelation(relation, alias);
  });

  return qb;
};

type TypeORMRelations = {
  [key: string]: boolean | TypeORMRelations;
};

export const buildRelationsObj = (relations: string[]): TypeORMRelations => {
  const relationObj: TypeORMRelations = {};

  relations.forEach((relation) => {
    const parts = relation.split('.');
    let currentLevel = relationObj;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Leaf node, set to true
        currentLevel[part] = true;
      } else {
        // Intermediate node, create nested object
        currentLevel[part] = currentLevel[part] || {};
        currentLevel = currentLevel[part] as TypeORMRelations;
      }
    });
  });

  return relationObj;
};
