document.addEventListener('DOMContentLoaded', () => {
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

  async function handleLogin() {
    const email = document.getElementById('email').value;

    if (!email) {
      alert('Por favor, insira um email');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/emails');
      const emails = await response.json();
      const emailExists = emails.some(e => e.email === email);

      if (emailExists) {
        window.location.href = 'trelofake.html';
        return;
      } else {
        const showError = document.getElementById('error');
        showError.innerHTML = "Email não encontrado, verifique seu gmail e tente novamente";
      }

      // Criação de um novo email - ATUALMENTE DESATIVADO
     /* const addResponse = await fetch('http://localhost:3001/emails', {
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
      } */
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to log in.');
    }
  }
} );