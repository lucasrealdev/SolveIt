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
  followsCollectionId: "6726b21000240fd51f28",
  commentsCollectionId: "6726b76f001832887fad",
  likesCollectionId: "6726bec6003e2fbe6d73",
  favoritesCollectionId: "6726bca00024d78f6036"
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
    await signOut();

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
    await signOut();
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
    console.error("Erro ao obter sessao atual: ", error)
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

export async function getCommentsForPost(postId) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal("postId", postId)]
    );
    return comments.documents;
  } catch (error) {
    console.error("Erro ao obter comentários do post:", error);
  }
}

// Função para adicionar um comentário a um post
export async function addComment(postId, userId, content) {
  try {
    // Verifica se o texto do comentário não está vazio
    if (!content) {
      throw new Error("O comentário não pode estar vazio.");
    }

    // Cria o documento de comentário
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,             // ID do banco de dados
      appwriteConfig.commentsCollectionId,    // ID da coleção de comentários
      ID.unique(),                            // ID único para o novo comentário
      {
        postId: postId,
        userId: userId,
        content: content,
        createdAt: new Date().toISOString(),  // Adiciona data/hora de criação (opcional)
      }
    );

    console.log("Comentário adicionado com sucesso:", newComment);
    return newComment;
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error.message);
    throw error;
  }
}

// Função para verificar se o usuário curtiu o post
export async function userLikedPost(postId, userId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );

    return likes.total > 0; // Retorna true se o usuário curtiu
  } catch (error) {
    console.error("Erro ao verificar se o usuário curtiu o post:", error.message);
    throw error;
  }
}

// Função para verificar se o post está nos favoritos do usuário
export async function userFavoritedPost(postId, userId) {
  try {
    const favorites = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );

    return favorites.total > 0; // Retorna true se o post é favorito
  } catch (error) {
    console.error("Erro ao verificar se o post é favorito:", error.message);
    throw error;
  }
}

// Função para alternar o estado do like e retornar se curtiu ou não
export async function toggleLike(postId, userId) {
  try {
    const liked = await userLikedPost(postId, userId);
    if (liked) {
      // Se já curtiu, remove o like
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        likes.documents[0].$id
      );

      return false; // Retorna que não curtiu mais
    } else {
      // Se não curtiu, adiciona o like
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        ID.unique(),
        { userId, postId }
      );

      return true; // Retorna que agora curtiu
    }
  } catch (error) {
    console.error("Erro ao alternar like:", error.message);
    throw error;
  }
}

// Função para alternar o estado do favorito e retornar se é favorito ou não
export async function toggleFavorite(postId, userId) {
  try {
    const favorited = await userFavoritedPost(postId, userId);
    if (favorited) {
      // Se já está nos favoritos, remove
      const favorites = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        favorites.documents[0].$id
      );

      return false; // Retorna que não é mais favorito
    } else {
      // Se não está nos favoritos, adiciona
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        ID.unique(),
        { userId, postId }
      );

      return true; // Retorna que agora é favorito
    }
  } catch (error) {
    console.error("Erro ao alternar favorito:", error.message);
    throw error;
  }
}

// Função para incrementar o número de compartilhamentos
export async function incrementShare(postId) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    console.log("Post compartilhado:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Erro ao compartilhar o post:", error.message);
    throw error;
  }
}


//Perfil
export async function followUser(followerId, followingId) {
  try {
    const followDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId, // A coleção de follows
      ID.unique(),
      {
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      }
    );
    return followDocument;
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
  }
}

export async function unfollowUser(followerId, followingId) {
  try {
    // Obter o documento de follow usando uma query para garantir que é o correto
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId)
      ]
    );

    if (follows.documents.length > 0) {
      const followDocument = follows.documents[0];
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followsCollectionId,
        followDocument.$id
      );
    }
  } catch (error) {
    console.error("Erro ao deixar de seguir usuário:", error);
  }
}


export async function getFollowers(userId) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followingId", userId)]
    );
    return followers.documents;
  } catch (error) {
    console.error("Erro ao obter seguidores:", error);
  }
}

export async function getFollowing(userId) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followerId", userId)]
    );
    return following.documents;
  } catch (error) {
    console.error("Erro ao obter lista de seguindo:", error);
  }
}
