/* ============================================================
   DIÁRIO DE BORDO — script.js
   Lógica principal da aplicação
   ============================================================ */

/* ------------------------------------------------------------
   TELA DE BOAS-VINDAS — coleta o nome do usuário
   Executada automaticamente ao iniciar o aplicativo.
   O nome é salvo no localStorage e exibido no cabeçalho.
------------------------------------------------------------ */

/**
 * Verifica se o usuário já cadastrou um nome anteriormente.
 * Se sim, pula a tela de boas-vindas e exibe o nome salvo.
 * Se não, exibe a tela pedindo o nome.
 *
 * localStorage.getItem('diario-nome') retorna:
 *   - O nome salvo (string) se já existir
 *   - null se for a primeira vez
 */
function inicializarBoasVindas() {
  // Tenta recuperar o nome salvo no localStorage
  const nomeSalvo = localStorage.getItem('diario-nome');

  if (nomeSalvo) {
    // Já existe um nome salvo: pula a tela e exibe o nome
    ocultarTelaBoasVindas();
    exibirNomeNaTela(nomeSalvo);
  } else {
    // Primeira vez: mostra a tela de boas-vindas
    // O overlay já está visível no HTML por padrão
    // Foca automaticamente no campo de nome para melhor UX
    document.getElementById('inputNome').focus();
  }
}

/**
 * Valida o nome digitado pelo usuário.
 * Regras:
 *   - Não pode estar vazio
 *   - Só aceita letras (com acentos), números e espaços
 *   - Mínimo de 2 caracteres
 *
 * @param {string} nome - O texto digitado pelo usuário
 * @returns {boolean} true se válido, false se inválido
 */
function validarNome(nome) {
  // trim() remove espaços no início e no fim
  const nomeLimpo = nome.trim();

  // Verifica tamanho mínimo
  if (nomeLimpo.length < 2) return false;

  // Expressão regular: permite letras (incluindo acentuadas),
  // números e espaços — bloqueia símbolos como !@#$%
  const regexValido = /^[A-Za-zÀ-ÿ0-9 ]+$/;
  return regexValido.test(nomeLimpo);
}

/**
 * Salva o nome no localStorage e faz a transição para o app.
 * Chamada quando o usuário clica em Continuar.
 */
function confirmarNome() {
  const inputNome  = document.getElementById('inputNome');
  const erroNome   = document.getElementById('erroNome');
  const nome       = inputNome.value.trim();

  // Valida o nome antes de prosseguir
  if (!validarNome(nome)) {
    // Mostra o campo com borda vermelha
    inputNome.classList.add('erro');
    // Exibe a mensagem de erro abaixo do campo
    erroNome.classList.add('visivel');
    // Foca novamente no campo para o usuário corrigir
    inputNome.focus();
    return; // Para a execução aqui — não avança
  }

  // Nome válido: remove indicadores de erro (se existirem)
  inputNome.classList.remove('erro');
  erroNome.classList.remove('visivel');

  // Salva o nome no localStorage para não perguntar novamente
  localStorage.setItem('diario-nome', nome);

  // Exibe o nome no cabeçalho da tela principal
  exibirNomeNaTela(nome);

  // Anima a saída da tela de boas-vindas
  ocultarTelaBoasVindas();
}

/**
 * Oculta a tela de boas-vindas com animação de saída.
 * A classe 'oculto' dispara a animação CSS fadeOut.
 * Após a animação (400ms), remove o elemento do fluxo visual
 * usando display:none para não interferir na página.
 */
function ocultarTelaBoasVindas() {
  const overlay = document.getElementById('boasVindasOverlay');
  // Adiciona classe que dispara animação CSS de saída
  overlay.classList.add('oculto');
  // Aguarda a animação terminar (400ms) e então esconde de vez
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 400);
}

/**
 * Insere o nome do usuário no elemento span do cabeçalho.
 * O HTML tem: <h1>Olá, <span id=nomeUsuario></span></h1>
 * Esta função preenche esse span com o nome salvo.
 *
 * @param {string} nome - Nome a exibir na tela principal
 */
function exibirNomeNaTela(nome) {
  document.getElementById('nomeUsuario').textContent = nome + ',';
}

// ── Eventos da tela de boas-vindas ──────────────────────────

// Clique no botão Continuar — salva o nome e avança
document.getElementById('btnContinuar').addEventListener('click', confirmarNome);

// Tecla Enter no campo de nome — mesmo comportamento do botão
document.getElementById('inputNome').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmarNome();
});

// Remove o estilo de erro enquanto o usuário digita
document.getElementById('inputNome').addEventListener('input', () => {
  document.getElementById('inputNome').classList.remove('erro');
  document.getElementById('erroNome').classList.remove('visivel');
});

/* ------------------------------------------------------------
   GERENCIAMENTO DE TEMA (claro / escuro)
------------------------------------------------------------ */

// Recupera o tema salvo ou usa a preferência do sistema operacional
const savedTheme =
  localStorage.getItem('diario-tema') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Aplica o tema ao carregar a página
applyTheme(savedTheme);

/**
 * Aplica o tema (claro ou escuro) ao documento e persiste a escolha.
 * @param {string} theme - 'light' ou 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('diario-tema', theme);

  const isDark    = theme === 'dark';
  const icon      = isDark ? '☀️' : '🌙';
  const label     = isDark ? 'Tema Claro' : 'Tema Escuro';
  const metaColor = isDark ? '#0f0f1a' : '#1a1a2e';

  // Atualiza ícone e texto dos botões de tema
  document.getElementById('themeIcon').textContent      = icon;
  document.getElementById('themeLabel').textContent     = label;
  document.getElementById('btnThemeMobile').textContent = icon;

  // Atualiza a cor da barra de status no navegador/PWA
  document.getElementById('meta-theme-color').setAttribute('content', metaColor);
}

/** Alterna entre tema claro e escuro */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Eventos dos botões de tema (sidebar e mobile)
document.getElementById('btnTheme').addEventListener('click', toggleTheme);
document.getElementById('btnThemeMobile').addEventListener('click', toggleTheme);

/* ------------------------------------------------------------
   DATA ATUAL NO CABEÇALHO
------------------------------------------------------------ */

// Formata e exibe a data de hoje no topo da página
const agora = new Date();
document.getElementById('currentDate').textContent =
  agora.toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

// Define a data de hoje como valor padrão no campo de data
document.getElementById('inputData').value = agora.toISOString().split('T')[0];

/* ------------------------------------------------------------
   PERSISTÊNCIA — LOCALSTORAGE
   Todas as notas são salvas localmente no navegador.
------------------------------------------------------------ */

const STORAGE_KEY = 'diario-notas';

/**
 * Carrega o array de notas do localStorage.
 * @returns {Array} Lista de notas salvas
 */
function carregarNotas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Persiste o array de notas no localStorage.
 * @param {Array} notas - Lista de notas a salvar
 */
function salvarNotas(notas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
}

/* ------------------------------------------------------------
   RENDERIZAÇÃO DAS NOTAS
------------------------------------------------------------ */

/**
 * Renderiza a lista de notas no DOM, aplicando filtro de busca.
 * @param {string} filtro - Texto para filtrar por título ou descrição
 */
function renderizarNotas(filtro = '') {
  const notas    = carregarNotas();
  const lista    = document.getElementById('entriesList');
  const contagem = document.getElementById('entriesCount');

  // Filtra por título ou descrição 
  const filtradas = notas.filter(n =>
    n.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    n.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  // Atualiza o contador total da sidebar
  atualizarEstatisticas(notas);
  contagem.textContent = `${filtradas.length} Nota${filtradas.length !== 1 ? 's' : ''}`;

  // Exibe estado vazio se não houver resultados
  if (filtradas.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📔</div>
        <h3>${filtro ? 'Nenhuma nota encontrada' : 'Sem notas ainda'}</h3>
        <p>${filtro ? 'Tente uma busca diferente.' : 'Comece registrando sua primeira nota acima!'}</p>
      </div>`;
    return;
  }

  // Ordena da mais recente para a mais antiga (pelo ID/timestamp)
  const ordenadas = [...filtradas].sort((a, b) => b.id - a.id);

  // Constrói os cards HTML de cada nota
  lista.innerHTML = ordenadas.map(nota => {
    const data = new Date(nota.data + 'T12:00:00');
    const dia  = data.getDate().toString().padStart(2, '0');
    const mes  = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const dataCompleta = data.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const horario = new Date(nota.id).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    });

    return `
      <article class="entry-card" data-id="${nota.id}">
        <!-- Badge com dia e mês -->
        <div class="entry-date-badge" aria-label="Data: ${dataCompleta}">
          <div class="entry-date-day">${dia}</div>
          <div class="entry-date-month">${mes}</div>
        </div>
        <!-- Conteúdo textual -->
        <div class="entry-body">
          <h3 class="entry-title">${escaparHtml(nota.titulo)}</h3>
          <p class="entry-desc">${escaparHtml(nota.descricao)}</p>
          <div class="entry-meta">🕐 Registrado às ${horario}</div>
        </div>
        <!-- Botão de excluir -->
        <button
          class="btn-delete"
          onclick="confirmarExclusao(${nota.id})"
          aria-label="Remover nota: ${escaparHtml(nota.titulo)}">
          🗑️
        </button>
      </article>`;
  }).join('');
}

/**
 * Atualiza o contador de total de notas na sidebar.
 * @param {Array} notas - Lista completa de notas
 */
function atualizarEstatisticas(notas) {
  document.getElementById('statTotal').textContent = notas.length;
}

/**
 * Escapa caracteres HTML para prevenir XSS ao exibir dados do usuário.
 * @param {string} texto - Texto a ser escapado
 * @returns {string} Texto seguro para exibição
 */
function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/* ------------------------------------------------------------
   ADICIONAR NOVA NOTA
------------------------------------------------------------ */

document.getElementById('btnSalvar').addEventListener('click', () => {
  const titulo    = document.getElementById('inputTitulo').value.trim();
  const data      = document.getElementById('inputData').value;
  const descricao = document.getElementById('inputDescricao').value.trim();

  // Valida que todos os campos estão preenchidos
  if (!titulo || !data || !descricao) {
    mostrarToast('⚠️ Preencha todos os campos antes de salvar.');
    return;
  }

  // Cria a nova nota com ID único baseado no timestamp atual
  const novaNota = { id: Date.now(), titulo, data, descricao };

  // Adiciona e persiste no localStorage
  const notas = carregarNotas();
  notas.push(novaNota);
  salvarNotas(notas);

  // Limpa o formulário, mantendo apenas a data de hoje
  document.getElementById('inputTitulo').value    = '';
  document.getElementById('inputDescricao').value = '';
  document.getElementById('inputData').value      = new Date().toISOString().split('T')[0];

  renderizarNotas();
  mostrarToast('Nota registrada com sucesso!');
});

/* ------------------------------------------------------------
   BUSCA EM TEMPO REAL
------------------------------------------------------------ */

// Filtra a lista a cada tecla digitada no campo de busca
document.getElementById('inputBusca').addEventListener('input', (e) => {
  renderizarNotas(e.target.value);
});

/* ------------------------------------------------------------
   EXCLUSÃO DE NOTA (com modal de confirmação)
------------------------------------------------------------ */

let idParaExcluir = null; // Armazena temporariamente o ID da nota a excluir

/**
 * Abre o modal de confirmação para excluir uma nota.
 * @param {number} id - ID da nota a ser excluída
 */
function confirmarExclusao(id) {
  idParaExcluir = id;
  document.getElementById('modalOverlay').classList.add('active');
}

// Cancela e fecha o modal sem excluir
document.getElementById('btnCancelDelete').addEventListener('click', () => {
  idParaExcluir = null;
  document.getElementById('modalOverlay').classList.remove('active');
});

// Confirma a exclusão e atualiza a lista
document.getElementById('btnConfirmDelete').addEventListener('click', () => {
  if (idParaExcluir !== null) {
    const notas = carregarNotas().filter(n => n.id !== idParaExcluir);
    salvarNotas(notas);
    renderizarNotas(document.getElementById('inputBusca').value);
    mostrarToast('Nota removida.');
    idParaExcluir = null;
  }
  document.getElementById('modalOverlay').classList.remove('active');
});

// Fecha o modal ao clicar fora da área do diálogo
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) {
    idParaExcluir = null;
    document.getElementById('modalOverlay').classList.remove('active');
  }
});

/* ------------------------------------------------------------
   TOAST DE NOTIFICAÇÃO
------------------------------------------------------------ */

let toastTimer = null;

/**
 * Exibe uma mensagem de notificação temporária na tela.
 * @param {string} mensagem - Texto da notificação
 */
function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('show');

  // Remove automaticamente após 3 segundos
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ------------------------------------------------------------
   MENU MOBILE — abrir e fechar sidebar
------------------------------------------------------------ */

// Botão hamburger — abre/fecha a sidebar deslizando da esquerda
document.getElementById('btnMenu').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
});

// Overlay escuro — fecha a sidebar ao clicar fora dela
document.getElementById('sidebarOverlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
});

/* ------------------------------------------------------------
   PWA — INSTALAÇÃO (beforeinstallprompt)
   O botão só aparece quando o navegador disponibiliza o prompt.
   Após instalação, o botão é ocultado permanentemente.
------------------------------------------------------------ */

let installPrompt = null; // Guarda o evento de instalação

// Captura o evento nativo do navegador antes de exibir o prompt de instalação
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Cancela o banner automático do navegador
  installPrompt = e;

  // Exibe o botão de instalação na sidebar
  document.getElementById('btnInstall').classList.remove('hidden');
});

// Dispara o prompt ao clicar no botão de instalação
document.getElementById('btnInstall').addEventListener('click', async () => {
  if (!installPrompt) return;

  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;

  // Oculta o botão se o usuário aceitou instalar
  if (outcome === 'accepted') {
    document.getElementById('btnInstall').classList.add('hidden');
    mostrarToast('Aplicativo instalado com sucesso!');
  }
  installPrompt = null;
});

// Oculta o botão quando o app é instalado via outro caminho
window.addEventListener('appinstalled', () => {
  document.getElementById('btnInstall').classList.add('hidden');
  installPrompt = null;
});

// Verifica se já está rodando como app instalado (modo standalone)
if (
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true
) {
  document.getElementById('btnInstall').classList.add('hidden');
}

/* ------------------------------------------------------------
   SERVICE WORKER — registro para suporte offline
------------------------------------------------------------ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(reg  => console.log('[PWA] Service Worker registrado:', reg.scope))
      .catch(err => console.warn('[PWA] Falha ao registrar Service Worker:', err));
  });
}

/* ------------------------------------------------------------
   INICIALIZAÇÃO — ordem de execução ao abrir a página
   1. inicializarBoasVindas() — verifica se já tem nome salvo
   2. renderizarNotas()       — carrega as notas do localStorage
------------------------------------------------------------ */
inicializarBoasVindas();
renderizarNotas();;
