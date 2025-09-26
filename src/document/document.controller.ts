import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { Permission } from '@app/iam/authorization/decorators';

import { AccountTypeEnum } from '@app/account/enums';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentFilesDto } from './dto/create-document-files.dto';
import { Public } from '@app/iam/decorators';
import DocumentInterceptor from './interceptors/document.interceptor';
import { fileFilter } from '@app/core/util/file-upload';
import { documentConstant } from './constant/document.constant';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '@app/iam/enum/permission.enum';

const BASE_PATH = 'generic-documents';

@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
@UseInterceptors(ClassSerializerInterceptor)
export default class DocumentsController {
  constructor(private readonly documentService: DocumentService) {}

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.READ, PermisionSubjectTypeEnum.DOCUMENT)
  @ApiFilterPagination('Get all documents')
  @ApiQuery({
    name: 'type',
    description: 'Generic document type is required',
    required: true,
  })
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.documentService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.CREATE, PermisionSubjectTypeEnum.DOCUMENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Document ')
  @ApiResponse({
    status: 201,
    description: 'Document created Successfully',
  })
  @Post()
  createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @ApiEndpoint('Create Document Files')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Post('/files')
  create(@Body() createDocumentFilesDto: CreateDocumentFilesDto) {
    return this.documentService.createDocumentFiles(createDocumentFilesDto);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.UPDATE, PermisionSubjectTypeEnum.DOCUMENT)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Update document')
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateDocumentDto: any) {
    return this.documentService.update(+id, UpdateDocumentDto);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.READ, PermisionSubjectTypeEnum.DOCUMENT)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Find one generic document')
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Product Created Successfully',
  })
  @Post('/upload')
  @UseInterceptors(
    DocumentInterceptor({
      fieldName: 'documents',
      path: 'uploads',
      fileFilter: fileFilter,
      limits: {
        fileSize: documentConstant.fileSize,
      },
    }),
  )
  async uploadDocument(@UploadedFiles() files, @Body() body: any) {
    // return this.documentService.uploadDocumentData(files, body?.folder);
  }

  @ApiEndpoint('Delete Document File')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete('files')
  removeFile(@Body() body: any) {
    return this.documentService.deleteDocumentFile(body.awsKey);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.DELETE, PermisionSubjectTypeEnum.DOCUMENT)
  @ApiEndpoint('Delete Document')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentService.delete(+id);
  }
}
