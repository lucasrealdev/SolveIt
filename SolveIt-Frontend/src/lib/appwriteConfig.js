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

import axios from "axios";

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

export async function getUserProfile(accountId) {
  try {
    // Busca o documento do usuário pelo accountId
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', [accountId])]
    );

    if (!user.documents || user.documents.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const userDoc = user.documents[0];

    return {
      username: userDoc.username,
      email: userDoc.email,
      avatar: userDoc.avatar,
      biography: userDoc.biography
    };
  } catch (error) {
    throw new Error(error.message);
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

export async function getCityAndStateByZipCode(zipCode) {
  try {
    if (!zipCode) {
      throw new Error("CEP não encontrado no post");
    }

    // Fazendo a requisição para a API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);

    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    const { localidade: city, uf: state } = response.data;

    return {
      city,
      state,
      country: "Brasil",
    };
  } catch (error) {
    return null;
  }
}

export async function toggleUserOnlineStatus() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Usuário não encontrado ou não autenticado.");
    }

    // Alterna o status entre true e false
    const updatedStatus = !currentUser.isOnline;

    // Atualiza o status no banco de dados
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      { isOnline: updatedStatus }
    );

    // Retorna o novo valor de isOnline
    return updatedStatus;
  } catch (error) {
    console.error("Erro ao alternar isOnline:", error);
    throw error;
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
export async function uploadFile(file, type, isWeb) {
  if (!file) return;
  try {
    let uploadedFile;

    if (isWeb) {
      // Caso seja web, utilize o objeto File diretamente
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file // Envia o objeto File diretamente
      );
    } else {
      // Extrai o tipo MIME do arquivo para não-Web
      const { mimeType, ...rest } = file;
      const asset = { type: mimeType, ...rest };

      // Faz o upload do arquivo no formato necessário
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
    }

    // Obter o preview do arquivo
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error('Falha ao enviar o arquivo. Tente novamente.');
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
export async function createPost(form, isWeb) {
  try {
    // Faz o upload da imagem de miniatura
    const [thumbnailUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image", isWeb)
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        title: form.title,
        description: form.description,
        tags: form.tags || "",
        zipCode: form.zipCode || "",
        peopleAffects: form.peopleAffects,
        category: form.category,
        urgencyProblem: form.urgencyProblem,
        thumbnail: thumbnailUrl,
        thumbnailRatio: form.thumbnailRatio,
        creator: form.userId,
        shares: "0", // Valor padrão
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getAllPosts(page = 1, limit = 10) {
  try {
    // Calcula o offset baseado na página e no limite
    const offset = (page - 1) * limit;

    // Obtém os IDs dos documentos de postagens com a paginação
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.orderDesc('$createdAt'), // Ordena pela data de criação (decrescente)
        Query.limit(limit),            // Limita o número de postagens
        Query.offset(offset),          // Desloca o início da busca para a página correta
        Query.select(['$id'])          // Seleciona apenas o campo ID dos documentos
      ]
    );

    return posts.documents; // Retorna apenas os documentos com os IDs
  } catch (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`);
  }
}

// Função para pegar um post pelo ID
export async function getPostById(postId) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return post;
  } catch (error) {
    throw new Error('Erro ao buscar o post: ' + error.message);
  }
}

export async function getUserPosts(userId, page = 1, limit = 10) {
  try {
    // Calcula o offset baseado na página e no limite
    const offset = (page - 1) * limit;

    // Obtém os IDs dos documentos de postagens de um usuário específico com paginação
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.equal("creator", userId),  // Filtra os posts pelo ID do usuário
        Query.orderDesc('$createdAt'),    // Ordena pela data de criação (decrescente)
        Query.limit(limit),               // Limita o número de postagens
        Query.offset(offset),             // Desloca o início da busca para a página correta
        Query.select(['$id'])             // Seleciona apenas o campo ID dos documentos
      ]
    );

    return {
      documents: posts.documents,   // Retorna os documentos com os IDs
      total: posts.total,           // Retorna o total de posts para controle de paginação
      pages: Math.ceil(posts.total / limit),  // Calcula o número total de páginas
    };
  } catch (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`);
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

export async function getCommentsForPost(postId, page = 1, limit = 2) {
  try {
    const offset = (page - 1) * limit;  // Cálculo para o deslocamento (pular itens anteriores)

    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [
        Query.equal("postId", postId),
        Query.orderDesc("$createdAt"),  // Ordena por data de criação, se necessário
        Query.limit(limit),             // Limita o número de comentários por página
        Query.offset(offset),           // Desloca o início da busca para a página correta
      ]
    );

    return {
      documents: comments.documents,  // Retorna os comentários
      total: comments.total,          // Retorna o total de comentários
      pages: Math.ceil(comments.total / limit),  // Calcula o número total de páginas
    };
  } catch (error) {
    console.error("Erro ao obter comentários do post:", error);
    return { documents: [], total: 0, pages: 0 };  // Retorna dados padrão em caso de erro
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
        creator: userId,
        content: content,
      }
    );
    return newComment;
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error.message);
    throw error;
  }
}

// Função para pegar o comentário pelo ID
export async function getCommentById(commentId) {
  try {
      const response = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.commentsCollectionId,
          commentId
      );
      return response; // Retorna o comentário
  } catch (error) {
      console.error('Erro ao buscar comentário:', error);
  }
}

// Função para deletar o comentário por ID (no backend)
export async function deleteCommentById(commentId) {
  try {
    // Implementar a lógica de exclusão no Appwrite ou outro banco
    await databases.deleteDocument(
      appwriteConfig.databaseId,  // ID do banco de dados
      appwriteConfig.commentsCollectionId,  // ID da coleção de comentários
      commentId  // ID do comentário a ser deletado
    );
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
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

export async function getLikeCount(postId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [Query.equal("postId", postId)]
    );
    return likes.total;
  } catch (error) {
    console.error("Erro ao obter número de likes:", error);
    return 0;
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

export async function getFavoriteCount(postId) {
  try {
    // Lista os documentos na coleção de favoritos para o postId
    const favorites = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [Query.equal("postId", postId)]
    );

    // Retorna o número de documentos encontrados (quantidade de favoritos)
    return favorites.total;
  } catch (error) {
    console.error("Erro ao obter contagem de favoritos:", error.message);
    throw error;
  }
}


// Função para incrementar o número de compartilhamentos
export const incrementShares = async (postId) => {
  try {
      // Buscar o post pelo ID
      const post = await getPostById(postId);

      // Converter o campo shares de string para número
      const currentShares = parseInt(post.shares || "0", 10);

      // Incrementar o valor
      const updatedShares = currentShares + 1;

      // Atualizar o documento com shares convertido de volta para string
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postId,
        {
          shares: updatedShares.toString(), // Converter para string antes de salvar
        }
      );

      return true;
  } catch (error) {
      console.error("Erro ao incrementar shares:", error);
      return false;
  }
};

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
