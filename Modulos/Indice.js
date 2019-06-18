module.exports = {
    CalculoIndice: CalculoIndice
}


function CalculoIndice(config, callback) {

    new Indice(config, callback);
}


function Indice(config, callback) {

    const Parse = require('./ParseData');
    const dados = require('./Dados');
    const publicacoes = require('./Publicacoes');
    const conferencias = require('./Conferencias');

    let parse = new Parse();
    
    let anoAtual = new Date().getFullYear();
    let anoInicial = anoAtual - 4;    

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);

    dados.retornaDadosPesquisador(jsonLattesObj, 'Cálculo do Índice PPG-CCOMP');

    let lattesArtigos = dados.retornaLattesArtigos(jsonLattesObj);
    
    let qualisPeriodicos = dados.retornaJsonObj("../Arquivos/qualis_periodicos_interdisciplinar_2016.json");

    let categorias = publicacoes.cruzaDadosArt(lattesArtigos, qualisPeriodicos, anoInicial, anoAtual, 'indice');    

    let indiceArtigos = calculaIndiceArtigos(categorias);

    let lattesEventos = dados.retornaLattesEventos(jsonLattesObj);    

    let qualisEventos = dados.retornaJsonObj("../Arquivos/qualis_eventos_cc_2016.json");

    let qualis = conferencias.cruzaDadosEve(lattesEventos, qualisEventos.conferencias, anoInicial, anoAtual, config.similaridade, 'indice');    

    let indiceEventos = calculaIndiceEventos(qualis);        

    let indiceFinal = indiceArtigos + indiceEventos;

    console.log('Índice PPG-CCOMP: ' + indiceFinal + "\n");
}


function calculaIndiceArtigos(categorias) {

    var counts = {};

    for ( var i in categorias ) {

        var conceito = categorias[i];
        counts[conceito] = counts[conceito] ? counts[conceito] + 1 : 1;
    } 
    
    var A1 = counts['A1'] ? counts['A1'] * 1.0 : 0;
    var A2 = counts['A2'] ? counts['A2'] * 0.85 : 0;
    var B1 = counts['B1'] ? counts['B1'] * 0.7 : 0;
    var B2 = counts['B2'] ? counts['B2'] * 0.55 : 0;
    var B3 = counts['B3'] ? counts['B3'] * 0.4 : 0;
    var B4 = counts['B4'] ? counts['B4'] * 0.25 : 0;
    var B5 = counts['B5'] ? counts['B5'] * 0.1 : 0;

    var indArt = ( A1 + A2 + B1 + B2 + B3 + B4 + B5 ) / 4;

    // console.log('Result A1: ' + A1);   
    // console.log('Result A2: ' + A2);  
    // console.log('Result B1: ' + B1);  
    // console.log('Result B2: ' + B2);  
    // console.log('Result B3: ' + B3);  
    // console.log('Result B4: ' + B4);  
    // console.log('Result B5: ' + B5);  

    // console.log('Quant. A1: ' + counts['A1']);
    // console.log('Quant. A2: ' + counts['A2']);
    // console.log('Quant. B1: ' + counts['B1']);
    // console.log('Quant. B2: ' + counts['B2']);
    // console.log('Quant. B3: ' + counts['B3']);
    // console.log('Quant. B4: ' + counts['B4']);
    // console.log('Quant. B5: ' + counts['B5']);    

    return indArt;
}


function calculaIndiceEventos(qualis) {

    var counts = {};

    for ( var i in qualis ) {

        var conceito = qualis[i];
        counts[conceito] = counts[conceito] ? counts[conceito] + 1 : 1;
    } 
    
    var A1 = counts['A1'] ? counts['A1'] * 1.0 : 0;
    var A2 = counts['A2'] ? counts['A2'] * 0.85 : 0;
    var B1 = counts['B1'] ? counts['B1'] * 0.7 : 0;
    var B2 = counts['B2'] ? counts['B2'] * 0.55 : 0;
    var B3 = counts['B3'] ? counts['B3'] * 0.4 : 0;
    var B4 = counts['B4'] ? counts['B4'] * 0.25 : 0;
    var B5 = counts['B5'] ? counts['B5'] * 0.1 : 0;

    var indEve = ( (A1 + A2 + B1 + B2 + B3 + B4 + B5) * 0.8 ) / 4;

    return indEve;
}
