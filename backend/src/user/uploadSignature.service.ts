import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export async function generateUploadSignatureService(folder?: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const params: any = {
    timestamp,
    upload_preset: "user_avatars",
  };

  if (folder) {
    params.folder = folder;
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    config.CLOUDINARY_API_SECRET,
  );

  return {
    signature,
    timestamp,
    cloudName: config.CLOUDINARY_CLOUD_NAME,
    apiKey: config.CLOUDINARY_API_KEY,
  };
}
