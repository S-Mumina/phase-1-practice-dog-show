document.addEventListener('DOMContentLoaded', () => {
  // Fetch the registered dogs from the API and render them in the table.
  const tableBody = document.getElementById('table-body');

  function renderDogTableRow(dog) {
    // function to render a table row for a dog.
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
    `;
    tableBody.appendChild(row);
  }

  function fetchAndRenderDogs() {
    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(dogs => {
        dogs.forEach(dog => {
          renderDogTableRow(dog);
        });
      })
      .catch(error => console.error('Error fetching dogs:', error));
  }

  fetchAndRenderDogs();

  // Edit Dog functionality.
  const dogForm = document.getElementById('dog-form');

  function populateFormWithDogInfo(dog) {
    dogForm.elements.name.value = dog.name;
    dogForm.elements.breed.value = dog.breed;
    dogForm.elements.sex.value = dog.sex;
    dogForm.dataset.id = dog.id;
  }

  function handleEditButtonClick(event) {
    event.preventDefault();
    const dogId = event.target.dataset.id;
    fetch(`http://localhost:3000/dogs/${dogId}`)
      .then(response => response.json())
      .then(dog => {
        populateFormWithDogInfo(dog);
      })
      .catch(error => console.error('Error fetching dog for editing:', error));
  }

  // Add event listener for each edit button
  tableBody.addEventListener('click', event => {
    if (event.target.classList.contains('edit-btn')) {
      handleEditButtonClick(event);
    }
  });

  // Submit Form functionality 
  dogForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(dogForm);
    const dogId = dogForm.dataset.id; 
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        breed: formData.get('breed'),
        sex: formData.get('sex'),
      })
    })
      .then(response => response.json())
      .then(updatedDog => {
      
        tableBody.innerHTML = ''; // Clear the table.
        fetchAndRenderDogs();
      })
      .catch(error => console.error('Error updating dog information:', error));
  });
});
