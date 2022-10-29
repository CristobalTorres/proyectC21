var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sonicImage,sonic,sonic_collided;
var eggManImg,eggMan;
var ground, invisibleGround, groundImage;
var sueloImg,suelo;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg,restart



function preload(){
  sonicImage= loadAnimation ("sinic.png","sinic1.png","sinic2.png","sinic3.png","sinic4.png","sinic5.png","sinic6.png","sinic7.png");

  eggManImg= loadImage("egg.png")

  sonic_collided=loadImage("sinicDie.png");

  groundImage = loadImage("paisaje.png");
  sueloImg=loadImage("suelo.png")
  
  obstacle1 = loadImage("obstaculos.png");
  obstacle2 = loadImage("obstaculos1.png");
  obstacle3 = loadImage("obstaculos2.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ground = createSprite(550,200,width,height);
  ground.addImage("ground",groundImage);
  ground.scale=4

  suelo = createSprite(width/2,height+300,width,2);
  suelo.addImage(sueloImg);
  suelo.x = width/2
  suelo.scale=8  ;    
  

  sonic = createSprite(50,height-180,10,10);
  sonic.addAnimation("running", sonicImage);
  sonic.addAnimation("collided",sonic_collided);
  sonic.setCollider("circle",0,0,15);
  sonic.scale = 2;
  sonic.debug=false;

  eggMan =createSprite (width/1.2,height-250,10,10);
  eggMan.addImage(eggManImg);
  eggMan.scale = 0.28;
  
  
    gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.09;
  invisibleGround = createSprite(width/2,height-10,width,225); 
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  
  
  score = 0;
}

function draw() {
  background(180);
  
   drawSprites();

  //mostrar puntuación
  textSize(20);
  fill("green");
  stroke(2);
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){

    score= score + Math.round(getFrameRate()/50);
    suelo.velocityX = -(7+ 2*score/500);

    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -2;
    //suelo.velocityX = -7
    
    //puntuación
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 450){
      ground.x = ground.width/2;
      ground.x=700;
    }
    
    if (suelo.x < 300){
      suelo.x = suelo.width/2;
      suelo.x=550;
    }

    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space")&& sonic.y >=  height-200) {
        sonic.velocityY = -13;
    }
    
    //agregar gravedad
    sonic.velocityY = sonic.velocityY + 0.8
  
    
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(sonic)){
      gameState = END;
    }
    
    obstaclesGroup.visible=false;
   
  }
  else if (gameState === END) {
    ground.velocityX = 0;
    sonic.velocityY = 0;
    suelo.velocityX=0;
    gameOver.visible = true;
    restart.visible = true;
    
    
    sonic.changeAnimation("collided",sonic_collided);
    
    
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
  }
  
  if(mousePressedOver(restart)){
    reset();
    
  }
  
  
  
  //evitar que el Trex caiga
  sonic.collide(invisibleGround);
  
  

}

function spawnObstacles(){
 if (frameCount % 65 === 0){
   var obstacle = createSprite(width-300,height-150,10,10);

   obstacle.velocityX = -(7+ 2*score/500);
   //obstacle.velocityX = -7;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 1.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
 
  
  sonic.changeAnimation("running",sonicImage);
  
  score = 0;

}
