interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
  }
  
  (function () {
    const $ = (query: string): HTMLInputElement | null =>
      document.querySelector(query);
  
    function calcTempo(mil: number): string {
      const min = Math.floor(mil / 60000);
      const sec = Math.floor((mil % 60000) / 1000);
  
      return `${min} min e ${sec} s`;
    }
  
    function patio() {
      function ler(): Veiculo[] {
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
      }
  
      function salvar(veiculos: Veiculo[]) {
        localStorage.setItem("patio", JSON.stringify(veiculos));
      }
  
      function adicionar(veiculo: Veiculo) {
        const veiculos = ler();
        if (veiculos.findIndex((v) => v.placa === veiculo.placa) === -1) {
          salvar([...ler(), veiculo]);
          adicionarHTML(veiculo);
        }
      }
  
      function adicionarHTML(veiculo: Veiculo) {
        const row = document.createElement("tr");
  
        row.innerHTML = `
              <td>${veiculo.nome}</td>
              <td>${veiculo.placa}</td>
              <td>${veiculo.entrada}</td>
              <td>
                  <button class="delete btn btn-danger" data-placa="${veiculo.placa}"> Encerrar <i class="bi bi-alarm"></i> </button>
              </td>
          `;
  
        row.querySelector(".delete")?.addEventListener("click", function () {
          remover(this.dataset.placa);
        });
  
        $("#patio")?.appendChild(row);
      }
  
      function remover(placa: string) {
        const { entrada, nome } = ler().find(
          (veiculo) => veiculo.placa === placa
        );
  
        const tempo = calcTempo(
          new Date().getTime() - new Date(entrada).getTime()
        );
  
        if (
          !confirm(
            `O veículo de ${nome} permaneceu por ${tempo}. Deseja encerrar?`
          )
        )
          return;
  
        salvar(ler().filter((veiculo) => veiculo.placa !== placa));
        renderizar();
      }
  
      function renderizar() {
        $("#patio")!.innerHTML = "";
        const patio = ler();
  
        if (patio.length) {
          patio.forEach((veiculo) => adicionarHTML(veiculo));
        }
      }
  
      return { ler, adicionar, remover, salvar, renderizar };
    }
  
    patio().renderizar();
  
    $("#cadastrar")?.addEventListener("click", () => {
      const nome = $("#nome")?.value;
      const placa = $("#placa")?.value;
  
      if (!nome || !placa) {
        alert("Os campos nome e placa são obrigatórios");
        return;
      }
  
      patio().adicionar({ nome, placa, entrada: new Date().toISOString() });
    });
  })();
  