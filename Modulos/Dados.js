const fs = require('fs');
const path = require('path');


module.exports = function () {


    this.retornaJsonObj = function (filepath) { 

        let file = path.join(__dirname, filepath);
    
        let data = fs.readFileSync(file, 'utf8', function(err, data) {
    
            if (err) throw err;               
        });
    
        return JSON.parse(data);
    }

    this.retornaLattesArtigos = function(jsonLattesObj) {

        return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['ARTIGOS-PUBLICADOS']['ARTIGO-PUBLICADO'];
    }

    this.retornaLattesEventos = function (jsonLattesObj) {

        return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
    }
}