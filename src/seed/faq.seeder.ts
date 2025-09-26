import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from '@app/faq/entities/faq.entity';
import { Repository } from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import faqsDumps from './raw-data/dump/faqs.dump.json';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FaqSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  seed() {
    return Bluebird.mapSeries(faqsDumps, async (data) => {
      const existingFaq = await this.faqRepository.findOne({
        where: {
          question: data.question,
        },
      });

      if (existingFaq) {
        return;
      } else {
        const newFaq = this.faqRepository.create({ ...data, uuid: uuidv4() });
        return this.faqRepository.save(newFaq);
      }
    });
  }
}
