// ============================================================
// BANCO DE DADOS LOCAL (array em memória — como um banco simples)
// ============================================================
let db = {
  usuarios: [
    { id: 1, nome: "Administrador", login: "admin", email: "admin@sistema.com", senha: "admin123", perfil: "admin", status: "ativo", criado: "2024-01-15" },
    { id: 2, nome: "João da Silva",  login: "joao",  email: "joao@email.com",   senha: "user123",  perfil: "user",  status: "ativo", criado: "2024-02-10" },
    { id: 3, nome: "Maria Souza",    login: "maria", email: "maria@email.com",  senha: "user123",  perfil: "user",  status: "ativo", criado: "2024-03-05" },
    { id: 4, nome: "Carlos Lima",    login: "carlos",email: "carlos@email.com", senha: "user123",  perfil: "user",  status: "inativo", criado: "2024-04-01" },
  ],
  proximoId: 5,
  produtos: [
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

let carrinho = []; // array de { produtoId, quantidade }


let usuarioLogado = null;
let idParaDeletar  = null;
let paginaAtual    = "usuarios";
let termoBusca     = "";
let filtroCategoria = "Todos";

// ============================================================
// AUTENTICAÇÃO
// ============================================================
function fazerLogin() {
  const loginVal = document.getElementById("login-user").value.trim();
  const senhaVal = document.getElementById("login-pass").value;
  const erro     = document.getElementById("login-error");

  const encontrado = db.usuarios.find(u => u.login === loginVal && u.senha === senhaVal && u.status === "ativo");

  if (!encontrado) {
    erro.style.display = "block";
    return;
  }

  erro.style.display = "none";
  usuarioLogado = encontrado;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-screen").style.display = "block";

  renderizarSidebar();
  navegarPara(encontrado.perfil === "admin" ? "dashboard" : "meu-perfil");
}

function fazerLogout() {
  usuarioLogado = null;
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("app-screen").style.display = "none";
  document.getElementById("login-user").value = "";
  document.getElementById("login-pass").value = "";
}

// Permite login com Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.getElementById("login-screen").style.display !== "none") {
    fazerLogin();
  }
});

// ============================================================
// SIDEBAR
// ============================================================
function renderizarSidebar() {
  const isAdmin = usuarioLogado.perfil === "admin";
  const iniciais = usuarioLogado.nome.split(" ").slice(0,2).map(n => n[0]).join("");

  document.getElementById("sidebar-name").textContent = usuarioLogado.nome;
  document.getElementById("sidebar-role").textContent = isAdmin ? "Administrador" : "Usuário";

  const avatar = document.getElementById("sidebar-avatar");
  avatar.textContent = iniciais;
  avatar.className   = `avatar ${isAdmin ? "avatar-admin" : "avatar-user"}`;

  const nav = document.getElementById("sidebar-nav");

  if (isAdmin) {
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

function svgHome() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
}
function svgUsers() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}
function svgUser() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}
function svgShop() {
  return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l1-5h16l1 5"/><path d="M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9"/><path d="M9 21V13h6v8"/></svg>`;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================
function navegarPara(pagina) {
  paginaAtual = pagina;
  termoBusca = "";
  filtroCategoria = "Todos";

  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const navEl = document.getElementById("nav-" + pagina);
  if (navEl) navEl.classList.add("active");

  if (pagina === "dashboard")   renderDashboard();
  else if (pagina === "usuarios") renderUsuarios();
  else if (pagina === "meu-perfil") renderMeuPerfil();
  else if (pagina === "loja") renderLoja();

  // Mostra o botão do carrinho só na página da loja
  const fab = document.getElementById("cart-fab");
  if (pagina === "loja") fab.classList.add("visible");
  else fab.classList.remove("visible");
}

// ============================================================
// PÁGINA: DASHBOARD (somente admin)
// ============================================================
function renderDashboard() {
  const total     = db.usuarios.length;
  const ativos    = db.usuarios.filter(u => u.status === "ativo").length;
  const admins    = db.usuarios.filter(u => u.perfil === "admin").length;
  const inativos  = db.usuarios.filter(u => u.status === "inativo").length;

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
}

// ============================================================
// PÁGINA: GERENCIAR USUÁRIOS (somente admin)
// ============================================================
function renderUsuarios() {
  const filtrados = db.usuarios.filter(u =>
    u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    u.login.toLowerCase().includes(termoBusca.toLowerCase()) ||
    u.email.toLowerCase().includes(termoBusca.toLowerCase())
  );

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
}

// ============================================================
// PÁGINA: MEU PERFIL (todos os usuários)
// ============================================================
function renderMeuPerfil() {
  const u = usuarioLogado;
  const iniciais = u.nome.split(" ").slice(0,2).map(n=>n[0]).join("");

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
function abrirModalNovo() {
  document.getElementById("modal-titulo").textContent = "Novo Usuário";
  document.getElementById("edit-id").value = "";
  document.getElementById("edit-nome").value = "";
  document.getElementById("edit-login").value = "";
  document.getElementById("edit-email").value = "";
  document.getElementById("edit-senha").value = "";
  document.getElementById("edit-perfil").value = "user";
  document.getElementById("edit-status").value = "ativo";
  document.getElementById("modal-error").style.display = "none";
  document.getElementById("modal-usuario").classList.add("open");
}

// ============================================================
// MODAL: EDITAR USUÁRIO (admin vê todos, user vê só o próprio)
// ============================================================
function abrirModalEditar(id) {
  const u = db.usuarios.find(u => u.id === id);
  if (!u) return;

  document.getElementById("modal-titulo").textContent = "Editar Usuário";
  document.getElementById("edit-id").value = u.id;
  document.getElementById("edit-nome").value = u.nome;
  document.getElementById("edit-login").value = u.login;
  document.getElementById("edit-email").value = u.email;
  document.getElementById("edit-senha").value = "";
  document.getElementById("edit-perfil").value = u.perfil;
  document.getElementById("edit-status").value = u.status;
  document.getElementById("modal-error").style.display = "none";

  // Usuário comum não altera perfil nem status
  const isAdmin = usuarioLogado.perfil === "admin";
  document.getElementById("edit-perfil").disabled = !isAdmin;
  document.getElementById("edit-status").disabled = !isAdmin;

  document.getElementById("modal-usuario").classList.add("open");
}

function abrirModalEditarPerfil() {
  abrirModalEditar(usuarioLogado.id);
}

function fecharModal() {
  document.getElementById("modal-usuario").classList.remove("open");
}

// ============================================================
// SALVAR USUÁRIO (criar ou editar)
// ============================================================
function salvarUsuario() {
  const id     = document.getElementById("edit-id").value;
  const nome   = document.getElementById("edit-nome").value.trim();
  const login  = document.getElementById("edit-login").value.trim();
  const email  = document.getElementById("edit-email").value.trim();
  const senha  = document.getElementById("edit-senha").value;
  const perfil = document.getElementById("edit-perfil").value;
  const status = document.getElementById("edit-status").value;
  const errDiv = document.getElementById("modal-error");

  // Validações simples
  if (!nome || !login || !email) {
    errDiv.textContent = "Nome, login e e-mail são obrigatórios.";
    errDiv.style.display = "block";
    return;
  }

  if (!email.includes("@")) {
    errDiv.textContent = "Informe um e-mail válido.";
    errDiv.style.display = "block";
    return;
  }

  // Verifica login duplicado
  const loginExiste = db.usuarios.find(u => u.login === login && u.id != id);
  if (loginExiste) {
    errDiv.textContent = "Este login já está em uso por outro usuário.";
    errDiv.style.display = "block";
    return;
  }

  errDiv.style.display = "none";

  if (id) {
    // ATUALIZAR
    const idx = db.usuarios.findIndex(u => u.id == id);
    db.usuarios[idx].nome   = nome;
    db.usuarios[idx].login  = login;
    db.usuarios[idx].email  = email;
    db.usuarios[idx].perfil = perfil;
    db.usuarios[idx].status = status;
    if (senha) db.usuarios[idx].senha = senha;

    // Atualiza sessão se for o próprio usuário
    if (db.usuarios[idx].id === usuarioLogado.id) {
      usuarioLogado = db.usuarios[idx];
      renderizarSidebar();
    }

    mostrarToast("✓", "Usuário atualizado com sucesso!");
  } else {
    // CRIAR
    if (!senha) {
      errDiv.textContent = "A senha é obrigatória para novo usuário.";
      errDiv.style.display = "block";
      return;
    }
    const novo = {
      id: db.proximoId++,
      nome, login, email, senha, perfil, status,
      criado: new Date().toISOString().split("T")[0]
    };
    db.usuarios.push(novo);
    mostrarToast("✓", "Usuário criado com sucesso!");
  }

  fecharModal();
  if (paginaAtual === "usuarios") renderUsuarios();
  else if (paginaAtual === "dashboard") renderDashboard();
  else if (paginaAtual === "meu-perfil") renderMeuPerfil();
}

// ============================================================
// DELETAR USUÁRIO
// ============================================================
function abrirDelete(id) {
  const u = db.usuarios.find(u => u.id === id);
  if (!u) return;
  idParaDeletar = id;
  document.getElementById("delete-nome").textContent = u.nome;
  document.getElementById("modal-delete").classList.add("open");
}

function fecharDelete() {
  idParaDeletar = null;
  document.getElementById("modal-delete").classList.remove("open");
}

function confirmarDelete() {
  db.usuarios = db.usuarios.filter(u => u.id !== idParaDeletar);
  fecharDelete();
  mostrarToast("🗑", "Usuário excluído.");
  if (paginaAtual === "usuarios") renderUsuarios();
  else if (paginaAtual === "dashboard") renderDashboard();
}

// ============================================================
// PÁGINA: LOJA DE PRODUTOS (todos os usuários)
// ============================================================
function renderLoja() {
  const categorias = ["Todos", ...new Set(db.produtos.map(p => p.categoria))];

  const filtrados = db.produtos.filter(p => {
    const passaCategoria = filtroCategoria === "Todos" || p.categoria === filtroCategoria;
    const passaBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase());
    return passaCategoria && passaBusca;
  });

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
}

// ============================================================
// CARRINHO DE COMPRAS
// ============================================================
function adicionarAoCarrinho(produtoId) {
  const item = carrinho.find(i => i.produtoId === produtoId);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ produtoId, quantidade: 1 });
  }
  atualizarBadgeCarrinho();
  const produto = db.produtos.find(p => p.id === produtoId);
  mostrarToast("🛒", `${produto.nome} adicionado ao carrinho`);
}

function alterarQuantidade(produtoId, delta) {
  const item = carrinho.find(i => i.produtoId === produtoId);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.produtoId !== produtoId);
  }
  atualizarBadgeCarrinho();
  renderCarrinho();
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter(i => i.produtoId !== produtoId);
  atualizarBadgeCarrinho();
  renderCarrinho();
}

function calcularTotalCarrinho() {
  return carrinho.reduce((total, item) => {
    const produto = db.produtos.find(p => p.id === item.produtoId);
    return total + (produto ? produto.preco * item.quantidade : 0);
  }, 0);
}

function totalItensCarrinho() {
  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById("cart-badge");
  const total = totalItensCarrinho();
  if (total > 0) {
    badge.textContent = total;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function abrirCarrinho() {
  renderCarrinho();
  document.getElementById("cart-overlay").classList.add("open");
}

function fecharCarrinho() {
  document.getElementById("cart-overlay").classList.remove("open");
}

function renderCarrinho() {
  const container = document.getElementById("cart-items");

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" fill="none" stroke="var(--text-muted)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Seu carrinho está vazio.</p>
      </div>
    `;
  } else {
    container.innerHTML = carrinho.map(item => {
      const p = db.produtos.find(p => p.id === item.produtoId);
      if (!p) return "";
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
    }).join("");
  }

  document.getElementById("cart-total").textContent = formatarPreco(calcularTotalCarrinho());
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    mostrarToast("⚠", "Seu carrinho está vazio.");
    return;
  }
  const total = formatarPreco(calcularTotalCarrinho());
  carrinho = [];
  atualizarBadgeCarrinho();
  fecharCarrinho();
  renderLoja();
  mostrarToast("✓", `Compra finalizada! Total: ${total}`);
}

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}


function badgePerfil(p) {
  return p === "admin"
    ? `<span class="badge badge-admin">Admin</span>`
    : `<span class="badge badge-user">Usuário</span>`;
}

function badgeStatus(s) {
  return s === "ativo"
    ? `<span class="badge badge-active">Ativo</span>`
    : `<span class="badge badge-inactive">Inativo</span>`;
}

function formatarData(d) {
  if (!d) return "—";
  const [y,m,dia] = d.split("-");
  return `${dia}/${m}/${y}`;
}

function mostrarToast(icone, msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-icon").textContent = icone;
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// Fechar modais clicando fora
document.getElementById("modal-usuario").addEventListener("click", function(e) {
  if (e.target === this) fecharModal();
});
document.getElementById("modal-delete").addEventListener("click", function(e) {
  if (e.target === this) fecharDelete();
});
