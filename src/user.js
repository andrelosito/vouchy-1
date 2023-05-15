//Moving Cursor in the Welcome Page
var _CONTENT = [ 
    "go?", 
	"stay?", 
	"eat?", 
	"relax?", 
	"enjoy?"
];

// Current sentence being processed
var _PART = 0;

// Character number of the current sentence being processed 
var _PART_INDEX = 0;

// Holds the handle returned from setInterval
var _INTERVAL_VAL;

// Element that holds the text
var _ELEMENT = document.querySelector("#text");

// Cursor element 
var _CURSOR = document.querySelector("#cursor");

// Implements typing effect
function Type() { 
	// Get substring with 1 characater added
	var text =  _CONTENT[_PART].substring(0, _PART_INDEX + 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX++;

	// If full sentence has been displayed then start to delete the sentence after some time
	if(text === _CONTENT[_PART]) {
		// Hide the cursor
		_CURSOR.style.display = 'none';

		clearInterval(_INTERVAL_VAL);
		setTimeout(function() {
			_INTERVAL_VAL = setInterval(Delete, 50);
		}, 1000);
	}
}

// Implements deleting effect
function Delete() {
	// Get substring with 1 characater deleted
	var text =  _CONTENT[_PART].substring(0, _PART_INDEX - 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX--;

	// If sentence has been deleted then start to display the next sentence
	if(text === '') {
		clearInterval(_INTERVAL_VAL);

		// If current sentence was last then display the first one, else move to the next
		if(_PART == (_CONTENT.length - 1))
			_PART = 0;
		else
			_PART++;
		
		_PART_INDEX = 0;

		// Start to display the next sentence after some time
		setTimeout(function() {
			_CURSOR.style.display = 'inline-block';
			_INTERVAL_VAL = setInterval(Type, 100);
		}, 200);
	}
}

// Start the typing effect on load
_INTERVAL_VAL = setInterval(Type, 100);

// Firebase Functions
const offerData=$('#offerData');
const creditData=$('#creditData');
const bankData=$('#bankData');
const listItems=$('#listItems');

//Insert Records in the Offers Section
function addRec(doc){

    listItems.append(`
      <div class="col" id="${doc.id}">
        <div class="card shadow-sm">
        <img src="https://www.dealy.ie/wp-content/uploads/2016/11/hot_deals-990x615.jpg">
          
          <div class="card-body">
            <h5 class="card-title">${doc.data().description}</h5>
            <p class="card-text">${doc.data().brand} | ${doc.data().location}</p>
            <p class="card-text"><span class="badge bg-dark">tags</span> ${doc.data().category}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group"">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
                <button type="button" id="${doc.id}" class="btn btn-sm btn-warning buy" data-bs-toggle="modal" data-bs-target="#buyModal">Buy</button>
              </div>
              <h1 style="color: #FFAB19;">P${doc.data().price}</h1>
            </div>
          </div>
          
        </div>
      </div>      
      
      `);

      //Display the Offer values in the Modal
      $('.buy').click((e)=>{
        e.stopImmediatePropagation();
        var id=e.target.id;

        db.collection('offers').doc(id).get().then(doc=>{
            $('#brand').val(doc.data().brand);
            $('#price').val(doc.data().price);
            $('#location').val(doc.data().location);
            $('#description').val(doc.data().description);
            $('#category').val(doc.data().category);
            $('#document').val(doc.id);

            $('#brand1').val(doc.data().brand);
            $('#price1').val(doc.data().price);
            $('#location1').val(doc.data().location);
            $('#description1').val(doc.data().description);
            $('#category1').val(doc.data().category);
            $('#document1').val(doc.id);
        })
      })
}

//Add Record in the Offers Collection in Firestore
offerData.on('submit',(e)=> {
   e.preventDefault();
   
   db.collection('offers').add({
       brand:$('#brand').val(),
       price:$('#price').val(),
       location:$('#location').val(),
       description:$('#description').val(),
       category:$('#category').val()
    })

    $('#brand').val('');
    $('#price').val('');
    $('#location').val('');
    $('#description').val('');
    $('#category').val('');
    
    swal("Success!", "An offer was added successfully!", "success");
  })

//Get the Offers Records
db.collection('offers').onSnapshot(snapshot=>{
    let changes=snapshot.docChanges();
    changes.forEach(change=>{
        if(change.type=="added"){
            addRec(change.doc)
        }
    })
})

//Add Record in the Credit Orders Collection in Firestore
creditData.on('submit',(e)=> {
  e.preventDefault();
  
  db.collection('credit orders').add({

      brand:$('#brand').val(),
      price:$('#price').val(),
      location:$('#location').val(),
      description:$('#description').val(),
      category:$('#category').val(),
      quantity:$('#quantity').val(),
      total:$('#total').val(),
      
      fullName:$('#fullName').val(),
      cardNumber:$('#cardNumber').val(),
      mm:$('#mm').val(),
      yy:$('#yy').val(),
      cvv:$('#cvv').val(),
      email:$('#email').val(),
      dateOrdered: Date()
      
   })

   $('#fullName').val('');
   $('#cardNumber').val('');
   $('#mm').val('');
   $('#yy').val('');
   $('#cvv').val('');
   $('#email').val('');
   $('#quantity').val('');
   $('#total').val('');
   
   swal("Success!", "A payment was made! Screenshot this page and the email that you will receive. Then, show it to our partner store when you are ready to avail the item!", "success");

})

//Add Record in the Bank Orders Collection in Firestore
bankData.on('submit',(e)=> {
  e.preventDefault();
  
  db.collection('bank orders').add({

      brand:$('#brand1').val(),
      price:$('#price1').val(),
      location:$('#location1').val(),
      description:$('#description1').val(),
      category:$('#category1').val(),
      quantity:$('#quantity1').val(),
      total:$('#total1').val(),

      transactionId:$('#transactionId').val(),
      bankfullName:$('#bankfullName').val(),
      bankemail:$('#bankemail').val(),
      dateOrdered: Date()
      
   })

   $('#transactionId').val('');
   $('#bankfullName').val('');
   $('#bankemail').val('');
   $('#quantity1').val('');
   $('#total1').val('');
   
   swal("Success!", "A payment was made! Screenshot this page and the email that you will receive. Then, show it to our partner store when you are ready to avail the item!", "success");

})

//Register User
function RegisterUser() {
  var name=document.getElementById('registerName').value;
  var email=document.getElementById('registerEmail').value;
  var password=document.getElementById('registerPassword').value;

  firebase.auth().createUserWithEmailAndPassword(email,password).then(() => {
    window.alert('User Register successfully');
  }).catch((error) => {
  
   var errorcode=error.code;
   var errormsg=error.message;
   swal("Oops!", errormsg, "warning");

  });
 }

 //What to see when Logged In and Logged Out
 firebase.auth().onAuthStateChanged(function(user){
  if (user) {
    document.getElementById('profile').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none';

    document.getElementById('paySignedIn').style.display = 'block';
    document.getElementById('paySignedOut').style.display = 'none';

    document.getElementById('detailSignedIn').style.display = 'block';
    document.getElementById('detailSignedOut').style.display = 'none';

    var user = firebase.auth().currentUser;
    
    if (user != null) {
      var email = user.email;
      document.getElementById('profileName').innerHTML = 'Hi, ' + email;
      document.getElementById('profileEmail').innerHTML = 'Email address: ' + email;
    }

  } else {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'block';
    document.getElementById('profile').style.display = 'none';

    document.getElementById('paySignedIn').style.display = 'none';
    document.getElementById('payignedOut').style.display = 'block';

    document.getElementById('detailSignedIn').style.display = 'none';
    document.getElementById('detailSignedOut').style.display = 'block';
  }
});

//Login User
 function LoginUser(){
   var userEmail=document.getElementById('loginEmail').value;
   var userPass=document.getElementById('loginPassword').value;

   firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
   .catch((error) => {
     var errorCode = error.code;
     var errorMessage = error.message;

     swal("Oops!", errormsg, "warning");
   });
 
  }

  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');
  
  signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
  });
  
  signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
  });
  
//Logout User
function LogOut(){
  firebase.auth().signOut().then(() => {
    location.replace('login.html');
    
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    swal("Oops!", errormsg, "warning");
  });
  
}

//In the Credit Card Payment Method, get the total amount of the chosen offer by multiplying the price and the chosen quantity
function calculateAmount()
    {
        var quantity = document.getElementById("quantity").value;
        var price = document.getElementById("price").value;
        var total = parseFloat(quantity) * parseFloat(price);
        var result = document.getElementById("total").value = total;
    }
//In the Bank Transfer Payment Method, get the total amount of the chosen offer by multiplying the price and the chosen quantity
function calculateAmount1()
    {
        var quantity1 = document.getElementById("quantity1").value;
        var price1 = document.getElementById("price1").value;
        var total1 = parseFloat(quantity1) * parseFloat(price1);
        var result1 = document.getElementById("total1").value = total1;
    }