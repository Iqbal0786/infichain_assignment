let coin;
function getValue(){
coin=document.getElementById("prod").value
}


let socket= new WebSocket("wss://ws-feed.pro.coinbase.com");
socket.onopen=function(event){
 console.log("connected " , event)
 let payload={
type: "subscribe",
product_ids: ["BTC-USD"],
channels: ["full"]

 }
//  payload.product_ids[0]=coin
socket.send(JSON.stringify(payload))

}


let sell=[]
let buy=[]
socket.onmessage= function(ws){
// console.log(payload)
try {
    
    let {side , price , type ,time , product_ids}= JSON.parse(ws.data);
    console.log(JSON.parse(ws.data))
  if(product_ids=="LTC-USD"){
      console.log(JSON.parse(ws.data))
  }
     if(side=="sell" && type=="received"){
         sell.push(+price)
         //console.log(JSON.parse(ws.data))
      
     }
     if(side=="buy" && type=="received"){
          buy.push(+price)
        //   console.log(JSON.parse(ws.data))
     }

        
} catch (error) {
    console.log(error)
}


}
show(sell,buy)

function show(sell, buy){


 setInterval(()=>{
 if(sell.length>0){
    let sellsum= sell.reduce((ac,value)=>ac+value)
    if(!isNaN(sellsum)){
        console.log("sell avg"+Math.floor(sellsum/sell.length))
        document.getElementById("sell").textContent= "Avg requested Sell price: "+Math.floor(sellsum/sell.length)
    }
 }
 if(buy.length>0){
    let buysum= buy.reduce((ac,value)=>ac+value)
    if(!isNaN(buysum)){
        console.log("buy avg"+Math.floor(buysum/buy.length))
        document.getElementById("buy").textContent= "Avg requested Buy price: "+Math.floor(buysum/buy.length)
    }
  
 }
 let datetime = new Date();
 datetime.setMilliseconds(0)
 let now = datetime.toISOString().replace('.000Z', ' ').replace('T', ' ')
 console.log(now)
 document.getElementById("time").textContent="Time : "+now
 sell.length=0
 buy.length=0
 },5000)
  
}
 