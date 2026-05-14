import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { StorageService } from '../storage/storage.service';
import { ImageProcessingService } from '../image-processing/image-processing.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { memoryStorage } from 'multer';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly imageProcessingService: ImageProcessingService,
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
    const processed = await this.imageProcessingService.processImage(file);
    const url = await this.storageService.upload(processed);
    return this.mediaService.saveFileRecord(processed, url, folderId, context);
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
