import { InjectRepository } from '@nestjs/typeorm';
import { SeederInterface } from './seeder.interface';
import { PermissionGroup } from '@app/permission/entities/permission-group.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { permissionGroups } from './raw-data/dump/permissions';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PermissionGroupSeeder implements SeederInterface {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  async seed() {
    await Bluebird.mapSeries(permissionGroups, async (data) => {
      const permissionGroup = await this.permissionGroupRepository.findOne({
        where: {
          id: data.id,
        },
      });

      if (permissionGroup) {
        return;
      } else {
        await this.permissionGroupRepository.save({ ...data, uuid: uuidv4() });
      }
    });
  }
}
