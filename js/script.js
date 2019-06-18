const dbNome = "dbBruna&Belle";
const db = JSON.parse(localStorage.getItem(dbNome)) || fakeDB;

function saveDb(db) {
  localStorage.setItem(dbNome, JSON.stringify(db));
}

function getDate(date) {
  const newDate = new Date(date);
  const pad = (n) => (n  < 10 ? `0${n}` : n)

  return [pad(newDate.getDate()), pad(newDate.getMonth()+1), newDate.getFullYear()].join('/');
}

function getDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function renderPosts() {
  $("#postagens").html("");

  $(db).each(function(index, { titulo, data, texto, imagem, curtidas, comentarios}) {
    $("#postagens").append(
      `<section class="post jumbotron" data-id="${index}">
        <h1 class="display-4 text-center">${titulo}</h1>
        <p><b>${getDate(data)}</b></p>
        <hr class="my-4" />
        <img src="${imagem}" class="img-fluid d-block mx-auto rounded" />
        <p class="text-justify m-4">
        ${texto}
        </p>
        <section class="d-flex justify-content-center">
        <button type="button" class="adicionarComentario btn btn-info mr-1">
            Adicionar comentário
        </button>
        <button type="button" class="curtir btn btn-success ml-1">Cutir <span class="badge badge-light">${curtidas}</span></button>
        </section>
        <hr />
        <section class="comentarios m-3">
        </section>
        <section class="m-3">
        <hr />
        <form class="comentarioFormulario" style="display: none">
            <div class="form-group">
            <label class="w-100">Nome: 
                <input type="texto" class="nomeDoComentador form-control" placeholder="xxx" />
            </label>
            </div>
            <div class="form-group">
            <label class="w-100">Comentário:
                <textarea class="textoDoComentario form-control" rows="3" placeholder="xxx"></textarea>
            </label>
            </div>
            <button type="submit" class="btn btn-primary d-block mx-auto col-6 col-sm-3 col-md-4">
            Enviar comentário
            </button>
        </form>
        </section>
    </section>
    `
    );
    $(comentarios).each(function(index, { nome, texto}) {     
      $(".comentarios").last().append(
        `
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">${nome}</h5>
            <p class="card-text">${texto}</p>
            </div>
        </div>
        `
      );
    })
  });

  loadEvents();
}

function loadEvents() {
  $(".curtir").on("click", function(event) {
    event.preventDefault();

    const index = $(this)
      .parents(".post")
      .data("id");

    db[index].curtidas++;
    saveDb(db);
    renderPosts();
  });

  $('.adicionarComentario').on('click', function() {   
    $(this).parents(".post").find('.comentarioFormulario').toggle();
  });

  $('.comentarioFormulario').on('submit', function(event) { 
    event.preventDefault();
    
    const index = $(this)
      .parents(".post")
      .data("id");

    db[index].comentarios.push({
      nome: $(event.target[0]).val(),
      texto: $(event.target[1]).val()
    });

    saveDb(db);
    renderPosts();
  });
}

$("#adicionarPostagem").on("submit", async function(event) {
  event.preventDefault();

  db.unshift({
    titulo: $("#tituloDaPostagem").val(),
    data: new Date(),
    curtidas: 0,
    texto: $("#textoDaPostagem").val(),
    imagem: await getDataURL($("#imagemDaPostagem").prop("files")[0]),
    comentarios: []
  });

  $("#adicionarPostagemModal").modal("hide");
  saveDb(db);
  renderPosts();
});

renderPosts();