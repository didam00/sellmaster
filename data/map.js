maps = [
  {
    name: '시작점',
    pos: [0,20], // 2 block
    events: {
      mobs: [],
      mobsSpawnRandom: 0,
      mobsSpawnMax: 0,
    }
  },
  {
    name: '실바 정원',
    pos: [20,240], // 12 block
    events: {
      mobs: ["slime","sword_eaten_slime","shield_eaten_slime","baby_slime"],
      mobsSpawnRandom: 0.5,
      mobsSpawnMax: 15,
    }
  },
  {
    name: '코누 강',
    pos: [240,270], // 1 block
    events: {
      mobs: ["stoner"],
      mobsSpawnRandom: 0.4,
      mobsSpawnMax: 3,
    }
  },
  {
    name: '마탠 산',
    pos: [270,600], // 35 block
    events: {
      mobs: [],
      mobsSpawnRandom: 0,
      mobsSpawnMax: 0,
    }
  },
]

// 1 pos = 12.8px
