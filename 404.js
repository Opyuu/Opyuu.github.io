


function on_load(){
    let index = Math.floor(Math.random() * data.length);
    console.log(data[1]["LINK"]);
    console.log(index);
    document.getElementById("image").src = data[index]["LINK"];
    document.getElementById("source").href=data[index]["SOURCE"];
    document.getElementById("source").innerHTML=data[index]["NAME"];
}