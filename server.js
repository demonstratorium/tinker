'use strict';const T=require('tinkerforge'),fetch=require('./modules/sw_fetch.min'),config=require('./package.json').config,MESS_TIME=process.env.MT||config.MESSTIME||1e3,BKUP_TIME=process.env.BT||config.BACKUP_TIME||15000,msg=(a)=>(b)=>console.log(`SW_MSG ${a} ${b}`),setAct=(a,b,c)=>(d)=>{console.log(a,d/b,c),env.push({ltime:Date.now(),loc:config.LOC,k:a,v:d/b,e:c})},dst={host:process.env.IPR||'at-flow',port:80,path:`/rest/${process.env.TBL||'tinker'}/_bulk`,method:'POST',auth:'',senc:!1,renc:!1,prot:'http'},xonce=async(a,b)=>{let c=await mdb_tcp(a),d=await transform(b)(c);d.counter=counter++,env.push(d),config.IS_LOG&&console.log(d),setTimeout(()=>xonce(a,b),MESS_TIME)},backup=async()=>{for(config.IS_LOG&&console.log(env.length,out.length);env.length;)out.push(env.shift());config.IS_LOG&&console.log(env.length,out.length),await fetch(dst,JSON.stringify(out)),out=[],setTimeout(backup,BKUP_TIME)},getValues=()=>{ambi.getIlluminance(setAct('Illuminance',10,'lux'),msg('ERROR_AMBI_ILLUMINANCE')),humi.getHumidity(setAct('Humidity',10,'%'),msg('ERROR_HUMI_HUMIDITY')),baro.getAirPressure(setAct('AirPressure',1e3,'mbar'),msg('ERROR_BARO_PRESSURE')),baro.getAltitude(setAct('Altitude',100,'m'),msg('ERROR_BARO_ALTITUDE')),setTimeout(getValues,MESS_TIME)},ipcon=new T.IPConnection,baro=new T.BrickletBarometer(config.SENSORS.BrickletBarometer,ipcon),ambi=new T.BrickletAmbientLight(config.SENSORS.BrickletAmbientLight,ipcon),humi=new T.BrickletHumidity(config.SENSORS.BrickletHumidity,ipcon);let env=[],counter=0,out=[];setTimeout(backup,BKUP_TIME),ipcon.connect(config.BRICK.host,config.BRICK.port,msg('ERROR_CONNECT')),ipcon.on(T.IPConnection.CALLBACK_CONNECTED,(a)=>{msg('CALLBACK CONNECTED')(a),getValues()},msg('ERROR_CONNECT'));
