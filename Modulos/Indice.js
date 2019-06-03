const path = require('path');
const fs = require('fs');

const Parse = require('./ParseData');
const Dados = require('./Dados');


exports = module.exports.CalculoIndice = CalculoIndice


function CalculoIndice(config, callback) {

    new Indice(config, callback);
}


function Indice(config, callback) {

    let parse = new Parse();
    let dados = new Dados();

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);

    let lattesArtigos = dados.retornaLattesArtigos(jsonLattesObj);
    
    let qualisPeriodicos = dados.retornaJsonObj("../Arquivos/qualis_periodicos_interdisciplinar_2016.json");

    let artigosComQualis = cruzaDados(lattesArtigos, qualisPeriodicos);    

    let categorias = filtraArtigosPorAno(artigosComQualis);

    let indiceArtigos = calculaIndiceArtigos(categorias);

    console.log(indiceArtigos);

    let lattesEventos = dados.retornaLattesEventos(jsonLattesObj);    
}


function cruzaDados(dadosLattes, dadosQualis) {

    let artigos = []; 

    for (var i in dadosLattes) {
            
        let artigo = {}, periodico = {};

        artigo.titulo = dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["TITULO-DO-ARTIGO"];
        artigo.ano = dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["ANO-DO-ARTIGO"];
        artigo.issn = dadosLattes[i]['DETALHAMENTO-DO-ARTIGO']["_attributes"]["ISSN"];

        for (var j in dadosQualis) {

            periodico.issn = dadosQualis[j]['ISSN'].trim();
            periodico.issn = periodico.issn.split('-').join('');
            periodico.conceito = dadosQualis[j]['Estrato'].trim();

            if (artigo.issn == periodico.issn) {

                artigo.conceito = periodico.conceito;
                
                artigos.push(artigo);
                break;
            }
        }
    }

    return artigos;
}


function filtraArtigosPorAno(artigos) {

    var anoAtual = new Date().getFullYear();
    var anoInicial = anoAtual - 4;    
    var categorias = [];    

    for (var i in artigos) {

        var anoArtigo = parseInt(artigos[i].ano);

        if (anoArtigo >= anoInicial && anoArtigo <= anoAtual) { 

            categorias.push(artigos[i].conceito);
        }
    }

    return categorias;
}


function calculaIndiceArtigos(categorias) {

    var counts = {};

    for (var i in categorias) {

        var conceito = categorias[i];
        counts[conceito] = counts[conceito] ? counts[conceito] + 1 : 1;
    } 
    
    var A1 = counts['A1'] ? counts['A1'] : 0;
    var A2 = counts['A2'] ? counts['A2'] * 0.85 : 0;
    var B1 = counts['B1'] ? counts['B1'] * 0.7 : 0;
    var B2 = counts['B2'] ? counts['B2'] * 0.55 : 0;
    var B3 = counts['B3'] ? counts['B3'] * 0.4 : 0;
    var B4 = counts['B4'] ? counts['B4'] * 0.25 : 0;
    var B5 = counts['B5'] ? counts['B5'] * 0.1 : 0;

    var indArt = (A1 + A2 + B1 + B2 + B3 + B4 + B5) / 4;

    return indArt;

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
}