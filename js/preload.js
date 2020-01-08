function preload(ext) {
  for(let i = 1; i<arguments.length; i++) {
    var p = new Image();
    p.src = "imgs/"+arguments[i]+"."+ext
  }
}

preload(
  "png",

  "crepe",
  "crepe_open",
  "down_button",
  "up_button",
  "right_button",
  "left_button",
  "down_button_pressed",
  "up_button_pressed",
  "right_button_pressed",
  "left_button_pressed",
  "no_button",
  "yes_button",
  "yes_button_pressed",
  "no_button_pressed",
  "ground1",
  "health_bar",
  "moon",
  "player",
  "player_walk",
  "normal_window/normal_window_1",
  "normal_window/normal_window_2",
  "normal_window/normal_window_3",
  "normal_window/normal_window_4",
  "normal_window/normal_window_5",
  "normal_window/normal_window_6",
  "normal_window/normal_window_7",
  "normal_window/normal_window_8",
  "normal_window/normal_window_9"
)
