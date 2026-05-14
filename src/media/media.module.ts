import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageProcessingModule } from '../image-processing/image-processing.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ImageProcessingModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
