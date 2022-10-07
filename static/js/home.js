addEventListener('DOMContentLoaded', (event) => {});




window.addEventListener('DOMContentLoaded', (event) => 
{
    addbuttonlisteners();
});


function addbuttonlisteners()
{
    //define botões
    var curriculobutton = document.getElementById("curriculo");
    var github = document.getElementById("github");
    var login = document.getElementById("login")

    //EventListener para botões
    curriculo.addEventListener("click", function(e) 
    {
       window.open("/resume");
    });
    github.addEventListener("click", function(e) 
    {
        window.open("https://github.com/bruno-1337");
    });
    login.addEventListener("click", function(e) 
    {
        window.open("/login", "_self");
    });

}