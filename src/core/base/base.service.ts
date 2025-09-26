import { DeepPartial } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DocumentType } from '@app/document/enum/document.enum';
import { FilterOptions, PaginationOptions } from '@app/core/interface';
import { v4 as uuidv4 } from 'uuid';
import { CurrentUserData } from '@app/iam/interfaces';
import { ClsServiceManager } from 'nestjs-cls';
import { CustomUnauthorizedException } from '../error';
import { Request } from 'express';

export abstract class BaseService<T> {
  documentType: DocumentType;
  documentFileType: string;

  constructor(private readonly baseRepository: BaseRepository<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentType(type: string | undefined): DocumentType | DocumentType[] {
    return this.documentType;
  }

  static getCurrentUser(): CurrentUserData {
    const clsService = ClsServiceManager.getClsService();
    const user = clsService.get('user');
    if (!user) {
      throw new CustomUnauthorizedException('No current user found in context');
    }
    return user;
  }

  static getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const ipFromForwarded = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor?.split(',')[0];

    const ipAddress = ipFromForwarded || request.ip;

    return ipAddress;
  }

  async findAll(
    filterOptions: FilterOptions = {},
    paginationOptions: PaginationOptions = {},
    relations: string[] = [],
  ): Promise<{ data: T[]; totalCount: number }> {
    const [data, totalCount] = await this.baseRepository.findAll(
      filterOptions,
      paginationOptions,
      relations,
    );

    return { data, totalCount };
  }

  async findOne(id: number, relations = []): Promise<T> {
    return this.baseRepository.findById(id, relations);
  }

  async create(entity: DeepPartial<T>) {
    return this.baseRepository.create({ ...entity, uuid: uuidv4() });
  }

  update(id, entity: T): Promise<T> {
    return this.baseRepository.update(id, entity);
  }

  delete(id: number) {
    return this.baseRepository.delete(id);
  }

  async deleteMany(data: any) {
    // TODO add soft delete and also validate if the entity belongs to the logged in account
    return this.baseRepository.deleteMany(data.ids);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transformDocuments(documents: any, type: string | undefined) {
    return documents;
  }

  protected generateUUID() {
    return uuidv4();
  }
}
