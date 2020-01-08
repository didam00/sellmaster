function tick() {
  $("#health").style.width = (player.stat.health * (186/player.stat.maxHealth)) + "px";

  settings()
}

function createWindow(name, width, height) {
  var c = document.createElement("div");
  c.id = "newWindow_"+name;
  c.className = "newWindow";
  c.style.width = "calc("+width+")";
  c.style.height = "calc("+height+")";
  document.body.appendChild(c);

  for(let i = 0; i<9; i++) {
    var a = new Image();
    a.src = "imgs/normal_window/normal_window_"+(i+1)+".png";
    if( (i%3) == 0 ) {
      c.appendChild(document.createElement("ul"))
    }

    $$("#newWindow_"+name+" ul")[$$("#newWindow_"+name+" ul").length-1].appendChild(document.createElement("li"))
    // 임의의 창 아래의 마지막 ul에 li 원소를 만들어서 넣는다.
    $$("#newWindow_"+name+" li")[$$("#newWindow_"+name+" li").length-1].appendChild(a)
  }

  if((height != null) && (width != null)) {
    $$("#newWindow_"+name+" li") [1].style.width = "calc(100% - 12px)"
    $$("#newWindow_"+name+" li") [4].style.width = "calc(100% - 12px)"
    $$("#newWindow_"+name+" li") [7].style.width = "calc(100% - 12px)"

    $$("#newWindow_"+name+" li") [3].style.height = "calc("+height+" - 30px)"
    $$("#newWindow_"+name+" li") [4].style.height = "calc("+height+" - 30px)"
    $$("#newWindow_"+name+" li") [5].style.height = "calc("+height+" - 30px)"
  }

  $$("#newWindow_"+name+" img")[1].style.width = "100%"
  $$("#newWindow_"+name+" img")[4].style.width = "100%"
  $$("#newWindow_"+name+" img")[7].style.width = "100%"

  $$("#newWindow_"+name+" img")[3].style.height = "100%"
  $$("#newWindow_"+name+" img")[4].style.height = "100%"
  $$("#newWindow_"+name+" img")[5].style.height = "100%"
}

function removeWindow(width, height, style) {

}

function buttonPressed(a) {
  a.style.visibility = "hidden"
  setTimeout(function () {
    a.style.visibility = "visible"
  },100)

  var mean = a.src.replace("imgs/","").replace("_button.png","").split("/");
  mean = mean[mean.length-1]

  // walk situation

  if(player.beh.act == "walk") {
    if(mean == "right") {
      player.pos += player.stat.moveSpeed
    } else if(mean == "left") {
      player.pos -= player.stat.moveSpeed
    } else if(mean == "up") {
      player.beh.act = "inventory";
      $("#inventory").style.visibility = "visible"
    }

    if((player.beh.act == "walk") && ((mean == "right") || (mean == "left"))) {
      if(player.beh.up == false) {
        $("#player").src = "imgs/player_walk.png"
        player.beh.up = true
      } else {
        $("#player").src = "imgs/player.png"
        player.beh.up = false
      }
    }
  }

  // inventory situation

  if(player.beh.act == "inventory") {
    if(mean == "no") {
      $("#inventory").style.visibility = "hidden"
      player.beh.act = "walk";
    }
  }



  tick()
}

var inf = {
  time: 0,
}

var player = {
  stat: {
    health: 100,
    maxHealth: 100,
    moveSpeed: 5,
    attack: 5,
    critical: 0,
  },
  pos: 0,
  map: null,
  beh: {
    up: false,
    act: "walk",
  },
  inventory: {

  }
}

function settings() {
  if(player.stat.health > player.stat.maxHealth) player.health = player.stat.maxHealth;
  player.map = maps.filter(a => (a.pos[0] <= player.pos)&&(player.pos < a.pos[1]))[0].name;
  $("#ground").style.backgroundPosition = "-"+(((player.pos%10)*128)/10) + "px"
}

window.onload = function () {
  tick()
  createWindow("inventory","100% - 5px","249px")
  $("#inventory").appendChild($("#newWindow_inventory"))

  $("#loading").outerHTML = null
}


/*
ul.width = 260px
li.width = 160px
*/
