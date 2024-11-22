// Toggle Theme
const themeToggle = document.getElementById('theme');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  document.getElementById("light-dark").innerHTML = document.body.classList.contains('light') ? "Dark" : "Light";
});

// Login Button Event Listener
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter your email');
    return;
  }

  try {
    // Verifica se o email já existe
    const response = await fetch('http://localhost:3001/emails');
    const emails = await response.json();
    const emailExists = emails.some(e => e.email === email);

    if (emailExists) {
      // Redireciona para trelofake.html se o email já existir
      window.location.href = 'trelofake.html';
      return;
    }

    // Adiciona o novo email se não existir
    const addResponse = await fetch('http://localhost:3001/emails', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (addResponse.ok) {
      alert('Email criado com sucesso');
    } else {
      alert('Erro ao criar o email');
    }

    const data = await addResponse.json();
    if (data.email) {
      window.location.href = 'trelofake.html';
    } else {
      alert(`Response: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to log in.');
  }
});

async function addEmail(newEmail) {
  const response = await fetch('http://localhost:3001/emails');
  const emails = await response.json();

  // Verifica se o email já existe
  const emailExists = emails.some(email => email.email === newEmail.email);

  if (!emailExists) {
      // Adiciona o novo email
      const addResponse = await fetch('http://localhost:3001/emails', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEmail)
      });

      if (addResponse.ok) {
          console.log('Email adicionado com sucesso');
      } else {
          console.error('Erro ao adicionar o email');
      }
  } else {
      console.log('Email já existe no banco de dados');
  }
}

// Exemplo de uso
const newEmail = { id: 'novoId', email: 'user1@example.com' };
addEmail(newEmail);

document.addEventListener('DOMContentLoaded', () => {
  const board = document.querySelector('.board');

  // Função para adicionar uma nova lista
  function addList() {
    const list = document.createElement('div');
    list.className = 'list';
    list.innerHTML = `
      <div class="list-header">
        <input type="text" class="list-title" placeholder="Nome da Lista">
        <button class="delete-list">Apagar Lista</button>
      </div>
      <div class="cards"></div>
      <button class="add-card">Adicionar Cartão</button>
    `;
    board.querySelector('.lists').appendChild(list);

    // Adiciona eventos aos botões da nova lista
    list.querySelector('.add-card').addEventListener('click', () => addCard(list));
    list.querySelector('.delete-list').addEventListener('click', () => list.remove());
  }

  // Função para adicionar um novo cartão
  function addCard(list) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <textarea class="card-content" placeholder="Conteúdo do Cartão"></textarea>
      <button class="delete-card">Apagar Cartão</button>
    `;
    list.querySelector('.cards').appendChild(card);

    // Adiciona evento ao botão do novo cartão
    card.querySelector('.delete-card').addEventListener('click', () => card.remove());
  }

  // Adiciona evento ao botão de adicionar lista
  document.querySelector('.add-list').addEventListener('click', addList);
});