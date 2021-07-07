
function myFunction() {
    const email = document.getElementById("email1").value;
    const pass = document.getElementById("pass1").value;

    let text;

    if((email === null || email === "") && (pass === null || pass === ""))
    {
      text = "Email and password requires a value"
    }
    else if(email === null || email === "")
    {
      text = "Email requires a value"
    }
    else if(pass === null || pass === "")
    {
      text = "Password requires a value"
    }
    else{
      text = " ";
    }

    document.getElementById("text").innerHTML = text;

    console.log(email);
    console.log(pass);

  }

  function myFunction2() {
    const email = document.getElementById("email2").value;
    var pass = document.getElementById("pass2").value;
    var name = document.getElementById("name1").value;


    let text;

    if((email === null || email === "") && (pass === null || pass === "") && (name === null || name === ""))
    {
      text = "Email and password and name requires a value"
    }
    else if((email === null || email === "") && (pass === null || pass === ""))
    {
      text = "Email and password requires a value"
    }
    else if(pass === null || pass === "")
    {
      text = "Password requires a value"
    }
    else if(pass.length < 6 || pass.length > 12)
    {
      text = "Password needs to be within 6 to 12 characters"
    }
    else if(email === null || email === "")
    {
      text = "email requires a value"
    }
    else{
      text = " ";
    }

    document.getElementById("text2").innerHTML = text;

    

  }