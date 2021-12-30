var player, obstacleGroup, pointsGroup, lifeGroup,boatGroup;
var blastImg, cannonballImg, coinImage, lifeImg, bgImage;
var score = 0;
var life = 180;
var displayScore, controls, instructions;
var backGroundMusic, blastSound, scoreSound;
var boat1,boat2;
var Start = 0, Play = 1, End = 2
var endSound;
var gameState = Start
var laughSound = false;

function preload(){
  blastImg = loadImage("blast.png");
  cannonballImg = loadImage("cannonball.png");
  coinImage = loadImage("goldCoin.png");
  backGroundMusic = loadSound("background_music.mp3");
  lifeImg = loadImage("life.png");
  boat1 = loadImage("boat.png");
  boat2 = loadImage("boat2.png");
  blastSound = loadSound("cannon_explosion.mp3");
  scoreSound = loadSound("checkpoint.mp3");
  bgImage = loadImage("background.jpg")
  endSound = loadSound("pirate_laugh.mp3")
}

function setup() {
  createCanvas(800,600);
  player = createSprite(400,400,18,18);
  player.addImage("boat1",boat1);
  player.addImage("boat2",boat2);
  player.scale = 0.3;
  player.debug = true;
  player.setCollider("circle",0,0,200);

  obstacleGroup = new Group();
  pointsGroup = new Group();
  lifeGroup = new Group();
  boatGroup = new Group();
  displayScore = createElement("h2");
  controls = createElement("h2");
  instructions = createElement("h2");
}

function draw() {
  background(255,255,255);
  
 if(gameState === Start){ 
   player.visible = false;

    elementProperties(
               instructions, 180, 240, "In this game, you will have to dodge the cannonballs and collect the coins",
               controls, 200, 380, "Use the arrow keys to move the player. Press 'Space' to start playing",
               displayScore,-100,-1000,"")
               
      
    if(keyDown("Space")){
      gameState = Play
    }
 }
 if(gameState === Play){
    background("Blue");
    if(!backGroundMusic.isPlaying()){
      backGroundMusic.play();     
      backGroundMusic.setVolume(0.1);
  }

    player.visible = true;
    drawLines(800,20,65,10)
    elementProperties(displayScore,60,20,"Score: " + score,instructions,-1000,-1000,"",controls,-1000,-1000,"")
    addBar(lifeImg,player.x- 130, player.y - 100, player.x- 100,player.y-100, 180, 20,"Yellow",life);

    playerControls();
    
    newSprite(100, coinImage, 0.1, pointsGroup, (6+score/5),0, random(10,790), 0);
    spriteCollision("coins",pointsGroup,player,score,1,0,scoreSound);

    newSprite(20, cannonballImg, 0.2, obstacleGroup, (4+score/5), 0, random(10,790), 0);
    spriteCollision("obstacles",obstacleGroup,player,life,0,90,blastSound);

    newSprite(60,lifeImg,0.2,lifeGroup,(4+score/4), 0,random(10,790),0);
    spriteCollision("life",lifeGroup,player,life,20,0, scoreSound);

    newSprite(100,boat2,0.3, boatGroup, 0, 4, 0, -5);
    
    for(var i = 0; i<700; i=i+70){
        drawLines(800,20,i+100,10);
    }
    if(life <= 0 || score>=20){
       backGroundMusic.stop()
       textSize(25);
       
       fill("black")
      player.visible = false;
      player.x = -1000
       text ("Thanks for Playing",300,300);
       text("Press enter to play again",300,350);
      if(score >=20) {
        text("You Won!",300,250)
        if(!laughSound && !endSound.isPlaying()){  
          scoreSound.play(); 
          endSound.play();
          laughSound = true;
        }
      }
      if(keyDown("Enter")){
        gameState = Start;
        reset();
     }
      pointsGroup.destroyEach();
      lifeGroup.destroyEach();
      obstacleGroup.destroyEach();
      boatGroup.destroyEach();
      pointsGroup.setLifeTimeEach = -1
      lifeGroup.setLifeTimeEach = -1
      obstacleGroup.setLifeTimeEach = -1
      boatGroup.setLifeTimeEach = -1;

    }
 }

 if(gameState === End && frameCount%40 === 0){
      endGame();
 }

 if(gameState!== Play && gameState!== Start){
  if(keyDown("Enter")){
    gameState = Start;
    reset();
 }
 }

  drawSprites();
}

function newSprite(spawnRate,spriteImg,scale,spriteGroup,velocityY,velocityX,spriteX,spriteY){
  if(frameCount%(spawnRate-score/2) === 0){
    var sprite = createSprite(spriteX,spriteY);
    sprite.addImage("spriteImg",spriteImg);
    sprite.lifetime = 400;
    sprite.velocityY = velocityY;
    sprite.velocityX = velocityX,
    sprite.scale = scale;
    spriteGroup.add(sprite);
  }
}

function drawLines(lineLengthSum,increment,lineY,lineLength){
    for(var i = 0; i<lineLengthSum; i=i+increment){
        line(i,lineY,i+lineLength,lineY);
    }
}























































































function spriteCollision(spriteTypeString,spriteGroup,collidedSprite, variableToChange,amountToIncrease,amontToDecrease,soundToPlay,){
    if(spriteGroup.collide(collidedSprite)){

          soundToPlay.play();
          spriteGroup.destroyEach()
        if(spriteTypeString === "obstacles"){
          if(life>0){
          life -= 90
          if(collidedSprite.x>=400){
              collidedSprite.x -= 5
         } else{
             collidedSprite.x += 5;
         }
         blast = createSprite(collidedSprite.x,collidedSprite.y);
         blast.addImage("blast",blastImg);
         blast.scale = 0.3;
         blast.life = 20;
         blastSound.play();
        }
        }
      if(spriteTypeString === "coins"){
             score += 1
        }
      if(spriteTypeString === "life"){
           if(life <180){
                   life += 20
           }
      
      }
    }
}

function playerControls(){
   if(keyDown(UP_ARROW) && player.y>200){
       player.y -= 6
   }
   if(keyDown(DOWN_ARROW) && player.y<600){
       player.y += 6
   }
   if(keyDown(LEFT_ARROW) && player.x>0){
       player.x -= 6;
       player.changeImage("boat1",boat1)
   }
   if(keyDown(RIGHT_ARROW) && player.x<800){
       player.x += 6
       player.changeImage("boat2",boat2);
   }
}

function addBar(barImg,imgX,imgY,barX,barY,barW,barH,decreasingBarColor,decreasingBarLength){
      push();
      image(barImg,imgX,imgY,20,20);
      fill("white");
      rect(barX,barY,barW,barH);
      fill(decreasingBarColor);
      rect(barX,barY,decreasingBarLength,barH)
      pop();
}



function endGame(){
  pointsGroup.destroyEach();
  pointsGroup.setLifeTimeEach = -1
  obstacleGroup.destroyEach();
  obstacleGroup.setLifeTimeEach = -1
  player.visible = false;
  if(life>0 && score>=20){
      gameState = Start
  }else if(life <= 0){
      instructions.position(300,200)
      instructions.html("YOU LOST. Press 'Space' to play again");
      displayScore.position(300,250);
      displayScore.html("Your Score: "+score)
  }
}

function elementProperties(element1,x1,y1,html1String,element2,x2,y2,html2String,element3,x3,y3,html3String){
      if(element1!== undefined){
        element1.position(x1,y1);
        element1.html(html1String);
      }
      if(element2!== undefined){
        element2.position(x2,y2);
        element2.html(html2String);
      }
      if(element3!== undefined){
        element3.position(x3,y3);
        element3.html(html3String);
      }
}

function reset(){
  score = 0;
  life = 180;
  pointsGroup.setLifeTimeEach = 400
  obstacleGroup.setLifeTimeEach = 400
  player.x = 400
  player.y = 500;
}

