import { API_BASE_URL } from '/apiconfig.js';

document.addEventListener('DOMContentLoaded', async () => {
  const themeToggle = document.getElementById('theme');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark');
      document.getElementById("Dark-mode").innerHTML = document.body.classList.contains('Dark Mode');
    });
  } else {
    console.error('Elemento theme não encontrado');
  }

  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
  } else {
    console.error('Elemento login-button não encontrado');
  }

  const clickEnter = addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  });

  const userBoardsDropdown = document.getElementById('user-boards-dropdown');
  if (userBoardsDropdown) {
    userBoardsDropdown.addEventListener('change', async () => {
      const boardId = userBoardsDropdown.value;
      if (boardId) {
        await loadBoardById(boardId);
      } else {
        document.getElementById('board-details').innerHTML = '';
      }
    });
  }

  await loadUserBoards();

  async function handleLogin() {
    const email = document.getElementById('email').value;

    if (!email) {
      alert('Por favor, insira um email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/GetPersonByEmail?Email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userExists = await response.json();

      if (userExists) {
        window.location.href = 'trelofake.html';
      } else {
        const showError = document.getElementById('error');
        showError.innerHTML = "Email não encontrado, verifique seu email e tente novamente";
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Falha ao fazer login.');
    }
  }
});

async function loadUserBoards() {
  try {
    const response = await fetch(`${API_BASE_URL}/Boards`);
    const boards = await response.json();

    const userBoardsDropdown = document.getElementById('user-boards-dropdown');
    userBoardsDropdown.innerHTML = '<option value="">Selecione um quadro</option>';

    boards.forEach(board => {
      const option = document.createElement('option');
      option.value = board.Id;
      option.textContent = board.Name;
      userBoardsDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar os quadros do usuário:', error);
  }
}

async function loadBoardById(boardId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Board?BoardId=${boardId}`);
    const board = await response.json();

    const boardDetails = document.getElementById('board-details');
    boardDetails.innerHTML = '';

    const boardElement = document.createElement('div');
    boardElement.className = 'board-card';
    boardElement.style.backgroundColor = board.HexaBackgroundCoor || '#ffffff';

    boardElement.innerHTML = `
      <h3>${board.Name}</h3>
      <p>${board.Description || 'Sem descrição'}</p>
    `;

    boardDetails.appendChild(boardElement);
  } catch (error) {
    console.error('Erro ao carregar o quadro:', error);
  }
}

async function loadBoards() {
  try {
    const response = await fetch(`${API_BASE_URL}/Boards`);
    const boards = await response.json();
    
    const boardsGrid = document.getElementById('boards-grid');
    boardsGrid.innerHTML = '';
    
    boards.forEach(board => {
      const boardElement = document.createElement('div');
      boardElement.className = 'board-card';
      boardElement.style.backgroundColor = board.HexaBackgroundCoor || '#ffffff';
      
      boardElement.innerHTML = `
        <h3>${board.Name}</h3>
        <p>${board.Description || 'Sem descrição'}</p>
      `;
      
      boardElement.addEventListener('click', () => {
        // Aqui você pode adicionar a navegação para a visualização detalhada do board
        console.log(`Board clicked: ${board.Id}`);
      });
      
      boardsGrid.appendChild(boardElement);
    });
  } catch (error) {
    console.error('Erro ao carregar boards:', error);
  }
}

// Adicionar listener para o botão de novo quadro
const addBoardButton = document.getElementById('add-board');
if (addBoardButton) {
  addBoardButton.addEventListener('click', async () => {
    const boardName = prompt('Digite o nome do novo quadro:');
    if (boardName) {
      try {
        const response = await fetch(`${API_BASE_URL}/Boards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Name: boardName })
        });

        if (!response.ok) {
          throw new Error('Erro ao criar o quadro');
        }

        const newBoard = await response.json();
        console.log('Novo quadro criado:', newBoard);
        await loadBoards(); // Recarregar os quadros após a criação
      } catch (error) {
        console.error('Erro ao criar o quadro:', error);
      }
    }
  });
}