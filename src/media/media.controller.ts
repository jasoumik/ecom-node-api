import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { StorageService } from '../storage/storage.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { memoryStorage } from 'multer';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  @Get('folders')
  getFolders(@Query('parentId') parentId?: string) {
    return this.mediaService.getFolders(parentId);
  }

  @Post('folders')
  createFolder(@Body() createFolderDto: CreateFolderDto) {
    return this.mediaService.createFolder(createFolderDto);
  }

  @Delete('folders/:id')
  deleteFolder(@Param('id') id: string) {
    return this.mediaService.deleteFolder(id);
  }

  @Get('files')
  getFiles(@Query('folderId') folderId?: string) {
    return this.mediaService.getFiles(folderId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId?: string,
    @Body('context') context?: string,
  ) {
    const url = await this.storageService.upload(file);
    return this.mediaService.saveFileRecord(file, url, folderId, context);
  }

  @Delete('files/:id')
  async deleteFile(@Param('id') id: string) {
    const file = await this.mediaService.getFileById(id);
    if (file?.url?.startsWith('http')) {
      await this.storageService.delete(file.url);
    }
    return this.mediaService.deleteFile(id);
  }

  @Post('files/:id/move')
  moveFile(@Param('id') id: string, @Body('folderId') folderId: string) {
    return this.mediaService.moveFile(id, folderId);
  }
}
