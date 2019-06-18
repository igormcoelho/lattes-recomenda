const fs = require('fs');
const path = require('path');


module.exports = {


    retornaDadosPesquisador : function(jsonLattesObj, string) {

        let pesquisador = jsonLattesObj['CURRICULO-VITAE']['DADOS-GERAIS']['_attributes']['NOME-COMPLETO'];
        console.log('\n------------------------------  ' + pesquisador + '  ------------------------------\n');
        console.log('\n------------------------------  ' + string + '  ------------------------------\n');
    },

    retornaJsonObj : function (filepath) { 

        let file = path.join(__dirname, filepath);
    
        let data = fs.readFileSync(file, 'utf8', function(err, data) {
    
            if (err) throw err;               
        });
    
        return JSON.parse(data);
    },

    retornaLattesArtigos : function(jsonLattesObj) {

        return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['ARTIGOS-PUBLICADOS']['ARTIGO-PUBLICADO'];
    },

    retornaLattesEventos : function (jsonLattesObj) {

        return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
    },

    getInfosConferenciaLattes : function (conferenciaLattes, indice) {

        conferenciaLattes.nome = indice['DETALHAMENTO-DO-TRABALHO']['_attributes']['NOME-DO-EVENTO'].toUpperCase();
        conferenciaLattes.tituloTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['TITULO-DO-TRABALHO'];
        conferenciaLattes.anoTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['ANO-DO-TRABALHO'];
    },

    getInfosConferenciaQualis : function (conferenciaQualis, indice) {

        conferenciaQualis.nome = indice.nome.toUpperCase();
        conferenciaQualis.sigla = indice.sigla;
        conferenciaQualis.conceito = indice.qualis;
    },

    preencheObjConferencia : function(conferencia, conferenciaLattes, conferenciaQualis, maiorSimilaridade) {

        conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
        conferencia.eventoLattes = conferenciaLattes.nome; 
        conferencia.eventoQualis = conferenciaQualis.nome; 
        conferencia.ano = conferenciaLattes.anoTrabalho;
        conferencia.qualis = conferenciaQualis.conceito; 
        conferencia.similaridade = maiorSimilaridade; 
    },

    salvaConferenciasNaoEncontradas : function (conferenciasNaoEncontradas, conferenciaLattes, conferenciasQualis, cont, flag, resultadoSimilaridade) {

        let conferencia = {};
    
        if ( cont == conferenciasQualis.length && flag == false ) {
            
            conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
            conferencia.eventoLattes = conferenciaLattes.nome; 
            conferencia.ano = conferenciaLattes.anoTrabalho;
            // conferencia.similaridade = String(resultadoSimilaridade);
    
            conferenciasNaoEncontradas.push(conferencia);
            // this.escreveJsonObj("./resultado_conferencias_nao_encontradas.json", conferenciasNaoEncontradas);
        }   
    },
        
    escreveJsonObj : function (filePath, data) {
    
        var json = JSON.stringify(data, null, " ");
    
        fs.writeFileSync(filePath, json, function(err) {
            
            if (err) return console.log("Erro na criação de arquivo com resultado final: " + err);
            console.log('Arquivo gerado com sucesso.');
        })  
    },

    verificaLista : function (lista, string) {

        if ( lista.length > 0 ) {

            console.log('\n------------------------------  ' + string + '  ------------------------------\n');
            console.log(lista);
            console.log('\n');
        } 
    }
}
