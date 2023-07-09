const xmlToJson = require('xml-js');
let   jsonLattesObj;
const iconv = require('iconv-lite');

module.exports = function () {

    this.parseXmlDataToJson = function (curriculoLattesXMLData) { 
        let optionsXML = {
            ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
        };
        // xml = iconv.decode(xml, 'iso88591');
        jsonLattesObj = xmlToJson.xml2json(curriculoLattesXMLData, optionsXML);
        jsonLattesObj = JSON.parse(jsonLattesObj);
    
        return jsonLattesObj; 
    }
    

}
