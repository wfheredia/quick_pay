
setTimeout(function(){
nfcOp.init();
},300);

var nfcOp = {
    init:function(){
        nfc.addNdefListener(
            nfcOp.nfcEvento,
            function() {
                alert("Exito"); // activar algu indicador de estado activado en pantalla
            },
            function() {
                alert("Error al activar NFC");
            }
        );    
    },
    nfcEvento: function (nfcEvent) {
        
        console.log(JSON.stringify(nfcEvent.tag));
        //app.clearScreen();

      //  var tag = nfcEvent.tag;

        // BB7 has different names, copy to Android names
        /*if (tag.serialNumber) {
            tag.id = tag.serialNumber;
            tag.isWritable = !tag.isLocked;
            tag.canMakeReadOnly = tag.isLockable;
        }*/

        $("#mostrar").html(JSON.stringify(nfcEvent.tag));

        navigator.notification.vibrate(100);        
    }
}

function comenzar(){
    
}