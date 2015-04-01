$(function(){
    $('#btn1').click(function(){
        if ( event && event.stopPropagation ) { 
            // this code is for Mozilla and Opera 
        event.stopPropagation(); 
    } 
    else if (window.event) { 
            // this code is for IE 
        window.event.cancelBubble = true; 
    }
        $('#div1').show();
    });
	$('#btnok').click(function(){
        if ( event && event.stopPropagation ) { 
        	event.stopPropagation(); 
        } 
        else if (window.event) { 
        	window.event.cancelBubble = true; 
        }
        $('#div1').hide();
        hermes.test();
    });
    /*$(document).click(function(){
        $('#div1').hide();
    });*/
});

Array.prototype.insert = function (index, item) { 
	this.splice(index, 0, item); 
};

if (!document.all) document.captureEvents(Event.MOUSEDOWN);
var _Tmenu = 0;
var _Amenu = 0;
var _Type = 'A';
var _Menu = "null";

document.body.onclick = _Hidden;

function _Hidden() {
  $('#main').empty();
  if (_Tmenu == 0) return;
  document.getElementById(_Tmenu).style.visibility = 'hidden';
  _Tmenu = 0;
}

document.oncontextmenu = function (e) {
  _Hidden();
  var _Obj = document.all ? event.srcElement : e.target;
  if (_Type.indexOf(_Obj.tagName) == -1) return;
  if('svg'==_Obj.tagName||'v'==_Obj.tagName){
	  _Obj.setAttribute('menu','main');
	  if(hermes.nodeArr==undefined||0>=hermes.nodeArr.length){
		  $('#main').append("<a href='javascript:addfirstNode();'>新建公司节点</a> ");
	  }else{
		  $('#main').append("<a href=\"javascript:if(window.confirm('你确定要清空当前画布吗？')){" +
			"clearCanvas();}else{_Hidden();}\">清空画布</a> ");
	  }
  }
  _Amenu = _Obj.getAttribute('menu');
  var data_id = _Obj.getAttribute('data-id');
  _dataid = data_id;
  if (_Amenu == 'null') return;
  if (document.all) e = event;

  _ShowMenu(_Amenu, e);
  return false;
};

function _ShowMenu(Eid, event) {
  _Menu = document.getElementById(Eid);

  var _Top = 0,_Left = 0;
  leftFix =  document.body.scrollLeft || document.documentElement.scrollLeft;
  topFix = document.body.scrollTop || document.documentElement.scrollTop;
  _Left = event.clientX + leftFix;
  _Top = event.clientY + topFix;
  _Menu.style.left = _Left.toString() + 'px';
  _Menu.style.top = _Top.toString() + 'px';
//  $("#content").width(hermes.w);
//  $("#content").height(hermes.h);
  _Menu.style.visibility = 'visible';
  _Tmenu = Eid;
  _Menu.onclick = transfer;
  _Menu.oncontextmenu = no_context_menu;
}

function transfer(e) {
  e = e || window.event; e.cancelBubble = true;
}

function no_context_menu(e) {
  e = e || window.event;
  e = e || window.event; e.cancelBubble = true;
  return;
}

function addUpNode(){
	$("#selectup").empty();
	$("#selectup").append("<option value =\"-1\">请选择......</option>");
	var upNode = hermes.getUpNodeList(_dataid);
	$.each(upNode,function(i,node){
		$("#selectup").append("<option value='"+node.id+"'>"+node.name+"</option>");
	});
	$("#currentid").val(_dataid);
	showDiv('addUpDiv');
	$("#upnode")[0].focus();
	_Hidden();
}
function addDownNode(){
	$("#selectdown").empty();
	$("#selectdown").append("<option value =\"-1\">请选择......</option>");
	var downNode = hermes.getDownNodeList(_dataid);
	$.each(downNode,function(i,node){
		$("#selectdown").append("<option value='"+node.id+"'>"+node.name+"</option>");
	});
	$("#currentid").val(_dataid);
	showDiv('addDownDiv');
	$("#downnode")[0].focus();
	_Hidden();
}
function delCurrNode(){
	if(window.confirm('你确定要删除当前节点吗？')){
		hermes.delNode(_dataid);
	}
	_Hidden();
}
function addvariousNode(){
	showDiv('addvariousDiv');
	$("#currentid").val(_dataid);  
	_Hidden();
}
function addfirstNode(){
	showDiv('addfirstDiv');
	$("#first")[0].focus();  
	_Hidden();
}
function clearCanvas(){
	hermes.clear();
	_Hidden();
}

//function getScrollWidth() {
//	  var noScroll, scroll, oDiv = document.createElement("DIV");
//	  oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
//	  noScroll = document.body.appendChild(oDiv).clientWidth;
//	  oDiv.style.overflowY = "scroll";
//	  scroll = oDiv.clientWidth;
//	  document.body.removeChild(oDiv);
//	  return noScroll-scroll;
//}

  
