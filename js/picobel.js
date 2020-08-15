function Picobel(options){options=typeof options!=="undefined"?options:{};options.theme=options.theme||"defaultPlayerTheme";options.preload=options.preload||false;var audioElements=findAudio();var data=getRawData(audioElements);buildMarkup(audioElements);var wrappers=document.getElementsByClassName("customAudioPlayer");var playPauseButtons=document.getElementsByClassName("playerTrigger");var muteButtons=document.getElementsByClassName("songMuteButton");var playPauseButtonsText=document.getElementsByClassName("buttonText");var playTimer=document.getElementsByClassName("songPlayTimer");var songLengthBox=document.getElementsByClassName("songDuration");var titleDisplay=document.getElementsByClassName("titleDisplay");var artistDisplay=document.getElementsByClassName("artistDisplay");var progressBar=document.getElementsByClassName("songProgressSlider");var playhead=document.getElementsByClassName("pseudoProgressPlayhead");var indicator=document.getElementsByClassName("pseudoProgressIndicator");var volumeControl=document.getElementsByClassName("songVolumeSlider");var volumeDisplay=document.getElementsByClassName("songVolumeValue");var volumeIndicator=document.getElementsByClassName("pseudoVolumeIndicator");var volumePlayhead=document.getElementsByClassName("pseudoVolumePlayhead");var myAudio=initAudio(data);console.log("myAudio",myAudio);var currentSongIndex=0;function findAudio(){var audioElements=document.getElementsByTagName("audio");var items=[].slice.call(audioElements);return items}function getRawData(_data){var output=_data.map(function(item){return{preload:options.preload?options.preload:item.preload,url:item.src}});return output}function buildMarkup(_data){for(var i=0;i<_data.length;i++){var newPlayer=document.createElement("div");newPlayer.className="customAudioPlayer loading player_"+i;var className=audioElements[i].className;if(className!==""){_addClass(newPlayer,className)}_addClass(newPlayer,options.theme);newPlayer.setAttribute("data-song-index",i);var loading=document.createElement("div");loading.className="loader";newPlayer.appendChild(loading);var button=document.createElement("button");button.className="playerTrigger";var buttonText=document.createElement("span");buttonText.className="buttonText";buttonText.innerHTML="play";button.appendChild(buttonText);var meta=document.createElement("div");meta.className="metaWrapper";var meta_title=document.createElement("span");meta_title.className="titleDisplay";meta_title.innerHTML="File "+(i+1);meta.appendChild(meta_title);var meta_artist=document.createElement("span");meta_artist.className="artistDisplay";meta.appendChild(meta_artist);var timings=document.createElement("div");timings.className="timingsWrapper";var meta_timer=document.createElement("span");meta_timer.className="songPlayTimer";meta_timer.innerHTML="0:00";timings.appendChild(meta_timer);var meta_progress_wrapper=document.createElement("div");meta_progress_wrapper.className="songProgressSliderWrapper";var meta_pseudo_progress_background=document.createElement("div");meta_pseudo_progress_background.className="pseudoProgressBackground";meta_progress_wrapper.appendChild(meta_pseudo_progress_background);var meta_pseudo_progress_indicator=document.createElement("div");meta_pseudo_progress_indicator.className="pseudoProgressIndicator";meta_progress_wrapper.appendChild(meta_pseudo_progress_indicator);var meta_pseudo_progress_playhead=document.createElement("div");meta_pseudo_progress_playhead.className="pseudoProgressPlayhead";meta_progress_wrapper.appendChild(meta_pseudo_progress_playhead);var meta_progress=document.createElement("input");meta_progress.type="range";meta_progress.min=0;meta_progress.max=100;meta_progress.value=0;meta_progress.className="songProgressSlider";meta_progress_wrapper.appendChild(meta_progress);timings.appendChild(meta_progress_wrapper);var meta_duration=document.createElement("span");meta_duration.className="songDuration";meta_duration.innerHTML="-:--";timings.appendChild(meta_duration);var meta_volume=document.createElement("div");meta_volume.className="songVolume";var meta_mute=document.createElement("button");meta_mute.className="songMuteButton";meta_mute.innerHTML="Mute";meta_volume.appendChild(meta_mute);var meta_volume_label_wrapper=document.createElement("div");meta_volume_label_wrapper.className="songVolumeLabelWrapper";var meta_volume_label=document.createElement("span");meta_volume_label.className="songVolumeLabel";meta_volume_label.innerHTML="Volume";meta_volume_label_wrapper.appendChild(meta_volume_label);var meta_volume_value=document.createElement("span");meta_volume_value.className="songVolumeValue";meta_volume_value.innerHTML="10";meta_volume_label_wrapper.appendChild(meta_volume_value);meta_volume.appendChild(meta_volume_label_wrapper);var meta_volume_wrapper=document.createElement("div");meta_volume_wrapper.className="songVolumeSliderWrapper";var meta_pseudo_volume_background=document.createElement("div");meta_pseudo_volume_background.className="pseudoVolumeBackground";meta_volume_wrapper.appendChild(meta_pseudo_volume_background);var meta_pseudo_volume_indicator=document.createElement("div");meta_pseudo_volume_indicator.className="pseudoVolumeIndicator";meta_volume_wrapper.appendChild(meta_pseudo_volume_indicator);var meta_pseudo_volume_playhead=document.createElement("div");meta_pseudo_volume_playhead.className="pseudoVolumePlayhead";meta_volume_wrapper.appendChild(meta_pseudo_volume_playhead);var meta_volume_control=document.createElement("input");meta_volume_control.type="range";meta_volume_control.min=0;meta_volume_control.max=1;meta_volume_control.value=1;meta_volume_control.step=.1;meta_volume_control.className="songVolumeSlider";meta_volume_wrapper.appendChild(meta_volume_control);meta_volume.appendChild(meta_volume_wrapper);newPlayer.appendChild(button);newPlayer.appendChild(meta);newPlayer.appendChild(timings);newPlayer.appendChild(meta_volume);_data[i].parentNode.replaceChild(newPlayer,_data[i])}}function initAudio(_data){var _myAudio=_data.map(function(item,key){var node=new Audio;if(item.preload){node.preload=item.preload}node.src=item.url;if(!isNaN(node.duration)){node.currentTime=0}node.setAttribute("data-song-index",key);node.addEventListener("timeupdate",_triggerUpdateProgress,false);node.addEventListener("loadstart",_loadStart,false);node.addEventListener("canplaythrough",_canplaythrough,false);node.addEventListener("error",_errors,false);node.addEventListener("stalled",_stalled,false);node.addEventListener("waiting",_errors,false);node.addEventListener("progress",_progress,false);playPauseButtons[key].addEventListener("click",_playPauseAudio,false);progressBar[key].addEventListener("input",sliderScrub,false);volumeControl[key].addEventListener("input",volume,false);muteButtons[key].addEventListener("click",_muteUnmuteAudio,false);return node});return _myAudio}function _loadStart(){}function _canplaythrough(){var index=this.getAttribute("data-song-index");_setLengthDisplay(index);_removeClass(wrappers[index],"loading");_getMeta(index)}function _getMeta(i){var url=myAudio[i].src;var fileType=_getFileType(url);var fileName=_getFileName(url);var title=audioElements[i].title;if(title!==""){titleDisplay[i].innerHTML=title}else{titleDisplay[i].innerHTML=fileName+"."+fileType}var artist=audioElements[i].getAttribute("data-artist");if(artist!==""){artistDisplay[i].innerHTML=artist}}function pauseAll(){for(var i=0;i<data.length;i++){myAudio[i].pause()}}function playSong(index){currentSongIndex=index;for(var i=0;i<data.length;i++){if(i!=index){myAudio[i].pause()}}myAudio[index].play()}function sliderScrub(){var value=this.value;var index=this.parentNode.parentNode.parentNode.getAttribute("data-song-index");var duration=myAudio[index].duration;var targetTime=duration*(value/100);targetTime=targetTime.toFixed(2);myAudio[index].currentTime=targetTime;_updateProgress(index)}function volume(){var value=this.value;var index=this.parentNode.parentNode.parentNode.getAttribute("data-song-index");mute(index,false);setVolume(index,value)}function setVolume(index,value){var valueMapped=value*10;var volumePercent=value*100;myAudio[index].volume=value;volumeDisplay[index].innerHTML=valueMapped;volumeControl[index].value=value;volumeIndicator[index].style.width=volumePercent+"%";volumePlayhead[index].style.left=volumePercent+"%"}function mute(index,state){var oldVolume=void 0;if(state){oldVolume=myAudio[index].volume;muteButtons[index].setAttribute("data-saved-volume",oldVolume);setVolume(index,0);_addClass(muteButtons[index],"songMuted");_removeClass(muteButtons[index],"songUnmuted");muteButtons[index].innerHTML="unmute"}else{oldVolume=muteButtons[index].getAttribute("data-saved-volume");if(typeof oldVolume!="undefined"&&oldVolume>0){setVolume(index,oldVolume)}else{setVolume(index,1)}_removeClass(muteButtons[index],"songMuted");_addClass(muteButtons[index],"songUnmuted");muteButtons[index].innerHTML="mute"}}function playPause(index,state){var buttonText=playPauseButtonsText[index];var target=playPauseButtons[index];if(state){for(var i=0;i<playPauseButtons.length;i++){_removeClass(playPauseButtons[i],"songPlaying");_addClass(playPauseButtons[i],"songPaused");playPauseButtonsText[i].innerHTML="play"}playSong(index);_addClass(target,"songPlaying");_removeClass(target,"songPaused");buttonText.innerHTML="pause"}else{pauseAll();_removeClass(target,"songPlaying");_addClass(target,"songPaused");buttonText.innerHTML="play"}}function _playPauseAudio(){var targetSong=this.parentNode.getAttribute("data-song-index");if(typeof targetSong!="undefined"){var _playSong=_hasClass(this,"songPlaying")?false:true;playPause(targetSong,_playSong)}else{console.log("too soon to play!")}}function _muteUnmuteAudio(){var targetSong=this.parentNode.parentNode.getAttribute("data-song-index");var buttonText=playPauseButtonsText[targetSong];if(_hasClass(this,"songMuted")){mute(targetSong,false)}else{mute(targetSong,true)}}function _triggerUpdateProgress(){var index=this.getAttribute("data-song-index");_updateProgress(index)}function _updateProgress(index){var progress=myAudio[index].currentTime;var duration=myAudio[index].duration;var progressParsed=_parseTime(progress);playTimer[index].innerHTML=progressParsed;if(progress>=duration){_removeClass(playPauseButtons[index],"songPlaying")}var progressPercent=(progress/duration*100).toFixed(2);progressBar[index].value=progressPercent;indicator[index].style.width=progressPercent+"%";playhead[index].style.left=progressPercent+"%"}function _setLengthDisplay(index){var songLength=myAudio[index].duration;var duration=_parseTime(songLength);var songClass=".song"+index;songLengthBox[index].innerHTML=duration}function _errors(e){var index=this.getAttribute("data-song-index")}function _error(e){var index=this.getAttribute("data-song-index");var error=myAudio[index].error}function _stalled(e){var index=this.getAttribute("data-song-index");playPause(index,false)}function _waiting(){}function _progress(e){var index=this.getAttribute("data-song-index");var readyState=myAudio[index].readyState}function _parseTime(seconds){var hours=Math.floor(seconds/3600);var mins=Math.floor(seconds%3600/60).toFixed(0).toString();var secs=Math.floor(seconds%3600%60).toFixed(0).toString();secs=secs>10?secs:"0"+secs;var parsedTime=mins+":"+secs;if(hours>0){mins=mins>10?mins:"0"+mins;parsedTime=hours+":"+mins+":"+secs}return parsedTime}function _hasClass(el,className){var result=void 0;if(el.classList){result=el.classList.contains(className)}else{result=new RegExp("(^| )"+className+"( |$)","gi").test(el.className)}return result}function _addClass(el,className){if(el.classList){el.classList.add(className)}else{el.className+=" "+className}}function _removeClass(el,className){if(el.classList){el.classList.remove(className)}else{el.className=el.className.replace(new RegExp("(^|\\b)"+className.split(" ").join("|")+"(\\b|$)","gi")," ")}}function _getFileType(string){return string.substr((~-string.lastIndexOf(".")>>>0)+2)}function _getFileName(string){var fullFileName=string.replace(/^.*[\\\/]/,"");var withNoExtension=fullFileName.split(".")[0];return withNoExtension}return{sliderScrub:sliderScrub,playSong:playSong,pauseAll:pauseAll}}