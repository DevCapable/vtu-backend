import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/users/user.repository';
import { User } from '@app/users/entities/user.entity';
import { AccountRepository } from '@app/account/account.repository';
import { AccountTypeEnum } from '@app/account/enums';
import { generateRandomCode, omit } from '@app/core/util';
import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserVerification } from '@app/users/entities/user-verification.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(filterOptions, paginationOptions, req: Request) {
    const [users, totalCount] = await this.usersRepository.findAll(
      filterOptions,
      paginationOptions,
      [
        'accounts',
        'accounts.customer',
        'accounts.admin',
        'roles',
        'permissions',
      ],
    );

    users.forEach((user) => {
      (user.accounts as any) = user.accounts.map((account) => {
        // const name = this._getAccountName(account);
        return {
          id: account.id,
          uuid: account.uuid,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          nogicNumber: account.nogicNumber,
          type: account.type,
          bio: account.bio,
          oldId: account.oldId,
          // name,
        };
      });
    });

    return { data: users, totalCount };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findFirstBy({ id }, [
      'accounts',
      'accounts.individual',
      'accounts.company',
      'accounts.operator',
      'accounts.agency',
      'accounts.communityVendor',
      'roles',
      'roles.permissions',
      'permissions',
    ]);

    const accounts =
      user &&
      user.accounts.map((account) => {
        return {
          id: account.id,
          uuid: account.uuid,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          name: account.name,
          type: account.type,
          bio: account.bio,
        };
      });

    return {
      ...user,
      accounts,
    };
  }

  async create(user: Partial<User>, entityManager?: unknown): Promise<User> {
    const newUser = await this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, data: any) {
    let updateData = omit(data, ['accountId']);

    if (data?.firstName) {
      updateData = {
        ...updateData,
        firstName: data.firstName.toUpperCase().trim(),
      };
    }

    if (data?.lastName) {
      updateData = {
        ...updateData,
        lastName: data.lastName.toUpperCase().trim(),
      };
    }

    if (data?.email) {
      updateData = {
        ...updateData,
        email: data.email.toLowerCase().trim(),
      };
    }

    if (
      [AccountTypeEnum.ADMIN, AccountTypeEnum.CUSTOMER].includes(
        data?.accountType,
      )
    ) {
      const user = await this.usersRepository.findById(id, ['accounts']);

      // Filter accounts based on type
      if (user) {
        const validAccounts = user.accounts.filter((account) =>
          [AccountTypeEnum.ADMIN, AccountTypeEnum.CUSTOMER].includes(
            account.type,
          ),
        );

        for (const account of validAccounts) {
          await this.accountRepository.update(account.id as number, {
            ...data,
            accountId: account.id,
          });
        }
      }
    }

    const updatedEntity = await this.usersRepository.update(id, updateData);

    return updatedEntity;
  }

  async generateToken(userId: number) {
    const generatedToken = generateRandomCode(12);
    const token = this.entityManager.create(UserVerification, {
      token: generatedToken,
      userId,
      uuid: uuidv4(),
    });
    await this.entityManager.save(token);

    return token;
  }

  async delete(id: number) {
    return this.usersRepository.delete(id);
  }
}
