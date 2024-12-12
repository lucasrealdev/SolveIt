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
  projectId: "675a4ecc0026b13eed36",
  storageId: "675a57cb00233e1f16ab",
  databaseId: "675a4f770003eeff7bb9",
  userCollectionId: "675a500e0036772a4baf",
  postsCollectionId: "675a50dc0037fc95fb70",
  followsCollectionId: "675a5667001c6600e156",
  commentsCollectionId: "675a5533003905d56029",
  likesCollectionId: "675a540a002b21a9a067",
  favoritesCollectionId: "675a55da003143c8d589",
  likesCommentCollectionId: "675a561b0022358afa77",
  eventsCollectionId: "675a5783001407778e93",
  quizCollectionId: "675a58af0015f9f51713",
  quizVotesCollectionId: "675a58e80025ce26c609",
  storiesCollectionId: "675a594d0024c6b991e1",
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
export async function createUser(email, password, username, avatar = undefined) {
  try {
    await signOut();  // Logout antes de criar o novo usuário

    // Criação da conta
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error("Falha ao criar a conta.");

    // Se o avatar for fornecido, use-o, caso contrário, use o avatar gerado com as iniciais
    const avatarUrl = avatar || avatars.getInitials(username);

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
    throw { message: error.message, code: error.code || 500 };  // Melhorar o código de erro
  }
}

export async function continueWithGoogle(email, password, username, avatar) {
  try {
    // Verificar se o usuário já existe no banco de dados
    const existingUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", [email])]
    );

    if (existingUsers.documents.length > 0) {
      // Usuário existe, tente fazer login
      const user = await signIn(email, password);
      return { status: "logged_in", user };
    } else {
      const avatarUrl = avatars.getInitials(username);

      // Criar um novo usuário com o avatar enviado
      const newUser = await createUser(email, password, username, avatarUrl);

      return { status: "created_and_logged_in", newUser };
    }
  } catch (error) {
    // Se o erro for relacionado a e-mail já cadastrado, trata esse caso
    if (error.message.includes('Falha ao autenticar o usuário')) {
      throw { message: "Já existe uma conta associada a este e-mail. Tente fazer login com a senha.", code: 409 };
    }

    throw { message: error.message, code: error.code || 500 };
  }
}

export async function updateUser(userId, form, isWeb, bannerId, avatarId) {
  try {

    // Prepara o objeto de dados a ser atualizado
    const updateData = {
      username: form.username,       // Atualiza o nome de usuário
      numberPhone: form.numberPhone, // Atualiza o número de telefone
      biography: form.biography,     // Atualiza a biografia
    };

    if (typeof form.profile !== "string") {
      const { url, id } = await uploadFile(form.profile, "image", isWeb, avatarId);
      updateData.avatar = url;
      updateData.avatarId = id;
    }

    if (typeof form.banner !== "string") {
      const { url, id } = await uploadFile(form.banner, "image", isWeb, bannerId);
      updateData.banner = url;
      updateData.bannerId = id;
    }

    // Atualiza os dados do usuário no banco de dados
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId, // ID do usuário para atualização
      updateData
    );

    return updatedUser;
  } catch (error) {
    throw { message: error.message, code: error.code || 500 };  // Melhorar o código de erro
  }
}

export async function updateUserAccountType(userId, accountType) {
  try {
    // Atualiza os dados do usuário no banco de dados
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId, // ID do usuário para atualização
      {
        accountType: accountType,       // Atualiza o nome de usuário
      }
    );

    return updatedUser;
  } catch (error) {
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
      isOnline: userDoc.isOnline,
      numberPhone: userDoc.numberPhone,
      accountType: userDoc.accountType,
      banner: userDoc.banner,
    };
  } catch (error) {
    throw { message: error.message || "Erro desconhecido", code: error.code || 500 }; // Melhorar o código de erro
  }
}

// Função para fazer login de usuário
export async function signIn(email, password) {
  try {
    await signOut();
    await account.createEmailPasswordSession(email, password);
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    throw { message: "Falha ao autenticar o usuário.", code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao alternar isOnline: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: "Erro ao fazer logout.", code: error.code || 500 }; // Melhorar o código de erro
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
export async function uploadFile(file, type, isWeb, storageId = null) {
  if (!file) return;
  try {
    let uploadedFile;

    // Caso exista um ID de storage, exclui o arquivo antigo
    if (storageId) {
      await storage.deleteFile(appwriteConfig.storageId, storageId);  // Deleta o arquivo existente
    }

    // Se for no navegador (web), utiliza o objeto File diretamente
    if (isWeb) {
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
    } else {
      // Caso contrário, extrai o tipo MIME do arquivo
      const { mimeType, ...rest } = file;
      const asset = { type: mimeType, ...rest };

      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
    }

    // Obter o preview do arquivo
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return { url: fileUrl, id: uploadedFile.$id };
  } catch (error) {
    throw { message: `Falha ao enviar o arquivo. Tente novamente. ${error.message}`, code: error.code || 500 };
  }
}

export async function uploadVideoFile(file, isWeb) {
  if (!file) return;

  try {
    let uploadedFile;

    // Para web
    if (isWeb) {
      console.log(file);
      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file // Objeto File direto
      );
    } else {
      // Para mobile/dispositivos não-web
      const { mimeType, uri, ...rest } = file;
      const asset = {
        type: mimeType || 'video/mp4',
        uri: uri,
        ...rest
      };

      uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
    }

    // Obter URL do vídeo
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      uploadedFile.$id
    );

    return {
      storyId: uploadedFile.$id,
      videoUrl: fileUrl
    };
  } catch (error) {
    throw {
      message: `Falha ao enviar o vídeo. Tente novamente. ${error.message}`,
      code: error.code || 500
    };
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
        0,   // Altura máxima da imagem
        "center",  // Posição do corte
        100     // Qualidade da imagem
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw { message: `Erro ao pegar link da imagem: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
}
//Fim funcoes storage

//INICIO funcoes post

// Função para criar uma nova postagem
export async function createPost(form, isWeb) {
  try {
    const { url } = await uploadFile(form.thumbnail, "image", isWeb);
    let thumbnailUrl = url;

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
    throw { message: `Erro ao criar Post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
}

// Função para pegar todas as postagens com paginação
export const fetchEntirePosts = async (page = 1, limit = 10, user = null) => {
  try {
    const offset = (page - 1) * limit;

    // Buscar os posts diretamente do Appwrite
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.orderDesc('$createdAt'), // Ordena pela data de criação
        Query.limit(limit),           // Limita o número de postagens
        Query.offset(offset),         // Define o deslocamento para paginação
      ]
    );

    // Enriquecer os posts com dados adicionais
    const enrichedPosts = await Promise.all(
      posts.documents.map(async (post) => {
        const [likes, comments, favorites, userLikedState, userFavoritedState] = await Promise.all([
          getLikeCount(post.$id), // Total de likes
          getCommentsForPost(post.$id, 1, 10), // Comentários da página 1 (exemplo)
          getFavoriteCount(post.$id), // Total de favoritos
          user ? userLikedPost(post.$id, user?.$id) : false, // Verificar se o usuário curtiu
          user ? userFavoritedPost(post.$id, user.$id) : false, // Verificar se o usuário favoritou
        ]);
        // Enriquecer os comentários com likeCount e isLiked
        const enrichedComments = await Promise.all(comments.documents.map(async (comment) => {
          // Obter a contagem de likes para cada comentário, com fallback para 0
          const likeCount = await getLikeCountComment(comment.$id).catch(() => 0);

          // Verificar se o usuário curtiu o comentário, com fallback para false
          const isLiked = user?.$id
            ? await userLikedComment(user.$id, comment.$id).catch(() => false)
            : false;

          return {
            ...comment,
            likeCount,  // Adiciona a contagem de likes do comentário
            isLiked,    // Adiciona se o usuário curtiu ou não
          };
        }));

        return {
          post: post,
          liked: userLikedState,
          likeCount: likes,
          commentCount: comments.total || 0,
          comments: enrichedComments, // Substitui os comentários originais pelos enriquecidos
          isFavorited: userFavoritedState,
          favoriteCount: favorites,
          shareCount: parseInt(post.shares || "0", 10),
        };
      })
    );

    return enrichedPosts;
  } catch (error) {
    throw { message: `Erro ao buscar o EntirePosts: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
};

export const fetchPostById = async (postId, user = null) => {
  try {
    // Buscar o post específico pelo ID
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    // Enriquecer o post com dados adicionais
    const [likes, comments, favorites, userLikedState, userFavoritedState] = await Promise.all([
      getLikeCount(post.$id), // Total de likes
      getCommentsForPost(post.$id, 1, 10), // Comentários da página 1 (exemplo)
      getFavoriteCount(post.$id), // Total de favoritos
      user ? userLikedPost(post.$id, user?.$id) : false, // Verificar se o usuário curtiu
      user ? userFavoritedPost(post.$id, user.$id) : false, // Verificar se o usuário favoritou
    ]);

    // Enriquecer os comentários com likeCount e isLiked
    const enrichedComments = await Promise.all(comments.documents.map(async (comment) => {
      // Obter a contagem de likes para cada comentário, com fallback para 0
      const likeCount = await getLikeCountComment(comment.$id).catch(() => 0);

      // Verificar se o usuário curtiu o comentário, com fallback para false
      const isLiked = user?.$id
        ? await userLikedComment(user.$id, comment.$id).catch(() => false)
        : false;

      return {
        ...comment,
        likeCount,  // Adiciona a contagem de likes do comentário
        isLiked,    // Adiciona se o usuário curtiu ou não
      };
    }));

    return {
      post: post,
      liked: userLikedState,
      likeCount: likes,
      commentCount: comments.total || 0,
      comments: enrichedComments, // Substitui os comentários originais pelos enriquecidos
      isFavorited: userFavoritedState,
      favoriteCount: favorites,
      shareCount: parseInt(post.shares || "0", 10),
    };

  } catch (error) {
    throw { message: `Erro ao buscar o post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
};

// Função para pegar postagens de um usuário com paginação
export async function fetchPostsUser(userId, page = 1, limit = 10, user = null) {
  try {
    const offset = (page - 1) * limit;

    // Buscar os IDs dos posts do usuário
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.equal("creator", userId),   // Filtra os posts pelo ID do usuário
        Query.orderDesc('$createdAt'),   // Ordena pela data de criação (decrescente)
        Query.limit(limit),              // Limita o número de postagens
        Query.offset(offset),            // Desloca o início da busca para a página correta
      ]
    );

    // Enriquecer cada post com os dados adicionais
    const enrichedPosts = await Promise.all(
      posts.documents.map(async (post) => {
        const [likes, comments, favorites, userLikedState, userFavoritedState] = await Promise.all([
          getLikeCount(post.$id), // Total de likes
          getCommentsForPost(post.$id, 1, 10), // Comentários da página 1 (exemplo)
          getFavoriteCount(post.$id), // Total de favoritos
          user ? userLikedPost(post.$id, user?.$id) : false, // Verificar se o usuário curtiu
          user ? userFavoritedPost(post.$id, user.$id) : false, // Verificar se o usuário favoritou
        ]);

        // Enriquecer os comentários com likeCount e isLiked
        const enrichedComments = await Promise.all(
          comments.documents.map(async (comment) => {
            const likeCount = await getLikeCountComment(comment.$id).catch(() => 0);
            const isLiked = user?.$id
              ? await userLikedComment(user.$id, comment.$id).catch(() => false)
              : false;

            return {
              ...comment,
              likeCount,  // Adiciona a contagem de likes do comentário
              isLiked,    // Adiciona se o usuário curtiu ou não
            };
          })
        );

        return {
          post,
          liked: userLikedState,
          likeCount: likes,
          commentCount: comments.total || 0,
          comments: enrichedComments, // Substitui os comentários originais pelos enriquecidos
          isFavorited: userFavoritedState,
          favoriteCount: favorites,
          shareCount: parseInt(post.shares || "0", 10),
        };
      })
    );

    return {
      documents: enrichedPosts,        // Retorna os posts enriquecidos
      total: posts.total,          // Total de posts
      pages: Math.ceil(posts.total / limit), // Número total de páginas
    };

  } catch (error) {
    throw { message: `Erro ao buscar posts de usuário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
}

export const fetchFavoritesPosts = async (page = 1, limit = 10, user = null) => {
  try {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const offset = (page - 1) * limit;

    // Buscar os IDs dos posts favoritados pelo usuário na coleção de favoritos
    const favoritePosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.favoritesCollectionId,
      [
        Query.equal('userId', user.$id), // Filtrar favoritos pelo usuário
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const favoritePostIds = favoritePosts.documents.map(fav => fav.postId);

    if (favoritePostIds.length === 0) {
      return []; // Retorna vazio se não houver posts favoritos
    }

    // Buscar os detalhes dos posts favoritados usando os IDs coletados
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.equal('$id', favoritePostIds), // Filtrar pelos IDs dos favoritos
        Query.orderDesc('$createdAt'),       // Ordena pela data de criação
      ]
    );

    // Enriquecer os posts com dados adicionais
    const enrichedPosts = await Promise.all(
      posts.documents.map(async (post) => {
        const [likes, comments, favorites, userLikedState, userFavoritedState] = await Promise.all([
          getLikeCount(post.$id), // Total de likes
          getCommentsForPost(post.$id, 1, 10), // Comentários da página 1 (exemplo)
          getFavoriteCount(post.$id), // Total de favoritos
          user ? userLikedPost(post.$id, user.$id) : false, // Verificar se o usuário curtiu
          user ? userFavoritedPost(post.$id, user.$id) : false, // Verificar se o usuário favoritou
        ]);

        // Enriquecer os comentários com likeCount e isLiked
        const enrichedComments = await Promise.all(comments.documents.map(async (comment) => {
          const likeCount = await getLikeCountComment(comment.$id).catch(() => 0);
          const isLiked = user?.$id
            ? await userLikedComment(user.$id, comment.$id).catch(() => false)
            : false;

          return {
            ...comment,
            likeCount, // Adiciona a contagem de likes do comentário
            isLiked,   // Adiciona se o usuário curtiu ou não
          };
        }));

        return {
          post: post,
          liked: userLikedState,
          likeCount: likes,
          commentCount: comments.total || 0,
          comments: enrichedComments, // Substitui os comentários originais pelos enriquecidos
          isFavorited: userFavoritedState,
          favoriteCount: favorites,
          shareCount: parseInt(post.shares || "0", 10),
        };
      })
    );

    return enrichedPosts;
  } catch (error) {
    throw { message: `Erro ao buscar os posts favoritos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
};

// Função para pesquisar postagens por uma string de consulta
async function enrichPost(post, user = null) {
  try {
    const [likes, comments, favorites, userLikedState, userFavoritedState] = await Promise.all([
      getLikeCount(post.$id), // Total de likes
      getCommentsForPost(post.$id, 1, 10), // Comentários da página 1 (exemplo)
      getFavoriteCount(post.$id), // Total de favoritos
      user ? userLikedPost(post.$id, user.$id) : false, // Verificar se o usuário curtiu
      user ? userFavoritedPost(post.$id, user.$id) : false, // Verificar se o usuário favoritou
    ]);

    const enrichedComments = await Promise.all(comments.documents.map(async (comment) => {
      const likeCount = await getLikeCountComment(comment.$id).catch(() => 0);
      const isLiked = user?.$id
        ? await userLikedComment(user.$id, comment.$id).catch(() => false)
        : false;

      return {
        ...comment,
        likeCount,
        isLiked,
      };
    }));

    return {
      ...post,
      liked: userLikedState,
      likeCount: likes,
      commentCount: comments.total || 0,
      comments: enrichedComments,
      isFavorited: userFavoritedState,
      favoriteCount: favorites,
      shareCount: parseInt(post.shares || "0", 10),
    };
  } catch (error) {
    throw error;
  }
}

// Atualizar a função searchPosts para incluir as informações enriquecidas
export async function searchResult(query, limit = 10, user = null) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.or([
          Query.search("title", query),
          Query.search("description", query),
          Query.search("tags", query)
        ]),
        Query.limit(limit),
      ]
    );

    // Enriquecer cada post individualmente
    const enrichedPosts = await Promise.all(
      posts.documents.map(post => enrichPost(post, user))
    );

    return enrichedPosts; // Retorna os posts enriquecidos
  } catch (error) {
    throw { message: `Erro ao pesquisar postagens: ${error.message}`, code: error.code || 500 };
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
    throw { message: `Erro ao incrementar compartilhamentos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao apagar o post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao seguir usuário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao deixar de seguir usuário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
}

export async function getFollowers(userId, page = 1, limit = 10) {
  try {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    const offset = (page - 1) * limit; // Cálculo para o deslocamento (pular itens anteriores)

    // Consulta para buscar os IDs dos seguidores
    const followersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followingId", userId),
        Query.orderDesc("$createdAt"), // Ordena por data de criação
        Query.limit(limit),           // Limita o número de resultados por página
        Query.offset(offset),         // Define o deslocamento
      ]
    );

    const followersDocuments = followersResponse.documents;

    if (followersDocuments.length === 0) {
      return {
        documents: [],
        total: followersResponse.total,
        pages: Math.ceil(followersResponse.total / limit),
      };
    }

    // Extrair os IDs dos seguidores
    const followerIds = followersDocuments.map(doc => doc.followerId);

    // Buscar os detalhes dos usuários na coleção de usuários
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", followerIds)]
    );

    // Mapear os seguidores com os detalhes do usuário
    const followersWithUserDetails = followersDocuments.map(followerDoc => {
      const user = usersResponse.documents.find(
        userDoc => userDoc.$id === followerDoc.followerId
      );

      return {
        ...followerDoc,
        user, // Adiciona os detalhes do usuário correspondente
      };
    });

    return {
      documents: followersWithUserDetails,
      total: followersResponse.total,
      pages: Math.ceil(followersResponse.total / limit),
    };
  } catch (error) {
    throw { message: `Erro ao obter seguidores: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
}

export async function getFollowing(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit; // Cálculo para o deslocamento (pular itens anteriores)

    // Consulta para buscar os IDs dos usuários que o usuário está seguindo
    const followingResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.orderDesc("$createdAt"), // Ordena por data de criação
        Query.limit(limit),           // Limita o número de resultados por página
        Query.offset(offset),         // Define o deslocamento
      ]
    );

    const followingDocuments = followingResponse.documents;

    if (followingDocuments.length === 0) {
      return {
        documents: [],
        total: followingResponse.total,
        pages: Math.ceil(followingResponse.total / limit),
      };
    }

    // Extrair os IDs dos usuários seguidos
    const followingIds = followingDocuments.map(doc => doc.followingId);

    // Buscar os detalhes dos usuários seguidos na coleção de usuários
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", followingIds)]
    );

    // Mapear os usuários seguidos com os detalhes dos usuários
    const followingWithUserDetails = followingDocuments.map(followingDoc => {
      const user = usersResponse.documents.find(
        userDoc => userDoc.$id === followingDoc.followingId
      );

      return {
        ...followingDoc,
        user, // Adiciona os detalhes do usuário correspondente
      };
    });

    return {
      documents: followingWithUserDetails,
      total: followingResponse.total,
      pages: Math.ceil(followingResponse.total / limit),
    };
  } catch (error) {
    throw { message: `Erro ao obter seguindo: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao buscar usuários não seguidos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao obter comentários do post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao adicionar comentário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao excluir comentário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao verificar se o usuário curtiu o post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao alternar like no post: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao alternar favorito: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao obter contagem de favoritos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao verificar se o post é favorito: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao verificar se o usuário curtiu o comentário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao alternar like no comentário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao buscar os documentos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    return { success: true, message: "Voto registrado com sucesso!" };

  } catch (error) {
    throw { message: `Erro ao atualizar o voto: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao verificar voto do usuário: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
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
    throw { message: `Erro ao obter a contagem de votos: ${error.message}`, code: error.code || 500 }; // Melhorar o código de erro
  }
};

export async function fetchEntiresQuiz(user = null) {
  try {
    const quizzes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCollectionId,
      [Query.orderDesc('$createdAt')] // Ordena pela data de criação, caso necessário
    );

    const enrichedQuizzes = await Promise.all(
      quizzes.documents.map(async (quiz) => {
        // Garantir que as opções estejam no formato JSON correto
        const parsedOptions = quiz.options.map(option => {
          const cleanedOption = option.trim().replace(/,$/, ""); // Remove vírgulas extras
          return JSON.parse(cleanedOption); // Converte a string para JSON
        });

        // Buscar a contagem de votos para o quiz
        const votesCount = await getVotesCount(quiz.$id).catch(() => ({})); // Fallback para objeto vazio

        // Calcular o total de votos
        const totalVotes = Object.values(votesCount).reduce((acc, count) => acc + count, 0);

        // Verificar se o usuário votou
        const userHasVoted = user
          ? await checkUserVote(quiz.$id, user.$id).catch(() => null)
          : null;

        return {
          ...quiz,
          options: parsedOptions, // Substitui as opções originais pelas opções transformadas
          voteCount: votesCount,
          totalVotes,
          userVoted: userHasVoted?.voteIndex ?? null, // Index da opção votada ou null
        };
      })
    );

    return enrichedQuizzes;
  } catch (error) {
    throw {
      message: `Erro ao buscar quiz: ${error.message}`,
      code: error.code || 500,
    };
  }
}

//FIM funcoes quiz

//INICIO funcoes stories
export async function getStories(limit = 1, offset = 0) {
  try {
    // Obter todos os stories
    const allStoriesResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId
    );

    if (!allStoriesResponse.documents?.length) {
      return { stories: [], totalUsers: 0, hasMore: false };
    }

    // Agrupar stories por usuário
    const storiesByUser = allStoriesResponse.documents.reduce((acc, story) => {
      const userId = story.userId;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(story);
      return acc;
    }, {});

    // Ordenar usuários pelo story mais recente (descendente)
    const sortedUsers = Object.entries(storiesByUser)
      .map(([userId, stories]) => ({
        userId,
        latestStoryTime: Math.max(
          ...stories.map((story) => new Date(story.$createdAt).getTime())
        ),
        stories, // Stories do usuário
      }))
      .sort((a, b) => b.latestStoryTime - a.latestStoryTime); // Ordenação decrescente

    // Aplicar paginação
    const paginatedUsers = sortedUsers.slice(offset, offset + limit);

    const userStoriesMap = {};

    // Buscar informações de perfil e organizar stories por usuário
    await Promise.all(
      paginatedUsers.map(async ({ userId, stories }) => {
        const user = await getUserProfile(userId);
        userStoriesMap[userId] = {
          user,
          stories: stories.map((story) => ({
            storyUrl: story.storyUrl,
            createdAt: story.$createdAt,
          })),
        };
      })
    );

    // Formatar resposta final
    const groupedStories = paginatedUsers.map(({ userId }) => userStoriesMap[userId]);

    return {
      stories: groupedStories,
      totalUsers: Object.keys(storiesByUser).length, // Total de usuários únicos
      hasMore: offset + limit < Object.keys(storiesByUser).length, // Indicador de mais páginas
    };
  } catch (error) {
    throw { message: error.message || "Unknown error", code: error.code || 500 };
  }
}

export async function createStory(video, isWeb, idUser) {
  try {
    const uploadResult = await uploadVideoFile(video, isWeb);

    // Cria o documento do usuário no banco de dados
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId,
      ID.unique(),
      {
        storyUrl: uploadResult.videoUrl,
        userId: idUser,
        storyId: uploadResult.storyId,
      }
    );

    return true;
  } catch (error) {
    throw { message: error.message, code: error.code || 500 };  // Melhorar o código de erro
  }
}
//FIM funcoes stories