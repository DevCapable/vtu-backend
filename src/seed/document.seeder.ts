import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '@app/document/entities/document.entity';
import { Repository } from 'typeorm';

import { Promise as Bluebird } from 'bluebird';
import { DocumentFormat } from '@app/document/types';
import { v4 as uuidv4 } from 'uuid';
import { StringHelper } from '@app/core/helpers';

@Injectable()
export class DocumentSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  seed() {
    const documents = [
      // ...nctrcDocumentsDbSeed,
      // ...advertDocumentsDbSeed,
      // ...ncdfDocumentsSeed,
      /*...ncecDocumentsSeed,
      ...exchangeProgramDocumentsDbSeed,
      ...ownershipDocumentsSeed,
      ...advertDocumentsDbSeed,
      ...ncrcApplicationDocumentsDbSeed,
      ...marineVesselDocumentsDbSeed,
      ...temporaryWorkPermitDocumentsDbSeed,
      ...serviceExecutedDocumentsDbSeed,
      ...eqAppDocumentsDbSeed,
      ...tenderApplicationDocumentsDbSeed,
      ...tenderStageApplicationDocumentsDbSeed,*/
    ];
    Bluebird.mapSeries(documents, async (data) => {
      const existingDocument = await this.documentRepository.findOne({
        where: { slug: data.slug },
      });

      const allowedFormats = Object.values(DocumentFormat).filter(
        (record) =>
          ![
            DocumentFormat.CSV,
            DocumentFormat.TXT,
            DocumentFormat.ZIP,
            DocumentFormat.RAR,
          ].includes(record),
      );

      await this.documentRepository.save({
        ...(existingDocument || {}),
        uuid: uuidv4(),
        slug: data.slug,
        name: data.name,
        type: data.type,
        description: data.description,
        allowedFormats: StringHelper.stringify(allowedFormats),
        ...(data.isRequired && {
          isRequired: 1,
        }),
      });
    });
  }
}
