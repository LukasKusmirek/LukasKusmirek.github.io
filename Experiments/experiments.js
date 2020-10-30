const myButton = document.querySelector(".myButton");
myButton.addEventListener('click', function(){
    window.print();
    myButton.style.backgroundColor ="violet"
    myButton.style.width = "20em";
    myButton.style.height = "20em";
});

const headlineButton = document.querySelector(".headline");
const h1 = document.querySelector( "h1" );
headlineButton.addEventListener("click", function(){
    h1.style.color = "red";
    h1.style.fontFamily = "Arial";
});

const input = document.querySelector('.input-to-copy');
  const paragraph = document.querySelector('.p-to-copy-to');

  input.addEventListener("keydown", function() {
    paragraph.innerText  = input.value;
  });

const bestFarbe = document.querySelector(".submitColor");
bestFarbe.addEventListener("click", function(){
    console.log("moooin")
    if(document.getElementById("yellow").checked){
        h1.style.color = "yellow";
    }else if(document.getElementById("green").checked){
        h1.style.color = "green"
    }else if(document.getElementById("blue").checked){
        h1.style.color = "blue"
    }
    
});

