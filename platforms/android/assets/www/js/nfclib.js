
setTimeout(function(){
nfcOp.init();
$( "#write" ).click(function() {
  nfcOp.escribirTag();
});
},300);

var nfcOp = {
    init:function(){
        nfc.addNdefListener(
            nfcOp.ndefEvento,
            function() {
                alert("NDEF Activar"); // activar algu indicador de estado activado en pantalla
            },
            function() {
                alert("Error al activar NDEF");
            }
        );
       // if (device.platform == "Android") {

            nfc.addTagDiscoveredListener(
                nfcOp.nfcEvento,
                function() {
                    console.log("NFC Activar");
                },
                function() {
                    alert("Error al activar NFC");
                }
            );

            nfc.addMimeTypeListener(
                'text/ML',
                nfcOp.ndefEvento,
                function() {
                    console.log("Listening for NDEF mime tags with type text/pg.");
                },
                function() {
                    alert("Error al activar NDEF mime");
                }
            ); 
     //   }   
    },
    nfcEvento: function (nfcEvent) {       
        
        console.log(JSON.stringify(nfcEvent.tag));

        $("#mostrar").html(nfcOp.bitATexyo(nfcEvent.tag.ndefMessage));
        navigator.notification.vibrate(100);        
    },
    ndefEvento: function (nfcEvent) {
        
        console.log(JSON.stringify(nfcEvent.tag));        

        $("#mostrar").html(nfcOp.bitATexyo(nfcEvent.tag.ndefMessage));

        navigator.notification.vibrate(100);        
    },

    bitATexyo: function(records){
        var  texto = "";      

        for (var i = 0; i < records.length; i++) {
            var record = records[i];            
            texto += nfc.bytesToString(record.payload);            
        }
        console.log(texto);
        return texto;
    },
    escribirTag: function(){
        nfc.addNdefListener(
            nfcOp.writeTag,
            function() {
                console.log("Registrado para escritura");
            },
            function() {
                console.log("Error al registrar para escritura");
            }
        );
    },
    writeTag: function(nfcEvent) {
        var mimeType = "text/ML";
        var payload  = "Hola mundo";
        var message  = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));

        nfc.write(
          [message],
          function () {
            console.log("exito al escribir");
          },
          function (reason) {
            console.log("error al intentar escribir");
          }
        );
    }
}

function comenzar(){
    
}

/*{"isWritable":true,
"id":[-3,127,20,22],
"techTypes":["android.nfc.tech.MifareClassic","android.nfc.tech.NfcA","android.nfc.tech.Ndef"],
"type":"com.nxp.ndef.mifareclassic",
"canMakeReadOnly":true,
"maxSize":716,
"ndefMessage":[{"id":[],
                "type":[85],
                "payload":[3,105,110,116,101,114,49,48,46,117,110,115,108,46,101,100,117,46,97,114,47,112,97,100,114,111,110,95,104,117,109,97,47,112,97,100,114,111,110,95,117,110,115,108,47,108,105,115,116,97,100,111,115,112,100,102,47,51,52],
                "tnf":1}
                ]
            } */