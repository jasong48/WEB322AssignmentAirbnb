
function myFunction() {
    const email = document.getElementById("email1").value;
    const pass = document.getElementById("pass1");

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
    const email = document.getElementById("email1").value;
    const pass = document.getElementById("pass1");

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