const fs = require('fs');
const path = require('path');


module.exports = function () {


    this.retornaQualisEventos = function () { 

        let arquivoEventos = path.join(__dirname, "../Arquivos/qualis_eventos_cc_2016.json");
    
        let eventos = fs.readFileSync(arquivoEventos, 'utf8', function(err, data) {
    
            if (err) throw err;               
        });
    
        return JSON.parse(eventos);
    }
}