let coin;
function getValue(){
coin=document.getElementById("prod").value
}

// creating socket object
let socket= new WebSocket("wss://ws-feed.pro.coinbase.com");
// sending data to server when connection is alive
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

// tow array for storing price of sell and price
let sell=[]
let buy=[]


socket.onmessage= function(ws){
// console.log(payload)
try {
    
    let {side , price , type }= JSON.parse(ws.data);
    console.log(JSON.parse(ws.data))
     if(side=="sell" && type=="received"){
         sell.push(+price)

      
     }
     if(side=="buy" && type=="received"){
          buy.push(+price)
    
     }

        
} catch (error) {
    console.log(error)
}


}

// calling show function
show(sell,buy)


function show(sell, buy){
    // setting an interval of 5 seconds to calculate average buy and sell price
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
  // creating and setting the date at every 5 seconds
 let datetime = new Date();
 datetime.setMilliseconds(0)
 // removing miliseconds from the date 
 let now = datetime.toISOString().replace('.000Z', ' ').replace('T', ' ')
 console.log(now)
 document.getElementById("time").textContent="Time : "+now
 // making sell and price array empty at every 5 seconds to store new value
 sell.length=0
 buy.length=0
 },5000)
  
}
 