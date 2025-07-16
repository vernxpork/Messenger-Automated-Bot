     let audioStarted = false;

      document.addEventListener("click", function () {
        if (!audioStarted) {
          const iframe = document.createElement("iframe");
          iframe.width = "1";
          iframe.height = "1";
          iframe.src = "https://www.youtube.com/embed/JdU0gDDCiB8?autoplay=1&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3";
          iframe.frameBorder = "0";
          iframe.allow = "autoplay; encrypted-media";
          iframe.allowFullscreen = true;
          iframe.style.opacity = "0";
          iframe.style.position = "absolute";
          iframe.style.left = "-9999px";
          document.getElementById("audio-container").appendChild(iframe);
          audioStarted = true;
        } 
      });
    