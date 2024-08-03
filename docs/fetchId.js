document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  
    function fetchUserId(callback) {
      const token = localStorage.getItem('token');
      console.log('Fetching user ID with token:', token);
  
      fetch('/getUserId', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Response not OK, redirecting to login');
          window.location.href = '/';
          throw new Error('Not logged in');
        }
      })
      .then(data => {
        if (data && data.userId) {
          console.log('Data received:', data);
          window.userId = data.userId; // Store userId globally
          callback();
        } else {
          throw new Error('Invalid response data');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        window.location.href = '/';
      });
    }
  
    // Define the callback function
    function onUserIdFetched() {
      console.log('User ID fetched successfully:', window.userId);
      // Now the user ID is stored in window.userId and can be accessed as a variable
    }
  
    // Fetch user ID when the page loads
    fetchUserId(onUserIdFetched);
  });
  