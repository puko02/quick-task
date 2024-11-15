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
    const response = await fetch('http://localhost:3001/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    alert(`Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to log in.');
  }
});
