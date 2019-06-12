const fs = require('fs');


const Parse = require('./ParseData');
const dados = require('./Dados');


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    let parse = new Parse();

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
        
    let conferenciasLattes = dados.retornaLattesEventos(jsonLattesObj);
    
    let conferenciasQualis = dados.retornaJsonObj("../Arquivos/qualis_eventos_cc_2016.json");

    dados.cruzaDadosEve(conferenciasLattes, conferenciasQualis, config.anoInicial, config.anoFinal, config.similaridade, 'conferencia');

    // this.verificaArquivosCriados();
}


Conferencia.prototype.verificaArquivosCriados = function() {

    if (fs.existsSync("./resultado_conferencias_encontradas.txt")) {
        console.log("Arquivo com conferências encontradas criado."); 
    }

    if (fs.existsSync("./resultado_conferencias_nao_encontradas.txt")) {
        console.log("Arquivo com conferências não encontradas criado."); 
    }
}
