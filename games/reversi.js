var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
var size = (canvas.width - 9)/8;

ctx.fillRect(0,0,canvas.width,canvas.width);

var y = 0;
while(y < 8) {
    var x = 0;
    while(x < 8) {
        ctx.fillStyle = "white";
        ctx.fillRect(1+x*(1+size),1+y*(1+size),size,size);
        x++;
    }
    y++;
}





document.getElementById('mycanvas').addEventListener('click',function(evt){
                                                     ctx.fillStyle = "green";
                                                     ctx.fillRect(evt.clientX,evt.clientY,5,5);
                                                     },false);


