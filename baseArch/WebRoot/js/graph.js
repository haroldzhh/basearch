hermes = {
    w:960,
    h:480,
    margin:5,
    mmpad:4,
    levelMinHeight:100,
    levelHeight:0,
    nodeMinWidth:100,
    nodezmargin:20,
    lineMargin: 6,
    styles:{
        point: [200,40],
        rateRect: [24,16]
    },
    r:null,
    maps:[],
    lines:[],
    crossLines:[],
    zLinePos:[],
    hLinePos:{},
    nodeArr:[],
    index:0,
    config:0
};

var hermes = hermes || {};

hermes.setMaxWHByNode = function(graph){
	var me = hermes;
	var clientW = me.getViewWidth();
	var clientH = me.getViewHeight();
	var nodeW = 0, nodeH = 0;
	$.each(graph,function(i,item){
		if(nodeW<item.items.length){
			nodeW = item.items.length;
		}
	});
	nodeW = ((nodeW*me.styles.point[0])+((nodeW+1)*me.nodeMinWidth));//+(2*me.margin));
	if(nodeW<clientW){nodeW = clientW;}
	nodeH = graph.length;
	nodeH = ((nodeH*me.styles.point[1])+((nodeH+1)*me.levelMinHeight));//+(2*me.margin));
	if(nodeH<clientH){nodeH = clientH;}
	me.w = nodeW, me.h = nodeH;

};

hermes.draw = function(graph){
	var me = hermes;
	me.clear();
	me.nodeArr = graph;
	me.setMaxWHByNode(me.nodeArr);
	
	me.w = me.w-2;
	me.r.setSize(me.w, me.h);
	$("#content").width(me.w);
	$("#content").height(me.h);
	me.initPos();
	me.buildLine();
	me.fixLine();
	me.drawLine();
};

hermes.resize = function(){
	var me = hermes;
	me.r.setSize(me.w, me.h);
	$("#content").width(me.w);
	$("#content").height(me.h);
};

hermes.initCanvas = function(){
	var me = hermes;
	if(me.nodeArr==undefined||0>=me.nodeArr.length){
		me.w = me.getViewWidth();
		me.h = me.getViewHeight();
		me.r = Raphael("canvas",me.w, me.h);
		me.w = me.getViewWidth();
		me.h = me.getViewHeight();
		me.w = me.w-2;
		me.r.setSize(me.w, me.h);
		$("#content").width(me.w);
		$("#content").height(me.h);
		me.config = 1;
	}
};

hermes.addFirstNode = function(name){
	var me = hermes;
	me.nodeArr = [ {items:[{x:0,y:0,name:name,id:0,pids:[],sids:[]}],itemsize:1} ];
	me.draw(me.nodeArr);
};

hermes.addUpNode = function(currentId,name,selectid,rate){
	var me = hermes;
	var node = me.getLevelById(currentId);
	var pos, pnode;
	var maxid = me.getMaxId();
	if(name){
		if(node.level==0){
			me.nodeArr.insert(0, {items:[{x:0,y:0,name:name,id:maxid,
			    pids:[],sids:[{index:1,pos:node.pos}]}],itemsize:1});
			pos = 0;
			me.nodeArr[(node.level+1)].items[node.pos].pids.insert(
					me.nodeArr[(node.level+1)].items[node.pos].pids.length,
					{index:-1,pos:pos,rate:rate});
		}else{
			pos = me.nodeArr[(node.level-1)].items.length;
			me.nodeArr[(node.level-1)].items.insert(pos,
					{x:0,y:0,name:name,id:maxid,pids:[],sids:[{index:1,pos:node.pos}]});
			me.nodeArr[(node.level-1)].itemsize = me.nodeArr[(node.level-1)].items.length;
			me.nodeArr[node.level].items[node.pos].pids.insert(
					me.nodeArr[node.level].items[node.pos].pids.length,
					{index:-1,pos:pos,rate:rate});
		}
	}else{
		pnode = me.getLevelById(selectid);
		me.nodeArr[pnode.level].items[pnode.pos].sids.insert(
				me.nodeArr[pnode.level].items[pnode.pos].sids.length,
				{index:(node.level-pnode.level),pos:node.pos});
		me.nodeArr[node.level].items[node.pos].pids.insert(
				me.nodeArr[node.level].items[node.pos].pids.length,
				{index:(pnode.level-node.level),pos:pnode.pos,rate:rate});
	}
	var graph = me.nodeArr;
	me.draw(graph);
};

hermes.addDownNode = function(currentId,name,selectid,rate){
	var me = hermes;
	var cnode = me.getLevelById(currentId);
	var pos, snode;
	var maxid = me.getMaxId();
	if(name){
		if(cnode.level==(me.nodeArr.length-1)){
			me.nodeArr.insert(me.nodeArr.length, {items:[{x:0,y:0,name:name,id:maxid,
			    pids:[{index:-1,pos:cnode.pos,rate:rate}],sids:[]}],itemsize:1});
			me.nodeArr[(me.nodeArr.length-2)].items[cnode.pos].sids.insert(
					me.nodeArr[(me.nodeArr.length-2)].items[cnode.pos].sids.length,
					{index:1,pos:0,rate:rate});
		}else{
			pos = me.nodeArr[(cnode.level+1)].items.length;
			me.nodeArr[(cnode.level+1)].items.insert(pos,
					{x:0,y:0,name:name,id:maxid,pids:[{index:-1,pos:cnode.pos,rate:rate}],sids:[]});
			me.nodeArr[cnode.level].items[cnode.pos].sids.insert(
					me.nodeArr[cnode.level].items[cnode.pos].sids.length,
					{index:1,pos:pos,rate:rate});
		}
	}else{
		snode = me.getLevelById(selectid);
		me.nodeArr[snode.level].items[snode.pos].pids.insert(
				me.nodeArr[snode.level].items[snode.pos].pids.length,
				{index:(cnode.level-snode.level),pos:cnode.pos,rate:rate});
		me.nodeArr[cnode.level].items[cnode.pos].sids.insert(
				me.nodeArr[cnode.level].items[cnode.pos].sids.length,
				{index:(snode.level-cnode.level),pos:snode.pos});
	}
	var graph = me.nodeArr;
	me.draw(graph);
};

hermes.getDownNodeList = function(id){
	var me = hermes;
	var returnArr = [];
	var snode = {};
	var cnode = me.getLevelById(id);
	if(cnode.level == (me.nodeArr.length-1)) return [];
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(i<=cnode.level) return true;
			var flag = 1;
			$.each(cnode.nodeobj.sids,function(k,sid){
				snode = me.nodeArr[(cnode.level+sid.index)].items[sid.pos];
				if(snode.id==node.id) {flag = 0;return false;};
			});
			if(flag)
				returnArr.insert(returnArr.length, {id: node.id, name: node.name});
		});
	});
	return returnArr;
};

hermes.getMaxId = function(){
	var me = hermes;
	var _maxid = 0;
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			_maxid+=1;
		});
	});
	return _maxid;
};

hermes.getLevelById = function(id){
	var me = hermes;
	var _node = {};
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(id == node.id) {
				_node = {level:i,pos:j,nodeobj:node};
				return false;
			}
		});
	});
	return _node;
};

hermes.getUpNodeList = function(id){
	var me = hermes;
	var returnArr = [];
	var pnode = {};
	var cnode = me.getLevelById(id);
	if(cnode.level < 1) return [];
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(i>=cnode.level) return false;
			var flag = 1;
			$.each(cnode.nodeobj.pids,function(k,pid){
				pnode = me.nodeArr[(cnode.level+pid.index)].items[pid.pos];
				if(pnode.id==node.id) {flag = 0;return false;};
			});
			if(flag)
				returnArr.insert(returnArr.length, {id: node.id, name: node.name});
		});
	});
	return returnArr;
};

hermes.addVariousNode = function(id,name){
	var me = hermes;
	var graph = [{items:[{x:0,y:0,name:name,id:0,pids:[],sids:[]}],itemsize:1}];
	me.draw(graph);
};

hermes.buildLine = function(){
	var me = hermes;
	var tmp = 0;
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(item.items[j].sids.length>0){
				me.lines[item.items[j].id] = new Array();
				$.each(item.items[j].sids,function(k,sid){
					tmp = me.getAvgPos(me.styles.point[0], 1, item.items[j].sids.length, (k+1));
					var q = me.nodeArr[(i+sid.index)].items[sid.pos].id;
					me.lines[item.items[j].id][q] = {from:{x:(item.items[j].x+tmp),y:(item.items[j].y+
							me.styles.point[1]),id:item.items[j].id,level:i,pos:j},
							to:{x:0,y:0,id:0,level:0,pos:0},rate:0};
				});
			}
		});
	});
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(item.items[j].pids.length>0){
				$.each(item.items[j].pids,function(m,pid){
					tmp = me.getAvgPos(me.styles.point[0], 1, item.items[j].pids.length, (m+1));
					var p = me.nodeArr[(i+pid.index)].items[pid.pos].id;
					me.lines[p][item.items[j].id].to = {x:(item.items[j].x+tmp),
							y:item.items[j].y,id:item.items[j].id,level:i,pos:j};
					me.lines[p][item.items[j].id].rate = pid.rate;
				});
			}
		});
	});
};

hermes.fixLine = function(){
	var me = hermes;
	var level = 0;
	var _node = null;
	$.each(me.lines, function(key,arr){
		if(arr == undefined) return true;
		$.each(arr, function(key2,line){
			if(undefined == line) return true;
			level = (line.to.level-line.from.level);
			if(level>1){
				if(me.crossLines[level]==undefined)
					me.crossLines[level] = new Array();
				me.crossLines[level].insert(me.crossLines[level].length, line);
			}
			if(me.hLinePos[line.from.level+"_"+line.to.level]==undefined)
				me.hLinePos[line.from.level+"_"+line.to.level] = new Array();
			me.hLinePos[line.from.level+"_"+line.to.level].insert(
					me.hLinePos[line.from.level+"_"+line.to.level].length, line.from.x);
		});
	});
	$.each(me.lines, function(key,arr1){
		if(arr1 == undefined) return true;
		$.each(arr1, function(key2,line1){
			if(undefined == line1) return true;
			if(line1.from.x==line1.to.x) return true;
			level = (line1.to.level-line1.from.level);
			$.each(me.hLinePos[line1.from.level+"_"+line1.to.level],function(i,item){
				if(line1.to.x==item){
					_node = me.getLevelById(line1.to.id);
					if(me.lineMargin<=(me.lines[line1.from.id][line1.to.id].to.x-
							me.styles.rateRect[0]/2-_node.nodeobj.x)){
						me.lines[line1.from.id][line1.to.id].to.x-=me.lineMargin;
					}else{
						me.lines[line1.from.id][line1.to.id].to.x+=me.lineMargin;
					}
					return false;
				}
			});
		});
	});
	
	me.crossLines = me.crossLines.reverse();
	$.each(me.nodeArr, function(level, items){
		if(level == 0) return true;
		if(level == (me.nodeArr.length-1)) return true;
		$.each(items.items, function(j,node){
			var tmpX = 0;
			var flag = 0;
			var tmpNodeX = node.x;
			
			$.each(me.crossLines, function(k,lines){
				if(lines == undefined) return true;
				$.each(lines, function(cc,line){
					if(level<=line.from.level||level>=line.to.level) return true;
					tmpX = 0;
					if((line.from.x>=tmpNodeX)&&(line.from.x<=(tmpNodeX+me.styles.point[0]))){
						tmpX = line.from.x + me.mmpad;
					}
					if((line.to.x>=tmpNodeX)&&(line.to.x<=(tmpNodeX+me.styles.point[0]))){
						tmpX = ((line.to.x + me.mmpad)>tmpX)?(line.to.x + me.mmpad):tmpX;
					}
					if(tmpX==0) return true;
					tmpNodeX = (tmpX>tmpNodeX)?tmpX:tmpNodeX;
					flag = 1;
				});
			});
			if(flag){
				var startx = node.x;
				var move = 0;
				me.nodeArr[level].items[j].x = tmpNodeX;
				move = Math.abs((me.nodeArr[level].items[j].x - startx));
				me.moveNode(node.id, {x:me.nodeArr[level].items[j].x,y:node.y});
				$.each(node.pids, function(m, _pid){
					var fromid = me.nodeArr[level+_pid.index].items[_pid.pos].id;
					me.lines[fromid][node.id].to.x += move;
				});
				$.each(node.sids, function(m, _sid){
					var toid = me.nodeArr[level+_sid.index].items[_sid.pos].id;
					me.lines[node.id][toid].from.x += move;
				});
				hermes.w += move;
				hermes.resize();
			}
		});
	});
	
	 
};

hermes.moveNode = function(id, moveto){
	var me = hermes;
	var index = me.maps[id].index;
	var rect = me.maps[id].rect;
	var gdom = $(".graph").eq(index);
	gdom.css("left",moveto.x);
	gdom.css("top",moveto.y);
	rect.attr({x:moveto.x, y:moveto.y});
};

hermes.delNode = function(currid){
	var me = hermes;
	var _psids = [];
	var _node = me.getLevelById(currid);
	if(me.nodeArr.length==1&&me.nodeArr[0].items.length==1)
		return me.clear();
	if(_node.nodeobj.sids==undefined||_node.nodeobj.sids.length<=0){
		$.each(_node.nodeobj.pids, function(i, pid){
			_psids = me.nodeArr[_node.level+pid.index].items[pid.pos].sids;
			$.each(_psids, function(j,psid){
				if((_node.level+pid.index+psid.index)==_node.level
					&& psid.pos==_node.pos){
					 me.nodeArr[_node.level+pid.index].items[pid.pos].sids.splice(j,1);
					 return false;
				}
			});
		});
		me.nodeArr[_node.level].items.splice(_node.pos,1);
		var graph = me.nodeArr;
		me.draw(graph);
	}else{
		alert("只能删除最下层的子公司节点！");
	}
};

hermes.getLevelzPos = function(scope,z){
	var me = hermes;
	var i = 0;
	var top = (scope.top+me.nodezmargin);
	var bottom = (scope.bottom - me.nodezmargin - me.styles.rateRect[1]);
	var m = me.getNodeLevel();
	if((m+me.styles.point[1])<(scope.bottom-scope.top)){
		top = (top+m+me.styles.point[1]+me.nodezmargin);
	}
	for(i=top; i<bottom; i=(i+me.lineMargin)){
		if(undefined == me.zLinePos[i]){
			me.zLinePos[i] = 1;
			return i;
		}
	}
	return z;
};

hermes.drawLine = function(){
	var me = hermes;
	$.each(me.lines, function(key,arr){
		if(arr == undefined) return true;
		$.each(arr, function(key2,line){
			if(undefined == line)
				return true;
			if(line.from.x == line.to.x){
				me.r.path("M"+line.from.x+","+line.from.y+
			    		  " L"+line.to.x+","+(line.to.y-me.styles.rateRect[1])).attr({
					//"stroke":"#2A6570",
					"stroke":"#4848fe",
					"stroke-width":1
			    });
			}else{
				var z = (line.from.y+Math.floor(Math.abs((line.to.y-line.from.y))/2));
				z = me.getLevelzPos({top:line.from.y,bottom:line.to.y},z);
			    me.r.path("M"+line.from.x+","+line.from.y+
			    		  " V"+z+
			    		  " H"+line.to.x+  //左右
			    		  " V"+(line.to.y-me.styles.rateRect[1])).attr({
					//"stroke":"#2A6570",
					"stroke":"#4848fe",
					"stroke-width":1
			    });
			}
		    var hfix = (me.styles.rateRect[0]/2);
		    me.r.path("M"+(line.to.x-hfix)+","+line.to.y+
		    		" V"+(line.to.y-me.styles.rateRect[1])+
		    		" H"+(line.to.x+hfix)+  //左右
		    		" V"+line.to.y).attr({
		    			//"stroke":"#2A6570",
		    			"stroke":"#4848fe",
		    			"stroke-width":1
		    });
		    me.r.text((line.to.x),(line.to.y-me.styles.rateRect[1]/2),line.rate).attr({
		    	"font-size":"10px","fill":"blue","stroke":"red","opacity":".5"});
		});
	});
};

hermes.initPos = function(){
	var me = hermes;
//	var z = 0;
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			item.items[j].x = me.getAvgPos(me.w, me.styles.point[0], item.items.length, (j+1));
			item.items[j].y = me.getAvgPos(me.h, me.styles.point[1], me.nodeArr.length, (i+1));
//			item.items[j].id = z;
//			z = (z + 1);
			me.createGraph(item.items[j],{x:i,y:j});
		});
	});
};

hermes.getNodeLevel = function(){
	var me = hermes;
	var y1,y2 = 0;
	$.each(me.nodeArr,function(i,item){
		$.each(item.items,function(j,node){
			if(1==i){
				y1 = (me.nodeArr[0].items[0].y+me.styles.point[1]);
				y2 = (node.y-y1);
				return false;
			}
		});
	});
	return y2;
};

hermes.clear = function(){
	var me = hermes;
	me.r.clear();
	$("#graph").empty();
	me.maps = [];
	me.lines = [];
	me.zLinePos = [];
	me.nodeArr = [];
	me.index = 0;
	me.hLinePos = {};
	me.crossLines = [];
};

hermes.createGraph = function(graph,pos){
    var me = hermes;
    graph.index = me.index;
    me.index +=1;

	var template = _.template($('#T-graph').html());
	var html = template({"data": graph});

    var stateR  =me.r.rect(0,0,me.styles.point[0],me.styles.point[1]);
    stateR.id = graph.id;
    stateR.attr({x:graph.x, y:graph.y});
    stateR.attr({fill: '#fff', "fill-opacity": 0, "stroke-width":1, 'stroke-opacity':0,cursor: "move"});
		
    $("#graph").append(html);
    var graphDom = $(".graph").eq(graph.index);
    //var width = graphDom.width();
    //width = parseInt(width,10)+10+32+5;
    //width = width < 150?150:width;
    //width = me.styles.point[0];
    graphDom.width(me.styles.point[0]);
    graphDom.height(me.styles.point[1]);
    stateR.attr({width:me.styles.point[0],height:me.styles.point[1]});

    me.maps[graph.id] = {pos:pos,index:graph.index,rect:stateR};
};

hermes.getAvgPos = function(length, single, num,  index){
	var left = length - single*num;
	var fix = Math.floor(left / (num+1));
	return (index*fix+(index-1)*single);
};

hermes.getViewWidth = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
    return client.clientWidth;
};

hermes.getViewHeight = function () {
    var doc = document,
        body = doc.body,
//        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;
    return client.clientHeight;
};

hermes.test5 = function(){
	var me = hermes;
	var graph = [{items:[{x:0,y:0,name:"test0",id:0,pids:[],sids:[{index:1,pos:1},{index:2,pos:1}]},
	                     {x:0,y:0,name:"test1",id:1,pids:[],sids:[{index:1,pos:0},{index:1,pos:1},{index:2,pos:1},{index:1,pos:2}]}]
						,itemsize:2},
	             {items:[{x:0,y:0,name:"test2-0",id:2,pids:[{index:-1,pos:1,rate:80}],sids:[{index:1,pos:0}]},
	                     {x:0,y:0,name:"test2-1",id:2,pids:[{index:-1,pos:0,rate:40},{index:-1,pos:1,rate:41}],sids:[{index:1,pos:1}]},
	                     {x:0,y:0,name:"test2-2",id:3,pids:[{index:-1,pos:1,rate:2}],sids:[{index:1,pos:1}]}],itemsize:3},
	             {items:[{x:0,y:0,name:"test3-0",id:4,pids:[{index:-1,pos:0,rate:20}],sids:[]},
	                     {x:0,y:0,name:"test3-1",id:4,pids:[{index:-2,pos:0,rate:20},{index:-1,pos:1,rate:22},
	                                                        {index:-2,pos:1,rate:24},{index:-1,pos:2,rate:26}],sids:[]}],itemsize:2}];
	me.draw(graph);
};


$(document).ready(function(){
	hermes.initCanvas();
});

/*hermes.test = function(){
	var rate = $('#rate').get(0).value;
	var compname = $('#companyname').get(0).value;
    var gra = {"id": 31,
                "rate": rate,
                "compname": compname,
                "xCoordinate": 100,
                "yCoordinate": 100,
				"relations":[{"id":20,"rate":20}]
				};
	//var d = {"dd":3};
	hermes.showGraph();
    hermes.createGraph(0,gra);
};*/
