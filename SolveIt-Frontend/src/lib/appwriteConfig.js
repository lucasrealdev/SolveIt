import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.planob.solveit",
  projectId: "671d0f4d00153dc7c867",
  storageId: "671d9fc20001e9236357",
  databaseId: "671d9fd40020e0d0cbdc",
  userCollectionId: "671ee16b001b68318e3c",
  postsCollectionId: "671ee27d00254e1853a8",
};

// Criação de uma instância do cliente Appwrite
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

// Criação de referências para as principais entidades do Appwrite
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Função para criar um novo usuário
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    // Gera uma URL de avatar inicial usando as iniciais do usuário
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw { message: error.message, code: error.code };
  }
}

// Função para fazer login de usuário
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para verificar e obter a sessão do usuário
export async function getSession() {
  try {
    const session = await account.getSession("current");
    return session;
  } catch (error) {
    return null; // Retorna null se o usuário não estiver autenticado
  }
}

// Função para obter a conta do usuário atual, se autenticado
export async function getAccount() {
  try {
    const session = await getSession(); // Verifica se há uma sessão ativa

    if (!session) {
      return null;
    }

    const currentAccount = await account.get(); // Obtém a conta se autenticado

    return currentAccount;
  } catch (error) {
    console.error("Erro ao obter conta do usuário:", error);
    return null; // Retorna null em caso de erro
  }
}

// Função para obter os dados do usuário atual
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) return null;

    let currentUser;

    try {
      currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
    } catch (listError) {
      return null;
    }

    if (!currentUser) return null;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return null;
  }
}

// Função para fazer logout do usuário
export async function signOut() {
  try {
    // Verifica se há uma sessão ativa antes de tentar deletá-la
    const session = await getSession(); // Função que retorna a sessão atual ou null se não houver sessão

    if (!session) {
      return null; // Retorna null caso não haja sessão ativa
    }

    // Se há uma sessão ativa, procede com o logout
    const deletedSession = await account.deleteSession("current");
    return deletedSession;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error(error);
  }
}

// Função para fazer upload de um arquivo
export async function uploadFile(file, type) {
  if (!file) return;

  // Extrai o tipo MIME do arquivo e mantém o restante das propriedades
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest }; // Cria um objeto asset com o tipo e as outras propriedades do arquivo

  try {
    // Faz o upload do arquivo para o storage do Appwrite
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para obter a URL de visualização de um arquivo
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId, // ID do arquivo
        2000,   // Largura máxima da imagem
        2000,   // Altura máxima da imagem
        "top",  // Posição do corte
        100     // Qualidade da imagem
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para criar uma nova postagem
export async function createPost(form) {
  try {
    // Faz o upload da imagem de miniatura
    const [thumbnailUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        description: form.description,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para obter todas as postagens
export async function getAllPosts() {
  try {
    // Obtém todos os documentos de postagens do banco de dados, ordenados pela data de criação em ordem descrescente
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para obter as postagens de um usuário específico
export async function getUserPosts(userId) {
  try {
    // Obtém todos os documentos de postagens do banco de dados, filtrados pelo ID do usuário e ordenados pela data de criação em ordem descrescente
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Função para pesquisar postagens por uma string de consulta
// Pesquisar por uma string em específico requer a criação de um index 'fulltext' (AppWrite)
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}