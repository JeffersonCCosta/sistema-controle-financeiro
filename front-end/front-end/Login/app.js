const userCards = document.querySelectorAll('.user-card');
const continueBtn = document.getElementById('continueBtn');

let selectedUser = null;

// Função para atualizar UI quando um usuário é selecionado
function selectUser(userId, element) {
  selectedUser = userId;

  // Atualiza atributos aria-pressed e estilo
  userCards.forEach(card => {
    const isSelected = card === element;
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    
    // Adiciona/remove classe para estilização
    if (isSelected) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Salva a seleção no localStorage
  localStorage.setItem('selectedUser', selectedUser);
  localStorage.setItem('selectedUserId', element.dataset.userId);
  localStorage.setItem('selectedUserEmail', element.dataset.email);

  // Habilita botão continuar
  continueBtn.disabled = false;
}

// Adiciona evento de clique a cada cartão
userCards.forEach(card => {
  card.addEventListener('click', () => {
    const userId = card.dataset.user;
    selectUser(userId, card);
  });

  // Melhora acessibilidade para teclado
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const userId = card.dataset.user;
      selectUser(userId, card);
    }
  });
});

/*
// Restaura seleção anterior (se houver)
const prevUser = localStorage.getItem('selectedUser');
if (prevUser) {
  const previousCard = Array.from(userCards).find(c => c.dataset.user === prevUser);
  if (previousCard) {
    selectUser(prevUser, previousCard);
  }
}
  */

document.getElementById('loginBtn').addEventListener('click', async () => {
  const senha = document.getElementById('passwordInput').value;
  const email = localStorage.getItem('selectedUserEmail');

  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      senha: senha
    })
  });

  if (!response.ok) {
    document.getElementById('errorMsg')
      .innerText = 'Senha inválida';
    return;
  }

  const usuario = await response.json();

  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

  window.location.href = '../Principal/Principal.html';
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
  document.getElementById('passwordModal')
    .classList.add('hidden');
});


// Ação do botão continuar
continueBtn.addEventListener('click', () => {
  if (!selectedUser) return;

  document.getElementById('passwordModal')
  .classList.remove('hidden');

  /*
  const userId = localStorage.getItem('selectedUserId');
  
  window.location.href = '../Principal/Principal.html';
  */
});