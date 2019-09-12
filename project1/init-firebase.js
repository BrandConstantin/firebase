var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
};
// Initialize Firebase with a "default" Firebase project
firebase.initializeApp(firebaseConfig);

// Obtener elementos
const preObject = document.getElementById('clientes');
const ulList = document.getElementById('lista');

// Crear referencias
const dbRefObject = firebase.database().ref().child('clientes'); //items de la bbdd
const dbRefList = dbRefObject.child('101'); //items de los items clientes

// Sincronizar cambios objeto
dbRefObject.once('value', snap => {
    preObject.innerText  = JSON.stringify(snap.val(), 4);
});

// Sincronizar cambios lista en consola
dbRefList.on('child_added', snap => console.log(snap.val())); //añadir hijo a la lista
// Sincronizar y mostrar cambios lista en consola
dbRefList.on('child_added', snap => {
    const li = document.createElement('li');
    li.innerText = snap.val();
    // actualizar los items de la lista
    li.id = snap.key;
    ulList.appendChild(li);
});

// Detectar cambios en la lista
dbRefList.on('child_changed', snap =>{
    const liChanged = document.getElementById('snap.key');
    liChanged.innerText = snap.val();
});

// Borrar elementos en la lista
dbRefList.on('child_removed', snap =>{
    const liToRemove = document.getElementById('snap.key');
    liToRemove.remove();
});


/* ------------------------------------------------------------ */
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

// Añadir evento login
btnLogin.addEventListener('click', e => {
    // obtener email y password
    const email = txtEmail.val;
    const pass = txtPassword.val;
    const auth = firebase.auth();

    //sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

// Añadir evento signup
btnSignUp.addEventListener('click', e => {
    // obtener email y password
    const email = txtEmail.val;
    const pass = txtPassword.val;
    const auth = firebase.auth();

    //sign up
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

// Añadir evento logout
btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

// Añadir evento en tiempo real
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        console.log(firebaseUser);
        btnLogout.classList.remove('hide');
    }else{
        console.log('no logueado');
        btnLogout.classList.add('hide');
    }
});

/****************************************************************** */
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');

/*
Para poder guardar cosas se necesita 
npm i --save google-cloud

y también 

const gcloud = require('google-cloud')
const storage = gcloud.storage({
    projectId: '<projectID>',
    keyFilename: 'service-account-credentials.json',
});
const bucket = storage.bucket('<projectID>.appspot.com')
*/


// var storage = app.storage();

fileButton.addEventListener('change', function(e){
    // Obtener el archivo
    var file = e.target.files[0];

    // Crear un storage ref
    var storageRef = firebase.storage().ref('fotos' + file.name);
    // Subir archivo
    var task = storageRef.put(file);
    // Actualizar barra de estado
    task.on('state_changed', 
    function progress(snapshot){
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
    },
    function error(err){

    }, 
    function complete(){

    });
});