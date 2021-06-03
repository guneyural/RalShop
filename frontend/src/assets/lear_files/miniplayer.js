(function(g){var window=this;'use strict';var w4=function(a){g.V.call(this,{D:"div",K:"ytp-miniplayer-ui"});this.Yf=!1;this.player=a;this.N(a,"minimized",this.fg);this.N(a,"onStateChange",this.IC)},x4=function(a){g.dM.call(this,a);
this.i=new w4(this.player);this.i.hide();g.GL(this.player,this.i.element,4);a.He()&&(this.load(),g.L(a.getRootNode(),"ytp-player-minimized",!0))};
g.v(w4,g.V);g.k=w4.prototype;
g.k.ZA=function(){this.tooltip=new g.CP(this.player,this);g.G(this,this.tooltip);g.GL(this.player,this.tooltip.element,4);this.tooltip.scale=.6;this.lc=new g.ZM(this.player);g.G(this,this.lc);this.qg=new g.V({D:"div",K:"ytp-miniplayer-scrim"});g.G(this,this.qg);this.qg.ya(this.element);this.N(this.qg.element,"click",this.bx);var a=new g.V({D:"button",Ca:["ytp-miniplayer-close-button","ytp-button"],U:{"aria-label":"Kapat"},S:[g.VJ()]});g.G(this,a);a.ya(this.qg.element);this.N(a.element,"click",this.Ph);
a=new g.b0(this.player,this);g.G(this,a);a.ya(this.qg.element);this.Rn=new g.V({D:"div",K:"ytp-miniplayer-controls"});g.G(this,this.Rn);this.Rn.ya(this.qg.element);this.N(this.Rn.element,"click",this.bx);var b=new g.V({D:"div",K:"ytp-miniplayer-button-container"});g.G(this,b);b.ya(this.Rn.element);a=new g.V({D:"div",K:"ytp-miniplayer-play-button-container"});g.G(this,a);a.ya(this.Rn.element);var c=new g.V({D:"div",K:"ytp-miniplayer-button-container"});g.G(this,c);c.ya(this.Rn.element);this.KI=new g.zO(this.player,
this,!1);g.G(this,this.KI);this.KI.ya(b.element);b=new g.wO(this.player,this);g.G(this,b);b.ya(a.element);this.nextButton=new g.zO(this.player,this,!0);g.G(this,this.nextButton);this.nextButton.ya(c.element);this.vg=new g.pP(this.player,this);g.G(this,this.vg);this.vg.ya(this.qg.element);this.Hc=new g.EO(this.player,this);g.G(this,this.Hc);g.GL(this.player,this.Hc.element,4);this.Ow=new g.V({D:"div",K:"ytp-miniplayer-buttons"});g.G(this,this.Ow);g.GL(this.player,this.Ow.element,4);a=new g.V({D:"button",
Ca:["ytp-miniplayer-close-button","ytp-button"],U:{"aria-label":"Kapat"},S:[g.VJ()]});g.G(this,a);a.ya(this.Ow.element);this.N(a.element,"click",this.Ph);a=new g.V({D:"button",Ca:["ytp-miniplayer-replay-button","ytp-button"],U:{"aria-label":"Kapat"},S:[g.$J()]});g.G(this,a);a.ya(this.Ow.element);this.N(a.element,"click",this.aR);this.N(this.player,"presentingplayerstatechange",this.Gc);this.N(this.player,"appresize",this.sb);this.N(this.player,"fullscreentoggled",this.sb);this.sb()};
g.k.show=function(){this.wd=new g.ln(this.Mo,null,this);this.wd.start();this.Yf||(this.ZA(),this.Yf=!0);0!==this.player.getPlayerState()&&g.V.prototype.show.call(this);this.Hc.show();this.player.unloadModule("annotations_module")};
g.k.hide=function(){this.wd&&(this.wd.dispose(),this.wd=void 0);g.V.prototype.hide.call(this);this.player.He()||(this.Yf&&this.Hc.hide(),this.player.loadModule("annotations_module"))};
g.k.ra=function(){this.wd&&(this.wd.dispose(),this.wd=void 0);g.V.prototype.ra.call(this)};
g.k.Ph=function(){this.player.stopVideo();this.player.Ma("onCloseMiniplayer")};
g.k.aR=function(){this.player.playVideo()};
g.k.bx=function(a){if(a.target===this.qg.element||a.target===this.Rn.element)g.R(this.player.T().experiments,"kevlar_miniplayer_play_pause_on_scrim")?g.ZI(this.player.ub())?this.player.pauseVideo():this.player.playVideo():this.player.Ma("onExpandMiniplayer")};
g.k.fg=function(){g.L(this.player.getRootNode(),"ytp-player-minimized",this.player.He())};
g.k.Tc=function(){this.Hc.Wb();this.vg.Wb()};
g.k.Mo=function(){this.Tc();this.wd&&this.wd.start()};
g.k.Gc=function(a){g.T(a.state,32)&&this.tooltip.hide()};
g.k.sb=function(){g.PO(this.Hc,0,this.player.Za().getPlayerSize().width,!1);g.GO(this.Hc)};
g.k.IC=function(a){this.player.He()&&(0===a?this.hide():this.show())};
g.k.fc=function(){return this.tooltip};
g.k.ze=function(){return!1};
g.k.Je=function(){return!1};
g.k.Kh=function(){return!1};
g.k.Cx=function(){};
g.k.Ul=function(){};
g.k.Zp=function(){};
g.k.im=function(){return null};
g.k.Ai=function(){return new g.bg(0,0,0,0)};
g.k.handleGlobalKeyDown=function(){return!1};
g.k.handleGlobalKeyUp=function(){return!1};
g.k.Uo=function(a,b,c,d,e){var f=0,h=d=0,l=g.zg(a);if(b){c=g.xn(b,"ytp-prev-button")||g.xn(b,"ytp-next-button");var m=g.xn(b,"ytp-play-button"),n=g.xn(b,"ytp-miniplayer-expand-watch-page-button");c?f=h=12:m?(b=g.xg(b,this.element),h=b.x,f=b.y-12):n&&(h=g.xn(b,"ytp-miniplayer-button-top-left"),f=g.xg(b,this.element),b=g.zg(b),h?(h=8,f=f.y+40):(h=f.x-l.width+b.width,f=f.y-20))}else h=c-l.width/2,d=25+(e||0);b=this.player.Za().getPlayerSize().width;e=f+(e||0);l=g.de(h,0,b-l.width);e?(a.style.top=e+"px",
a.style.bottom=""):(a.style.top="",a.style.bottom=d+"px");a.style.left=l+"px"};
g.k.showControls=function(){};
g.k.lk=function(){};
g.k.Kj=function(){return!1};g.v(x4,g.dM);x4.prototype.create=function(){};
x4.prototype.Yh=function(){return!1};
x4.prototype.load=function(){this.player.hideControls();this.i.show()};
x4.prototype.unload=function(){this.player.showControls();this.i.hide()};g.oM.miniplayer=x4;})(_yt_player);
