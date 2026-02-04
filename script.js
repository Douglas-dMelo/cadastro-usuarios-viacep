// ===============================
// SELEÇÃO DOS ELEMENTOS DO DOM
// ===============================

// Formulário principal
const form = document.getElementById("formCadastro");

// Botões
const btnLimpar = document.getElementById("btnLimpar");
const btnTema = document.getElementById("btnTema");

// Campos do formulário
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const cep = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

// ===============================
// FUNÇÃO PARA SALVAR DADOS
// ===============================

// Armazena os dados no sessionStorage
function salvarDados() {

  // Cria um objeto com os valores do formulário
  const dados = {
    nome: nome.value,
    email: email.value,
    cep: cep.value,
    rua: rua.value,
    bairro: bairro.value,
    cidade: cidade.value,
    estado: estado.value
  };

  // Converte o objeto em JSON e salva no sessionStorage
  sessionStorage.setItem("formulario", JSON.stringify(dados));
}

// ===============================
// FUNÇÃO PARA RESTAURAR DADOS
// ===============================

// Recupera os dados salvos ao recarregar a página
function restaurarDados() {

  // Busca os dados no sessionStorage
  const dadosSalvos = sessionStorage.getItem("formulario");

  // Se não existir nada salvo, encerra a função
  if (!dadosSalvos) return;

  // Converte o JSON em objeto
  const dados = JSON.parse(dadosSalvos);

  // Preenche os campos novamente
  nome.value = dados.nome || "";
  email.value = dados.email || "";
  cep.value = dados.cep || "";
  rua.value = dados.rua || "";
  bairro.value = dados.bairro || "";
  cidade.value = dados.cidade || "";
  estado.value = dados.estado || "";
}

// ===============================
// FETCH API + VIACEP
// ===============================

// Busca o endereço a partir do CEP
async function buscarCEP(valorCEP) {
  try {
    // Faz a requisição para a API ViaCEP
    const resposta = await fetch(`https://viacep.com.br/ws/${valorCEP}/json/`);

    // Converte a resposta em JSON
    const dados = await resposta.json();

    // Verifica se o CEP é inválido
    if (dados.erro) {
      alert("CEP não encontrado");
      return;
    }

    // Preenche os campos automaticamente
    rua.value = dados.logradouro;
    bairro.value = dados.bairro;
    cidade.value = dados.localidade;
    estado.value = dados.uf;

    // Salva os dados atualizados
    salvarDados();

  } catch (erro) {
    // Trata erros de conexão
    alert("Erro ao buscar o CEP");
  }
}

// ===============================
// EVENTOS
// ===============================

// Evento disparado ao sair do campo CEP
cep.addEventListener("blur", () => {

  // Remove caracteres que não sejam números
  const valor = cep.value.replace(/\D/g, "");

  // Verifica se o CEP tem 8 dígitos
  if (valor.length === 8) {
    buscarCEP(valor);
  }
});

// Evento de envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recarregar a página

  // Validação nativa do HTML5
  if (!form.checkValidity()) {
    alert("Preencha todos os campos obrigatórios");
    return;
  }

  salvarDados();
  alert("Dados salvos com sucesso");
});

// Botão limpar dados
btnLimpar.addEventListener("click", () => {
  sessionStorage.clear(); // Limpa o storage
  form.reset();           // Limpa o formulário
});

// ===============================
// SALVAMENTO AUTOMÁTICO
// ===============================

// Salva os dados sempre que o usuário digitar
[nome, email, cep].forEach(campo => {
  campo.addEventListener("input", salvarDados);
});

// ===============================
// TEMA CLARO / ESCURO
// ===============================

// Aplica o tema conforme valor salvo
function aplicarTema(tema) {
  if (tema === "dark") {
    document.body.classList.add("dark");
    btnTema.textContent = "☀️ Tema Claro";
  } else {
    document.body.classList.remove("dark");
    btnTema.textContent = "🌙 Tema Escuro";
  }
}

// Alterna o tema ao clicar no botão
btnTema.addEventListener("click", () => {

  // Verifica tema atual
  const temaAtual = document.body.classList.contains("dark") ? "dark" : "light";

  // Alterna o tema
  const novoTema = temaAtual === "dark" ? "light" : "dark";

  aplicarTema(novoTema);

  // Salva o tema na sessão
  sessionStorage.setItem("tema", novoTema);
});

// ===============================
// AO CARREGAR A PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // Restaura dados do formulário
  restaurarDados();

  // Aplica o tema salvo
  aplicarTema(sessionStorage.getItem("tema") || "light");
});