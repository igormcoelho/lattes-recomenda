const fs = require('fs'),
      pdf = require('pdf-parse');
let   conferenciasQualis = [];


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    this.parsePdfToTxt(config.arquivoConferencias, callback);
    this.salvaConferencias();
    this.parseXmlToJson(config.arquivoLattes)
}


Conferencia.prototype.parsePdfToTxt = function(arquivoConferencias) {

    pdf(fs.readFileSync(arquivoConferencias)).then(function(data) {
        fs.writeFileSync(
            './conferencias.txt', 
            data.text, 
            function(err) {
                if(err) {
                    return console.log("Erro na escrita do arquivo: " + err);
                }
            }  
        ); 
    });
}

Conferencia.prototype.salvaConferencias = function() {
    fs.readFile("./conferencias.txt", 'utf8', function(err, data) {
        if (err) throw err;
        
        conferenciasQualis = data.toString().split("\n");
    });
}

Conferencia.prototype.parseXmlToJson = function(arquivoLattes) {
    
    var convert = require('xml-js'),
        xml = fs.readFileSync(arquivoLattes, 'utf8'),
        options = {
            ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
        },
        result = convert.xml2json(xml, options); 

    arquivoLattes = "./curriculo-lattes.json";
    fs.writeFile(
        arquivoLattes, 
        result, 
        function(err) {
          if(err) {
            return console.log(err);
          }
        }  
    );     
}