const searchInput = document.getElementById('search-input');
const container = document.querySelector('.container');
const body = document.body;

// Definir a função displayWeatherData primeiro
function displayWeatherData(data) {
  let oldResults = document.querySelector('.weather-results');
  if (oldResults) {
    oldResults.remove();
  }

  const weatherResults = document.createElement('div');
  weatherResults.classList.add('weather-results');

  const weatherCard = document.createElement('div');
  weatherCard.classList.add('weather-card');

  const { formattedDate, formattedTime } = apiDateTime(data);

  weatherCard.innerHTML = `
    <h2>${data.location.name}, ${data.location.region}</h2>
    <p>Temperatura: ${data.current.temp_c}°C</p>
    <p>Clima: ${data.current.condition.text}</p>
    <p>Vento: ${data.current.wind_kph} km/h</p>
    <p>Humidade: ${data.current.humidity} %</p>
    <p>Data: ${formattedDate}</p>
    <p>Hora: ${formattedTime}</p>
  `;

  changeBackground(data.current.condition.text);

  weatherResults.appendChild(weatherCard);
  container.appendChild(weatherResults);
}

async function getData() {
  const city = searchInput.value.trim();
  if (!city) {
    alert('Por favor, digite uma cidade!');
    return;
  }

  const url = `/weather/${city}`; // Chama o backend

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro: Cidade não encontrada. Código: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    displayWeatherData(json); // Chama a função displayWeatherData
  } catch (error) {
    console.error(error.message);
    alert('Cidade não encontrada.');
  }

  searchInput.value = ''; // Limpa o input após a busca
}

// Função para formatar a data e hora
function apiDateTime(data) {
  let datetime = data.location.localtime;
  const [datePart, timePart] = datetime.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  const dateObject = new Date(year, month - 1, day, hours, minutes);

  const formattedDate = `${String(dateObject.getDate()).padStart(2, '0')}/${String(dateObject.getMonth() + 1).padStart(2, '0')}/${dateObject.getFullYear()}`;
  const formattedTime = `${String(dateObject.getHours()).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')}`;

  return { formattedDate, formattedTime };
}

function changeBackground(condition) {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sol") || conditionLower.includes("ensolarado") || conditionLower.includes('céu limpo')) {
    body.style.backgroundImage = "url('./assets/img/sol.jpg')";
    body.style.backgroundSize = "cover";
  } else if (conditionLower.includes("encoberto") || conditionLower.includes("possibilidade de chuva irregular") || conditionLower.includes('nublado')) {
    body.style.backgroundImage = "url('./assets/img/cloudy.jpg')";
    body.style.backgroundSize = "cover";
  } else if (conditionLower.includes("neblina")) {
    body.style.backgroundImage = "url('./assets/img/mist.jpg')";
    body.style.backgroundSize = "cover";
  } else if (conditionLower.includes("nevoeiro")) {
    body.style.backgroundImage = "url('./assets/img/snow.jpg')";
    body.style.backgroundSize = "cover";
  } else if (conditionLower.includes('chuva') || conditionLower.includes('chuvisco')) {
    body.style.backgroundImage = "url('./assets/img/rain.jpg')";
    body.style.backgroundSize = "cover";
  } else {
    body.style.backgroundImage = "none";
  }
}

// Event listener para o botão de busca
searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    getData();
  }
});
