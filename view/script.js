/* JS/script.js (MERGED - SINGLE PAGE APP) */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIG ---
    const API_URL = 'http://localhost:4000/api/cricketers';
    let currentEditingPlayerId = null; // Stores ID for the 'Edit Player' button

    // --- MAIN VIEW ELEMENTS ---
    const adminView = document.getElementById('admin-view');
    const profileView = document.getElementById('profile-view');

    // --- ADMIN VIEW ELEMENTS ---
    const adminForm = document.getElementById('player-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const playerIdInput = document.getElementById('player-id');
    const playerListBody = document.getElementById('player-list-body');
    const adminClearBtn = document.getElementById('clear-btn');
    const adminSearchInput = document.getElementById('admin-search-input');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    const adminClearSearchBtn = document.getElementById('admin-clear-search-btn');

    // --- PROFILE VIEW ELEMENTS ---
    const profileSearchForm = document.getElementById('profile-search-form');
    const profileSearchInput = document.getElementById('profile-search-input');
    const backToAdminBtn = document.getElementById('back-to-admin-btn');
    const profileEditBtn = document.getElementById('profile-edit-btn');
    const messageArea = document.getElementById('message-area');
    const messageText = document.getElementById('message-text');
    const playerContent = document.getElementById('player-content');
    const playerNameEl = document.getElementById('player-name');
    const playerImageEl = document.getElementById('player-image');
    const playerDobEl = document.getElementById('player-dob');
    const playerMatchesEl = document.getElementById('player-matches');
    const playerRunsEl = document.getElementById('player-runs');
    const playerAverageEl = document.getElementById('player-average');
    const playerCenturiesEl = document.getElementById('player-centuries');
    const playerFiftiesEl = document.getElementById('player-fifties');
    const playerWicketsEl = document.getElementById('player-wickets');
    const playerBirthplaceEl = document.getElementById('player-birthplace');
    const playerCareerEl = document.getElementById('player-career');

    // --- NAVIGATION FUNCTIONS ---

    function showAdminView() {
        profileView.style.display = 'none';
        adminView.style.display = 'block';
        // Check if we need to pre-fill the form
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit_id');
        if (editId) {
            fetchPlayerForEdit(editId);
            // Clear the URL parameter so it doesn't persist
            window.history.pushState({}, '', window.location.pathname);
        }
    }

    function showProfileView(id) {
        if (!id) {
            displayProfileMessage('Player not found.');
        } else {
            adminView.style.display = 'none';
            profileView.style.display = 'block';
            fetchAndDisplayProfile(id); // Load this player's data
        }
    }

    // --- ADMIN VIEW FUNCTIONS ---

    async function fetchAndRenderPlayers(searchQuery = '') {
        try {
            let url = API_URL;
            if (searchQuery) {
                url = `${API_URL}?name=${encodeURIComponent(searchQuery)}`;
                adminClearSearchBtn.style.display = 'block';
            } else {
                adminClearSearchBtn.style.display = 'none';
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const players = await response.json();
            playerListBody.innerHTML = ''; 

            if (players.length === 0) {
                const message = searchQuery ? `No players found matching "${searchQuery}".` : 'No players found. Add one above!';
                playerListBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
                return;
            }

            players.forEach(player => {
                const row = document.createElement('tr');
                
                // --- *** KEY CHANGE HERE *** ---
                // Updated buttons to use Bootstrap classes
                row.innerHTML = `
                    <td>
                        <a href="#" class="view-profile-link" data-id="${player.id}">
                            ${player.name}
                        </a>
                    </td>
                    <td>${player.matches}</td>
                    <td>${player.runs}</td>
                    <td>${player.wickets}</td>
                    <td class="actions-cell">
                        <button class="btn btn-sm btn-outline-primary" data-id="${player.id}" name="edit-btn">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${player.id}" name="delete-btn">Delete</button>
                    </td>
                `;
                // --- *** END OF KEY CHANGE *** ---
                
                playerListBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching players:', error);
            playerListBody.innerHTML = '<tr><td colspan="5">Error loading players.</td></tr>';
        }
    }

    async function fetchPlayerForEdit(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Player not found');
            const player = await response.json();
            adminForm.name.value = player.name;
            adminForm.date_of_birth.value = player.date_of_birth;
            adminForm.birthplace.value = player.birthplace;
            adminForm.photo_link.value = player.photo_link;
            adminForm.career.value = player.career;
            adminForm.matches.value = player.matches;
            adminForm.runs.value = player.runs;
            adminForm.average.value = player.average;
            adminForm.century.value = player.century;
            adminForm.fifties.value = player.fifties;
            adminForm.wickets.value = player.wickets;
            playerIdInput.value = player.id;
            formTitle.textContent = `Editing: ${player.name}`;
            submitBtn.textContent = 'Update Player';
            window.scrollTo(0, 0); 
        } catch (error) {
            console.error('Error fetching player for edit:', error);
            alert('Could not load player data for editing.');
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault(); 
        const formData = new FormData(adminForm);
        const data = Object.fromEntries(formData.entries());
        const playerId = data.id;
        for (const key in data) {
            if (data[key] === '') data[key] = null;
        }
        let url = API_URL;
        let method = 'POST';
        if (playerId) {
            url = `${API_URL}/${playerId}`;
            method = 'PUT';
        }
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'API request failed');
            }
            resetForm();
            await fetchAndRenderPlayers();
        } catch (error) {
            console.error('Error saving player:', error);
            alert(`Error: ${error.message}`);
        }
    }

    function handleListClick(event) {
        // Use .closest() to make sure we get the button if the user clicks an icon inside it
        const target = event.target.closest('button, a.view-profile-link');
        
        // If the click wasn't on a button or the link, ignore it
        if (!target) return; 

        const id = target.dataset.id;
        
        if (target.classList.contains('view-profile-link')) {
            event.preventDefault();
            showProfileView(id);
        }

        if (target.name === 'delete-btn') {
            if (confirm(`Are you sure you want to delete player with ID ${id}?`)) {
                deletePlayer(id);
            }
        }
        if (target.name === 'edit-btn') {
            fetchPlayerForEdit(id);
        }
    }

    async function deletePlayer(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete player');
            await fetchAndRenderPlayers();
        } catch (error) {
            console.error('Error deleting player:', error);
            alert('Error deleting player.');
        }
    }
    
    function resetForm() {
        adminForm.reset();
        playerIdInput.value = '';
        formTitle.textContent = 'Add New Player';
        submitBtn.textContent = 'Save Player';
    }

    // --- PROFILE VIEW FUNCTIONS ---

    function displayProfileMessage(msg, loading = false) {
        messageText.textContent = msg;
        // In Bootstrap, we can show/hide the spinner
        const spinner = messageArea.querySelector('.spinner-border');
        if (spinner) {
            spinner.style.display = loading ? 'inline-block' : 'none';
        }
        
        playerContent.style.display = 'none';
        messageArea.style.display = 'block';
    }

    function displayProfileData(player) {
        playerNameEl.textContent = player.name;
        playerImageEl.src = player.photo_link || 'https://via.placeholder.com/150';
        playerDobEl.textContent = formatPlayerDob(player.date_of_birth);
        playerMatchesEl.textContent = player.matches || 0;
        playerRunsEl.textContent = player.runs || 0;
        playerAverageEl.textContent = player.average || 0;
        playerCenturiesEl.textContent = player.century || 0;
        playerFiftiesEl.textContent = player.fifties || 0;
        playerWicketsEl.textContent = player.wickets || 0;
        playerBirthplaceEl.textContent = player.birthplace || 'N/A';
        playerCareerEl.textContent = player.career || 'No career information available.';
        
        currentEditingPlayerId = player.id;
        
        messageArea.style.display = 'none';
        playerContent.style.display = 'block';
    }

    async function fetchAndDisplayProfile(id) {
        displayProfileMessage('Loading player data...', true);
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Player not found');
            const player = await response.json();
            displayProfileData(player);
        } catch (error) {
            console.error('Error fetching profile:', error);
            displayProfileMessage(`Error: ${error.message}`, false);
        }
    }
    
    async function searchProfileByName(name) {
        if (!name) return;
        displayProfileMessage(`Searching for "${name}"...`, true);
        try {
            const response = await fetch(`${API_URL}?name=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error('Search request failed');
            const players = await response.json();
            if (players.length > 0) {
                displayProfileData(players[0]); // Show the first match
            } else {
                displayProfileMessage(`No player found matching "${name}".`, false);
            }
        } catch (error) {
            console.error('Error searching profile:', error);
            displayProfileMessage(`Error: ${error.message}`, false);
        }
    }

    function formatPlayerDob(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const dateOptions = { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' };
            const formattedDate = date.toLocaleDateString('en-US', dateOptions);
            const today = new Date();
            let age = today.getFullYear() - date.getUTCFullYear();
            const monthDiff = today.getUTCMonth() - date.getUTCMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < date.getUTCDate())) {
                age--;
            }
            return `${formattedDate} (${age} years)`;
        } catch (error) { return dateString; }
    }

    // --- EVENT LISTENERS ---

    // Admin View Listeners
    adminForm.addEventListener('submit', handleFormSubmit);
    adminClearBtn.addEventListener('click', (e) => { e.preventDefault(); resetForm(); });
    playerListBody.addEventListener('click', handleListClick);
    adminSearchBtn.addEventListener('click', () => {
        fetchAndRenderPlayers(adminSearchInput.value.trim());
    });
  adminSearchBtn.addEventListener('click', () => {
        const query = adminSearchInput.value.trim();

        if (!query) {
            // Optional: Show an alert if the search is empty
            alert("Please enter a name to search.");
            return;
        }

        // --- ADD THIS LINE ---
        // Manually show the clear button since we are no longer calling fetchAndRenderPlayers
        adminClearSearchBtn.style.display = 'block'; 
        // --- END OF ADDITION ---

        // 1. Hide the admin view
        adminView.style.display = 'none';
        // 2. Show the profile view
        profileView.style.display = 'block';

        // 3. (Optional) Set the profile search bar's value to match
        profileSearchInput.value = query;

        // 4. Call the function that searches and displays a profile
        searchProfileByName(query);
    });

    // Profile View Listeners
    profileSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchProfileByName(profileSearchInput.value.trim());
    });
    
    backToAdminBtn.addEventListener('click', showAdminView);
    
    profileEditBtn.addEventListener('click', () => {
        if (currentEditingPlayerId) {
            window.history.pushState({}, '', `?edit_id=${currentEditingPlayerId}`);
            showAdminView(); 
        } else {
            alert("No player loaded to edit.");
        }
    });

    // --- INITIALIZATION ---
    showAdminView(); 
    fetchAndRenderPlayers();
});