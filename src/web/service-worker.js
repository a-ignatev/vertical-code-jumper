self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("vertical-code-jumper-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/game.js",
        "/main.css",
        "/override.css",
        "/favicon.png",
        "/vscode-mock.js",
        "/icon.png",
        "/sound/",
        "/sound/coffee.mp3",
        "/sound/game-over.mp3",
        "/sound/jump.mp3",
        "/sound/music.mp3",
        "/sound/ough.mp3",
        "/sound/pouring-drink.mp3",
        "/sound/roar.mp3",
        "/sound/score.mp3",
        "/img/",
        "/img/heart-empty.png",
        "/img/heart.png",
        "/img/mug.png",
        "/img/Normal_Guy_Air.png",
        "/img/Normal_Guy_Drinks_SpriteSheet.png",
        "/img/Normal_Guy_Idle_SpriteSheet.png",
        "/img/Normal_Guy_Transforms_SpriteSheet.png",
        "/img/Strong_Guy_Idle_SpriteSheet.png",
        "/img/Strong_Guy_Jumps.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
