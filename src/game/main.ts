document.getElementById("hello")?.addEventListener("click", hello);

function hello() {
  const div = document.createElement("div");
  div.innerHTML = "i'm going to jump!!!";
  document.body.appendChild(div);
}
