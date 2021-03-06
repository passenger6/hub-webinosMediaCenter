var $ = require('jquery');
var address = require('../util/address.coffee');

$(window).resize(function() {
  calcSize();
});

function calcSize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  if(width > height){
    $("#orientation").removeClass('portrait');
    $("#orientation").addClass('landscape');

    var backButtonheight = $(".backButton").height();
    $(".tapButton").css({left: backButtonheight*0.26, right: backButtonheight*0.16, bottom: 0, top: 0});
    var tapButtonheight = $(".tapButton").height();
    var tapButtonwidth = $(".tapButton").width();
    if(tapButtonwidth < tapButtonheight){
      tapButtonheight = tapButtonwidth;
    }
    $(".clickAreaBack").css({width: backButtonheight*0.26, height: "", bottom: ""});
    var topOffset = (backButtonheight-tapButtonheight)/2;
    $(".clickAreaUp").css({width: tapButtonheight*0.35, height: tapButtonheight*0.35, left: tapButtonheight*0.325, top:topOffset});
    $(".clickAreaDown").css({width: tapButtonheight*0.35, height: tapButtonheight*0.35, left: tapButtonheight*0.325, top:(tapButtonheight*0.325+tapButtonheight*0.325)+topOffset});
    $(".clickAreaLeft").css({width: tapButtonheight*0.35, height: tapButtonheight*0.35, top: tapButtonheight*0.325+topOffset, left:0});
    $(".clickAreaRight").css({width: tapButtonheight*0.35, height: tapButtonheight*0.35, top: tapButtonheight*0.325+topOffset, left:(tapButtonheight*0.325+tapButtonheight*0.325)});
    $(".clickAreaOk").css({width: tapButtonheight*0.25, height: tapButtonheight*0.25, left: tapButtonheight*0.375, top:tapButtonheight*0.375+topOffset});
    $(".switchButton").css({width: backButtonheight*0.12, height: backButtonheight*0.12});

  }else{
    $("#orientation").removeClass('landscape');
    $("#orientation").addClass('portrait');

    var backButtonwidth = $(".backButton").width();
    $(".tapButton").css({bottom: backButtonwidth*0.26, top: backButtonwidth*0.16, left: 0, right: 0});
    var tapButtonheight = $(".tapButton").height();
    var tapButtonwidth = $(".tapButton").width();
    if(tapButtonheight < tapButtonwidth){
      tapButtonwidth = tapButtonheight;
    }
    $(".clickAreaBack").css({height: backButtonwidth*0.26, width: "", bottom: 0});
    var leftOffset = (backButtonwidth-tapButtonwidth)/2;
    $(".clickAreaUp").css({width: tapButtonwidth*0.35, height: tapButtonwidth*0.35, left: tapButtonwidth*0.325+leftOffset, bottom:(tapButtonwidth*0.325+tapButtonwidth*0.325), top: ""});
    $(".clickAreaDown").css({width: tapButtonwidth*0.35, height: tapButtonwidth*0.35, left: tapButtonwidth*0.325+leftOffset, bottom:0, top: ""});
    $(".clickAreaLeft").css({width: tapButtonwidth*0.35, height: tapButtonwidth*0.35, bottom: tapButtonwidth*0.325, left:0+leftOffset, top: ""});
    $(".clickAreaRight").css({width: tapButtonwidth*0.35, height: tapButtonwidth*0.35, bottom: tapButtonwidth*0.325, left:(tapButtonwidth*0.325+tapButtonwidth*0.325)+leftOffset, top: ""});
    $(".clickAreaOk").css({width: tapButtonwidth*0.25, height: tapButtonwidth*0.25, left: tapButtonwidth*0.375+leftOffset, bottom:tapButtonwidth*0.375, top: ""});
    $(".switchButton").css({width: backButtonwidth*0.12, height: backButtonwidth*0.12});
  }
}

function NavigationView (viewModel) {

  viewModel.input().onValue(Navigate);
  viewModel.peer().map(function (peer) {
    if (peer === '<no-peer>') return 'No peer selected';
    return address.friendlyName(peer.address());
  }).onValue(function (friendlyName) {
    $("#remoteTarget").text(friendlyName);
  });

  function Navigate(direction) {
    switch(direction){
      case 'left':
        window.openMainmenu();
        break;
    }
  }

  function navlog(direction) {
    console.log(direction);
  }
}


function RemoteView(viewModel) {
  var navigationView = new NavigationView(viewModel);

  viewModel.enter().plug($('.clickAreaOk').asEventStream('click').merge($('.clickAreaOk').asEventStream('touchend')).debounceImmediate(500));
  viewModel.left().plug($('.clickAreaLeft').asEventStream('click').merge($('.clickAreaLeft').asEventStream('touchend')).debounceImmediate(500));
  viewModel.up().plug($('.clickAreaUp').asEventStream('click').merge($('.clickAreaUp').asEventStream('touchend')).debounceImmediate(500));
  viewModel.right().plug($('.clickAreaRight').asEventStream('click').merge($('.clickAreaRight').asEventStream('touchend')).debounceImmediate(500));
  viewModel.down().plug($('.clickAreaDown').asEventStream('click').merge($('.clickAreaDown').asEventStream('touchend')).debounceImmediate(500));

  $('.changeModeButton').on('click', function() { window.openMainmenu(); });
  $('.clickAreaBack').on('click', function() { window.openMainmenu(); });
  calcSize();
}

module.exports = RemoteView;
