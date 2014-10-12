


var meli = {
	ref:null,
	apiUrl:"https://api.mercadolibre.com",
	
	// ########### Identificarse LOGUIN ################
	loguinML: function(iniciarSesion)
	{
		this.loadingCartel(true,true);
		meli.ref = window.open('https://auth.mercadolibre.com.ar/authorization?response_type=token&client_id=6977659590438028', '_blank', 'location=no,hidden=no');
		meli.ref.addEventListener('loadstart',meli.procesarURL);
		// para cuando el metodo es llamdo por iniciar Sesion
		if(iniciarSesion)
		{
			meli.ref.addEventListener('exit',meli.redircASistema);	
		}	
	},
	redircASistema: function()
	{
		// redirec
		//alert("chau");
		$(location).attr('href',"contenido.html");
	},
		
	// /////////////////// Cerrar seccion  ///////////////////////////////////////////////
	// Cierra la sección limpiando las variables de sección y borrando cualquier  cookie, 
	// esto lo consigue abriendo una ventana extra  con parámetros especifico (clearcache=yes,clearsessioncache=yes) 
	// y tambien borra localStorage 
	///////////////////////////////////////////////////////////////////////////////////////
	logout: function()
	{
		
		this.loadingCartel(true,true,"Desconectando...");
		
		meli.ref = window.open('https://auth.mercadolibre.com.ar/oauth/images/auth/no_existe_app.jpg', '_blank', 'location=yes,hidden=yes,clearcache=no,clearsessioncache=no');
		meli.ref.addEventListener('loadstart',meli.procesarURL);	
		// recorre el localStorage para borrar todos los datos
		for(var i=0, t=localStorage.length; i < t; i++) {
			key = localStorage.key(i);
			localStorage.removeItem(key);			
		}
	},

	// /////////////////// Procesa la url ///////////////////////////////////////////////
	// En caso de loguin: cierra la ventana, toma variables GET y guarda  en el localStorage.
	// en caso de logaut: cierra la ventan. 
	// URL de redireccionamiento en caso de Loguin exitoso  (Redirect URI)
	// https://a248.e.akamai.net/secure.mlstatic.com/org-img/commons/logo-mercadolibre-new.png
	// URL de Cerrar seccion 
	// https://auth.mercadolibre.com.ar/oauth/images/auth/no_existe_app.jpg
	///////////////////////////////////////////////////////////////////////////////////////
	procesarURL: function (event)
	{					
	    var urlObj = $.mobile.path.parseUrl(event.url);
		
		
		//Muestra WebViews solo cuando está el formulario listo **************
		if("www.mercadolibre.com" == urlObj.hostname )
	    {               
			// Pausa para mostrar WebViews, cuando termine el rendeisado y no muestre la página en blanco durante mucho tiemo
			window.setTimeout(function(){
								meli.ref.show();
								meli.loadingCartel(false,false,"");
							},2000);
        }
		
		// en caso de exito en el loguin ************************
	    if("logo-mercadolibre-new.png" == urlObj.filename )
	    { 		
			var getArray = urlObj.hash.substr(1).split('&');			
			//access_token=APP_USR-******
			//expires_in=216***
			//user_id=408***
			//domains=a248.e.akamai.net
			for(var i=0; i < getArray.length; i++)
			{
				var etiquetaYcontenido = getArray[i].split('=');				
				localStorage[etiquetaYcontenido[0]] = etiquetaYcontenido[1];
			}			
			 meli.ref.close();			
        }
		
		// Cuando cierra conexión logout *************************
		if("no_existe_app.jpg" == urlObj.filename )
	    {          
            meli.ref.close();
			meli.loadingCartel(false,false,"");
			alert("usted ya esta desconectado"); // recirdar descomentar si es necesario  
        }
		
	},
	////////////////////////////Listar productos///////////////////////////////////////////
	// Lista los productos del usuario pero como no tenemos 
	// nada a la venta, hardcodear otro vendedro que tenia
	////////////////////////////////////////////////////////////////////////////////
	listProducto: function()
	{
		//this.loadingCartel(true,true);
		//meli.ref = window.open('https://www.mercadopago.com/mla/opdetail?from=mp&nw=Y&opId=792804256', '_blank', 'location=yes,hidden=no');
		//meli.ref.addEventListener('loadstart',meli.procesarURL);
		$.get( 'https://api.mercadolibre.com/sites/MLA/search?nickname=DASHDIGITAL', function( data ) {
				//$( "#info" ).html( data );
				var lista = data.results;
				console.log(JSON.stringify(data)); 
				console.log(JSON.stringify(lista)); 
				for (var i = lista.length-1; i >= 0; i--) {					
					var itemLi = "<li><a href='dialog_producto.html?id="+lista[i].id+ "' data-transition=\"flip\"><img src='"+lista[i].thumbnail+"'><h2>"+lista[i].title+"</h2>";
                        itemLi +="   <p>"+lista[i].permalink+" </p>";						
                        itemLi +="    </a> <span class=\"ui-li-count\">$"+lista[i].price+" </span> </li>";
                    $( "#listItem" ).append( itemLi);
				};				
			});
	},
	cargarProducto: function(){

        // recupera los datos del procuto con la api
        var linktag="https://api.mercadolibre.com/items/"+meli.getUrlParameter("id");
        nfcOp.linkwrite = meli.getUrlParameter("id");
        $.get( linktag, function( data ) {
				//$( "#info" ).html( data );
				var lista = data;
				console.log(JSON.stringify(data));  				
					var itemLi = "<img src='"+lista.thumbnail+"'><h2>"+lista.title+"</h2>";
                        itemLi +="   <p>"+lista.permalink+" </p>";						
                        itemLi +="     <span class=\"ui-li-count\">$"+lista.price+" </span>";                        
                    $("#detalleproducto").html( itemLi);
                    $("#operacionestag").show();
			
			});


	}, 
	getUrlParameter: function(sParam)
	{
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	},  		
	/////////////////////// Procesa la url ///////////////////////////////////////////////
	//  cartel de cargando    
	//////////////////////////////////////////////////////////////////////////////////////
	loadingCartel:function(estado,textVisible,msgText) 
	{		
		// Valor por defecto 
		msgText || (msgText = "Conectando…"); 		
		
		if(estado) //muestra el cartelito
		{					
			$.mobile.loading( "show", {
					text: msgText,
					textVisible: textVisible
			});
		}
		else // oculta el cartelito 
		{
			$.mobile.loading("hide");
		}
		
	}
};