import { Alert } from 'react-native';

// https://appwrite.io/docs/advanced/platform/response-codes#authentication-errors
// Função para lidar com erros de cadastro
export const handleAppwriteUpError = (error) => { 
    const errorCode = error.code || 0;
    console.log('Signup Error:', error);
  
    const errorMessages = {
        409: {
            title: "Usuário já cadastrado",
            message: "Um usuário com este e-mail já está cadastrado. Tente fazer login ou use outro e-mail."
        },
        400: {
            title: "Dados inválidos",
            message: "Por favor, verifique se o e-mail está correto."
        },
        401: {
            title: "Sessão ativa",
            message: "Parece que você já está logado. Por favor, faça logout ou aguarde para tentar novamente."
        },
        429: {
            title: "Muitas tentativas",
            message: "Por favor, aguarde alguns minutos antes de tentar novamente."
        },
        500: {
            title: "Erro no servidor",
            message: "Desculpe, estamos com problemas técnicos. Tente novamente mais tarde."
        }
    };

    // Se tivermos um código de erro mapeado, usamos ele
    if (errorMessages[errorCode]) {
        const { title, message } = errorMessages[errorCode];
        Alert.alert(title, message);
        return;
    }
    
    // Se o erro contiver a palavra "same", "already" ou "exists" provavelmente é erro de parametros que já estão sendo utilizados em outra conta
    if (error.message?.toLowerCase().includes('same') ||
        error.message?.toLowerCase().includes('already') ||
        error.message?.toLowerCase().includes('exists') ||
        error.type === 'user_already_exists') {
            Alert.alert(
                "Usuário já cadastrado",
                "Um usuário com este e-mail já está cadastrado. Tente fazer login ou use outro e-mail."
            );
        return;
    }

    // Mensagem genérica como último recurso
    Alert.alert(
        "Erro no login", 
        "Ocorreu um erro durante o login. Por favor, tente novamente."
    );
};

// Função para lidar com erros de login
export const handleAppwriteInError = (error) => {
    console.log('Login Error:', error);
  
    const errorCode = error.code || error.response?.code || 0;
    console.log('Error code:', errorCode);

    const errorMessages = {
        400: {
            title: "Campos obrigatórios",
            message: "Por favor, preencha todos os campos obrigatórios."
        },
        401: {
            title: "Credenciais inválidas",
            message: "E-mail ou senha incorretos. Por favor, tente novamente."
        },
        403: {
            title: "Acesso negado",
            message: "Você não tem permissão para acessar esta conta."
        },
        404: {
            title: "Usuário não encontrado",
            message: "Não conseguimos encontrar um usuário com esse e-mail."
        },
        429: {
            title: "Muitas tentativas",
        message: "Você excedeu o número de tentativas de login. Tente novamente mais tarde."
        },
        500: {
            title: "Erro no servidor",
            message: "Desculpe, estamos com problemas técnicos. Tente novamente mais tarde."
        }
    };

    // Se tivermos um código de erro mapeado, usamos ele
    if (errorMessages[errorCode]) {
        const { title, message } = errorMessages[errorCode];
        Alert.alert(title, message);
        return;
    }

    // Se o erro contiver a palavra "password" ou "senha", provavelmente é erro de senha
    if (error.message?.toLowerCase().includes('password') || 
        error.message?.toLowerCase().includes('senha') ||
        error.type === 'password_invalid') {
            Alert.alert(
                "Credenciais inválidas",
                "E-mail ou senha incorretos. Por favor, tente novamente."
            );
        return;
    }

    // Se o erro contiver a palavra "email" ou mencionar formato inválido
    if (error.message?.toLowerCase().includes('email') || 
        error.message?.toLowerCase().includes('invalid format') ||
        error.type === 'email_invalid') {
            Alert.alert(
                "E-mail inválido",
                "Por favor, insira um endereço de e-mail válido."
            );
        return;
    }

    // Mensagem genérica como último recurso
    Alert.alert(
        "Erro no login", 
        "Ocorreu um erro durante o login. Por favor, tente novamente."
    );
};