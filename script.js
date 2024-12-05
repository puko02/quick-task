import { API_BASE_URL } from '/apiconfig.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Toggle Theme
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

  await loadBoards();

  async function handleLogin() {
    const email = document.getElementById('email').value;

    if (!email) {
      alert('Por favor, insira um email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/People`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const people = await response.json();
      
      const userExists = people.some(person => person.Email.toLowerCase() === email.toLowerCase());

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
  addBoardButton.addEventListener('click', () => {
    // Aqui você pode adicionar a lógica para criar um novo board
    console.log('Novo quadro clicked');
  });
}