import { Client } from 'minio';

// Initialize MinIO client
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

// Initialize buckets on startup
export async function initializeBuckets() {
  const buckets = [
    process.env.MINIO_BUCKET_DOCUMENTS || 'staplewise-documents',
    process.env.MINIO_BUCKET_IMAGES || 'staplewise-images'
  ];
  
  try {
    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, 'us-east-1');
        console.log(`✅ Created bucket: ${bucket}`);
        
        // Set public read policy for images bucket
        if (bucket.includes('images')) {
          const policy = {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`]
            }]
          };
          await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
          console.log(`✅ Set public policy for: ${bucket}`);
        }
      } else {
        console.log(`✅ Bucket already exists: ${bucket}`);
      }
    }
  } catch (error) {
    console.error('❌ Error initializing MinIO buckets:', error);
  }
}

// Upload file to MinIO
export async function uploadFile(
  file: Buffer, 
  fileName: string, 
  bucketName: string, 
  contentType: string = 'application/octet-stream'
): Promise<string> {
  try {
    const objectName = `${Date.now()}-${fileName}`;
    
    await minioClient.putObject(bucketName, objectName, file, file.length, {
      'Content-Type': contentType,
    });
    
    // Generate public URL
    const fileUrl = `${process.env.MINIO_PUBLIC_URL || 'http://31.97.229.127:9000'}/${bucketName}/${objectName}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw new Error('File upload failed');
  }
}

// Delete file from MinIO
export async function deleteFile(bucketName: string, objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, objectName);
    console.log(`✅ Deleted file: ${objectName} from bucket: ${bucketName}`);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
    throw new Error('File deletion failed');
  }
}

// Get file URL
export function getFileUrl(bucketName: string, objectName: string): string {
  return `${process.env.MINIO_PUBLIC_URL || 'http://31.97.229.127:9000'}/${bucketName}/${objectName}`;
}

// List files in bucket
export async function listFiles(bucketName: string, prefix: string = ''): Promise<any[]> {
  try {
    const stream = minioClient.listObjects(bucketName, prefix, true);
    const files: any[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => files.push(obj));
      stream.on('end', () => resolve(files));
      stream.on('error', reject);
    });
  } catch (error) {
    console.error('Error listing files from MinIO:', error);
    throw new Error('Failed to list files');
  }
}