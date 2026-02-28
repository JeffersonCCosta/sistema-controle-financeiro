console.log("Salvando API'S");

const BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://sistema-controle-financeiro-zrep.onrender.com";

window.API = {
    CATEGORIAS: `${BASE_URL}/api/categorias`,
    DESPESAS: `${BASE_URL}/api/despesas`,
    RECEITAS: `${BASE_URL}/api/receitas`
};