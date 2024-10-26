// appwriteConfig.ts
import { Client, Account, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.planob.solveit",
    projectId: "671d0f4d00153dc7c867"
  };

// Substitua pelo seu Project ID e URL do Appwrite
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint) // Insira o endereço do seu servidor Appwrite
    .setProject(appwriteConfig.projectId) // Seu Project ID
    .setPlatform(appwriteConfig.platform); // Seu package name

export { client, Account, ID };
