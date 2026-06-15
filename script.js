// ============================================================
// BANCO DE DADOS LOCAL (array em memória — como um banco simples)
// ============================================================

// "db" é um objeto que guarda todos os dados do sistema.
// Aqui usamos um objeto JS no lugar de um banco de dados real.
let db = {

  // "usuarios" é um array de objetos. Cada objeto representa um usuário do sistema.
  usuarios: [
    // Cada usuário tem: id, nome, login, email, senha, perfil (admin/user), status (ativo/inativo) e data de criação
    { id: 1, nome: "Administrador", login: "admin", email: "admin@sistema.com", senha: "admin123", perfil: "admin", status: "ativo", criado: "2024-01-15" },
    { id: 2, nome: "João da Silva",  login: "joao",  email: "joao@email.com",   senha: "user123",  perfil: "user",  status: "ativo", criado: "2024-02-10" },
    { id: 3, nome: "Maria Souza",    login: "maria", email: "maria@email.com",  senha: "user123",  perfil: "user",  status: "ativo", criado: "2024-03-05" },
    { id: 4, nome: "Carlos Lima",    login: "carlos",email: "carlos@email.com", senha: "user123",  perfil: "user",  status: "inativo", criado: "2024-04-01" },
  ],

  // "proximoId" guarda qual será o próximo ID disponível para um novo usuário.
  // Começa em 5 porque já existem 4 usuários (ids 1 a 4).
  proximoId: 5,

  // "produtos" é um array de objetos. Cada objeto representa um produto da loja.
  produtos: [
    // Cada produto tem: id, nome, categoria, preco, icone (emoji), cor (usada no CSS) e descrição
    { id: 1, nome: "Fone Bluetooth",     categoria: "Eletrônicos", preco: 129.90, icone: "🎧", cor: "blue",   desc: "Fone sem fio com cancelamento de ruído" },
    { id: 2, nome: "Mouse Gamer",        categoria: "Eletrônicos", preco: 89.90,  icone: "🖱️", cor: "purple", desc: "Mouse com RGB e 6 botões programáveis" },
    { id: 3, nome: "Teclado Mecânico",   categoria: "Eletrônicos", preco: 219.90, icone: "⌨️", cor: "purple", desc: "Switch azul, retroiluminado" },
    { id: 4, nome: "Camiseta Básica",    categoria: "Roupas",      preco: 39.90,  icone: "👕", cor: "green",  desc: "100% algodão, várias cores" },
    { id: 5, nome: "Tênis Esportivo",    categoria: "Roupas",      preco: 199.90, icone: "👟", cor: "green",  desc: "Confortável para o dia a dia" },
    { id: 6, nome: "Caneca Personalizada", categoria: "Casa",      preco: 29.90,  icone: "☕", cor: "amber",  desc: "Cerâmica 300ml, ótima para café" },
    { id: 7, nome: "Luminária de Mesa",  categoria: "Casa",        preco: 79.90,  icone: "💡", cor: "amber",  desc: "LED com 3 níveis de intensidade" },
    { id: 8, nome: "Livro JavaScript",   categoria: "Livros",      preco: 59.90,  icone: "📘", cor: "coral",  desc: "Guia completo para iniciantes" },
    { id: 9, nome: "Garrafa Térmica",    categoria: "Casa",        preco: 49.90,  icone: "🧴", cor: "amber",  desc: "Mantém a temperatura por 12h" },
  ]
};

// ============================================================
// VARIÁVEIS DE ESTADO GLOBAIS
// (guardam o "estado atual" da aplicação, fora do banco de dados)
// ============================================================

// "carrinho" é o array do carrinho de compras.
// Cada item do array é um objeto no formato { produtoId, quantidade }
let carrinho = [];

// Guarda o objeto do usuário que está logado no momento. Começa como "null" (ninguém logado).
let usuarioLogado = null;

// Guarda o ID do usuário que está marcado para ser excluído (usado no modal de confirmação).
let idParaDeletar  = null;

// Guarda qual página está sendo exibida no momento (ex: "usuarios", "dashboard", "loja"...).
let paginaAtual    = "usuarios";

// Guarda o texto digitado pelo usuário nas caixas de busca (usuários ou produtos).
let termoBusca     = "";

// Guarda qual categoria de produto está selecionada como filtro na loja. "Todos" = sem filtro.
let filtroCategoria = "Todos";

// ============================================================
// AUTENTICAÇÃO
// ============================================================

// Função executada quando o usuário clica no botão de "Entrar" (login).
function fazerLogin() {
  // Pega o valor digitado no campo de login, removendo espaços extras no início/fim (.trim())
  const loginVal = document.getElementById("login-user").value.trim();

  // Pega o valor digitado no campo de senha (sem remover espaços, pois senha pode ter espaço)
  const senhaVal = document.getElementById("login-pass").value;

  // Pega o elemento HTML que mostra a mensagem de erro de login
  const erro     = document.getElementById("login-error");

  // Procura no array "db.usuarios" um usuário cujo login e senha sejam iguais aos digitados,
  // e que também esteja com status "ativo". Se encontrar, retorna o objeto do usuário; senão, retorna "undefined".
  const encontrado = db.usuarios.find(u => u.login === loginVal && u.senha === senhaVal && u.status === "ativo");

  // Se NÃO encontrou nenhum usuário válido...
  if (!encontrado) {
    // ...mostra a mensagem de erro na tela
    erro.style.display = "block";
    // ...e interrompe a função aqui (não continua o login)
    return;
  }

  // Se chegou até aqui, o login foi correto: esconde a mensagem de erro
  erro.style.display = "none";

  // Guarda o usuário encontrado como o "usuário logado" atual
  usuarioLogado = encontrado;

  // Esconde a tela de login
  document.getElementById("login-screen").style.display = "none";

  // Mostra a tela principal da aplicação
  document.getElementById("app-screen").style.display = "block";

  // Atualiza o menu lateral (sidebar) com as informações do usuário logado
  renderizarSidebar();

  // Navega para a página inicial:
  // Se o perfil for "admin", vai para o "dashboard"; caso contrário, vai para "meu-perfil"
  navegarPara(encontrado.perfil === "admin" ? "dashboard" : "meu-perfil");
}

// Função executada quando o usuário clica em "Sair" (logout).
function fazerLogout() {
  // Remove o usuário da sessão (volta para "ninguém logado")
  usuarioLogado = null;

  // Mostra novamente a tela de login (com display "flex" para manter o layout correto)
  document.getElementById("login-screen").style.display = "flex";

  // Esconde a tela principal da aplicação
  document.getElementById("app-screen").style.display = "none";

  // Limpa o campo de login (deixa vazio para o próximo usuário digitar)
  document.getElementById("login-user").value = "";

  // Limpa o campo de senha
  document.getElementById("login-pass").value = "";
}

// Permite login com Enter
// Adiciona um "ouvinte de evento" (event listener) no documento inteiro.
// Esse código roda toda vez que QUALQUER tecla é pressionada na página.
document.addEventListener("keydown", (e) => {
  // "e.key" é a tecla que foi pressionada. Verifica se foi "Enter"
  // E também verifica se a tela de login ainda está visível (display !== "none")
  if (e.key === "Enter" && document.getElementById("login-screen").style.display !== "none") {
    // Se as duas condições forem verdadeiras, chama a função de login
    fazerLogin();
  }
});

// ============================================================
// SIDEBAR
// ============================================================

// Função responsável por montar/atualizar o menu lateral (sidebar) de acordo com o usuário logado.
function renderizarSidebar() {
  // Verifica se o usuário logado é admin (true ou false)
  const isAdmin = usuarioLogado.perfil === "admin";

  // Cria as "iniciais" do nome do usuário, para exibir no avatar.
  // 1. Separa o nome em palavras (split " ")
  // 2. Pega só as duas primeiras palavras (slice(0,2))
  // 3. De cada palavra, pega a primeira letra (n => n[0])
  // 4. Junta as letras em uma única string (join "")
  const iniciais = usuarioLogado.nome.split(" ").slice(0,2).map(n => n[0]).join("");

  // Coloca o nome do usuário logado no elemento HTML com id "sidebar-name"
  document.getElementById("sidebar-name").textContent = usuarioLogado.nome;

  // Define o texto do cargo: "Administrador" se for admin, senão "Usuário"
  document.getElementById("sidebar-role").textContent = isAdmin ? "Administrador" : "Usuário";

  // Pega o elemento do avatar (o círculo com as iniciais)
  const avatar = document.getElementById("sidebar-avatar");

  // Coloca as iniciais como texto dentro do avatar
  avatar.textContent = iniciais;

  // Define a classe CSS do avatar: muda a cor dependendo se é admin ou usuário comum
  avatar.className   = `avatar ${isAdmin ? "avatar-admin" : "avatar-user"}`;

  // Pega o elemento HTML que vai receber os itens do menu de navegação
  const nav = document.getElementById("sidebar-nav");

  // Se o usuário logado for ADMIN...
  if (isAdmin) {
    // ...monta um menu completo (Dashboard, Usuários, Loja, Meu Perfil)
    // "innerHTML" substitui todo o conteúdo HTML interno do elemento "nav"
    // As crases (`) criam uma "template string", que permite quebrar linha e usar ${...} para inserir valores
    nav.innerHTML = `
      <div class="nav-section-title">Principal</div>
      <div class="nav-item" id="nav-dashboard" onclick="navegarPara('dashboard')">
        ${svgHome()} <span>Dashboard</span>
      </div>
      <div class="nav-item" id="nav-usuarios" onclick="navegarPara('usuarios')">
        ${svgUsers()} <span>Usuários</span>
      </div>
      <div class="nav-item" id="nav-loja" onclick="navegarPara('loja')">
        ${svgShop()} <span>Loja</span>
      </div>
      <div class="nav-section-title" style="margin-top:8px">Conta</div>
      <div class="nav-item" id="nav-meu-perfil" onclick="navegarPara('meu-perfil')">
        ${svgUser()} <span>Meu Perfil</span>
      </div>
    `;
  } else {
    // Se NÃO for admin, monta um menu reduzido (apenas Loja e Meu Perfil)
    nav.innerHTML = `
      <div class="nav-section-title">Principal</div>
      <div class="nav-item" id="nav-loja" onclick="navegarPara('loja')">
        ${svgShop()} <span>Loja</span>
      </div>
      <div class="nav-section-title" style="margin-top:8px">Conta</div>
      <div class="nav-item" id="nav-meu-perfil" onclick="navegarPara('meu-perfil')">
        ${svgUser()} <span>Meu Perfil</span>
      </div>
    `;
  }
}

// As funções abaixo apenas retornam um pedaço de código SVG (desenho vetorial) como texto (string).
// Cada uma representa um ícone usado no menu.

// Ícone de "Casa" (Dashboard)
function svgHome() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
}
// Ícone de "Pessoas" (Usuários)
function svgUsers() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}
// Ícone de "Pessoa" (Meu Perfil)
function svgUser() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}
// Ícone de "Loja"
function svgShop() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l1-5h16l1 5"/><path d="M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9"/><path d="M9 21V13h6v8"/></svg>`;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

// Função responsável por trocar de página dentro da aplicação (sem recarregar o navegador).
function navegarPara(pagina) {
  // Atualiza a variável global que guarda a página atual
  paginaAtual = pagina;

  // Sempre que troca de página, limpa o termo de busca digitado anteriormente
  termoBusca = "";

  // E também reseta o filtro de categoria para "Todos"
  filtroCategoria = "Todos";

  // Pega TODOS os elementos com a classe "nav-item" (itens do menu) e remove a classe "active" de cada um.
  // Isso "desmarca" visualmente o item que estava selecionado antes.
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

  // Procura o item do menu correspondente à página atual (ex: "nav-dashboard", "nav-loja"...)
  const navEl = document.getElementById("nav-" + pagina);

  // Se esse item existir na tela, adiciona a classe "active" para destacá-lo visualmente
  if (navEl) navEl.classList.add("active");

  // Dependendo do nome da página, chama a função de renderização correspondente
  if (pagina === "dashboard")   renderDashboard();
  else if (pagina === "usuarios") renderUsuarios();
  else if (pagina === "meu-perfil") renderMeuPerfil();
  else if (pagina === "loja") renderLoja();

  // Mostra o botão do carrinho só na página da loja
  // Pega o elemento do botão flutuante do carrinho (FAB = Floating Action Button)
  const fab = document.getElementById("cart-fab");

  // Se a página atual for "loja", adiciona a classe "visible" (mostra o botão)
  if (pagina === "loja") fab.classList.add("visible");
  // Caso contrário, remove a classe "visible" (esconde o botão)
  else fab.classList.remove("visible");
}

// ============================================================
// PÁGINA: DASHBOARD (somente admin)
// ============================================================

// Função que monta a tela do Dashboard, com estatísticas gerais do sistema.
function renderDashboard() {
  // Conta quantos usuários existem no total (tamanho do array)
  const total     = db.usuarios.length;

  // Filtra os usuários com status "ativo" e conta quantos são
  const ativos    = db.usuarios.filter(u => u.status === "ativo").length;

  // Filtra os usuários com perfil "admin" e conta quantos são
  const admins    = db.usuarios.filter(u => u.perfil === "admin").length;

  // Filtra os usuários com status "inativo" e conta quantos são
  const inativos  = db.usuarios.filter(u => u.status === "inativo").length;

  // Substitui todo o conteúdo da área principal ("page-content") pelo HTML do dashboard
  document.getElementById("page-content").innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-subtitle">Visão geral do sistema</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total de Usuários</div>
        <div class="stat-value" style="color:var(--blue)">${total}</div>
        <div class="stat-desc">cadastrados</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Usuários Ativos</div>
        <div class="stat-value" style="color:var(--green)">${ativos}</div>
        <div class="stat-desc">com acesso liberado</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Administradores</div>
        <div class="stat-value" style="color:var(--purple)">${admins}</div>
        <div class="stat-desc">com perfil admin</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Inativos</div>
        <div class="stat-value" style="color:var(--red)">${inativos}</div>
        <div class="stat-desc">sem acesso</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar" style="justify-content:space-between">
        <div style="font-size:14px;font-weight:600">Últimos usuários cadastrados</div>
        <button class="btn btn-primary" onclick="navegarPara('usuarios')">
          Ver todos
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
      <table>
        <thead><tr>
          <th>Nome</th><th>Login</th><th>E-mail</th><th>Perfil</th><th>Status</th>
        </tr></thead>
        <tbody>
          ${db.usuarios.slice(-4).reverse().map(u => `
            <tr>
              <td><strong>${u.nome}</strong></td>
              <td><code style="font-size:12px;background:var(--bg);padding:2px 6px;border-radius:4px">${u.login}</code></td>
              <td style="color:var(--text-muted)">${u.email}</td>
              <td>${badgePerfil(u.perfil)}</td>
              <td>${badgeStatus(u.status)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  // Explicação do trecho acima:
  // - "db.usuarios.slice(-4)" pega os 4 últimos usuários cadastrados no array (os mais recentes)
  // - ".reverse()" inverte a ordem, para mostrar o mais recente primeiro
  // - ".map(u => `...`)" transforma cada usuário em uma linha de tabela (<tr>...</tr>)
  // - ".join("")" junta todas as linhas em uma única string, sem separador
}

// ============================================================
// PÁGINA: GERENCIAR USUÁRIOS (somente admin)
// ============================================================

// Função que monta a tela de listagem/gerenciamento de usuários.
function renderUsuarios() {
  // Filtra a lista de usuários de acordo com o texto digitado na busca ("termoBusca").
  // Um usuário aparece na lista se o nome, login OU email contiverem o termo buscado
  // (".toLowerCase()" converte tudo para minúsculo, para a busca não diferenciar maiúsculas/minúsculas)
  const filtrados = db.usuarios.filter(u =>
    u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    u.login.toLowerCase().includes(termoBusca.toLowerCase()) ||
    u.email.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // Monta todo o HTML da página de usuários e insere dentro de "page-content"
  document.getElementById("page-content").innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Usuários</div>
        <div class="page-subtitle">${db.usuarios.length} usuários cadastrados</div>
      </div>
      <button class="btn btn-primary" onclick="abrirModalNovo()">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo Usuário
      </button>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg width="14" height="14" fill="none" stroke="var(--text-muted)" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar por nome, login ou e-mail..."
            value="${termoBusca}"
            oninput="termoBusca=this.value; renderUsuarios()" />
        </div>
        <span class="chip">${filtrados.length} resultado(s)</span>
      </div>

      ${filtrados.length === 0 ? `
        <div class="empty-state">
          <svg width="40" height="40" fill="none" stroke="var(--text-muted)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>Nenhum usuário encontrado para "<strong>${termoBusca}</strong>"</p>
        </div>
      ` : `
        <table>
          <thead><tr>
            <th>Nome</th><th>Login</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Criado em</th><th>Ações</th>
          </tr></thead>
          <tbody>
            ${filtrados.map(u => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="avatar ${u.perfil === 'admin' ? 'avatar-admin' : 'avatar-user'}" style="width:28px;height:28px;font-size:10px">
                      ${u.nome.split(" ").slice(0,2).map(n=>n[0]).join("")}
                    </div>
                    <strong>${u.nome}</strong>
                  </div>
                </td>
                <td><code style="font-size:12px;background:var(--bg);padding:2px 6px;border-radius:4px">${u.login}</code></td>
                <td style="color:var(--text-muted)">${u.email}</td>
                <td>${badgePerfil(u.perfil)}</td>
                <td>${badgeStatus(u.status)}</td>
                <td style="color:var(--text-muted)">${formatarData(u.criado)}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-icon edit" onclick="abrirModalEditar(${u.id})" title="Editar">
                      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    ${u.id !== usuarioLogado.id ? `
                    <button class="btn-icon delete" onclick="abrirDelete(${u.id})" title="Excluir">
                      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>` : `<button class="btn-icon" title="Você mesmo" style="opacity:.3;cursor:default">
                      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </button>`}
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}
    </div>
  `;
  // Pontos importantes deste bloco:
  // - Usa um operador ternário (condição ? valorSeTrue : valorSeFalse) para decidir
  //   entre mostrar "nenhum resultado encontrado" OU a tabela com os usuários filtrados.
  // - O botão de excluir só aparece se o usuário da linha NÃO for o usuário logado
  //   (impede que a pessoa exclua a própria conta).
}

// ============================================================
// PÁGINA: MEU PERFIL (todos os usuários)
// ============================================================

// Função que monta a tela "Meu Perfil", mostrando os dados do usuário logado.
function renderMeuPerfil() {
  // Cria uma referência mais curta para o usuário logado
  const u = usuarioLogado;

  // Gera as iniciais do nome (mesma lógica usada na sidebar)
  const iniciais = u.nome.split(" ").slice(0,2).map(n=>n[0]).join("");

  // Monta o HTML da página de perfil
  document.getElementById("page-content").innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Meu Perfil</div>
        <div class="page-subtitle">Suas informações pessoais</div>
      </div>
      <button class="btn btn-primary" onclick="abrirModalEditarPerfil()">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Editar
      </button>
    </div>

    <div class="profile-card">
      <div class="profile-head">
        <div class="avatar-lg ${u.perfil === 'admin' ? 'avatar-admin' : 'avatar-user'}">${iniciais}</div>
        <div>
          <div class="profile-name">${u.nome}</div>
          <div class="profile-email">${u.email}</div>
          <div style="margin-top:6px">${badgePerfil(u.perfil)} &nbsp; ${badgeStatus(u.status)}</div>
        </div>
      </div>

      <div class="info-row">
        <span class="info-label">Nome completo</span>
        <span class="info-value">${u.nome}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Login</span>
        <span class="info-value"><code style="font-size:12px;background:var(--bg);padding:2px 8px;border-radius:4px">${u.login}</code></span>
      </div>
      <div class="info-row">
        <span class="info-label">E-mail</span>
        <span class="info-value">${u.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Perfil</span>
        <span class="info-value">${u.perfil === "admin" ? "Administrador" : "Usuário padrão"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cadastrado em</span>
        <span class="info-value">${formatarData(u.criado)}</span>
      </div>
    </div>
  `;
}

// ============================================================
// MODAL: CRIAR USUÁRIO
// ============================================================

// Função chamada ao clicar em "Novo Usuário". Prepara o modal (janela popup) para CADASTRO.
function abrirModalNovo() {
  // Define o título do modal como "Novo Usuário"
  document.getElementById("modal-titulo").textContent = "Novo Usuário";

  // Limpa todos os campos do formulário, pois é um cadastro novo (sem dados pré-existentes)
  document.getElementById("edit-id").value = "";       // campo escondido que guarda o ID (vazio = criar novo)
  document.getElementById("edit-nome").value = "";
  document.getElementById("edit-login").value = "";
  document.getElementById("edit-email").value = "";
  document.getElementById("edit-senha").value = "";

  // Define valores padrão para perfil e status
  document.getElementById("edit-perfil").value = "user";
  document.getElementById("edit-status").value = "ativo";

  // Esconde qualquer mensagem de erro que possa ter ficado visível de uma tentativa anterior
  document.getElementById("modal-error").style.display = "none";

  // Adiciona a classe "open" ao modal, o que (via CSS) faz ele aparecer na tela
  document.getElementById("modal-usuario").classList.add("open");
}

// ============================================================
// MODAL: EDITAR USUÁRIO (admin vê todos, user vê só o próprio)
// ============================================================

// Função chamada ao clicar no botão de "Editar" de um usuário específico (identificado pelo "id").
function abrirModalEditar(id) {
  // Procura no array de usuários aquele cujo "id" seja igual ao recebido por parâmetro
  const u = db.usuarios.find(u => u.id === id);

  // Se não encontrar o usuário (por algum motivo inesperado), interrompe a função
  if (!u) return;

  // Define o título do modal como "Editar Usuário"
  document.getElementById("modal-titulo").textContent = "Editar Usuário";

  // Preenche os campos do formulário com os dados atuais do usuário encontrado
  document.getElementById("edit-id").value = u.id;
  document.getElementById("edit-nome").value = u.nome;
  document.getElementById("edit-login").value = u.login;
  document.getElementById("edit-email").value = u.email;

  // O campo de senha fica vazio por segurança (não mostramos a senha atual)
  document.getElementById("edit-senha").value = "";

  document.getElementById("edit-perfil").value = u.perfil;
  document.getElementById("edit-status").value = u.status;

  // Esconde mensagens de erro anteriores
  document.getElementById("modal-error").style.display = "none";

  // Usuário comum não altera perfil nem status
  // Verifica se quem está editando é admin
  const isAdmin = usuarioLogado.perfil === "admin";

  // Se NÃO for admin, desabilita (".disabled = true") os campos de perfil e status,
  // impedindo que um usuário comum altere essas informações sobre si mesmo
  document.getElementById("edit-perfil").disabled = !isAdmin;
  document.getElementById("edit-status").disabled = !isAdmin;

  // Exibe o modal
  document.getElementById("modal-usuario").classList.add("open");
}

// Função chamada quando o próprio usuário clica em "Editar" na página "Meu Perfil".
// Ela simplesmente reaproveita a função "abrirModalEditar", passando o ID do usuário logado.
function abrirModalEditarPerfil() {
  abrirModalEditar(usuarioLogado.id);
}

// Função que fecha o modal de criar/editar usuário, removendo a classe "open"
function fecharModal() {
  document.getElementById("modal-usuario").classList.remove("open");
}

// ============================================================
// SALVAR USUÁRIO (criar ou editar)
// ============================================================

// Função chamada ao clicar em "Salvar" dentro do modal de usuário.
// Ela serve tanto para CRIAR um novo usuário quanto para ATUALIZAR um já existente.
function salvarUsuario() {
  // Lê os valores atuais de cada campo do formulário
  const id     = document.getElementById("edit-id").value;     // se vazio = criação; se tiver valor = edição
  const nome   = document.getElementById("edit-nome").value.trim();
  const login  = document.getElementById("edit-login").value.trim();
  const email  = document.getElementById("edit-email").value.trim();
  const senha  = document.getElementById("edit-senha").value;
  const perfil = document.getElementById("edit-perfil").value;
  const status = document.getElementById("edit-status").value;

  // Elemento onde mensagens de erro de validação serão exibidas
  const errDiv = document.getElementById("modal-error");

  // Validações simples
  // Verifica se nome, login ou email estão vazios
  if (!nome || !login || !email) {
    errDiv.textContent = "Nome, login e e-mail são obrigatórios.";
    errDiv.style.display = "block";
    return; // interrompe a função, não salva nada
  }

  // Verifica se o e-mail contém o caractere "@" (validação bem simples, apenas didática)
  if (!email.includes("@")) {
    errDiv.textContent = "Informe um e-mail válido.";
    errDiv.style.display = "block";
    return;
  }

  // Verifica login duplicado
  // Procura se já existe outro usuário (com ID diferente do que está sendo editado) usando o mesmo login
  // "u.id != id" usa "!=" (sem o segundo "=") porque "id" vem como string do input, e "u.id" é número;
  // o "!=" faz a comparação convertendo os tipos automaticamente.
  const loginExiste = db.usuarios.find(u => u.login === login && u.id != id);
  if (loginExiste) {
    errDiv.textContent = "Este login já está em uso por outro usuário.";
    errDiv.style.display = "block";
    return;
  }

  // Se passou por todas as validações, esconde qualquer mensagem de erro
  errDiv.style.display = "none";

  // Se "id" tem algum valor (não está vazio), significa que estamos EDITANDO um usuário existente
  if (id) {
    // ATUALIZAR
    // Encontra a posição (índice) do usuário dentro do array "db.usuarios"
    const idx = db.usuarios.findIndex(u => u.id == id);

    // Atualiza cada campo do usuário encontrado com os novos valores digitados
    db.usuarios[idx].nome   = nome;
    db.usuarios[idx].login  = login;
    db.usuarios[idx].email  = email;
    db.usuarios[idx].perfil = perfil;
    db.usuarios[idx].status = status;

    // A senha só é atualizada se o campo não estiver vazio
    // (assim, deixar em branco mantém a senha antiga)
    if (senha) db.usuarios[idx].senha = senha;

    // Atualiza sessão se for o próprio usuário
    // Se o usuário editado for o mesmo que está logado, atualiza também a variável "usuarioLogado"
    // e redesenha a sidebar (para refletir nome/avatar atualizados, por exemplo)
    if (db.usuarios[idx].id === usuarioLogado.id) {
      usuarioLogado = db.usuarios[idx];
      renderizarSidebar();
    }

    // Mostra uma notificação (toast) de sucesso
    mostrarToast("✓", "Usuário atualizado com sucesso!");
  } else {
    // CRIAR
    // Se o campo "id" estava vazio, significa que é um cadastro novo.
    // Nesse caso, a senha é obrigatória.
    if (!senha) {
      errDiv.textContent = "A senha é obrigatória para novo usuário.";
      errDiv.style.display = "block";
      return;
    }

    // Cria um novo objeto de usuário com os dados informados
    const novo = {
      id: db.proximoId++,  // usa o próximo ID disponível e, em seguida, incrementa o contador (++)
      nome, login, email, senha, perfil, status, // forma resumida de escrever nome: nome, login: login, etc.
      criado: new Date().toISOString().split("T")[0] // data atual no formato "AAAA-MM-DD"
    };

    // Adiciona o novo usuário ao array de usuários
    db.usuarios.push(novo);

    // Mostra notificação de sucesso
    mostrarToast("✓", "Usuário criado com sucesso!");
  }

  // Fecha o modal após salvar (seja criação ou edição)
  fecharModal();

  // Atualiza a tela atual para refletir as mudanças, dependendo de qual página está aberta
  if (paginaAtual === "usuarios") renderUsuarios();
  else if (paginaAtual === "dashboard") renderDashboard();
  else if (paginaAtual === "meu-perfil") renderMeuPerfil();
}

// ============================================================
// DELETAR USUÁRIO
// ============================================================

// Função chamada ao clicar no botão de "Excluir" de um usuário.
function abrirDelete(id) {
  // Procura o usuário pelo id recebido
  const u = db.usuarios.find(u => u.id === id);

  // Se não encontrar, não faz nada
  if (!u) return;

  // Guarda o ID do usuário que será excluído (será usado depois, na confirmação)
  idParaDeletar = id;

  // Mostra o nome do usuário dentro da mensagem de confirmação do modal
  document.getElementById("delete-nome").textContent = u.nome;

  // Exibe o modal de confirmação de exclusão
  document.getElementById("modal-delete").classList.add("open");
}

// Função que fecha o modal de confirmação de exclusão SEM excluir nada.
function fecharDelete() {
  // Limpa o ID guardado, pois a exclusão foi cancelada
  idParaDeletar = null;

  // Esconde o modal
  document.getElementById("modal-delete").classList.remove("open");
}

// Função chamada ao confirmar a exclusão (botão "Sim, excluir", por exemplo).
function confirmarDelete() {
  // Cria um novo array "db.usuarios" contendo todos os usuários, EXCETO aquele cujo id é igual a "idParaDeletar"
  db.usuarios = db.usuarios.filter(u => u.id !== idParaDeletar);

  // Fecha o modal de confirmação
  fecharDelete();

  // Mostra notificação informando que o usuário foi excluído
  mostrarToast("🗑", "Usuário excluído.");

  // Atualiza a tela: se estiver na página de usuários ou no dashboard, redesenha a tabela/estatísticas
  if (paginaAtual === "usuarios") renderUsuarios();
  else if (paginaAtual === "dashboard") renderDashboard();
}

// ============================================================
// PÁGINA: LOJA DE PRODUTOS (todos os usuários)
// ============================================================

// Função que monta a tela da Loja, com os produtos disponíveis.
function renderLoja() {
  // Cria a lista de categorias disponíveis para o filtro:
  // - "db.produtos.map(p => p.categoria)" pega a categoria de cada produto, gerando um array com repetições
  // - "new Set(...)" remove as repetições, deixando só categorias únicas
  // - "[...new Set(...)]" transforma o Set de volta em array
  // - Adiciona "Todos" no início do array, para representar "sem filtro"
  const categorias = ["Todos", ...new Set(db.produtos.map(p => p.categoria))];

  // Filtra os produtos de acordo com a categoria selecionada e o termo de busca digitado
  const filtrados = db.produtos.filter(p => {
    // "passaCategoria" é true se o filtro for "Todos" OU se a categoria do produto for igual ao filtro selecionado
    const passaCategoria = filtroCategoria === "Todos" || p.categoria === filtroCategoria;

    // "passaBusca" é true se o nome do produto (em minúsculas) contiver o termo buscado (em minúsculas)
    const passaBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase());

    // O produto só aparece na lista se passar nos dois critérios
    return passaCategoria && passaBusca;
  });

  // Monta o HTML da página da loja
  document.getElementById("page-content").innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Loja</div>
        <div class="page-subtitle">${db.produtos.length} produtos disponíveis</div>
      </div>
    </div>

    <div class="table-card" style="margin-bottom:16px">
      <div class="table-toolbar" style="flex-direction:column;align-items:stretch;gap:12px">
        <div class="search-box">
          <svg width="14" height="14" fill="none" stroke="var(--text-muted)" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar produto..."
            value="${termoBusca}"
            oninput="termoBusca=this.value; renderLoja()" />
        </div>
        <div class="filter-pills">
          ${categorias.map(c => `
            <div class="filter-pill ${filtroCategoria === c ? 'active' : ''}" onclick="filtroCategoria='${c}'; renderLoja()">${c}</div>
          `).join("")}
        </div>
      </div>
    </div>

    ${filtrados.length === 0 ? `
      <div class="table-card">
        <div class="empty-state">
          <svg width="40" height="40" fill="none" stroke="var(--text-muted)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>Nenhum produto encontrado.</p>
        </div>
      </div>
    ` : `
      <div class="produtos-grid">
        ${filtrados.map(p => `
          <div class="produto-card">
            <div class="produto-img" style="background:var(--${p.cor}-bg, var(--bg))">${p.icone}</div>
            <div class="produto-body">
              <div class="produto-categoria">${p.categoria}</div>
              <div class="produto-nome">${p.nome}</div>
              <div class="produto-desc">${p.desc}</div>
              <div class="produto-footer">
                <span class="produto-preco">${formatarPreco(p.preco)}</span>
                <button class="btn-add-cart" onclick="adicionarAoCarrinho(${p.id})" title="Adicionar ao carrinho">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}
  `;
  // Resumo deste bloco:
  // - Monta os botões de filtro de categoria dinamicamente, marcando como "active" o filtro selecionado.
  // - Se não houver produtos após o filtro, mostra uma mensagem de "Nenhum produto encontrado".
  // - Caso contrário, gera um "card" visual para cada produto filtrado, com botão para adicionar ao carrinho.
}

// ============================================================
// CARRINHO DE COMPRAS
// ============================================================

// Função chamada ao clicar no botão "Adicionar ao carrinho" de um produto.
function adicionarAoCarrinho(produtoId) {
  // Verifica se esse produto já está no carrinho (procura um item com o mesmo produtoId)
  const item = carrinho.find(i => i.produtoId === produtoId);

  // Se já existir no carrinho...
  if (item) {
    // ...apenas aumenta a quantidade em 1
    item.quantidade++;
  } else {
    // Se ainda não existir, adiciona um novo item ao array do carrinho, com quantidade 1
    carrinho.push({ produtoId, quantidade: 1 });
  }

  // Atualiza o número exibido no ícone do carrinho (badge)
  atualizarBadgeCarrinho();

  // Busca os dados completos do produto (para mostrar o nome na notificação)
  const produto = db.produtos.find(p => p.id === produtoId);

  // Mostra uma notificação (toast) informando que o produto foi adicionado
  mostrarToast("🛒", `${produto.nome} adicionado ao carrinho`);
}

// Função chamada ao clicar nos botões "+" ou "-" de quantidade dentro do carrinho.
// "delta" é a variação: +1 para aumentar, -1 para diminuir.
function alterarQuantidade(produtoId, delta) {
  // Procura o item correspondente no carrinho
  const item = carrinho.find(i => i.produtoId === produtoId);

  // Se não encontrar (não deveria acontecer), interrompe a função
  if (!item) return;

  // Soma o "delta" à quantidade atual (pode ser +1 ou -1)
  item.quantidade += delta;

  // Se a quantidade ficar zero ou negativa, remove o item do carrinho por completo
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.produtoId !== produtoId);
  }

  // Atualiza o badge (contador) do carrinho
  atualizarBadgeCarrinho();

  // Redesenha a lista de itens do carrinho na tela
  renderCarrinho();
}

// Função chamada ao clicar no botão de "remover" (lixeira) de um item do carrinho.
function removerDoCarrinho(produtoId) {
  // Cria um novo array do carrinho sem o item cujo produtoId corresponde ao informado
  carrinho = carrinho.filter(i => i.produtoId !== produtoId);

  // Atualiza o contador do carrinho
  atualizarBadgeCarrinho();

  // Redesenha a lista do carrinho
  renderCarrinho();
}

// Função que calcula o valor total do carrinho, somando (preço x quantidade) de cada item.
function calcularTotalCarrinho() {
  // "reduce" percorre o array "carrinho" e acumula um valor (começando em 0)
  return carrinho.reduce((total, item) => {
    // Para cada item do carrinho, busca o produto correspondente no array "db.produtos"
    const produto = db.produtos.find(p => p.id === item.produtoId);

    // Se o produto existir, soma (preço * quantidade) ao total; senão, soma 0
    return total + (produto ? produto.preco * item.quantidade : 0);
  }, 0); // "0" é o valor inicial do total
}

// Função que calcula a quantidade TOTAL de itens no carrinho (somando as quantidades de cada produto).
function totalItensCarrinho() {
  // Soma a propriedade "quantidade" de todos os itens do carrinho
  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

// Função que atualiza o pequeno número (badge) exibido sobre o ícone do carrinho.
function atualizarBadgeCarrinho() {
  // Pega o elemento HTML do badge
  const badge = document.getElementById("cart-badge");

  // Calcula a quantidade total de itens no carrinho
  const total = totalItensCarrinho();

  // Se houver pelo menos 1 item...
  if (total > 0) {
    // ...mostra o número total no badge
    badge.textContent = total;
    // ...e torna o badge visível (display "flex" para centralizar o número)
    badge.style.display = "flex";
  } else {
    // Se o carrinho estiver vazio, esconde o badge
    badge.style.display = "none";
  }
}

// Função chamada ao clicar no ícone do carrinho, para abrir a janela lateral do carrinho.
function abrirCarrinho() {
  // Antes de abrir, redesenha o conteúdo do carrinho (para garantir que está atualizado)
  renderCarrinho();

  // Adiciona a classe "open" ao elemento do carrinho, o que (via CSS) faz ele aparecer/deslizar na tela
  document.getElementById("cart-overlay").classList.add("open");
}

// Função que fecha a janela lateral do carrinho.
function fecharCarrinho() {
  document.getElementById("cart-overlay").classList.remove("open");
}

// Função responsável por desenhar a lista de produtos dentro do carrinho.
function renderCarrinho() {
  // Pega o elemento que vai receber os itens do carrinho
  const container = document.getElementById("cart-items");

  // Se o carrinho estiver vazio...
  if (carrinho.length === 0) {
    // ...mostra uma mensagem de "carrinho vazio" com um ícone
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" fill="none" stroke="var(--text-muted)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Seu carrinho está vazio.</p>
      </div>
    `;
  } else {
    // Caso contrário, monta um bloco HTML para cada item do carrinho
    container.innerHTML = carrinho.map(item => {
      // Busca os dados completos do produto correspondente a este item do carrinho
      const p = db.produtos.find(p => p.id === item.produtoId);

      // Se por algum motivo o produto não existir mais, não desenha nada para esse item
      if (!p) return "";

      // Retorna o HTML do item do carrinho, já preenchido com os dados do produto
      return `
        <div class="cart-item">
          <div class="cart-item-icon" style="background:var(--${p.cor}-bg, var(--bg))">${p.icone}</div>
          <div class="cart-item-info">
            <div class="cart-item-nome">${p.nome}</div>
            <div class="cart-item-preco">${formatarPreco(p.preco)} cada</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn" onclick="alterarQuantidade(${p.id}, -1)">−</button>
            <span class="qty-value">${item.quantidade}</span>
            <button class="qty-btn" onclick="alterarQuantidade(${p.id}, 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removerDoCarrinho(${p.id})" title="Remover">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
    }).join(""); // junta todos os blocos HTML gerados em uma única string
  }

  // Atualiza o valor total exibido no rodapé do carrinho, formatado como moeda (R$)
  document.getElementById("cart-total").textContent = formatarPreco(calcularTotalCarrinho());
}

// Função chamada ao clicar no botão "Finalizar Compra".
function finalizarCompra() {
  // Se o carrinho estiver vazio, mostra um aviso e interrompe a função
  if (carrinho.length === 0) {
    mostrarToast("⚠", "Seu carrinho está vazio.");
    return;
  }

  // Guarda o valor total formatado ANTES de esvaziar o carrinho (para mostrar na mensagem final)
  const total = formatarPreco(calcularTotalCarrinho());

  // Esvazia o carrinho (simulando que a compra foi concluída)
  carrinho = [];

  // Atualiza o badge do carrinho (vai ficar escondido, pois está vazio)
  atualizarBadgeCarrinho();

  // Fecha a janela lateral do carrinho
  fecharCarrinho();

  // Redesenha a página da loja (para refletir o estado atualizado, se necessário)
  renderLoja();

  // Mostra uma notificação de sucesso, informando o valor total da compra finalizada
  mostrarToast("✓", `Compra finalizada! Total: ${total}`);
}

// ============================================================
// FUNÇÕES AUXILIARES (helpers)
// ============================================================

// Função que formata um número (ex: 129.9) como texto de moeda brasileira (ex: "R$ 129,90")
function formatarPreco(valor) {
  // ".toFixed(2)" garante sempre 2 casas decimais (ex: 129.9 -> "129.90")
  // ".replace(".", ",")" troca o ponto decimal por vírgula, no padrão brasileiro
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Função que retorna o HTML de uma "badge" (etiqueta colorida) indicando o perfil do usuário.
function badgePerfil(p) {
  // Se o perfil for "admin", retorna uma badge com a classe "badge-admin" e texto "Admin"
  return p === "admin"
    ? `<span class="badge badge-admin">Admin</span>`
    // Caso contrário, retorna uma badge com a classe "badge-user" e texto "Usuário"
    : `<span class="badge badge-user">Usuário</span>`;
}

// Função que retorna o HTML de uma "badge" indicando o status do usuário (ativo/inativo).
function badgeStatus(s) {
  // Se o status for "ativo", retorna badge verde com texto "Ativo"
  return s === "ativo"
    ? `<span class="badge badge-active">Ativo</span>`
    // Caso contrário, retorna badge indicando "Inativo"
    : `<span class="badge badge-inactive">Inativo</span>`;
}

// Função que converte uma data no formato "AAAA-MM-DD" (ex: "2024-01-15") para o formato brasileiro "DD/MM/AAAA"
function formatarData(d) {
  // Se "d" estiver vazio/nulo, retorna um traço como valor padrão
  if (!d) return "—";

  // Divide a string pelo caractere "-", gerando um array: ["2024", "01", "15"]
  // E já desestrutura esse array em três variáveis: y (ano), m (mês), dia
  const [y,m,dia] = d.split("-");

  // Retorna a data remontada no formato "dia/mes/ano"
  return `${dia}/${m}/${y}`;
}

// Função que exibe uma notificação temporária (toast) na tela, com um ícone e uma mensagem.
function mostrarToast(icone, msg) {
  // Pega o elemento principal do toast
  const t = document.getElementById("toast");

  // Define o ícone exibido (ex: "✓", "🛒", "⚠"...)
  document.getElementById("toast-icon").textContent = icone;

  // Define o texto da mensagem
  document.getElementById("toast-msg").textContent = msg;

  // Adiciona a classe "show", que (via CSS) faz o toast aparecer na tela
  t.classList.add("show");

  // Depois de 2800 milissegundos (2,8 segundos), remove a classe "show",
  // fazendo o toast desaparecer automaticamente
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ============================================================
// EVENTOS DE FECHAMENTO DOS MODAIS (clicando fora da caixa)
// ============================================================

// Fechar modais clicando fora
// Adiciona um listener de clique no elemento de fundo do modal de usuário (a área escura ao redor da caixa).
document.getElementById("modal-usuario").addEventListener("click", function(e) {
  // "e.target" é o elemento exatamente onde o clique ocorreu.
  // "this" é o elemento onde o listener foi registrado (o fundo do modal).
  // Se o clique foi diretamente no fundo (e não dentro da caixa do modal), fecha o modal.
  if (e.target === this) fecharModal();
});

// Mesma lógica acima, mas para o modal de confirmação de exclusão.
document.getElementById("modal-delete").addEventListener("click", function(e) {
  if (e.target === this) fecharDelete();
});
