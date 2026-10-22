import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type UploadPurpose =
  | "CAR_IMAGE"
  | "CAR_DOCUMENT"
  | "BOOKING_DRIVER_LICENSE"
  | "PROFILE_DRIVER_LICENSE";

interface UploadAssetResponse {
  assetId: string;
  purpose: UploadPurpose;
}

export const uploadFile = async (
  file: File | Blob,
  purpose: UploadPurpose
): Promise<UploadAssetResponse> => {
  const body = new FormData();
  body.append("file", file);
  body.append("purpose", purpose);
  const response = await axios.post(`${BASE_URL}/file/upload`, body, {
    withCredentials: true,
  });
  return response.data.data as UploadAssetResponse;
};

export const uploadSelectedFile = async (
  file: File,
  purpose: UploadPurpose
): Promise<UploadAssetResponse> => {
  return uploadFile(file, purpose);
};
