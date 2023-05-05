import azureStorage from 'azure-storage';
import getStream from 'into-stream';
import dotenv from 'dotenv';
dotenv.config();

const azureStorageConfig = {
  accountName: '',
  accountKey: '',
  blobURL: '',
  containerName: '',
};

uploadFileToBlob = async (directoryPath, file) => {
  return new Promise((resolve, reject) => {
    const blobName = getBlobName(file.originalname);
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    const blobService = azureStorage.createBlobService(
      azureStorageConfig.accountName,
      azureStorageConfig.accountKey
    );
    blobService.createBlockBlobFromStream(
      azureStorageConfig.containerName,
      `${directoryPath}/${blobName}`,
      stream,
      streamLength,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            filename: blobName,
            originalname: file.originalname,
            size: streamLength,
            path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
            url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
          });
        }
      }
    );
  });
};

getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

export default uploadFileToBlob;
