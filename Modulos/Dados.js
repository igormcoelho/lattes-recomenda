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

        try {
            return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['ARTIGOS-PUBLICADOS']['ARTIGO-PUBLICADO'];
        } catch (err) {
            console.log('Não existem publicações no currículo Lattes a serem avaliadas.');
        }
    },

    retornaLattesEventos : function (jsonLattesObj) {

        try {
            return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
        } catch (err) {
            console.log('Não existem trabalhos no currículo Lattes a serem avaliados.');
        }
    },

    getEventoSemDigitos : function (evento) {
        var result;
        
        result = evento.replace(/\d{2,4}/g, '').trim();
        return result;
    },

    getEventoEntreParenteses : function (evento) {
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(evento);
        var result = evento;

        try {
            if (matches) {
                result = matches[1];
                result = this.getEventoSemDigitos(result);                
            }
        } catch(e) {

        }

        return result; 
    },

    getInfosConferenciaLattes : function (conferenciaLattes, indice) {

        conferenciaLattes.nome = indice['DETALHAMENTO-DO-TRABALHO']['_attributes']['NOME-DO-EVENTO'].toUpperCase();
        // conferenciaLattes.nome = this.parseEntidadesEspeciais(conferenciaLattes.nome);        
        // conferenciaLattes.nome.toUpperCase();

        conferenciaLattes.proceeding = indice['DETALHAMENTO-DO-TRABALHO']['_attributes']['TITULO-DOS-ANAIS-OU-PROCEEDINGS'];
        conferenciaLattes.proceeding = this.parseEntidadesEspeciais(conferenciaLattes.proceeding).toUpperCase();
        
        conferenciaLattes.tituloTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['TITULO-DO-TRABALHO'];
        conferenciaLattes.tituloTrabalho = this.parseEntidadesEspeciais(conferenciaLattes.tituloTrabalho);
        
        conferenciaLattes.anoTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['ANO-DO-TRABALHO'];
        conferenciaLattes.homePage = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['HOME-PAGE-DO-TRABALHO'];

        conferenciaLattes.nomeSemDigitos = this.getEventoSemDigitos(conferenciaLattes.nome);
        conferenciaLattes.nomeEntreParenteses = this.getEventoEntreParenteses(conferenciaLattes.nome);
        conferenciaLattes.proceedingSemDigitos = this.getEventoSemDigitos(conferenciaLattes.proceeding);
        conferenciaLattes.proceedingEntreParenteses = this.getEventoEntreParenteses(conferenciaLattes.proceeding);
    },

    getInfosConferenciaQualis : function (conferenciaQualis, indice) {

        conferenciaQualis.nome = indice.nome.toUpperCase();
        conferenciaQualis.sigla = indice.sigla.toUpperCase();
        conferenciaQualis.conceito = indice.qualis;
    },

    parseEntidadesEspeciais : function (string) {
        string = string.replace(/&amp;/g, "&");
        string = string.replace(/&apos;/g, "'");

        return string;
    },

    preencheObjConferencia : function(conferencia, conferenciaLattes, conferenciaQualis, maiorSimilaridade) {
        conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
        conferencia.ano = conferenciaLattes.anoTrabalho;
        conferencia.pagina = conferenciaLattes.homePage;
        conferencia.eventoLattes = conferenciaLattes.nome; 
        conferencia.proceeding = conferenciaLattes.proceeding;
        conferencia.eventoQualis = conferenciaQualis.nome; 
        conferencia.qualis = conferenciaQualis.conceito; 
        conferencia.similaridade = maiorSimilaridade.toString(); 
    },

    salvaConferenciasEncontradas : function (conferenciasEncontradas, conferencia, flag) {

        // let conferencia = {};

        if ( flag == true ) {
            conferenciasEncontradas.push(conferencia);
        }

        // console.log(conferenciasEncontradas);
        
    },

    salvaConferenciasNaoEncontradas : function (conferenciasNaoEncontradas, conferenciaLattes, conferenciasQualis, cont, flag, resultadoSimilaridade) {

        let conferencia = {};
    
        if ( cont == conferenciasQualis.length && flag == false ) {
            
            conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
            conferencia.pagina = conferenciaLattes.homePage;
            conferencia.eventoLattes = conferenciaLattes.nome; 
            conferencia.proceeding = conferenciaLattes.proceeding;
            conferencia.ano = conferenciaLattes.anoTrabalho;
            // conferencia.similaridade = String(resultadoSimilaridade);
    
            conferenciasNaoEncontradas.push(conferencia);
            // this.escreveJsonObj("./resultado_conferencias_nao_encontradas.json", conferenciasNaoEncontradas);
        }   
    },
        
    escreveJsonObj : function (filePath, data) {
    
        var json = JSON.stringify(data, null, " ");
    
        try {
            fs.writeFileSync(filePath, json, function(err) {
                
                if (err) return console.log("Erro na criação de arquivo com resultado final: " + err);
                console.log('Arquivo gerado com sucesso.');
            })  
        } catch (err) {
            console.log("Que erro deu: " + err);
        }
    },

    verificaLista : function (lista, string, filePath) {

        if ( lista.length > 0 ) {

            console.log('\n------------------------------  ' + string + '  ------------------------------\n');
            console.log('Quantidade: ' + lista.length + '\n');
            // console.log(lista);
            this.escreveJsonObj(filePath, lista);
            console.log('\n');
        } 
    }
}
