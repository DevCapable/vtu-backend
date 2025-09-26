import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '@app/core/base/base.service';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(data) {
    return this.roleRepository.create({ ...data, uuid: uuidv4() });
  }

  async findAll(pagination, paginationOptions, user) {
    const [data, totalCount] = await this.roleRepository.findAll(
      pagination,
      paginationOptions,
      user,
    );
    return { data, totalCount };
  }

  async findAllByAccount(filterOptions, paginationOptions, user) {
    const [data, totalCount] = await this.roleRepository.findAllByAccount(
      filterOptions,
      paginationOptions,
      user,
    );

    return { data, totalCount };
  }

  async findAllUsers(filterOptions, paginationOptions, roleId: number) {
    const [data, totalCount] = await this.roleRepository.findAllUsers(
      filterOptions,
      paginationOptions,
      roleId,
      BaseService.getCurrentUser(),
    );

    return { data, totalCount };
  }

  async findOne(id: number) {
    return this.roleRepository.findById(id);
  }

  async update(id: number, data) {
    return this.roleRepository.update(id, data);
  }

  async remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
