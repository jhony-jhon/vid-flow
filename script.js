import axios from "axios";

const containerVideos = document.querySelector(".videos__container");
const cacheVideos = new Map(); // Cache para armazenar os vídeos

async function buscarEMostrarVideos() {
  const urlVideos = import.meta.env.VITE_URL_VIDEOS;

  console.log(import.meta.env.PROD);
  console.log(urlVideos);

  if (cacheVideos.has(urlVideos)) {
    // Use o cache se os vídeos já foram carregados
    renderizarVideos(cacheVideos.get(urlVideos));
    return;
  }

  try {
    const videos = await fazerRequisicaoComRetry(urlVideos);
    cacheVideos.set(urlVideos, videos); // Armazena no cache
    renderizarVideos(videos);
  } catch (error) {
    containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error}</p>`;
  }
}

async function fazerRequisicaoComRetry(url, retries = 3, delay = 1000) {
  for (let tentativa = 0; tentativa < retries; tentativa++) {
    try {
      const busca = await axios.get(url);
      return busca.data;
    } catch (error) {
      if (error.response?.status === 429 && tentativa < retries - 1) {
        console.warn(`Erro 429: Tentando novamente em ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

function renderizarVideos(videos) {
  videos.forEach((video) => {
    if (video.categoria == "") {
      throw new Error("Vídeo não tem categoria");
    }
    containerVideos.innerHTML += `
      <li class="videos__item">
          <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
          <div class="descricao-video">
              <img class="img-canal" src="${video.imagem}" alt="Logo do Canal">
              <h3 class="titulo-video">${video.titulo}</h3>
              <p class="titulo-canal">${video.descricao}</p>
              <p class="categoria" hidden>${video.categoria}</p>
          </div>
      </li>
    `;
  });
}

buscarEMostrarVideos();

const barraDePesquisa = document.querySelector(".pesquisar__input");

barraDePesquisa.addEventListener("input", filtrarPesquisa);

function filtrarPesquisa() {
  const videos = document.querySelectorAll(".videos__item");

  if (barraDePesquisa.value != "") {
    for (let video of videos) {
      let titulo = video
        .querySelector(".titulo-video")
        .textContent.toLowerCase();
      let valorFiltro = barraDePesquisa.value.toLowerCase();

      if (!titulo.includes(valorFiltro)) {
        video.style.display = "none";
      } else {
        video.style.display = "block";
      }
    }
  } else {
    for (let video of videos) {
      video.style.display = "block";
    }
  }
}

const botaoCategoria = document.querySelectorAll(".superior__item");

botaoCategoria.forEach((botao) => {
  let nomeCategoria = botao.getAttribute("name");
  botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
});

function filtrarPorCategoria(filtro) {
  const videos = document.querySelectorAll(".videos__item");
  for (let video of videos) {
    let categoria = video.querySelector(".categoria").textContent.toLowerCase();
    let valorFiltro = filtro.toLowerCase();

    if (!categoria.includes(valorFiltro) && valorFiltro != "tudo") {
      video.style.display = "none";
    } else {
      video.style.display = "block";
    }
  }
}
