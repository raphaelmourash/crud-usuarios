# CRUD de Usuários com Loja e Carrinho

Projeto front-end simples feito com **HTML, CSS e JavaScript puro** (sem frameworks), com sistema de login, gestão de usuários (CRUD) e uma loja de produtos com carrinho de compras.

## Funcionalidades

- Login com dois perfis: **Administrador** e **Usuário padrão**
- Painel administrativo:
  - Dashboard com estatísticas
  - CRUD completo de usuários (criar, listar, editar, excluir)
  - Busca por nome, login ou e-mail
- Visão do usuário padrão:
  - Edição do próprio perfil
- Loja de produtos:
  - Listagem com busca e filtro por categoria
  - Carrinho de compras (adicionar, remover, alterar quantidade)
  - Cálculo automático do total

## Contas de demonstração

| Perfil  | Login | Senha    |
|---------|-------|----------|
| Admin   | admin | admin123 |
| Usuário | joao  | user123  |

## Estrutura do projeto

```
projeto-crud/
├── index.html   → estrutura da página
├── style.css    → estilos visuais
└── script.js    → lógica do sistema (login, CRUD, loja, carrinho)
```

## Como usar

Basta abrir o arquivo `index.html` no navegador. Não é necessário instalar nada nem ter um servidor — tudo funciona localmente, com os dados armazenados em memória (são reiniciados ao recarregar a página).

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)

## Possíveis melhorias futuras

- Persistir os dados com `localStorage`
- Conectar a um back-end real (API + banco de dados)
- Adicionar máscara de campos e validações mais robustas
