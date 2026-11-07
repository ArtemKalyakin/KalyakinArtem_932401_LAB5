var playerName = prompt("Как тебя зовут, геймер?");
alert("Привет, " + playerName + "! Добро пожаловать в статистику игрового времени.");
console.log("Имя пользователя:", playerName);

var gameHours = [12, 2, 8, 15, 3, 1, 6];
console.log("Время по играм за неделю (часы):", gameHours);

function findMax(arr) {
    var max = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function filterGames(arr, threshold) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > threshold) {
            result.push(arr[i]);
        }
    }
    return result;
}

function sumArray(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

var maxHours = findMax(gameHours);
var popularGames = filterGames(gameHours, 10);
var popularHours = sumArray(popularGames);
var totalHours = sumArray(gameHours);

var lightCount = 0;
for (var i = 0; i < gameHours.length; i++) {
    if (gameHours[i] <= 3) {
        lightCount++;
    }
}

var lightShare = (lightCount / gameHours.length) * 100;

alert("Вы провели " + totalHours + " часов в играх, из них " + popularHours + " часов – в самых популярных.");

console.log("Максимум часов в одной игре:", maxHours);
console.log("Игры с временем > 10 часов:", popularGames);
console.log("Количество «лёгких» игр (≤ 3 часов):", lightCount);
console.log("Доля коротких игровых сессий:", lightShare.toFixed(1) + "%");

if (totalHours > 25) {
    console.log("Возможно, стоит сбалансировать время между играми и учёбой");
}

document.addEventListener('DOMContentLoaded', function () {
    var toggleThemeBtn = document.getElementById('toggleThemeBtn');
    var toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');
    var addGameBtn = document.getElementById('addGameBtn');
    var removeLastGameBtn = document.getElementById('removeLastGameBtn');
    var gamesList = document.getElementById('games-list');
    var projectsList = document.getElementById('projects-list');

    var gamesSectionTitle = document.querySelector('#games h2');
    if (gamesSectionTitle) {
        gamesSectionTitle.setAttribute('title', 'Список любимых игр с рейтингом');
    }

    var projectsItems = document.querySelectorAll('#projects-list .card');
    projectsItems.forEach(function (item, index) {
        item.setAttribute('data-project-index', index);
    });

    var games = [];

    function saveState() {
        try {
            localStorage.setItem('games', JSON.stringify(games));
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            if (projectsList) {
                localStorage.setItem('projectsVisibility', projectsList.classList.contains('hidden') ? 'hidden' : 'visible');
            }
        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }
    }

    function loadState() {
        try {
            var savedGames = localStorage.getItem('games');
            var savedTheme = localStorage.getItem('theme');
            var savedVisibility = localStorage.getItem('projectsVisibility');

            if (savedGames) {
                games = JSON.parse(savedGames);
                if (!Array.isArray(games)) {
                    games = [];
                }
            }

            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
            }

            if (savedVisibility === 'hidden' && projectsList) {
                projectsList.classList.add('hidden');
            }
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            games = [];
        }
    }

    function renderGames() {
        if (!gamesList) {
            console.error('Элемент #games-list не найден');
            return;
        }

        gamesList.innerHTML = '';

        games.forEach(function (game, index) {
            var card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-game-index', index);
            card.dataset.title = game.title || '';
            card.dataset.genre = game.genre || '';

            var title = document.createElement('div');
            title.className = 'game-title';
            title.textContent = game.title || 'Без названия';
            title.setAttribute('title', 'Название игры: ' + (game.title || 'не указано'));

            var genre = document.createElement('div');
            genre.className = 'game-genre';
            genre.textContent = 'Жанр: ' + (game.genre || 'Не указан');
            genre.setAttribute('title', 'Жанр: ' + (game.genre || 'не указан'));

            var rating = document.createElement('div');
            rating.className = 'game-rating';
            var ratingNum = parseInt(game.rating, 10) || 1;
            rating.textContent = 'Рейтинг: ' + '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
            rating.setAttribute('data-rating', ratingNum);

            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-game-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Удалить';
            deleteBtn.setAttribute('aria-label', 'Удалить игру ' + (game.title || ''));
            deleteBtn.addEventListener('click', function () {
                games.splice(index, 1);
                renderGames();
                saveState();
            });

            card.appendChild(title);
            card.appendChild(genre);
            card.appendChild(rating);
            card.appendChild(deleteBtn);
            gamesList.appendChild(card);
        });
    }

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', function () {
            document.body.classList.toggle('light-theme');
            saveState();
        });
    }

    if (toggleVisibilityBtn && projectsList) {
        toggleVisibilityBtn.addEventListener('click', function () {
            projectsList.classList.toggle('hidden');
            saveState();
        });
    }

    if (addGameBtn) {
        addGameBtn.addEventListener('click', function () {
            var title = prompt('Введите название игры:');
            if (title === null) {
                return;
            }
            title = title.trim();
            if (title === '') {
                alert('Название не может быть пустым!');
                return;
            }

            var genre = prompt('Введите жанр игры:');
            if (genre === null) {
                return;
            }
            genre = genre.trim();
            if (genre === '') {
                alert('Жанр не может быть пустым!');
                return;
            }

            var ratingStr = prompt('Введите рейтинг от 1 до 5:');
            if (ratingStr === null) {
                return;
            }
            var rating = parseInt(ratingStr, 10);
            if (isNaN(rating) || rating < 1 || rating > 5) {
                alert('Рейтинг должен быть числом от 1 до 5!');
                return;
            }

            games.push({ title: title, genre: genre, rating: rating });
            renderGames();
            saveState();
        });
    }

    if (removeLastGameBtn) {
        removeLastGameBtn.addEventListener('click', function () {
            if (games.length === 0) {
                alert('Список игр пуст!');
                return;
            }
            games.pop();
            renderGames();
            saveState();
        });
    }

    loadState();
    renderGames();
});
