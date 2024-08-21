# **Guia de Contribuição para o Projeto SolveIt**

## Como Contribuir

Primeiramente, obrigado por se interessar em contribuir com o **SolveIt**! Abaixo estão os passos e as diretrizes que seguimos para garantir que nosso fluxo de trabalho permaneça organizado e consistente.

### 1. **Fork o Repositório**
   - Faça um fork deste repositório clicando no botão "Fork" no canto superior direito da página.
   - Isso criará uma cópia do repositório no seu GitHub.

### 2. **Clone o Repositório**
   - Após fazer o fork, clone o repositório para a sua máquina:
     ```bash
     git clone https://github.com/lucasrealdev/solveit.git
     ```
   - Navegue até o diretório do projeto:
     ```bash
     cd SolveIt/SolveIt-Frontend
     ```

### 3. **Crie uma Nova Branch**
   - Crie uma nova branch para realizar suas alterações:
     ```bash
     git checkout -b minha-branch
     ```
   - Use um nome de branch descritivo que explique a mudança que você está fazendo.

### 4. **Faça as Alterações e Commit**
   - Faça as modificações desejadas no código.
   - Após realizar suas alterações, adicione os arquivos alterados:
     ```bash
     git add .
     ```
   - Faça um commit seguindo os padrões de commit semântico que usamos neste projeto. Veja a seção [Padrões de Commit](#padrões-de-commit) abaixo para mais detalhes.

### 5. **Envie para o GitHub**
   - Envie suas alterações para o repositório remoto:
     ```bash
     git push origin minha-branch
     ```

### 6. **Crie um Pull Request**
   - Acesse o repositório no GitHub e clique em "Compare & pull request".
   - Descreva claramente as mudanças feitas e envie o pull request para análise.

---

## Padrões de Commit

Para garantir a clareza e consistência dos commits no projeto **SolveIt**, seguimos o formato de commit semântico. O commit semântico possui os seguintes tipos:

### Tipo e descrição 🦄

- `feat` - Indica a inclusão de um **novo recurso**. (Relacionado ao **MINOR** do versionamento semântico)
- `fix` - Indica a **correção de um bug**. (Relacionado ao **PATCH** do versionamento semântico)
- `docs` - Indica **mudanças na documentação**, sem alterações no código.
- `test` - Indica alterações em **testes**, como criação, modificação ou exclusão de testes unitários.
- `build` - Indica modificações em **arquivos de build e dependências**.
- `perf` - Indica alterações relacionadas à **performance**.
- `style` - Indica alterações de **formatação de código**, como espaços, ponto e vírgula, etc. (Sem alterações de funcionalidade)
- `refactor` - Indica **refatorações de código** que não alteram a funcionalidade original.
- `chore` - Indica **atualizações de tarefas** de build, pacotes ou configurações. (Sem alterações no código)
- `ci` - Indica mudanças relacionadas à **integração contínua** (_continuous integration_).
- `raw` - Indica mudanças em **arquivos de configuração, dados ou parâmetros**.

---

## Código de Conduta

Ao contribuir, siga nosso [Código de Conduta](./CODE_OF_CONDUCT.md).

---

## Dúvidas?

Caso tenha dúvidas sobre o processo de contribuição, entre em contato através de issues ou por e-mail. Agradecemos suas contribuições para tornar o **SolveIt** cada vez melhor!