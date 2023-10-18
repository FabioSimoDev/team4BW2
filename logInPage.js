
const accessoButton= document.getElementById("accedibut")


accessoButton.addEventListener("click", function(e){

e.preventDefault()

save()

})

const save = function(){
    
const inputEmail=document.getElementById("exampleInputEmail1")
const inputPassword=document.getElementById("exampleInputPassword1")
const newLogIn = {

email: inputEmail.value,
password: inputPassword.value

}

localStorage.setItem('account-memory', newLogIn)
return save

}

save()






// const passwordButton=document.getElementById("passbut")

// passwordButton.addEventListener("click",function(e){

// e.preventDefault()

// let input=document.getElementById("exampleInputPassword1")

// if (passwordButton){input.value}
// else{




// }


// })