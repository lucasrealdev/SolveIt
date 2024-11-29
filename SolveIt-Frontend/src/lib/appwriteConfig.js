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
  favoritesCollectionId: "6726bca00024d78f6036",
  likesCommentCollectionId: "673df510002f41d33ae3",
  eventsCollectionId: "67465b65000f8d48c88c",
  quizzesCollectionId: "6748bb010033a892b9d1",
  quizVotesCollectionId: "674907a4002af75a48b1",
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

//INICIO FUNCOES USUARIO
// Função para criar um novo usuário
export async function createUser(email, password, username) {
  try {
    await signOut();  // Logout antes de criar o novo usuário

    // Criação da conta
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error("Falha ao criar a conta.");

    // Gera uma URL de avatar inicial usando as iniciais do usuário
    const avatarUrl = avatars.getInitials(username);

    // Faz login após criação da conta
    await signIn(email, password);

    // Cria o documento do usuário no banco de dados
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
    console.error("Erro ao criar usuário:", error.message);
    throw { message: error.message, code: error.code || 500 };  // Melhorar o código de erro
  }
}

// Função para obter o perfil do usuário
export async function getUserProfile(accountId) {
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", [accountId])]
    );

    // Verifica se o usuário foi encontrado
    if (!user.documents?.length) {
      throw new Error('Usuário não encontrado');
    }

    const userDoc = user.documents[0];

    return {
      username: userDoc.username,
      email: userDoc.email,
      avatar: userDoc.avatar,
      biography: userDoc.biography || "", // Definindo como string vazia caso não haja biografia
      isOnline: userDoc.isOnline
    };
  } catch (error) {
    console.error("Erro ao obter perfil:", error.message);
    throw new Error(error.message || "Erro desconhecido");
  }
}

// Função para fazer login de usuário
export async function signIn(email, password) {
  try {
    await signOut();
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    throw new Error("Falha ao autenticar o usuário.");
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
    console.error("Erro ao obter conta do usuário:", error.message);
    return null;
  }
}

// Função para obter os dados do usuário atual
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    return currentUser?.documents?.[0] || null;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error.message);
    return null;
  }
}

// Função para alternar o status 'isOnline' do usuário
export async function toggleUserOnlineStatus() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Usuário não encontrado ou não autenticado.");
    }

    const updatedStatus = !currentUser.isOnline;  // Alterna o status
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      { isOnline: updatedStatus }
    );

    return updatedStatus;
  } catch (error) {
    throw new Error("Erro ao alternar status de online.");
  }
}

// Função para fazer logout do usuário
export async function signOut() {
  try {
    const session = await getSession(); // Verifica se há uma sessão ativa antes de tentar deletá-la

    if (!session) {
      return null; // Retorna null caso não haja sessão ativa
    }

    const deletedSession = await account.deleteSession("current");
    return deletedSession;
  } catch (error) {
    throw new Error("Erro ao fazer logout.");
  }
}
//FIM FUNCOES USUARIO

export async function getCityAndStateByZipCode(zipCode) {
  try {
    if (!zipCode) {
      throw new Error("CEP não informado.");
    }

    // Fazendo a requisição para a API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);

    if (response.data.erro) {
      throw new Error("CEP não encontrado.");
    }

    const { localidade: city, uf: state } = response.data;

    return {
      city,
      state,
      country: "Brasil",
    };
  } catch (error) {
    throw new Error(`Erro ao buscar o CEP: ${error.message}`);
  }
}

//INICIO funcoes storage
// Função para fazer o upload de um arquivo
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
    throw new Error('Falha ao enviar o arquivo. Tente novamente. Detalhes: ' + error.message);
  }
}

// Função para obter a URL de visualização de um arquivo
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = await storage.getFilePreview(
        appwriteConfig.storageId,
        fileId, // ID do arquivo
        2000,   // Largura máxima da imagem
        2000,   // Altura máxima da imagem
        "top",  // Posição do corte
        100     // Qualidade da imagem
      );
    } else {
      throw new Error("Tipo de arquivo inválido. Apenas imagens são suportadas.");
    }

    if (!fileUrl) throw new Error("Não foi possível gerar o preview do arquivo.");

    return fileUrl;
  } catch (error) {
    throw new Error('Erro ao obter o preview do arquivo: ' + error.message);
  }
}
//FIM funcoes storage

//INICIO funcoes post
// Função para criar uma nova postagem
export async function createPost(form, isWeb) {
  try {
    // Faz o upload da imagem de miniatura
    const [thumbnailUrl] = await Promise.all([uploadFile(form.thumbnail, "image", isWeb)]);

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
    throw new Error('Erro ao criar o post: ' + error.message);
  }
}

// Função para pegar todas as postagens com paginação
export async function getAllPosts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.orderDesc('$createdAt'),  // Ordena pela data de criação (decrescente)
        Query.limit(limit),             // Limita o número de postagens
        Query.offset(offset),           // Desloca o início da busca para a página correta
        Query.select(['$id'])           // Seleciona apenas os campos necessários (id)
      ]
    );

    return posts.documents;  // Retorna apenas os documentos com os IDs
  } catch (error) {
    throw new Error("Erro ao buscar todos os posts: " + error.message);
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
    throw new Error("Erro ao buscar o post: " + error.message);
  }
}

// Função para pegar postagens de um usuário com paginação
export async function getUserPosts(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.equal("creator", userId),   // Filtra os posts pelo ID do usuário
        Query.orderDesc('$createdAt'),     // Ordena pela data de criação (decrescente)
        Query.limit(limit),                // Limita o número de postagens
        Query.offset(offset),              // Desloca o início da busca para a página correta
        Query.select(['$id'])              // Seleciona apenas o campo ID dos documentos
      ]
    );

    return {
      documents: posts.documents,        // Retorna os documentos com os IDs
      total: posts.total,                // Retorna o total de posts para controle de paginação
      pages: Math.ceil(posts.total / limit),  // Calcula o número total de páginas
    };
  } catch (error) {
    throw new Error("Erro ao buscar posts de usuário: " + error.message);
  }
}

// Função para pesquisar postagens por uma string de consulta
export async function searchPosts(query, limit = 10) {
  try {
    // Limita o número de resultados retornados para melhorar a performance
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.search("title", query),
        Query.limit(limit) // Limita o número de posts retornados
      ]
    );

    return posts.documents; // Retorna os documentos encontrados
  } catch (error) {
    throw new Error("Erro ao realizar a busca: " + error.message);
  }
}

// Função para incrementar o número de compartilhamentos
export const incrementShares = async (postId) => {
  try {
    // Buscar o post e obter o campo 'shares'
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    // Incrementa o número de compartilhamentos diretamente
    const updatedShares = (parseInt(post.shares || "0", 10) + 1).toString();

    // Atualiza o post com o novo número de compartilhamentos
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      { shares: updatedShares }
    );

    return true; // Indica que a operação foi bem-sucedida
  } catch (error) {
    throw new Error("Erro ao incrementar compartilhamentos: " + error.message);
  }
};

// Função para deletar um post pelo ID
export async function deletePostById(postId) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return { success: true, message: "Post deletado com sucesso!" };
  } catch (error) {
    throw new Error("Erro ao apagar o post: " + error.message);
  }
}
//FIM funcoes post

//INICIO funcoes follow
// Função para seguir um usuário
export async function followUser(followerId, followingId) {
  try {
    const followDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId, // A coleção de follows
      ID.unique(),
      {
        followerId,
        followingId,
      }
    );
    return followDocument;
  } catch (error) {
    throw new Error(`Erro ao seguir usuário: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para deixar de seguir um usuário
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
    throw new Error(`Erro ao deixar de seguir usuário: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter os seguidores de um usuário
export async function getFollowers(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit; // Cálculo para o deslocamento (pular itens anteriores)

    // Consulta para buscar seguidores
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followingId", userId),
        Query.orderDesc("$createdAt"), // Ordena por data de criação
        Query.limit(limit),           // Limita o número de resultados por página
        Query.offset(offset),         // Define o deslocamento
      ]
    );

    return {
      documents: followers.documents, // Retorna os seguidores
      total: followers.total,         // Retorna o total de seguidores
      pages: Math.ceil(followers.total / limit), // Calcula o número total de páginas
    };
  } catch (error) {
    throw new Error(`Erro ao obter seguidores: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter os usuários seguidos por um usuário
export async function getFollowing(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit; // Cálculo para o deslocamento (pular itens anteriores)

    // Consulta para buscar quem o usuário está seguindo
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.orderDesc("$createdAt"), // Ordena por data de criação
        Query.limit(limit),           // Limita o número de resultados por página
        Query.offset(offset),         // Define o deslocamento
      ]
    );

    return {
      documents: following.documents, // Retorna os usuários seguidos
      total: following.total,         // Retorna o total de usuários seguidos
      pages: Math.ceil(following.total / limit), // Calcula o número total de páginas
    };
  } catch (error) {
    throw new Error(`Erro ao obter seguindo: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter o número de seguidores de um usuário
export async function getFollowerCount(userId) {
  try {
    // Consulta para contar o número de seguidores de um usuário
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followingId", userId)]
    );

    return result.total; // Retorna o total de seguidores
  } catch (error) {
    throw new Error(`Erro ao obter o número de seguidores: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter o número de usuários seguidos por um usuário
export async function getFollowingCount(userId) {
  try {
    // Consulta para contar o número de usuários seguidos por um usuário
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followerId", userId)]
    );

    return result.total; // Retorna o total de usuários seguidos
  } catch (error) {
    throw new Error(`Erro ao obter o número de usuários seguidos: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para verificar se um usuário está seguindo outro
export async function checkIfFollowing(followerId, followingId) {
  try {
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );

    return follows.documents.length > 0; // Retorna true se existir um documento
  } catch (error) {
    throw new Error(`Erro ao verificar se está seguindo: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para sugerir amigos para um usuário
export async function getSuggestedFriends(userId, page = 1, limit = 10) {
  try {
    // Validar se o ID do usuário é fornecido
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    // Calcular o deslocamento para a paginação
    const offset = (page - 1) * limit;

    // Buscar os IDs dos usuários que o usuário atual segue
    const followingResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.select(["followingId"])
      ]
    );

    // Extrair os IDs dos usuários seguidos
    const followedUserIds = followingResponse.documents.map(doc => doc.followingId);

    // Preparar as consultas para buscar usuários não seguidos
    const queries = [
      Query.notEqual("$id", userId), // Excluir o próprio usuário
      ...followedUserIds.map(id => Query.notEqual("$id", id)) // Excluir usuários já seguidos
    ];

    // Buscar usuários não seguidos com paginação
    const notFollowingUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        ...queries,
        Query.orderDesc("$createdAt"), // Opcional: ordenar por data de criação
        Query.limit(limit),
        Query.offset(offset)
      ]
    );

    return {
      documents: notFollowingUsers.documents, // Usuários não seguidos
      total: notFollowingUsers.total, // Total de usuários encontrados
      pages: Math.ceil(notFollowingUsers.total / limit), // Total de páginas
      currentPage: page // Página atual
    };
  } catch (error) {
    throw new Error(`Erro ao buscar usuários não seguidos: ${error.message}`); // Lança um erro com a mensagem
  }
}
//FIM funcoes follow

//INICIO funcoes comentario
// Função para obter comentários de um post com paginação
export async function getCommentsForPost(postId, page = 1, limit = 2) {
  try {
    const offset = (page - 1) * limit;  // Cálculo para o deslocamento (pular itens anteriores)

    // Reutilizando a consulta para pegar comentários, sem carregar dados desnecessários
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [
        Query.equal("postId", postId),
        Query.orderDesc("$createdAt"),  // Ordena por data de criação
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
    throw new Error(`Erro ao obter comentários do post: ${error.message}`);  // Lança um erro com a mensagem
  }
}

// Função para adicionar um comentário a um post
export async function addComment(postId, userId, content) {
  try {
    if (!content.trim()) {
      throw new Error("O comentário não pode estar vazio.");
    }

    // Cria o documento de comentário
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        postId: postId,
        creator: userId,
        content: content,
      }
    );
    return newComment;
  } catch (error) {
    throw new Error(`Erro ao adicionar comentário: ${error.message}`);  // Lança um erro com a mensagem
  }
}

// Função para pegar o comentário pelo ID
export async function getCommentById(commentId) {
  try {
    // Utiliza getDocument para pegar um comentário específico
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );
    return response;  // Retorna o comentário
  } catch (error) {
    throw new Error(`Erro ao buscar comentário: ${error.message}`);  // Lança um erro com a mensagem
  }
}

// Função para deletar o comentário por ID
export async function deleteCommentById(commentId) {
  try {
    // Realiza a exclusão diretamente
    await databases.deleteDocument(
      appwriteConfig.databaseId,  // ID do banco de dados
      appwriteConfig.commentsCollectionId,  // ID da coleção de comentários
      commentId  // ID do comentário a ser deletado
    );
  } catch (error) {
    throw new Error(`Erro ao excluir comentário: ${error.message}`);  // Lança um erro com a mensagem
  }
}
//FIM funcoes comentario

//INICIO funcoes post
// Função para verificar se o usuário curtiu o post
export async function userLikedPost(postId, userId) {
  try {
    // Limita a consulta a 1 resultado para verificar rapidamente se o post foi curtido
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)],
      1 // Limita a consulta a 1 resultado
    );

    return likes.total > 0; // Retorna true se o usuário curtiu o post
  } catch (error) {
    throw new Error(`Erro ao verificar se o usuário curtiu o post: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter a quantidade de likes de um post
export async function getLikeCount(postId) {
  try {
    // Apenas retorna o total de likes, sem carregar os documentos completos
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [Query.equal("postId", postId)]
    );
    return likes.total; // Retorna a quantidade total de likes
  } catch (error) {
    throw new Error(`Erro ao obter número de likes do post: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para alternar o like em um post (curtir/descurtir)
export async function toggleLike(postId, userId) {
  try {
    // Verifica se o usuário já curtiu o post
    const liked = await userLikedPost(postId, userId);

    if (liked) {
      // Se já curtiu, remove o like
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)],
        1 // Limita a consulta a 1 resultado
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
    throw new Error(`Erro ao alternar like no post: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para alternar entre favoritar e desfavoritar um post
export async function toggleFavorite(postId, userId) {
  try {
    const favorites = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );

    if (favorites.total > 0) {
      // Se o post já está favoritado, remove o favorito
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        favorites.documents[0].$id
      );
      return false; // O post não é mais favorito
    } else {
      // Se o post não está favoritado, adiciona o favorito
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        ID.unique(),
        { userId, postId }
      );
      return true; // O post agora é favorito
    }
  } catch (error) {
    throw new Error(`Erro ao alternar favorito: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter o número de favoritos de um post
export async function getFavoriteCount(postId) {
  try {
    const favorites = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [Query.equal("postId", postId)]
    );

    return favorites.total; // Retorna o número de favoritos
  } catch (error) {
    throw new Error(`Erro ao obter contagem de favoritos: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para verificar se um post é favorito de um usuário
export async function userFavoritedPost(postId, userId) {
  try {
    const favorites = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)],
      1 // Limita a consulta a 1 resultado
    );

    return favorites.total > 0; // Retorna true se o post está favoritado
  } catch (error) {
    throw new Error(`Erro ao verificar se o post é favorito: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para verificar se um usuário curtiu um comentário
export async function userLikedComment(userId, commentId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCommentCollectionId,
      [Query.equal("commentId", commentId), Query.equal("userId", userId)],
      1 // Limita a consulta a 1 resultado
    );

    return likes.total > 0; // Retorna true se o usuário curtiu o comentário
  } catch (error) {
    throw new Error(`Erro ao verificar se o usuário curtiu o comentário: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para obter o número de curtidas de um comentário
export async function getLikeCountComment(commentId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCommentCollectionId,
      [Query.equal("commentId", commentId)]
    );

    return likes.total; // Retorna o número de curtidas
  } catch (error) {
    throw new Error(`Erro ao obter número de likes do comentário: ${error.message}`); // Lança um erro com a mensagem
  }
}

// Função para alternar a curtidinha de um comentário
export async function toggleLikeComment(userId, commentId) {
  try {
    const liked = await userLikedComment(userId, commentId);

    if (liked) {
      // Se o comentário já foi curtido, remove a curtidinha
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCommentCollectionId,
        [Query.equal("commentId", commentId), Query.equal("userId", userId)],
        1 // Limita a consulta a 1 resultado
      );

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCommentCollectionId,
        likes.documents[0].$id
      );

      return false; // Comentário não está mais curtido
    } else {
      // Se o comentário não foi curtido, adiciona a curtidinha
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCommentCollectionId,
        ID.unique(),
        { userId, commentId }
      );

      return true; // Comentário foi curtido
    }
  } catch (error) {
    throw new Error(`Erro ao alternar like no comentário: ${error.message}`); // Lança um erro com a mensagem
  }
}
//FIM curtidas comentario

//INICIO funcoes eventos
export async function getAllEvents() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId
    );

    return response.documents; // Retorna todos os documentos da coleção
  } catch (error) {
    throw new Error(`Erro ao buscar os documentos: ${error.message}`);
  }
};
//FIM funcoes eventos

//INICIO funcoes quiz
export async function updateVote(quizId, userId, optionIndex) {
  try {
    // Verificar se o usuário já votou utilizando a nova coleção de votos
    const existingVote = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizVotesCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("quizId", quizId)
      ]
    );

    // Se o usuário já votou e está atualizando, remova o voto anterior
    if (existingVote.documents.length > 0) {
      const previousVote = existingVote.documents[0];
      const previousOptionIndex = previousVote.optionIndex;

      // Se o voto anterior for diferente, reduz o voto na opção anterior
      if (previousOptionIndex !== optionIndex) {
        // Remover o voto anterior da coleção `quizVotes`
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.quizVotesCollectionId,
          previousVote.$id
        );
      }
    }

    // Adiciona o novo voto na coleção `quizVotes`
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizVotesCollectionId,
      ID.unique(),
      {
        userId: userId,
        quizId: quizId,
        voteIndex: optionIndex.toString(),
      }
    );

    // Atualiza a contagem de votos na coleção `quizVotes`
    return { success: true, message: "Voto registrado com sucesso!"};

  } catch (error) {
    throw new Error("Erro ao atualizar o voto: " + error.message);
  }
}

// Função para verificar se o usuário já votou no quiz
export const checkUserVote = async (quizId, userId) => {
  try {
    const existingVote = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizVotesCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("quizId", quizId),
      ]
    );

    return existingVote.documents.length > 0 ? existingVote.documents[0] : null;
  } catch (error) {
    throw new Error("Erro ao verificar voto do usuário: " + error.message);
  }
};

export const getVotesCount = async (quizId) => {
  try {
    // Lista todos os votos do quiz na coleção `quizVotes`
    const votes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizVotesCollectionId,
      [Query.equal("quizId", quizId)] // Filtra pelos votos do quiz específico
    );

    // Cria um objeto para armazenar a contagem de votos por índice de opção
    const votesCount = {};

    // Itera sobre os votos e conta os votos para cada `voteIndex`
    votes.documents.forEach((vote) => {
      const { voteIndex } = vote;  // Acessa o campo voteIndex
      if (votesCount[voteIndex]) {
        votesCount[voteIndex] += 1;  // Incrementa o contador para o índice específico
      } else {
        votesCount[voteIndex] = 1;  // Inicializa o contador para o índice específico
      }
    });

    // Retorna a contagem de votos por índice de opção
    return votesCount;
  } catch (error) {
    throw new Error("Erro ao obter a contagem de votos: " + error.message);
  }
};

export async function fetchAllQuizIds() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizzesCollectionId
    );

    const quizIds = response.documents.map((doc) => doc.$id);
    return quizIds;
  } catch (error) {
    throw new Error("Erro ao buscar IDs dos quizzes: " + error.message);
  }
}

export async function fetchQuizById(quizId) {
  try {
    const quizData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizzesCollectionId,
      quizId
    );

    // Garantir que as opções estejam no formato correto
    const parsedOptions = quizData.options.map(option => {
      const cleanedOption = option.trim().replace(/,$/, "");
      return JSON.parse(cleanedOption);
    });

    return { ...quizData, options: parsedOptions };
  } catch (error) {
    throw new Error("Erro ao carregar o quiz: " + error.message);
  }
}
//FIM funcoes quiz