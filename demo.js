// const avaliacaoQualis = require('avaliacao-qualis');
const avaliacaoQualis = require('.');

const fs = require('fs');
const path = require('path');

let getJsonObj = function (filepath) { 
    let file = path.join(__dirname, filepath);
    let data = fs.readFileSync(file, 'utf8', function(err, data) {
        if (err) throw err;               
    });
    return JSON.parse(data);
};

let myQualisJSON = getJsonObj('./qualis-data/classificacoes_publicadas_interdisciplinar_2017.json');
// console.log(myQualisJSON);

let readXMLFile = function(xmlFile) {
    var xml = fs.readFileSync(xmlFile, 'binary', function (err, data) {
        if (err) {
        return console.log(err);
        }
    });
    return xml;
};



// const ParseFS = require('./ModulosHelper/ParseDataFS');
// let parsefs = new ParseFS();
// let myLattesJSON = parsefs.parseXmlFileToJson('./curriculo/curriculo.xml');

const Parse = require('./Modulos/ParseData');
let parse = new Parse();
let myLattesJSON = parse.parseXmlDataToJson(readXMLFile('./curriculo/curriculo.xml'));
// console.log(myLattesJSON);


avaliacaoQualis.publicacoes({
        classificacoesPublicadasJSON: myQualisJSON,
        curriculoLattesJSON: myLattesJSON,
        anoInicial: 2015,
        anoFinal: 2018
    }, 

    function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    }
);

avaliacaoQualis.conferencias({

    curriculoLattesJSON: myLattesJSON,
    anoInicial: 2010,
    anoFinal: 2019,
    similaridade: 0.7 // entre 0.1 e 1
},

function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
}
);
