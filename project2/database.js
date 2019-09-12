// Acceder al servicio de la base de datos
var database = firebase.database();

// console.log(firebase.app().name); 
 // Get a reference to the database service
// var database = firebase.database();
// console.log(database);

// Acceso a un documento
var ref = database.ref('tienda');
ref.on('value', function(ss){
    var tienda = ss.val();
    console.log(tienda);
    getId('tienda1').innerHTML = tienda.tienda1;
    getId('tienda2').innerHTML = tienda.tienda2;
});

// Acceso a los hijos (colección)
var refRespuesta = database.ref('clientes');
refRespuesta.on('child_added', function(ss){
    var respuesta = ss.val();
    console.log(respuesta);
    var item = document.createElement('li');
    // item.innerHTML = respuesta.nombreCliente + respuesta.apellidoCliente + " : " + respuesta.aniosClienteTienda + " años";
    item.innerHTML = '<input name="respuesta" type="radio" value="' + respuesta.nombreCliente + '"> ' + respuesta.nombreCliente;
    getId('lista').appendChild(item);
});

// Escritura en una colección
getId('votar').addEventListener('click', function(){
    // No se puede votar si el usuario no está logueado
    var user = auth.currentUser;
    if(!user) {
      mensajeFeedback('Haz login para votar la encuesta');
      return false;
    }

    // Otener campo modificado
    var res = getRadioValue('respuesta');
    if(!res) {
      mensajeFeedback('Escoge una de las posibles respuestas');
      return false;
    }
    var objResultado = {
    //   user: user.displayName,
      respuesta: res
    };
    console.log(objResultado);

    // Escribir en la BBDD
    var refResultados = database.ref('resultado').child(user.uid);
    refResultados.set(objResultado)
        .then(function(){
            mensajeFeedback('Tu respuesta se ha almacenado');
        })
        .catch(function(err) {
            mensajeFeedback('Error al almacenar: ' + err);
        });
});

// testando real time
var refResultados = database.ref('resultados');
refResultados.on('child_added', function(ss) {
    var respuesta = ss.val();
    var elem = document.createElement('article');
    elem.innerHTML = '<b>' + respuesta.user + ' <span>dice:</span> </b>' + '<i>' + respuesta.respuesta + '</i>';
    preppend(elem);
});