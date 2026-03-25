# 📔 Diário de Bordo

> Registre suas atividades e memórias diárias com praticidade, privacidade e suporte offline.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura e Decisões Técnicas](#-arquitetura-e-decisões-técnicas)
- [Instalação e Uso](#-instalação-e-uso)
- [PWA — Instalação como Aplicativo](#-pwa--instalação-como-aplicativo)
- [Armazenamento de Dados](#-armazenamento-de-dados)
- [Acessibilidade](#-acessibilidade)
- [Licença](#-licença)

---

##  Sobre o Projeto

O **Diário de Bordo** é uma aplicação web progressiva (PWA) desenvolvida integralmente com tecnologias nativas do navegador — HTML5, CSS3 e JavaScript puro — para o registro de notas e atividades diárias. O aplicativo funciona completamente **offline**, não requer servidor backend e armazena todos os dados **localmente** no dispositivo do usuário, garantindo total privacidade.

A interface foi projetada com foco em **usabilidade** e **responsividade**, adaptando-se perfeitamente tanto a dispositivos móveis quanto a desktops, e oferecendo suporte a temas claro e escuro.

---

##  Funcionalidades

### Gerenciamento de Notas
- **Criar notas** com título, data e descrição (até 1.000 caracteres)
- **Listar notas** em ordem cronológica decrescente (mais recente primeiro)
- **Busca em tempo real** filtrando por título ou conteúdo da descrição
- **Excluir notas** com modal de confirmação para evitar exclusões acidentais
- **Contador dinâmico** de notas na sidebar e na seção de registros

### Experiência do Usuário
- **Tela de boas-vindas** personalizada que solicita o nome do usuário na primeira execução
- **Validação de formulário** com feedback visual imediato (campos obrigatórios, formato do nome)
- **Notificações** para confirmações de ações (salvar, excluir, instalar)
- **Data atual** exibida automaticamente no cabeçalho da aplicação
- **Campo de data** pré-preenchido com a data de hoje

### Temas
- **Tema escuro** e **tema claro**, alternáveis com um botão
- Detecção automática da **preferência do sistema operacional** (`prefers-color-scheme`)
- Persistência do tema escolhido entre sessões via `localStorage`
- Atualização dinâmica da **meta `theme-color`** para corresponder ao tema ativo na barra do navegador/PWA

### Progressive Web App (PWA)
- **Instalável** como aplicativo nativo
- **Suporte offline completo** via Service Worker com estratégia Cache First
- Manifesto Web App com configuração de ícones, nome e orientação
- Botão de instalação contextual que aparece apenas quando o prompt está disponível

### Responsividade
- Layout de **sidebar fixa** no desktop e **menu hambúrguer deslizável** no mobile
- Header exclusivo para dispositivos móveis com botão de tema integrado
- Overlay de fundo ao abrir o menu mobile para melhor foco e usabilidade

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| HTML5 | — | Estrutura semântica da aplicação |
| CSS3 | — | Estilização, animações e responsividade |
| JavaScript (ES2020+) | — | Lógica da aplicação, manipulação do DOM |
| Web Storage API | — | Persistência de dados com `localStorage` |
| Service Worker API | — | Cache offline e suporte PWA |
| Web App Manifest | — | Instalação como aplicativo nativo |
| Google Fonts | — | Tipografia (Playfair Display + Lato) |

> Nenhuma dependência externa de JavaScript ou framework foi utilizada. O projeto é **zero-dependency**.

---

## 📁 Estrutura do Projeto

```
diario-de-bordo/
│
├── index.html          
├── style.css           
├── script.js           
├── manifest.json       
├── service-worker.js  
├── README.md 
│
└── icons/
    ├── icon-192.png    
    └── icon-512.png    
```

---

## 🏗 Arquitetura e Decisões Técnicas

### Persistência com `localStorage`

Todas as notas são serializadas em JSON e armazenadas sob a chave `diario-notas` no `localStorage` do navegador. Cada nota é um objeto com a seguinte estrutura:

```json
{
  "id": 1718123456789,
  "titulo": "Reunião de planejamento",
  "data": "2024-06-11",
  "descricao": "Discutimos as metas do segundo semestre..."
}
```

O campo `id` é gerado a partir de `Date.now()`, garantindo unicidade e servindo simultaneamente como timestamp de criação (usado para ordenação e para exibição do horário de registro).

Outras chaves utilizadas no `localStorage`:

| Chave | Conteúdo |
|---|---|
| `diario-notas` | Array JSON com todas as notas |
| `diario-nome` | Nome do usuário (string) |
| `diario-tema` | Tema ativo: `"light"` ou `"dark"` |

### Service Worker — Estratégia Cache First

O Service Worker implementa a estratégia **Cache First**:

1. Ao receber uma requisição, verifica primeiro se o recurso existe no cache.
2. Se existir, serve imediatamente do cache (sem rede).
3. Se não existir, busca na rede, armazena no cache e retorna a resposta.
4. Em caso de falha de rede e ausência no cache, retorna `index.html` como fallback.

O cache é versionado (`diario-de-bordo-v1`). Para forçar atualização em produção, basta incrementar o número da versão — caches antigos são automaticamente removidos no evento `activate`.


---

## 🚀 Instalação e Uso

### Pré-requisitos


### Execução local

**VS Code Live Server (recomendado):**
1. Abra a pasta do projeto no VS Code
2. Instale a extensão **Live Server**
3. Clique em **"Go Live"** na barra inferior

---

## 📱 PWA — Instalação como Aplicativo

O Diário de Bordo pode ser instalado como um aplicativo nativo nos principais sistemas operacionais.

### Desktop (Navegador)
1. Acesse o aplicativo
2. Clique no ícone de instalação na barra de endereços, ou
3. Utilize o botão **"Instalar Aplicativo"** na sidebar

---

## 💾 Armazenamento de Dados

Todos os dados são armazenados **exclusivamente no dispositivo local** do usuário, sem qualquer envio para servidores externos.

- **Nenhum dado é coletado ou transmitido**
- Os dados persistem enquanto o cache do navegador não for limpo
- Para **backup**, o usuário pode inspecionar o `localStorage` via DevTools do navegador
- Para **limpar todos os dados**, basta limpar o armazenamento do site nas configurações do navegador

> ℹ️ Por utilizar `localStorage`, os dados **não são sincronizados** entre dispositivos ou entre perfis de navegador diferentes.

---



## 📄 Licença

Este projeto tem licença gratuita para uso.

---

<p align="center">
  Feito para preservar suas memórias.
</p>
