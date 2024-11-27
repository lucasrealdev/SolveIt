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
  eventsCollectionId: "67465b65000f8d48c88c"
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
      console.error("Erro ao alternar isOnline:", error.message);
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
      console.error("Erro ao fazer logout:", error.message);
      throw new Error("Erro ao fazer logout.");
    }
  }
//FIM FUNCOES USUARIO

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

//INICIO funcoes storage
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
      throw new Error('Falha ao enviar o arquivo. Tente novamente.' + error);
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
//Fim funcoes storage

//INICIO funcoes post
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
      console.error("Erro ao buscar todos os posts:", error.message);
      throw new Error("Erro ao buscar todos os posts.");
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
      console.error("Erro ao buscar posts de usuário:", error.message);
      throw new Error("Erro ao buscar posts de usuário.");
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
      console.error("Erro ao pesquisar postagens:", error.message);
      throw new Error("Erro ao realizar a busca");
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
      console.error("Erro ao incrementar compartilhamentos:", error.message);
      return false; // Retorna false se houver erro
    }
  };

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
      console.error("Erro ao obter seguidores:", error);
      throw error;
    }
  }
  
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
      console.error("Erro ao obter seguindo:", error);
      throw error;
    }
  }

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
      console.error("Erro ao obter o número de seguidores:", error);
      return 0; // Retorna 0 em caso de erro
    }
  }

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
      console.error("Erro ao obter o número de usuários seguidos:", error);
      return 0; // Retorna 0 em caso de erro
    }
  }
  
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
      console.error("Erro ao verificar se está seguindo:", error);
      return false; // Retorna falso em caso de erro
    }
  }

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
      console.error("Erro ao buscar usuários não seguidos:", error);
      throw error;
    }
  }
  
//FIM funcoes follow

//INICIO funcoes comentario
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
      console.error("Erro ao obter comentários do post:", error.message);
      throw error;
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
      console.error("Erro ao adicionar comentário:", error.message);
      throw error;
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
      console.error('Erro ao buscar comentário:', error.message);
      throw error;
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
      console.error('Erro ao excluir comentário:', error.message);
      throw error;
    }
  }
//FIM funcoes comentario


//INICIO funcoes like post
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
      console.error("Erro ao verificar se o usuário curtiu o post:", error.message);
      throw error;
    }
  }
  
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
      console.error("Erro ao obter número de likes do post:", error.message);
      return 0; // Retorna 0 em caso de erro
    }
  }
  
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
      console.error("Erro ao alternar like no post:", error.message);
      throw error;
    }
  }  
//FIM funcoes like post

//INICIO funcoes favoritos 
  // Função para alternar o estado do favorito e retornar se é favorito ou não
  export async function toggleFavorite(postId, userId) {
    try {
      // Consulta para verificar se o post já está favoritado e obter o documento, se existir
      const favorites = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );
  
      if (favorites.total > 0) {
        // Remove o documento diretamente, já que sabemos seu $id
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.favoritesCollectionId,
          favorites.documents[0].$id
        );
        return false; // Agora não é mais favorito
      } else {
        // Adiciona um novo favorito
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.favoritesCollectionId,
          ID.unique(),
          { userId, postId }
        );
        return true; // Agora é favorito
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

  // Função para verificar se o post está nos favoritos do usuário
  export async function userFavoritedPost(postId, userId) {
    try {
      // Evita buscas desnecessárias, já que só queremos saber se existe
      const favorites = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.favoritesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)],
        1 // Limita a consulta a 1 resultado
      );
  
      return favorites.total > 0; // Retorna true se há favoritos
    } catch (error) {
      console.error("Erro ao verificar se o post é favorito:", error.message);
      throw error;
    }
  }
//FIM funcoes favoritos 

//INICIO Curtidas Comentario
  export async function userLikedComment(userId, commentId) {
    try {
      // Limita a consulta a 1 resultado para evitar a busca desnecessária de múltiplos documentos
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCommentCollectionId,
        [Query.equal("commentId", commentId), Query.equal("userId", userId)],
        1 // Limita a consulta a 1 documento
      );

      return likes.total > 0; // Retorna true se o usuário curtiu o comentário
    } catch (error) {
      console.error("Erro ao verificar se o usuário curtiu o comentário:", error.message);
      throw error;
    }
  }

  export async function getLikeCountComment(commentId) {
    try {
      // Apenas retorna o total de likes, sem carregar os documentos
      const likes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCommentCollectionId,
        [Query.equal("commentId", commentId)]
      );
      return likes.total;
    } catch (error) {
      console.error("Erro ao obter número de likes do comentário:", error.message);
      return 0; // Retorna 0 em caso de erro
    }
  }

  export async function toggleLikeComment(userId, commentId) {
    try {
      // Verifica se o usuário já curtiu o comentário
      const liked = await userLikedComment(userId, commentId);

      if (liked) {
        // Se o usuário já curtiu, busca e remove o like
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

        return false; // Retorna que o comentário não é mais curtir
      } else {
        // Se o usuário não curtiu, adiciona o like
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.likesCommentCollectionId,
          ID.unique(),
          { userId, commentId }
        );

        return true; // Retorna que o comentário foi curtido
      }
    } catch (error) {
      console.error("Erro ao alternar like no comentário:", error.message);
      throw error;
    }
  }
//FIM curtidas comentario

//INICIO funcoes eventos
  export async function getAllEvents() {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.eventsCollectionId,
      );
      
      return response.documents; // Retorna todos os documentos da coleção
    } catch (error) {
      console.error('Erro ao buscar os documentos:', error);
    }
  };
//FIM funcoes eventos