document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/get-username')
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          document.getElementById('welcome-message').textContent = `Hello, ${data.username}!`;
        }
      });
  });