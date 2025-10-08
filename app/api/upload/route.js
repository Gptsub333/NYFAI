// /app/api/upload/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

// Initialize S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,  // e.g., 'us-west-2'
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_UPLOAD,
        secretAccessKey: process.env.AWS_SECRET_KEY_UPLOAD,
    },
});

export async function POST(request) {
    try {
        const { imageData, bucketName, fileName } = await request.json();

        // Check if all required fields are provided
        if (!imageData || !bucketName || !fileName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Convert base64 image to a Buffer
        const buffer = Buffer.from(imageData, 'base64');

        // S3 upload parameters - REMOVED ACL
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: 'image/jpeg',
            // ACL: 'public-read', // REMOVED - This line causes the error
        };

        // Upload image to S3
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);

        // Return the public URL of the uploaded image
        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error("Error in POST /api/upload:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
