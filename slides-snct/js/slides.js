const slides = Array.from(document.querySelectorAll('.slide'));
const indicador = document.getElementById('indicadorTela');
const barra = document.getElementById('barraProgresso');
const preenchido = document.getElementById('progressoPreenchido');
const cronTempo = document.getElementById('cronometroTempo');
let indiceAtual = 0;

/* ===== Cronômetro da oficina =====
   Um relógio só: conta o tempo decorrido desde que a página foi aberta (00:00 em diante)
   e não reinicia ao trocar de tela. Para zerar, recarregue a página (F5). */
const inicioOficina = Date.now();

function formatarTempo(ms) {
    const segundos = Math.floor(ms / 1000);
    const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
    const ss = String(segundos % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}

function atualizarCronometro() {
    cronTempo.textContent = formatarTempo(Date.now() - inicioOficina);
}

setInterval(atualizarCronometro, 250);
atualizarCronometro();

/* ===== Navegação entre telas ===== */
function irPara(novoIndice) {
    const limite = Math.max(0, Math.min(slides.length - 1, novoIndice));

    slides[indiceAtual].classList.remove('ativo');
    indiceAtual = limite;
    slides[indiceAtual].classList.add('ativo');
    slides[indiceAtual].scrollTop = 0;

    indicador.textContent = `Tela ${indiceAtual + 1} / ${slides.length}`;
    const porcentagem = ((indiceAtual + 1) / slides.length) * 100;
    preenchido.style.width = `${porcentagem}%`;
    barra.setAttribute('aria-valuenow', String(indiceAtual + 1));
}

function mudarSlide(delta) {
    irPara(indiceAtual + delta);
}

function alternarTelaCheia() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch(() => {});
    }
}

/* Teclado */
document.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    const emBotao = ev.target.tagName === 'BUTTON';

    switch (ev.key) {
        case 'ArrowRight':
        case 'PageDown':
            ev.preventDefault();
            mudarSlide(1);
            break;
        case ' ':
            if (emBotao) return; // deixa o botão focado fazer o próprio clique
            ev.preventDefault();
            mudarSlide(1);
            break;
        case 'ArrowLeft':
        case 'PageUp':
            ev.preventDefault();
            mudarSlide(-1);
            break;
        case 'Home':
            ev.preventDefault();
            irPara(0);
            break;
        case 'End':
            ev.preventDefault();
            irPara(slides.length - 1);
            break;
        case 'f':
        case 'F':
            alternarTelaCheia();
            break;
    }
});

/* Clique no telão avança (ignora links, botões e seleção de texto) */
document.getElementById('telas').addEventListener('click', (ev) => {
    if (ev.target.closest('a, button')) return;
    if (window.getSelection().toString() !== '') return;
    mudarSlide(1);
});

/* Prints e QR Codes: se a imagem não existir, mostra um espaço reservado com o nome do arquivo */
document.querySelectorAll('img.print-tela').forEach((img) => {
    const trocarPorPlaceholder = () => {
        const caixa = document.createElement('div');
        caixa.className = 'print-placeholder';
        const rotulo = img.dataset.rotulo || 'o print';
        caixa.textContent = `Coloque aqui ${rotulo}: ${img.getAttribute('src')}`;
        img.replaceWith(caixa);
    };
    img.addEventListener('error', trocarPorPlaceholder);
    if (img.complete && img.naturalWidth === 0) trocarPorPlaceholder();
});

irPara(0);
