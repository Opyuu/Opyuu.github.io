function on_load(){
    let index = Math.floor(Math.random() * data.length);
    document.getElementById("image").src = data[index]["LINK"];
    document.getElementById("source").href=data[index]["SOURCE"];
    document.getElementById("source").innerHTML=data[index]["NAME"];
}