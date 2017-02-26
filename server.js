'use strict';const rest=require('./lib/rest'),tf=require('./Tinkerforge.js'),cfg=require('./package.json').config,ipc=new tf.IPConnection,master=new tf.BrickMaster(cfg.MID,ipc),baro=new tf.BrickletBarometer(cfg.BID,ipc),humi=new tf.BrickletBarometer(cfg.HID,ipc),ambi=new tf.BrickletAmbientLight(cfg.AID,ipc),delta=cfg.DELTA,delay=cfg.DELAY,r=t => rest('POST',cfg.RHOST,cfg.RPORT,'/rest/'+cfg.RIDX+'/_bulk',JSON.stringify(t)),i=t => {if(t.length>0){r(t);return []}return t};let bair=0,bairmax=0,bairmin=0,villumax=0,villumin=0,villu=0,hph=0,mv=0,mc=0,t=[];ipc.connect(cfg.HOST,cfg.PORT,error => {console.log('Connect HOST PORT Error: '+error)});ipc.on(tf.IPConnection.CALLBACK_CONNECTED,connectReason => {console.log('connected',connectReason);master.getStackVoltage(v => {mv=v/1000;console.log('VoltageMaster',mv)},e => console.log('MasterVoltageError: '+e));baro.getAirPressure(a => {bair=a/1000;console.log('Air pressure: '+bair+' mbar');t.push({'v':bair,'t':'mbar','l':cfg.LOC,'_time':Date.now()})},e => console.log('AirPressureError: '+e));ambi.getIlluminance(l => {villu=l/10;t.push({'v':villu,'t':'lux','l':cfg.LOC,'_time':Date.now()})},e => console.log('IlluminanceError: '+e));baro.setAirPressureCallbackPeriod(cfg.DELAY);baro.on(tf.BrickletBarometer.CALLBACK_AIR_PRESSURE,a => {if(Math.abs((bair-a/1000)/bair)>delta){bair=a/1000;t.push({'v':bair,'t':'mbar','l':cfg.LOC,'_time':Date.now()})}console.log('CB baro',bair,a/1000,Math.abs((bair-a/1000)/bair))});ambi.setIlluminanceCallbackPeriod(cfg.DELAY);ambi.on(tf.BrickletAmbientLight.CALLBACK_ILLUMINANCE,l => {if(Math.abs((villu-l/10)/villu)>delta){villu=l/10;t.push({'v':villu,'t':'lux','l':cfg.LOC,'_time':Date.now()})}})},err => {});require('http').createServer((req,res) => {res.writeHead(200);res.end('bar'+bair+'\tlux'+villu)}).listen(8888);setInterval(() => t=i(t),4*cfg.DELAY);
