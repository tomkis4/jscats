// cats.js

const apiKey = 'live_Kg8HqvTiYpHdztHFk3w6RiVaptksun4cHmjtX90wKZ6qVKz1ZZ47wNizOntIlACC';
const catImagesContainer = document.getElementById('catImages');

// Funkcja do pobierania obrazów kotów
const getCatImages = async () => {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': apiKey,
            },
        });

        const data = await response.json();
        const imageUrl = data[0].url;

        // Dodawanie obrazu do kontenera z ustalonymi wymiarami
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.width = 600; // Powiększenie obrazu dwukrotnie
        imgElement.height = 400; // Powiększenie obrazu dwukrotnie
        imgElement.style.objectFit = 'cover'; // Zapewnia, że obrazy są proporcjonalne

        // Dodanie klasy do kontenera obrazu
        const catImageContainer = document.createElement('div');
        catImageContainer.className = 'cat-image';
        catImageContainer.appendChild(imgElement);

        // Dodanie kontenera obrazu do głównego kontenera na obrazy
        catImagesContainer.innerHTML = ''; // Czyszczenie kontenera przed dodaniem nowego obrazu
        catImagesContainer.appendChild(catImageContainer);

        // Dodanie przycisku do wyświetlania następnego kotka
        const nextCatButton = document.createElement('button');
        nextCatButton.innerText = 'Następny Kotek';
        nextCatButton.className = 'next-cat-button'; // Dodanie klasy do przycisku
        nextCatButton.addEventListener('click', getCatImages);

        // Dodanie przycisku pod obrazem
        catImagesContainer.appendChild(nextCatButton);

    } catch (error) {
        console.error('Błąd podczas pobierania obrazu kota:', error);
    }
};

// Wywołanie funkcji przy ładowaniu strony
document.addEventListener('DOMContentLoaded', getCatImages);

// Dodanie obsługi kliknięcia przycisku "Wyloguj"
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        // Przekierowanie na stronę główną
        window.location.href = '/';
    });
}





