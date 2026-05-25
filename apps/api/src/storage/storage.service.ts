import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: Number(this.configService.get('MINIO_PORT')) || 9000,
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get('MINIO_SECRET_KEY') || 'minioadmin',
    });
    this.bucketName = 'thesis-documents';
    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    
    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );
      
      return fileName;
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file to storage');
    }
  }

  async getPresignedUrl(fileName: string): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucketName, fileName, 3600);
  }

  // Alias para compatibilidad con otras partes del sistema
  async getFileUrl(fileName: string): Promise<string> {
    return this.getPresignedUrl(fileName);
  }
}
