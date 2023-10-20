

const accessoButton= document.getElementById("accedibut")


accessoButton.addEventListener("click", function(e){

e.preventDefault()

save()

})

const save = function(){
    
const inputEmail=document.getElementById("exampleInputEmail1")
const inputPassword=document.getElementById("exampleInputPassword1")

const accessoButton= document.getElementById("accesso")


const formReference=document.getElementById("form")

formReference.addEventListener("submit", function(e){

e.preventDefault()

const inputEmail=document.getElementById("exampleInputEmail1")
const inputPassword=document.getElementById("exampleInputPassword1")


const newLogIn = {

email: inputEmail.value,
password: inputPassword.value

}


let ricordami= document.getElementById("flexSwitchCheckChecked")

if( ricordami.checked){localStorage.setItem('account-memory', JSON.stringify(newLogIn) )}
else {sessionStorage.setItem('account-session', JSON.stringify(newLogIn) )}

return save

})

save()


// mostra password

function myFunction() {
    var x = document.getElementById("exampleInputPassword1");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

}

