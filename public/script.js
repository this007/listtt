document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('problemForm');
    const input = document.getElementById('problemInput');
    const linkInput = document.getElementById('problemLinkInput');
    const tableBody = document.querySelector('#problemList tbody');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchDate = document.getElementById('searchDate');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');
    const searchStatus = document.getElementById('searchStatus');
    
    function toggleInstructions() {
        var instructions = document.getElementById("instructions");
        if (instructions.style.display === "none") {
            instructions.style.display = "block";
        } else {
            instructions.style.display = "none";
        }
    }
    
    var displayContainer = document.getElementById("container-display");
    displayContainer.addEventListener("click", toggleInstructions);

    searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const keyword = searchInput.value.toLowerCase().trim();
    const date = searchDate.value;
    const status = searchStatus.value;

    tableBody.innerHTML = '';
    for (const date in problems) {
        const dateHeader = document.createElement('tr');
        dateHeader.classList.add('date-row');
        dateHeader.dataset.date = date;
        dateHeader.innerHTML = `<td colspan="4">${date}</td>`;
        tableBody.appendChild(dateHeader);

        problems[date].forEach(function(item) {
            const problem = item.problem.toLowerCase();

            // Check if the problem text contains the keyword (if provided),
            // matches the date (if provided), and matches the status (if provided)
            if ((keyword === '' || problem.includes(keyword)) &&
                (date === '' || date === date) &&
                (status === '' || status === item.status)) {
                const listItem = document.createElement('tr');
                listItem.classList.add('problem-row');
                listItem.dataset.number = item.number;
                listItem.innerHTML = `
                    <td>${item.number}</td>
                    <td>${item.problem}</td>
                    <td>
                        <select class="status-select">
                            <option value="solved" ${item.status === 'solved' ? 'selected' : ''}>Solved</option>
                            <option value="attempted" ${item.status === 'attempted' ? 'selected' : ''}>Attempted</option>
                            <option value="todo" ${item.status === 'todo' ? 'selected' : ''}>To-Do</option>
                        </select>
                    </td>
                    <td><a href="${item.problemLink}" target="_blank">${item.problemLink}</a></td>
                `;
                tableBody.appendChild(listItem);
            }
        });
    }

    // Update problem counts
    updateProblemCounts();
});

    
    const clearButton = document.getElementById('clearButton');
    
    clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        searchInput.value = '';
        searchDate.value = '';
        searchStatus.value = '';
        renderProblems();
    });    

function updateCategoryCounts(problems) {
    const solvedCount = document.getElementById('solvedCount');
    const attemptedCount = document.getElementById('attemptedCount');
    const todoCount = document.getElementById('todoCount');

    let solved = 0;
    let attempted = 0;
    let todo = 0;

    for (const date in problems) {
        problems[date].forEach(function(item) {
            const problemStatus = item.status.toLowerCase();

            if (problemStatus === 'solved') {
                solved++;
            } else if (problemStatus === 'attempted') {
                attempted++;
            } else if (problemStatus === 'todo') {
                todo++;
            }
        });
    }

    solvedCount.innerText = `Solved: ${solved}`;
    attemptedCount.innerText = `Attempted: ${attempted}`;
    todoCount.innerText = `To-Do: ${todo}`;
}

function updateTotalCount(problems) {
    const totalProblems = document.getElementById('totalProblems');
    let totalCount = 0;

    for (const date in problems) {
        totalCount += problems[date].length;
    }

    totalProblems.innerText = `Total Problems: ${totalCount}`;
}

    let problems = {};
    let problemNumber = 1;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
    
        const number = problemNumber++;
        const problem = input.value;
        const problemLink = linkInput.value;
        const status = problemStatusSelect.value;
    
        if (problem) {
            const date = new Date().toLocaleDateString();
            if (!problems[date]) {
                problems[date] = [];
            }
            problems[date].push({ number, problem, problemLink, status });
    
            input.value = '';
            linkInput.value = '';
    
            // Send the problem data to the server
            const formData = new FormData();
            formData.append('number', number);
            formData.append('problem', problem);
            formData.append('problemLink', problemLink);
            formData.append('status', status);
    
            fetch('/list', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                renderProblems();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
    

    function renderProblems(filteredProblems = null) {
        tableBody.innerHTML = '';
    
        const problemsToRender = filteredProblems || problems;
    
        for (const date in problemsToRender) {
            if (Array.isArray(problemsToRender[date])) {
                const dateHeader = document.createElement('tr');
                dateHeader.classList.add('date-header');
                dateHeader.innerHTML = `<td colspan="4">${date}</td>`;
                tableBody.appendChild(dateHeader);
    
                problemsToRender[date].forEach(function(item) {
                    const listItem = document.createElement('tr');
                    const problemStatus = item.status.toLowerCase();
                    listItem.innerHTML = `
                        <td>${item.number}</td>
                        <td>${item.problem}</td>
                        <td>
                            <select class="status-select">
                                <option value="solved" ${problemStatus === 'solved' ? 'selected' : ''}>Solved</option>
                                <option value="attempted" ${problemStatus === 'attempted' ? 'selected' : ''}>Attempted</option>
                                <option value="todo" ${problemStatus === 'todo' ? 'selected' : ''}>To-Do</option>
                            </select>
                        </td>
                        <td><a href="${item.problemLink}" target="_blank">${item.problemLink}</a></td>
                    `;
                    tableBody.appendChild(listItem);
    
                    const statusSelect = listItem.querySelector('.status-select');
                    if (statusSelect) {
                        statusSelect.addEventListener('change', function() {
                            item.status = statusSelect.value;
                            updateCategoryCounts(problems);
                        });
                    }
                });
            }
        }
    
        updateCategoryCounts(problems);
        updateTotalCount(problems);
    }
    

    

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            // Handle login button click event
            window.location.href = '/login.html';
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            // Handle register button click event
            window.location.href = '/register.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Handle logout button click event
            window.location.href = '/login.html';
        });
    }
});
