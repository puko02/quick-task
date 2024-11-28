// Toggle Theme
const themeToggle = document.getElementById('theme');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.getElementById("Dark-mode").innerHTML = document.body.classList.contains('Dark Mode');
});

// Login Button Event Listener
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
  } else {
    console.error('Elemento login-button não encontrado');
  }

  async function handleLogin() {
    const email = document.getElementById('email').value;

    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/emails');
      const emails = await response.json();
      const emailExists = emails.some(e => e.email === email);

      if (emailExists) {
        window.location.href = 'trelofake.html';
        return;
      }

      const addResponse = await fetch('http://localhost:3001/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (addResponse.ok) {
        alert('Email criado com sucesso');
        window.location.href = 'trelofake.html';
      } else {
        alert('Erro ao criar o email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to log in.');
    }
  }
});

// Board Management
document.addEventListener('DOMContentLoaded', () => {
  const boardDropdown = document.getElementById('board-dropdown');
  const addBoardButton = document.getElementById('add-board');
  const board = document.querySelector('.board');
  const boardTitle = document.querySelector('.board-title');
  const addListButton = document.querySelector('.add-list');
  const deleteBoardButton = document.querySelector('.delete-board');

  // Carrega os quadros do localStorage
  function loadBoards() {
    const boards = JSON.parse(localStorage.getItem('boards')) || {};
    boardDropdown.innerHTML = '<option value="">Selecione um Quadro</option>';
    Object.keys(boards).forEach(boardId => {
      const option = document.createElement('option');
      option.value = boardId;
      option.textContent = boards[boardId].title;
      boardDropdown.appendChild(option);
    });
  }

  // Salva os quadros no localStorage
  function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
  }

  // Carrega o quadro selecionado
  function loadBoard(boardId) {
    const boards = JSON.parse(localStorage.getItem('boards')) || {};
    const savedBoard = boards[boardId];
    if (savedBoard) {
      boardTitle.value = savedBoard.title;
      board.querySelector('.lists').innerHTML = '';
      savedBoard.lists.forEach(listData => addList(listData));
    }
  }

  // Salva o quadro atual
  function saveBoard(boardId) {
    const boards = JSON.parse(localStorage.getItem('boards')) || {};
    const lists = Array.from(board.querySelectorAll('.list')).map(list => {
      const title = list.querySelector('.list-title').value;
      const cards = Array.from(list.querySelectorAll('.card')).map(card => {
        return {
          content: card.querySelector('.card-content').value
        };
      });
      return { title, cards };
    });

    boards[boardId] = {
      title: boardTitle.value,
      lists
    };

    saveBoards(boards);
  }

  // Função para adicionar uma nova lista
  function addList(listData = { title: '', cards: [] }) {
    const list = document.createElement('div');
    list.className = 'list';
    list.innerHTML = `
      <div class="list-header">
        <input type="text" class="list-title" placeholder="Nome da Lista" value="${listData.title}">
        <button class="delete-list">Apagar Lista</button>
      </div>
      <div class="cards"></div>
      <button class="add-card">Adicionar Cartão</button>
    `;
    board.querySelector('.lists').appendChild(list);

    // Adiciona eventos aos botões da nova lista
    list.querySelector('.add-card').addEventListener('click', () => addCard(list));
    list.querySelector('.delete-list').addEventListener('click', () => {
      list.remove();
      saveBoard(boardDropdown.value);
    });

    // Adiciona os cartões da lista
    listData.cards.forEach(cardData => addCard(list, cardData));
  }

  // Função para adicionar um novo cartão
  function addCard(list, cardData = { content: '' }) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <textarea class="card-content" placeholder="Conteúdo do Cartão">${cardData.content}</textarea>
      <button class="delete-card">Apagar Cartão</button>
    `;
    list.querySelector('.cards').appendChild(card);

    // Adiciona evento ao botão do novo cartão
    card.querySelector('.delete-card').addEventListener('click', () => {
      card.remove();
      saveBoard(boardDropdown.value);
    });

    // Salva o quadro sempre que um cartão é adicionado ou removido
    card.querySelector('.card-content').addEventListener('input', () => saveBoard(boardDropdown.value));
  }

  // Adiciona evento ao botão de adicionar lista
  addListButton.addEventListener('click', () => {
    addList();
    saveBoard(boardDropdown.value);
  });

  // Salva o quadro sempre que o título do quadro é alterado
  boardTitle.addEventListener('input', () => saveBoard(boardDropdown.value));

  // Carrega o quadro selecionado ao mudar a seleção do dropdown
  boardDropdown.addEventListener('change', () => {
    if (boardDropdown.value) {
      loadBoard(boardDropdown.value);
    } else {
      boardTitle.value = '';
      board.querySelector('.lists').innerHTML = '';
    }
  });

  // Adiciona um novo quadro
  addBoardButton.addEventListener('click', () => {
    const boardId = `board-${Date.now()}`;
    const boards = JSON.parse(localStorage.getItem('boards')) || {};
    boards[boardId] = { title: 'Novo Quadro', lists: [] };
    saveBoards(boards);
    loadBoards();
    boardDropdown.value = boardId;
    loadBoard(boardId);
  });

  // Apaga o quadro atual
  deleteBoardButton.addEventListener('click', () => {
    const boardId = boardDropdown.value;
    if (boardId) {
      const boards = JSON.parse(localStorage.getItem('boards')) || {};
      delete boards[boardId];
      saveBoards(boards);
      loadBoards();
      boardTitle.value = '';
      board.querySelector('.lists').innerHTML = '';
      boardDropdown.value = '';
    }
  });

  // Carrega os quadros ao carregar a página
  loadBoards();
});
