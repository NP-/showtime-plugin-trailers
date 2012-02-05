/**
 *  Trailers plugin for showtime version 0.25  by NP
 *
 * 	Change Log:
 * 	0.25
 *  Added IMDb Scrapper and video gallery support
 * 	Added HD trailers and Dave Trailers
 *  Upgrade bookmark system
 * 	0.24
 *  Fix apple trailers problem
 * 	IMDb and TMDb improvements
 *  0.23
 * 	Full Trailer-Welt.de Support
 *  0.22
 * 	Added Trailer-Welt.de feed Support
 *  0.21
 *  code clean up
 *  0.2
 *  Major rewrite
 * 	Added TMDb Showtime Key
 *  Added Search Support
 *  Added Bookmarks
 * 	0.11
 * 	Add http headerfix (dirty)
 *	Required version 3.1.188 
 * 
 *  Copyright (C) 2011 NP
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
//TODO: 


(function(plugin) {


var PREFIX = 'trailers:';
var YAHOO_PIPES = 'http://pipes.yahoo.com/pipes/pipe.run?_id=';
var MOVIES_IMG = "http://image.torrent-invites.com/images/360movies.png";
var NO_POSTER = 'http://moviecarpet.com/wp-content/uploads/2011/05/no-poster.jpg';
var HDTRAILERS = 'http://www.hd-trailers.net/';
var IMDB_LOGO = 'http://userlogos.org/files/logos/Sucka/imdb_new.png';
var HDTRAILERS_LOGO = "http://static.hd-trailers.net/images/title.png";
var debug = 0;

//showtime TMDb API key 
var apikey = "d0fd11e3f0bf829c781c3c6c017e8662";


var CHAR_LIST = [
//hex and others	
[/&#x27;/gi, "'"], 		[/&#038;/gi, "&"], 		[/&#x26;/gi, "&"], 		[/&amp;<br\/>/gi, "&"],				
[/&amp;/gi, '&'], 		[/&#xF4/gi, "o"], 		[/&#x22;/gi, ""], 		[/&#x2B;/gi, "e"],
[/&#xC6;/gi, "AE"], 	[/&#xC7;/gi, "C"], 		[/&#xB0;/gi, "º"], 		[/&#xED;/gi, "í"],
[/&#xEE;/gi, "î"],		[/&#xB3;/gi, "3"],	 	[/&nbsp;/gi, ""],		[/&#8211;/gi, "-"],
[/&frac12;/gi, "1/2"], 	[/&#xE9;/gi, "é"],		[/&#039;/gi, "'"],		[/&quot;/gi, ' '],
[/&#163;/gi , '£'],		[/&#8217;/gi, "'"],		[/&#xF1;/gi, "ñ"],		[/&#xF6;/gi , 'ö'],
[/&#xC1;/gi , 'Á '],	[/&#39;/gi, "'"], //list
[/&copy;/gi, '©'], 		[/&#33;/gi, '!'], 		[/&#95;/gi, '_'], 		[/&#157;/gi, ''], 	[/&#219;/gi, 'Û'],
[/&reg;/gi, '®'], 		[/&#34;/gi, '"'],		[/&#96;/gi, '`'], 		[/&#158;/gi, 'ž'], 		[/&#220;/gi, 'Ü'],
[/&nbsp;/gi, ' '],		[/&#35;/gi, '#'],		[/&#97;/gi, 'a'], 		[/&#159;/gi, 'Ÿ'], 		[/&#221;/gi, 'Ý'],	
[/&quot;/gi, '"'], 		[/&#36;/gi, '$'], 		[/&#98;/gi, 'b'], 		[/&#160;/gi, ' '], 		[/&#222;/gi, 'Þ'],	
[/&amp;/gi, '&'], 		[/&#37;/gi, '%'],		[/&#99;/gi, 'c'], 		[/&#161;/gi, '¡'], 		[/&#223;/gi, 'ß'],	
[/&lt;/gi, '<'],		[/&#38;/gi, '&'],		[/&#100;/gi, 'd'],		[/&#162;/gi, '¢'],		[/&#224;/gi, 'à'],	
[/&gt;/gi, '>'],		[/&#39;/gi, "'"],		[/&#101;/gi, 'e'],		[/&#163;/gi, '£'],		[/&#225;/gi, 'á'],	
[/&Agrave;/gi, 'À'],	[/&#40;/gi, '('],		[/&#102;/gi, 'f'],		[/&#164;/gi, '¤'],		[/&#226;/gi, 'â'],	
[/&Aacute;/gi, 'Á'],	[/&#41;/gi, ')'],		[/&#103;/gi, 'g'],		[/&#165;/gi, '¥'],		[/&#227;/gi, 'ã'],	
[/&Acirc;/gi, 'Â'],		[/&#42;/gi, '*'],		[/&#104;/gi, 'h'],		[/&#166;/gi, '¦'],		[/&#228;/gi, 'ä'],	
[/&Atilde;/gi, 'Ã'],	[/&#43;/gi, '+'],		[/&#105;/gi, 'i'],		[/&#167;/gi, '§'],		[/&#229;/gi, 'å'],	
[/&Auml;/gi, 'Ä'],		[/&#44;/gi, ','],		[/&#106;/gi, 'j'],		[/&#168;/gi, '¨'],		[/&#230;/gi, 'æ'],	
[/&Aring;/gi, 'Å'],		[/&#45;/gi, '-'],		[/&#107;/gi, 'k'],		[/&#169;/gi, '©'],		[/&#231;/gi, 'ç'],	
[/&AElig;/gi, 'Æ'],		[/&#46;/gi, '.'],		[/&#108;/gi, 'l'],		[/&#170;/gi, 'ª'],		[/&#232;/gi, 'è'],	
[/&Ccedil;/gi, 'Ç'],	[/&#47;/gi, '/'],		[/&#109;/gi, 'm'],		[/&#171;/gi, '«'],		[/&#233;/gi, 'é'],	
[/&Egrave;/gi, 'È'],	[/&#48;/gi, '0'],		[/&#110;/gi, 'n'],		[/&#172;/gi, '¬'],		[/&#234;/gi, 'ê'],	
[/&Eacute;/gi, 'É'],	[/&#49;/gi, '1'],		[/&#111;/gi, 'o'],		[/&#173;/gi, ' '],		[/&#235;/gi, 'ë'],	
[/&Ecirc;/gi, 'Ê'],		[/&#50;/gi, '2'],		[/&#112;/gi, 'p'],		[/&#174;/gi, '®'],		[/&#236;/gi, 'ì'],	
[/&Euml;/gi, 'Ë'],		[/&#51;/gi, '3'],		[/&#113;/gi, 'q'],		[/&#175;/gi, '¯'],		[/&#237;/gi, 'í'],	
[/&Igrave;/gi, 'Ì'],	[/&#52;/gi, '4'],		[/&#114;/gi, 'r'],		[/&#176;/gi, '°'],		[/&#238;/gi, 'î'],	
[/&Iacute;/gi, 'Í'],	[/&#53;/gi, '5'],		[/&#115;/gi, 's'],		[/&#177;/gi, '±'],		[/&#239;/gi, 'ï'],	
[/&Icirc;/gi, 'Î'],		[/&#54;/gi, '6'],		[/&#116;/gi, 't'],		[/&#178;/gi, '²'],		[/&#240;/gi, 'ð'],	
[/&Iuml;/gi, 'Ï'],		[/&#55;/gi, '7'],		[/&#117;/gi, 'u'],		[/&#179;/gi, '³'],		[/&#241;/gi, 'ñ'],	
[/&ETH;/gi, 'Ð'],		[/&#56;/gi, '8'],		[/&#118;/gi, 'v'],		[/&#180;/gi, '´'],		[/&#242;/gi, 'ò'],	
[/&Ntilde;/gi, 'Ñ'],	[/&#57;/gi, '9'],		[/&#119;/gi, 'w'],		[/&#181;/gi, 'µ'],		[/&#243;/gi, 'ó'],	
[/&Otilde;/gi, 'Õ'],	[/&#58;/gi, ':'],		[/&#120;/gi, 'x'],		[/&#182;/gi, '¶'],		[/&#244;/gi, 'ô'],	
[/&Ouml;/gi, 'Ö'],		[/&#59;/gi, ';'],		[/&#121;/gi, 'y'],		[/&#183;/gi, '·'],		[/&#245;/gi, 'õ'],	
[/&Oslash;/gi, 'Ø'],	[/&#60;/gi, '<'],		[/&#122;/gi, 'z'],		[/&#184;/gi, '¸'],		[/&#246;/gi, 'ö'],	
[/&Ugrave;/gi, 'Ù'],	[/&#61;/gi, '='],		[/&#123;/gi, '{'],		[/&#185;/gi, '¹'],		[/&#247;/gi, '÷'],	
[/&Uacute;/gi, 'Ú'],	[/&#62;/gi, '>'],		[/&#124;/gi, '|'],		[/&#186;/gi, 'º'],		[/&#248;/gi, 'ø'],	
[/&Ucirc;/gi, 'Û'],		[/&#63;/gi, '?'],		[/&#125;/gi, '}'],		[/&#187;/gi, '»'],		[/&#249;/gi, 'ù'],	
[/&Uuml;/gi, 'Ü'],		[/&#64;/gi, '@'],		[/&#126;/gi, '~'],		[/&#188;/gi, '¼'],		[/&#250;/gi, 'ú'],	
[/&Yacute;/gi, 'Ý'],	[/&#65;/gi, 'A'],		[/&#127;/gi, '?'],		[/&#189;/gi, '½'],		[/&#251;/gi, 'û'],	
[/&THORN;/gi, 'Þ'],		[/&#66;/gi, 'B'],		[/&#128;/gi, '€'],		[/&#190;/gi, '¾'],		[/&#252;/gi, 'ü'],
[/&szlig;/gi, 'ß'],		[/&#67;/gi, 'C'],		[/&#129;/gi, ''],		[/&#191;/gi, '¿'],		[/&#253;/gi, 'ý'],	
[/&agrave;/gi, 'à'],	[/&#68;/gi, 'D'],		[/&#130;/gi, '‚'],		[/&#192;/gi, 'À'],		[/&#254;/gi, 'þ'],	
[/&aacute;/gi, 'á'],	[/&#69;/gi, 'E'],		[/&#131;/gi, 'ƒ'],		[/&#193;/gi, 'Á'],		[/&#255;/gi, 'ÿ'],	
[/&aring;/gi, 'å'],		[/&#70;/gi, 'F'],		[/&#132;/gi, '„'],		[/&#194;/gi, 'Â'],		 	 
[/&aelig;/gi, 'æ'],		[/&#71;/gi, 'G'],		[/&#133;/gi, '…'],		[/&#195;/gi, 'Ã'],		 	 
[/&ccedil;/gi, 'ç'],	[/&#72;/gi, 'H'],		[/&#134;/gi, '†'],		[/&#196;/gi, 'Ä'],		 	 
[/&egrave;/gi, 'è'],	[/&#73;/gi, 'I'],		[/&#135;/gi, '‡'],		[/&#197;/gi, 'Å'],		 	 
[/&eacute;/gi, 'é'],	[/&#74;/gi, 'J'],		[/&#136;/gi, 'ˆ'],		[/&#198;/gi, 'Æ'],		 	 
[/&ecirc;/gi, 'ê'],		[/&#75;/gi, 'K'],		[/&#137;/gi, '‰'],		[/&#199;/gi, 'Ç'],		 	 
[/&euml;/gi, 'ë'],		[/&#76;/gi, 'L'],		[/&#138;/gi, 'Š'],		[/&#200;/gi, 'È'],		 	 
[/&igrave;/gi, 'ì'],	[/&#77;/gi, 'M'],		[/&#139;/gi, '‹'],		[/&#201;/gi, 'É'],		 	 
[/&iacute;/gi, 'í'],	[/&#78;/gi, 'N'],		[/&#140;/gi, 'Œ'],		[/&#202;/gi, '?'],		 	 
[/&icirc;/gi, 'î'],		[/&#79;/gi, 'O'],		[/&#141;/gi, ''],		[/&#203;/gi, 'Ë'],		 	 
[/&iuml;/gi, 'ï'],		[/&#80;/gi, 'P'],		[/&#142;/gi, 'Ž'],		[/&#204;/gi, 'Ì'],		 	 
[/&eth;/gi, 'ð'],		[/&#81;/gi, 'Q'],		[/&#143;/gi, ''],		[/&#205;/gi, 'Í'],		 	 
[/&ntilde;/gi, 'ñ'],	[/&#82;/gi, 'R'],		[/&#144;/gi, ''],		[/&#206;/gi, 'Î'],		 	 
[/&ograve;/gi, 'ò'],	[/&#83;/gi, 'S'],		[/&#145;/gi, '‘'],		[/&#207;/gi, 'Ï'],		 	 
[/&oacute;/gi, 'ó'],	[/&#84;/gi, 'T'],		[/&#146;/gi, '’'],		[/&#208;/gi, 'Ð'],		 	 
[/&ocirc;/gi, 'ô'],		[/&#85;/gi, 'U'],		[/&#147;/gi, '“'],		[/&#209;/gi, 'Ñ'],		 	 
[/&otilde;/gi, 'õ'],	[/&#86;/gi, 'V'],		[/&#148;/gi, '”'],		[/&#210;/gi, 'Ò'],		 	 
[/&ouml;/gi, 'ö'],		[/&#87;/gi, 'W'],		[/&#149;/gi, '•'],		[/&#211;/gi, 'Ó'],		 	 
[/&oslash;/gi, 'ø'],	[/&#88;/gi, 'X'],		[/&#150;/gi, '–'],		[/&#212;/gi, 'Ô'],		 	 
[/&ugrave;/gi, 'ù'],	[/&#89;/gi, 'Y'],		[/&#151;/gi, '—'],		[/&#213;/gi, 'Õ'],		 	 
[/&uacute;/gi, 'ú'],	[/&#90;/gi, 'Z'],		[/&#152;/gi, '˜'],		[/&#214;/gi, 'Ö'],		 	 
[/&ucirc;/gi, 'û'],		[/&#91;/gi, "["],		[/&#153;/gi, '™'],		[/&#215;/gi, '×'],		 	 
[/&yacute;/gi, 'ý'],	[/&#92;/gi, '\\'],		[/&#154;/gi, 'š'],		[/&#216;/gi, 'Ø'],		 	 
[/&thorn;/gi, 'þ'],		[/&#93;/gi, "]"],		[/&#155;/gi, '›'],		[/&#217;/gi, 'Ù'],		 	 
[/&yuml;/gi, 'ÿ'],		[/&#94;/gi, '^'],		[/&#156;/gi, 'œ'],		[/&#218;/gi, 'Ú'],
[/&#xE7;/gi, 'ç'], 		[/&#xE1;/gi, 'á'],		[/&#xE3;/gi, 'ã'],		[/&#xFA;/gi, 'ú'],
[/&#x27;/gi, "'"],		[/&#x26;/gi, '&'], 		[/&#xE5;/gi, 'å'],		[/&#xEB;/gi, 'ë'],
[/&#xE0;/gi, 'â'],		[/&#xFB;/gi, 'û'],		[/&#xE8;/gi, 'è'],
];


			   
//settings 

  var service =
    plugin.createService("Trailers", PREFIX + "start", "tv", true,
			   plugin.path + "movies.png");
  
  var settings  = plugin.createSettings("Trailers",
					  plugin.path + "movies.png",
					 "Movie Trailers");

  settings.createInfo("info",
			     plugin.path + "movies.png",
			     "This Plugin uses several websites as sources for trailers links.\n"+
			     "The supported websites are:\n"+
			     "		davestrailerpage.co.uk\n"+
			     "		hd-trailers.net\n"+
			     "		imdb.com\n"+
			     "		trailer-welt.de  (German)\n\n"+
			     "The imdb support, gives access to more them the usual Trailers.\n"+
			     "Trailer origins include: Apple Trailers, Yahoo Movies and numerous studio sources,\n"+
			     "be sure to visit them as they host the trailers, this plugin merely provide easy to view\n"+ 
			     "direct links. ... \n"+
				 "Plugin developed by NP \n");


	settings.createBool("youtube", "Support Youtube links (requires youtube plugin)", false, function(v) {
	    service.youtube = v;
	  });
	
	
	settings.createBool("hd", "HD", false, function(v) {
	    service.hd = v;
	  });
	
	
	settings.createBool("fullhd", "Full HD", false, function(v) {
	    service.fullhd = v;
	  });

	settings.createMultiOpt("movieInfo", "Movie Info", [['1', 'IMDb Scraper', true], ['2', 'TMDb'], ['3', 'IMDbApi.com']], function(v){ service.movieinfo = v; });
	
  
//store
	var bookmarks = plugin.createStore('bookmarks', true);

	if(!bookmarks.movies || bookmarks.movies.indexOf('\t') != -1 || bookmarks.movies == '' )
		bookmarks.movies = '[]';

	//http header fix
	plugin.addHTTPAuth("http:\/\/trailers\.apple\.com\/.*", function(authreq) {
	    authreq.setHeader("User-Agent", "QuickTime");
	  });




function startPage(page) {      
	
	page.type = "directory";
    page.contents = "items";
	page.metadata.logo = plugin.path + "movies.png";
	page.metadata.title = 'Select Source';
	


	page.appendItem(PREFIX + "davestrailerpage", "directory", {
		title: "Daves Trailers",
		icon: plugin.path + "movies.png"
	});

	page.appendItem(PREFIX + "hdtrailers", "directory", {
		title: "HD Trailers",
		icon: HDTRAILERS_LOGO
	});

	page.appendItem(PREFIX + "imdb:latest", "directory", {
		title: "IMDb Trailers",
		icon: IMDB_LOGO
	});

	page.appendItem(PREFIX + "trailer-welt", "directory", {
		title: "Trailer Welt",
		icon: 'http://www.trailer-welt.de/menu/logo.gif'
	});

	if(bookmarks.movies.length>10)
		page.appendItem(PREFIX + "bookmarks", "directory", {
			title: "Bookmarks"
			});

  page.loading = false;	
}  

//davestrailerpage
plugin.addURI(PREFIX + "davestrailerpage", function(page) {
	
	page.type = "directory";
    page.contents = "video";
	page.metadata.logo = plugin.path + "movies.png";
	
	var trailers = new XML(showtime.httpGet("http://trailers.apple.com/trailers/home/rss/newtrailers.rss").toString());
	page.metadata.title = trailers.channel.title.toString() +" "+ trailers.channel.lastBuildDate.toString()	;
	
	for each (var item in trailers.channel.item) {
		  	
		var img = item.toString().match('src=".*"').toString();


		var metadata = {
		      title: item.title,
		      description: item.description,
		      year: item.pubDate,
		      icon: img.slice(img.indexOf('src=')+5, img.indexOf('" ',img.indexOf('src=')+5))
		  };
		  
		var file = item.link.toString().slice(item.link.toString().lastIndexOf('/',item.link.toString().length-2)+1, (item.link.toString().length-1));
	
		if(item.title.toString().match('Trailer') != null)
			file += '-tlr';
			
		if(item.title.toString().match('Clip') != null)
			file += '-clip';
			
		if(item.title.toString().match('Featurette') != null)
			file += '-ftr';
			
		if(item.link.toString().match('Teaser') != null)
			file += '-tsr';
			
		//default
		if(file.toString().match('-') == null)
			file += '-tlr';
			
		var nbr = item.title.toString().match(' - .*').toString().match('[0-9]');
	
		if(nbr != null){
			nbr = parseFloat(nbr.toString());
			}else{ nbr = '1'; }
	
		file += nbr.toString();
		
		var quality = '_h480p.mov';
		
		if (service.hd == "1")
			quality = '_h720p.mov';
			
		if (service.fullhd == "1")
			quality = '_h1080p.mov';
			
		file = item.link.toString().replace('/trailers/','/movies/') + file + quality;
		if(!showtime.probe(file).result)		
			page.appendItem(file,"video", metadata);   
  }
   

	page.appendItem(PREFIX + "more:recent:b14c5154c772847b586c9f58b2f213b5", "directory", {
		title: "Recent"
		});

	page.appendItem(PREFIX + "more", "directory", {
		title: "More"
		});

  page.loading = false;

});


//HD Trailers
plugin.addURI( PREFIX + "hdtrailers", function(page) {
	page.type = "directory";
	page.contents = "video";
	page.metadata.logo = HDTRAILERS_LOGO;
	
	var trailers = new XML(showtime.httpGet("http://feeds.hd-trailers.net/hd-trailers").toString());
	page.metadata.title = trailers.channel.lastBuildDate.toString()	;
	var url = false;
	var title = '';
	for each (var item in trailers.channel.item) {
		 
		var metadata = {
		      title: item.title,
		      description: item.description,
		      year: item.pubDate,
		      icon: getValue(item.toString(), 'src="', '"')
		  };
		  
		if (service.fullhd == "1")
			url = getValue(item.toString(), '"', '"&gt;1080p&lt', 'endRef');
		else if (service.hd == "1")
			url = getValue(item.toString(), '"', '"&gt;720p&lt', 'endRef');
		else if (!url || url == '')
			url = getValue(item.toString(), '"', '"&gt;480p&lt', 'endRef');
		
		if(url.indexOf('youtube.com')==-1){
			page.appendItem(url.replace(/amp;amp;/gi,''),"video", metadata);
		}else if(url.indexOf('clipconverter.cc')==-1 && service.youtube == "1"){
			page.appendItem('youtube:video:simple:'+ escape(metadata.title) + ':' + getValue(url, 'v=', '&')
			 ,"video", metadata);
		} 
		url = false;  
	}
	
	page.appendItem(PREFIX + "hdtrailers:list:page","directory", { title: "Latest" });
	page.appendItem(PREFIX + "hdtrailers:list:topmovies","directory", { title: "Top 10" });
	page.appendItem(PREFIX + "hdtrailers:list:openingthisweek","directory", { title: "Opening" });
	page.appendItem(PREFIX + "hdtrailers:list:comingsoon","directory", { title: "Coming Soon" });
	page.appendItem(PREFIX + "hdtrailers:letters","directory", { title: "A-Z" });


	page.loading = false;	
});

plugin.addURI( PREFIX + "hdtrailers:letters", function(page, category) {
	page.type = "directory";
    page.contents = "items"; 
    page.metadata.logo = HDTRAILERS_LOGO;

	var letter = ['0','A', "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",  "W", "X", "Y", "Z" ];
	
	for each (var item in letter)
		page.appendItem( PREFIX + 'hdtrailers:list:PosterLibrary/'+ item , "directory", { title: item });
				
	page.loading = false;	
});


plugin.addURI( PREFIX + "hdtrailers:list:(.*)", function(page, category) {
	page.type = "directory";
    page.contents = "items"; 
    page.metadata.logo = HDTRAILERS_LOGO;
	
	var content = showtime.httpGet(HDTRAILERS + category).toString()
	page.metadata.title = getValue(content, '<title>', '</title>');
	var next = getValue(content, '"', '">Next &#8811', 'endRef');		
	content = getValue(content, '<table class="indexTable">', '</table>');
	content = content.split('<td class="indexTableTrailerImage">');
	for each (var film in content){
		if(getValue(film, 'title="', '"') != '')
			page.appendItem( PREFIX + 'hdtrailers:present:'+ getValue(film, 'href="','"'), "video", 
						{ title:  getValue(film, 'title="', '"'),
						  icon:	getValue(film, 'src="', '"')});
	}		

	if(next != '')
		page.appendItem( PREFIX + 'hdtrailers:list:'+ next , "directory", { title:  'Next' });
		
	page.loading = false;	
});


plugin.addURI( PREFIX + "hdtrailers:listsources:(.*)", function(page, category) {
	page.type = "directory";
    page.contents = "videos"; 
    page.metadata.logo = HDTRAILERS_LOGO;
	
	var content = showtime.httpGet(HDTRAILERS + category).toString()
	page.metadata.title = getValue(content, '<title>', '</title>');
	content = getValue(content, '<table class="bottomTable">', '</table>');
	content = content.split('<td class="bottomTableDate" rowspan="2">');
	var url = '';
	var title = '';
	for each (var film in content){
		if (service.fullhd == "1")
			url = getValue(film, '"', '" rel="lightbox[res1080p', 'endRef');
		else if (service.hd == "1")
			url = getValue(film, '"', '" rel="lightbox[res720p', 'endRef');
		else if (!url || url == '')
			url = getValue(film, '"', '" rel="lightbox[res480p', 'endRef');
		
		title =  getValue(film, 'itemprop="name">', '<');
		if( url != '' && url.indexOf('youtube.com')==-1){
			page.appendItem(url.replace(/amp;amp;/gi,''), "video", { title: title});
		}else if( url != '' && url.indexOf('clipconverter.cc')==-1 && service.youtube == "1"){
			page.appendItem('youtube:video:simple:'+ escape(title) + ':' + getValue(url, 'v=', '&')
			 ,"video", { title: title});
		}
		url = '';
		title = '';
	}
		
	page.loading = false;	
});


plugin.addURI( PREFIX + "hdtrailers:present:(.*)", function(page, category) {
    page.metadata.logo = HDTRAILERS_LOGO;	
	var content = showtime.httpGet(HDTRAILERS + category).toString()
	var title = getValue(content, '<title>', '</title>');
	page.metadata.title = title;
	
	var icon = getValue(content, '<meta property="og:image" content="', '"');
	page.metadata.icon = icon;
	page.appendPassiveItem("bodytext", new showtime.RichText(getValue(content, '<meta name="description" content="', '"')));
	
	page.appendAction("navopen", getValue(content, '"', '" class="playLatest"', 'endRef').replace(/amp;amp;/gi,''), true, {
				title: "Play Latest"
				});
	
	page.appendAction("navopen", PREFIX + 'hdtrailers:listsources:' + category, true, {
				title: "List Trailers"
				});
	
	if(!bookmarked(category, 'hdtrailers:present:'))
		var bookmakrButton = page.appendAction("pageevent", "bookmark", true,{ title: "Bookmark" });
	else		
		var bookmakrButton = page.appendAction("pageevent", "bookmark_remove", true,{ title: "Remove Bookmark" });
	
	page.type = "item";	
	page.loading = false;
	
	page.onEvent('bookmark', function(){				
						if(!bookmarked(category,'hdtrailers:present:')){
							bookmark(category, title, 'hdtrailers:present:')
							showtime.message('Bookmarked: '+ title, true, false);
						}else
							showtime.message('Already Bookmarked: '+ title, true, false);
				});

	page.onEvent('bookmark_remove', function(){ 
						if(!bookmarked(category, 'hdtrailers:present:')){
							showtime.message(title +' Not bookmarked ', true, false);
						}else{
							bookmark_remove(category,title, 'hdtrailers:present:');
							showtime.message(title + ' bookmark removed' , true, false);
						}
				});

});


/*
 * IMDb Trailers
 */

plugin.addURI( PREFIX + "imdb:(.*)", function(page, category){

	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = IMDB_LOGO;
	
	var imdbCat = {'most': {'name': 'Most-Watched Trailers'}, 
				   'latest': {'name': 'Latest Trailers'},
				   'open': {'name': 'Opening This Week and Coming Soon'},
				   'family': {'name': 'Family Films'},
				   'indie': {'name': 'Indie Films<'},
				   'fields': ['most','latest','open','family','indie']
				   };
	category = eval('imdbCat.' + category);
	
	page.metadata.title = 'IMDb ' + category.name ;

	var content = showtime.httpGet('http://www.imdb.com/features/video/trailers').toString();
	content = getValue(content, category.name, '<br style="clear: left;" />');
	content = cleanString(content);
	content = content.split('<div class="slate"> ');
	
	for each (var video in content){
		if(getValue(video, 'alt="', ' -') != '')
			page.appendItem( PREFIX + 'imdb:play:' + getValue(video, 'href="/video/', '"'), "video",
				{ title: getValue(video, 'alt="', ' -'),
				  icon:  getValue(video, 'src="', '"'),
				  description: getValue(video, 'title="', '"')});

	}
	var aux = 0;
	for each (var cat in imdbCat){
		if(cat != category && aux < 5)
			page.appendItem( PREFIX + 'imdb:'+imdbCat.fields[aux], "directory", { title:  cat.name,
			   icon: IMDB_LOGO });
		aux++;
	}

  page.appendItem( PREFIX + 'imdb:a-z:film/', "directory", { title:  'Full-Length Movies',
	   icon: IMDB_LOGO });

  page.appendItem( PREFIX + 'imdb:a-z:tv/', "directory", { title:  'Full-Length TV Episodes',
	   icon: IMDB_LOGO });

  page.appendItem( PREFIX + 'imdb:a-z:trailer/', "directory", { title:  'Trailers',
	   icon: IMDB_LOGO });

  page.appendItem( PREFIX + 'imdb:a-z:clip/', "directory", { title:  'Clips',
	   icon: IMDB_LOGO });

  page.appendItem( PREFIX + 'imdb:a-z:indie/', "directory", { title:  'Indie Films and Shorts',
	   icon: IMDB_LOGO });

	page.loading = false; 	
});

plugin.addURI( PREFIX + "imdb:a-z:(.*)", function(page, link){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = IMDB_LOGO;

	var letter = ['#','A', "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",  "W", "X", "Y", "Z" ];
	
	for each (var url in letter){
		page.appendItem( PREFIX + "imdblist:" + link+ '?c=' + url, "directory", {
		    title: url });
	}
	
	page.loading = false; 
});

plugin.addURI( PREFIX + "imdblist:(.*)", function(page, link){
	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = IMDB_LOGO;
		
	var content = showtime.httpGet('http://www.imdb.com/features/video/browse/'+link).toString();
	content = getValue(content, 'browse-video-column', '<br style="clear: left;"/>');
	content = cleanString(content);
	content = content.split('</li>');
	
	for each (var item in content)
		if(getValue(item, ';">', '<') != '')
			page.appendItem( PREFIX + 'imdb:present:' + getValue(item, 'href="/title/', '"'), "video",
				{ title: getValue(item, ';">', '<') +' '+ getValue(item, '>', '</a>)', 'endRef')});

	page.loading = false; 
});

plugin.addURI( PREFIX + "imdbgallery:(.*)", function(page, id){
	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = IMDB_LOGO;
		
	var content = showtime.httpGet('http://www.imdb.com/title/'+id+'/videogallery').toString();
	content = getValue(content, '<div class="slate">', '<!--');
	content = content.split('<div class="slate">');
	
	for each (var item in content)
		if(getValue(item, 'alt="', ' -') != '')
			page.appendItem( PREFIX + 'imdb:play:' + getValue(item, 'href="/video/', '"'), "video",
				{ title: getValue(item, 'alt="', ' -'),
				  icon:  getValue(item, 'src="', '"'),
				  description: getValue(item, 'title="', '"')});
	
	page.loading = false; 
});

plugin.addURI( PREFIX + "imdb:play:(.*)", function(page, id){
	
	var content = showtime.httpGet('http://www.imdb.com/video/'+id + 'player?uff=3').toString();
	var url = getValue(content, 'IMDbPlayer.playerKey = "', '"');
	if(url == '' && getValue(content, '"file", "','"') !='')
		url = unescape(getValue(content, '"file", "','"')) + ' playpath=' + unescape(getValue(content, '"id", "','"')) ;
			
	page.loading = false;
	page.source = "videoparams:" + showtime.JSONEncode({      
		sources: [
		{	
			url: url
		}]    
	});    
	page.type = "video"; 
});


plugin.addURI( PREFIX + "imdb:present:(.*)", function(page, imdb){

	var url_org = url;
	
	if(imdb.indexOf('tt') != -1)
		var movie =imdbGet('http://www.imdb.com/title/'+imdb);

	page.metadata.title = new showtime.RichText(movie.Title);
	page.metadata.logo = IMDB_LOGO;
	
	if(movie.Year)
		page.metadata.title= new showtime.RichText(movie.Title + " " + movie.Year.toString());
	
	if(movie.icon == "N/A" || !movie.icon)
		page.metadata.icon = NO_POSTER;
	else
		page.metadata.icon =  movie.icon;
	
	var count = 0;
	if(movie.Genre){
		page.appendPassiveItem("label", movie.Genre);
		count++;
	}
	if(movie.rating)
		page.appendPassiveItem("rating", movie.rating);
	

	var args = ["divider", "Episode", "Number", "AKA", "TagLine", "Keywords", "Duration", "Actors", "Director", 
				"Writer", "Studios", "Country", "Location", 'Aired', "Released",'Language', "Budget", "Votes",
				'Format', 'Audio', 'Size', "Rated", "divider"];

			
	for each (var arg in args){
		try{
			var aux = eval('movie.'+arg);
			if(aux != "divider" && aux != "N/A" && aux != null && aux != ""){
				page.appendPassiveItem("label", aux, {
				title: arg});
				count++;
			}			
		}catch(np){ 
			if(arg == "divider" && count>0){
				page.appendPassiveItem("divider");
				count = 0;				
			}
			continue; 
		}	
	}
	if(movie.plot == '' || movie.plot == null)
		movie.plot = 'Description Not Found...';
	page.appendPassiveItem("bodytext", new showtime.RichText(movie.plot.toString()));
	
	  
	//imdb trailers  
	if(movie.Trailer)
		page.appendAction("navopen", PREFIX + 'imdb:play:' + movie.Trailer, true, {
				title: "Watch Trailer"
		});

	if(movie.Trailer && parseInt(movie.trailers) > 1)
		page.appendAction("navopen", PREFIX + 'imdbgallery:'+imdb, true, {
				title: "IMDb Videos("+ movie.trailers +")"
		});
	
	//bookmarks		
	if(!bookmarked(imdb, 'imdb:present')){
		var bookmakrButton = page.appendAction("pageevent", "bookmark", true,{ title: "Bookmark" });
	}
	else{		
		var bookmakrButton = page.appendAction("pageevent", "bookmark_remove", true,{ title: "Remove Bookmark" });
	}
	
	page.loading = false;
    page.type = "item";
	
	
	page.onEvent('bookmark', function(){ 
							if(!bookmarked(imdb)){
								bookmark(imdb, movie.Title, 'imdb:present:')
								showtime.message('Bookmarked: '+ movie.Title, true, false);
							}else
								showtime.message('Already Bookmarked: '+ movie.Title, true, false);
					});

	page.onEvent('bookmark_remove', function(){ 
							if(!bookmarked(imdb, 'imdb:present')){
								showtime.message(movie.Title +' Not bookmarked ', true, false);
							}else{
								showtime.message(movie.Title + ' bookmark removed' , true, false);
								bookmark_remove(imdb, movie.Title , 'imdb:present');
							}
					});	

});



plugin.addURI( PREFIX + "bookmarks", function(page) {
	page.type = "directory";
    page.contents = "video";
    page.metadata.logo = plugin.path + "movies.png";
	page.metadata.title = 'Bookmarks';

	var temp = eval( '('+ bookmarks.movies +')');
	for each (var movie in temp){
		if(!movie.uri)
			page.appendItem( PREFIX + 'present:'+ movie.id + ':' + 'search' , "video", { title:  movie.title });
		else
			page.appendItem( PREFIX + movie.uri + movie.id  , "video", { title:  movie.title });			
	}	
	page.loading = false;	
});


plugin.addURI(PREFIX + "more", function(page, indice) {
	page.type = "directory";
    page.contents = "video";
	page.metadata.logo = plugin.path + "movies.png";

	var list = { indice: [ 
		//{name: "recent" , link: "b14c5154c772847b586c9f58b2f213b5"},
		{name: "A" , link: "7e45058d2751894868b0a8dee6c9353f"},
		{name: "B" , link: "1b33a8009b0dbeb73468a3d451fdc80d"},
		{name: "C" , link: "b4498a260a884f2182e2ce5d1b70ac2f"},
		{name: "D" , link: "020d33880c088c324f584256dc1c951e"},
		{name: "E" , link: "e7e1c25539ba8c7c051780ddfd446cae"},
		{name: "F" , link: "b18861a0e77588c20cc3388d7cae7c23"},
		{name: "G" , link: "d9ff406399e275873be8d7a75243a5e7"},
		{name: "H" , link: "72a14f592f9c2948d9a4837c6e47b57c"},			
		{name: "I" , link: "4476fa165742f34c0522081c3009d148"},
		{name: "J" , link: "c6a9f52936eecdd6dd171f205c9c24ad"},
		{name: "K" , link: "bf31b46990b7ea8b1866d053ef650598"},
		{name: "L" , link: "2398ebb505fd14b259c2b64e35ba466d"},
		{name: "M" , link: "5845d72728a61f6c656a6051430c3126"},
		{name: "N" , link: "a5a3050b37a51c808a1f1a17fa9b2456"},
		{name: "O" , link: "6df1c12f5eb87d98d0ab00faf8fa72c6"},
		{name: "P" , link: "1de3aaec7a16144afa3b205057f69d7a"},
		{name: "Q" , link: "968837aee08b2724d83ba434b3606210"},
		{name: "R" , link: "9bab92e1dfb166f52def3bf46502ea1e"},
		{name: "S" , link: "c706b9d234f2985ee51a4b4b6678ef89"},
		{name: "T" , link: "8ff0ef1bda95b0fcca6c9ce2791a972e"},
		{name: "U" , link: "b75af3f6c9b9b3a906b6a344ce02e807"},
		{name: "V" , link: "12b72f842fa0b5ce3b12742e4467da98"},
		{name: "W" , link: "22621a71ae92442084e0af9ba5fa4b7c"},
		{name: "XYZ" , link: "63033b4306f99b957771142c58200cf4"},
		{name: "0-9" , link: "b151cc64cd04ab5ef9e797e026ae1dee"}
			]
		}
    for each (var letter in list.indice) {
		
		page.appendItem(PREFIX + 'more:'+ letter.name + ':' + letter.link, "directory", { title:  letter.name });
		
		} 
    
    page.loading = false;
	

});

plugin.addURI(PREFIX + "more:(.*):(.*)", function(page, indice, link) {
	page.type = "directory";
    page.contents = "video";
    page.metadata.logo = plugin.path + "movies.png";
    
   	page.metadata.title = "Trailers starting with " + '"' + indice + '"';
	if(indice == "recent")
		page.metadata.title = "Recent Trailers";
	
	if(indice == 'search'){
		var trailersJSON = showtime.httpGet( YAHOO_PIPE + '941e84ac0bc3c2bfd03d189a9cecdb0a&_render=JSON&search='+link).toString();
		page.metadata.title = 'Search results for "'+ link +'"';
	}else{
		var trailersJSON = showtime.httpGet( YAHOO_PIPES + link + '&_render=JSON').toString();
	}
	
	trailersJSON = eval( '('+ trailersJSON +')');
	
	
	var aux_total = 0;
	var aux_presented =0;
	var url = null;

	for each (var trailer in trailersJSON.value.items) {
		
		var imdb = false;
		if(trailer.link.toString().length <= 10)
			imdb = true;
					
		url = retrive_links(trailer.description);
		if(imdb && url.length > 10){
			page.appendItem(PREFIX + 'present:' + trailer.link + ':' + url, "video", { title:  trailer.title });
			aux_presented++;
		}
		if(!imdb && url.length > 10){
			if(url.match(/<b>/gi) != null)
				var count = url.match(/<b>/gi).length;
			else 
				var count =0;
				
			for (var j=0;j<count;j++){
				page.appendItem('http://'+url.slice(0,url.indexOf('<b>')),"video", { title:  trailer.title + "  -  " + url.slice(url.indexOf('<b>')+3,url.indexOf('</b>'))});
				url = url.slice(url.indexOf('</b>')+4);
				aux_presented++;
			}		
		}
	}
	
	showtime.trace(" Available: " + aux_presented + ' Original Count: ' + trailersJSON.count);
	page.loading = false;
});




plugin.addURI( PREFIX + "present:(.*):(.*)", function(page, imdb, url) {
	
	//if(service.tmdb == "1"){ var movie = tmdbInfo(imdb); }else{ var movie = imdbInfo(imdb); }
	switch(service.movieinfo){
		case '1': 
			var movie = imdbGet('http://www.imdb.com/title/'+imdb);
		break;
		
		case '2': 
			var movie = tmdbInfo(imdb);
		break;
		
		case '3':
			var movie = imdbInfo(imdb);
		break;
		
		default:
			showtime.trace('Error selecting movie info source!');
			break;
		}
	page.metadata.title = new showtime.RichText(movie.Title);
	page.metadata.logo = MOVIES_IMG;
	
	if(movie.Year)
		page.metadata.title= new showtime.RichText(movie.Title + " " + movie.Year.toString());
	
	if(movie.icon == "N/A" || !movie.icon)
		page.metadata.icon = NO_POSTER;
	else
		page.metadata.icon =  movie.icon;
	
	var count = 0;
	if(movie.Genre){
		page.appendPassiveItem("label", movie.Genre);
		count++;
	}
	if(movie.rating)
		page.appendPassiveItem("rating", movie.rating);
	
	
	var args = ["divider", "Episode", "Number", "AKA", "TagLine", "Keywords", "Duration", "Actors", "Director", 
				"Writer", "Studios", "Country", "Location", 'Aired', "Released",'Language', "Budget", "Votes",
				'Format', 'Audio', 'Size', "Rated", "divider"];

			
	for each (var arg in args){
		try{
			var aux = eval('movie.'+arg);
			if(aux != "divider" && aux != "N/A" && aux != null && aux != ""){
				page.appendPassiveItem("label", aux, {
				title: arg});
				count++;
			}			
		}catch(np){ 
			if(arg == "divider" && count>0){
				page.appendPassiveItem("divider");
				count = 0;				
			}
			continue; 
		}	
	}
	if(movie.plot == '' || movie.plot == null)
		movie.plot = 'Description Not Found...';
	page.appendPassiveItem("bodytext", new showtime.RichText(movie.plot.toString()));
	
	
	//bookmarked  --  search
	if(url == 'search'){
		var search = showtime.httpGet( YAHOO_PIPES + '941e84ac0bc3c2bfd03d189a9cecdb0a&_render=JSON&search='+imdb).toString();
		search = eval( '('+ search +')');
		
		if(search.count == 1){
			url = retrive_links(search.value.items[0].description);
		}
		//Recent Movies, main files not yet updated 
		var search = showtime.httpGet( YAHOO_PIPES + '572d20849220c9c16ae649f820f88e77&_render=JSON&search='+imdb).toString();
		search = eval( '('+ search+')');
		if(search.count > 0){			
			for (var j=0;j<search.count;j++){
				url += retrive_links(search.value.items[j].description);
			}
		}
	}
	
	//Add links
	var name = url.match("<b>.*</b>");
	if(name != null){
		var list = url.split("</b>");
		for each (var split in list){
			name = split.match("<b>.*");
			if(name != null){
				url = split.replace(name,"");
				page.appendAction("navopen", "http://" +url.replace("</b>",""), true, {
					title: "Watch "+name.toString().replace("<b>","").replace("</b>","")
					});
			}
		}
		//re-check
		}else{
			page.appendAction("navopen", "http://" +url, true, {
				title: "Watch trailer"
				});
			}
			
	//bookmarks		
	if(!bookmarked(imdb)){
		var bookmakrButton = page.appendAction("pageevent", "bookmark", true,{ title: "Bookmark" });
	}
	else{		
		var bookmakrButton = page.appendAction("pageevent", "bookmark_remove", true,{ title: "Remove Bookmark" });
	}
	
	page.loading = false;
    page.type = "item";
	
	
	page.onEvent('bookmark', function(){ 
							if(!bookmarked(imdb)){
								bookmark(imdb, movie.Title)
								showtime.message('Bookmarked: '+ movie.Title, true, false);
							}else
								showtime.message('Already Bookmarked: '+ movie.Title, true, false);
					});

	page.onEvent('bookmark_remove', function(){ 
							if(!bookmarked(imdb)){
								showtime.message(movie.Title +' Not bookmarked ', true, false);
							}else{
								showtime.message(movie.Title + ' bookmark removed' , true, false);
								bookmark_remove(imdb, movie.Title);
							}
					});	
});


// Search hook
  plugin.addSearcher(
    "Trailers", plugin.path + "movies.png",
    function(page, query) {
	
    showtime.trace('Trailers - Started Search for: ' +escape(query));

	var link = escape(query);
	var trailersJSON = showtime.httpGet( YAHOO_PIPES + '941e84ac0bc3c2bfd03d189a9cecdb0a&_render=JSON&search='+link).toString();
	
	trailersJSON = eval( '(' + trailersJSON + ')');
		
	var aux_total = 0;
	var aux_presented =0;
	var url = null;

	for each (var trailer in trailersJSON.value.items) {
		
		var imdb = false;
		if(trailer.link.toString().length <= 10)
			imdb = true;
					
		url = retrive_links(trailer.description);
		if(imdb && url.length > 10){
			page.appendItem( PREFIX + 'present:'+ trailer.link + ':' + url, "video", { title:  trailer.title });
			aux_presented++;
		}
		if(!imdb && url.length > 10){
			if(url.match(/<b>/gi) != null)
				var count = url.match(/<b>/gi).length;
			else 
				var count =0;
				
			for (var j=0;j<count;j++){
				page.appendItem('http://'+url.slice(0,url.indexOf('<b>')),"video", { title:  trailer.title + "  -  " + url.slice(url.indexOf('<b>')+3,url.indexOf('</b>'))});
				url = url.slice(url.indexOf('</b>')+4);
				aux_presented++;
			}		
		}
	}
	
	showtime.trace("Trailers search ended.  Available: " + aux_presented + ' Original count: ' + trailersJSON.count );
	page.type = "directory";
    page.entries = aux_presented;
    page.loading = false;
      
         
   });
   
   
   
//Trailer Welt
   

plugin.addURI( PREFIX + "trailer-welt", function(page) {
	
	page.type = "directory";
    page.contents = "video";
	page.metadata.logo = "http://www.trailer-welt.de/menu/logo.gif";
	
	var trailers = new XML(showtime.httpGet("http://feeds.feedburner.com/neue-filmtrailer.rss").toString());
	page.metadata.title = trailers.channel.title.toString();
	
	for each (var item in trailers.channel.item) {

		var metadata = {
			title: item.title,
			description: item.description,
			link: item.link
		};
		page.appendItem( PREFIX + 'video:' + item.link ,"video", metadata);
	}
	
	page.appendItem(PREFIX + "trailer-welt:more:1", "directory", {
		title: "More"
	});

	page.loading = false;
});

plugin.addURI( PREFIX + "trailer-welt:more:(.*)", function(page, letter) {
	page.type = "directory";
    page.contents = "video";
	page.metadata.logo = "http://www.trailer-welt.de/menu/logo.gif";
	var list = ['0-9','A','B','C','D','E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
				'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	
	if(letter == '1'){
		for (var i=0;i<list.length;i++){
			page.appendItem(PREFIX + "trailer-welt:more:"+list[i], "directory", {
				title: list[i]
			});
		}		
	}else{
		var content = showtime.httpGet('http://www.trailer-welt.de/Filme-mit-'+ letter +'/').toString();
		content = content.slice(content.indexOf("<td class='fliste2' colspan='2'>"), content.indexOf("</table>",content.indexOf("<td class='fliste2' colspan='2'>")));
		content  = content.split("<td class='fliste2' colspan='2'>");
		for each (var film in content){
			page.appendItem(PREFIX + "video:" + 'http://www.trailer-welt.de/' + film.slice(film.indexOf("<a href=")+9,film.indexOf('>' ,film.indexOf("<a href="))-1), "directory", {
				title: film.slice(film.indexOf('>' ,film.indexOf("<a href="))+1, film.indexOf('</a></td>'))
			});
		}
	
	}


	page.loading = false;
});

plugin.addURI( PREFIX + "video:(.*)", function(page, url) {
	url = showtime.httpGet(url).toString();
	url = url.slice(url.lastIndexOf('http://', url.indexOf('.flv')), url.indexOf('.flv'));
    page.source = "videoparams:" + showtime.JSONEncode({      
        sources: [
        {	
            url: url
        }]    
    });    
    page.type = "video";

	});



/*
 * Functions
 */

//bookmarks

function mark(id, title, uri){
	this.id = id;
	if(uri)
		this.uri = uri;
	this.title = title;
}


function bookmark(id, title, uri){
	
	if(bookmarked(id))
		return;
	
	var temp = eval( '('+ bookmarks.movies +')');
	temp.push(new mark(id, title, uri));
	bookmarks.movies = showtime.JSONEncode(temp);
}

function bookmark_remove(id, title, uri){
	
	if(!bookmarked(id, uri))
		return;
	
	var start = bookmarks.movies.lastIndexOf('{',bookmarks.movies.indexOf(id));
	var offSet = 1;
	if(start<2)
		offSet=0;
	bookmarks.movies = bookmarks.movies.slice(0,start-offSet) + bookmarks.movies.slice(bookmarks.movies.indexOf('}',bookmarks.movies.indexOf(id))+1,bookmarks.movies.length);
}
function bookmarked(id, uri){
	if(bookmarks.movies.indexOf(id) !=-1 && !uri)
		return true;
	if(uri && bookmarks.movies.indexOf(id+'","uri":"'+uri)!=-1 )
		return true;
	else
		return false; 
}


/*
 * Information:
 * 	-IMDb
 *  -TMDb
 *  -TVRage 
 */

//IMDb
function imdbInfo(id) {
	
	try{
		var info = eval(('(' + showtime.httpGet("http://www.imdbapi.com/?i=" + id + "&r=json&plot=full") + ')'));
	}catch(err){
		showtime.trace('IMDb info: '+err);
		if(service.tmdb == "0")
			return tmdbInfo(id);
		else
			return {plot: "Error obtaining information\nIMDb API error: " + err};
	}
	if(info.Response == "Parse Error")
		info = eval(('(' + showtime.httpGet("http://www.imdbapi.com/?i=" + id + "&r=json&t=") + ')'));
		
	if(info.Response == "Parse Error")
		return {plot: "Error obtaining information"}; 
		
	var metadata = {
	      Title: info.Title,
	      plot: info.Plot,
	      icon: info.Poster,
	      Duration: info.Runtime,
	      Year: info.Year,
	      Genre: info.Genre,
	      Actors: info.Actors,
	      Director: info.Director,
	      rating: parseFloat(info.Rating) / 10 ,
	      Released: info.Released,
	      Writer: info.Writer,
	      Rated: info.Rated
	     };
	return metadata;
}


function imdbGet(id){
	var information = [	{'arg': 'Title', 'regexB': 'title" content="', 'regexE': '"'},
						{'arg': 'AKA', 'regexB': 'Also Known As:</h4>', 'regexE': '<'},
						{'arg': 'Budget', 'regexB': 'Budget:</h4>', 'regexE': '('},
						{'arg': 'Actors', 'regexB': '<h4 class="inline">Stars:</h4>', 'regexE': '</div>', 'regex': /.>(.*?)<\/a>/g},
						{'arg': 'ActorsAll', 'regexB': '<table class="cast_list">', 'regexE': '<div class="see-more">', 'regex': /<td class=\"name\">\s+<a\s+href=\"\/name\/nm\d+\/\">(.*?)<\/a>\s+<\/td/gi}, // /.*<td class=\"name\">        <a  href=\"\/name\/nm\d+\/\">(.*?)<.*/g},
						//{'arg': 'Character', 'regexB': '<td class="character">', 'regexE': '</a', 'regex': /.*<td class=\"name\">        <a  href=\"\/name\/nm\d+\/\">(.*?)<.*/g},
						{'arg': 'Color', 'regexB': '<a href="/search/title\?colors=', 'regexE': '</a', 'regex': /.*">(.*)/g},
						{'arg': 'Country', 'regexB': '<h4 class="inline">Country:</h4>', 'regexE': '</div>', 'regex': /\" >(.*?)<\/a>/g},
						{'arg': 'Creator', 'regexB': 'Creator', 'regexE': '</div'},
						{'arg': 'Director', 'regexB': 'Director:', 'regexE': '</div>', 'regex': /\">(.*?)<\/a>/g },
						{'arg': 'Genre', 'regexB': '<h4 class="inline">Genres:</h4>', 'regexE': '</div>', 'regex': /itemprop=\"genre\"\s*>(.*?)<\/a>/gi },	
						{'arg': 'Language', 'regexB': '<h4 class="inline">Language:</h4>', 'regexE': '</div>', 'regex': /"inLanguage">(.*?)<\/a>/g},
						{'arg': 'Keywords', 'regexB': '<h4 class="inline">Plot Keywords:</h4>', 'regexE': '</div>', 'regex': /">(.*?)<\/a>/g},
						{'arg': 'Location', 'regexB': '<a href="/search/title?locations=', 'regexE': '<', 'regex': /.*">(.*)/g},
						{'arg': 'Rated', 'regexB': '<span itemprop="contentRating">', 'regexE': '<'},
						{'arg': 'plot', 'regexB': '<h2>Storyline</h2>', 'regexE': '<span'},
						{'arg': 'icon', 'regexB': 'href="/media/', 'regexE': 'style=', 'regex': /.*src="(.*)"/g},
						{'arg': 'rating', 'regexB': 'itemprop="ratingValue">', 'regexE': '<'},
						{'arg': 'Released', 'regexB': 'itemprop="datePublished" datetime="', 'regexE': '"'},
						{'arg': 'Duration', 'regexB': 'itemprop="duration" datetime="', 'regexE': '<','regex': /.*">(.*)/g},
						{'arg': 'Studios', 'regexB': '<h4 class="inline">Production Co:</h4>', 'regexE': '<span', 'regex': /href="\/company\/co\d+\/\">(.*?)<\/a>/g},						
						{'arg': 'TagLine', 'regexB': '<h4 class="inline">Taglines:</h4>', 'regexE': '<'},
						{'arg': 'Trailer', 'regexB': 'href="/video/', 'regexE': '"'},
						{'arg': 'trailers', 'regexB': 'data-vc="', 'regexE': '"'},
						{'arg': 'Votes', 'regexB': '<span itemprop="ratingCount">', 'regexE': '<'},
						{'arg': 'Writer', 'regexB': 'Writer', 'regexE': '</div>', 'regex': /href=\"\/name\/nm\d+\/\">(.*?)<\/a>/g },						
						{'arg': 'Year', 'regexB': '<a href="/year/', 'regexE': '</a>', 'regex':  /.*">(.*)/g}
						];
						
	var content = cleanString(showtime.httpGet(id).toString()); 
	
	var movie = {};
	var aux = null;
	for each (var test in information){
		aux = getValue(content, test.regexB, test.regexE);
		if(aux != '')
			if(test.regex){
			    aux = aux.replace(/\n/g ,'').match(test.regex);
				movie[test.arg] = '';
				for each (var auxx in aux){
					if(movie[test.arg] != '')
						movie[test.arg]+=', ';
					movie[test.arg]+=auxx.toString().replace(test.regex, "$1");
				}
			}else{
				movie[test.arg]= aux.replace(/\n/g ,'');
			}
	}
	if(movie.rating)
		movie.rating = parseFloat(movie.rating) / 10

	if(debug == '1'){
		showtime.trace('IMDb Link: ' + id);
		for each (var element in information){
		try{
			showtime.trace(element.arg + ': ' + eval('movie.'+element.arg) );
		}catch(err){ continue;}
		}
	}
	return movie;
}


//TMDb
function tmdbInfo(id) {
	
	//showtime API key 
	var apikey = "d0fd11e3f0bf829c781c3c6c017e8662";
	var info = showtime.httpGet("http://api.themoviedb.org/2.1/Movie.imdbLookup/en/json/" + apikey + "/" + id).toString();
	
	if(info == '["Nothing found."]')
		if(service.tmdb == "1")
			return imdbInfo(id);
		else
			return {plot: "Error obtaining information"}; 

	info = eval( '(' + info.slice(1, info.length - 1) + ')' );	
	
	if(!info.id)
		if(service.tmdb == "1")
			return imdbInfo(id);
		else
			return {plot: "Error obtaining information"}; 
		
	info = showtime.httpGet("http://api.themoviedb.org/2.1/Movie.getInfo/en/json/" + apikey + "/" + info.id).toString();
	info = eval( '(' + info.slice(1, info.length - 1) + ')');
				
	var metadata = {
		Title: info.name,
		plot: info.overview,
	    rating: info.rating / 10,
	    Rated: info.certification,
	    Genre: mergeJSONS(info.genres, null, null),
	    Actors: mergeJSONS(info.cast, "job", "Actor"),
	    Director: mergeJSONS(info.cast, "job", "Director"),
	    Writer: mergeJSONS(info.cast, "job", "Writer"),
	    Studios: mergeJSONS(info.studios, null, null),
	    Country: mergeJSONS(info.countries, null, null),
	    Released: info.released
		};
		
	if(info.posters[0])
		metadata.icon = info.posters[0].image.url;
	if(info.runtime)
		metadata.Duration = info.runtime + " minutes";
	    
	return metadata;
}


function mergeJSONS(list, condition, filter) {
	var prefix = "";
    var r = "";
    for each (v in list) {
	  if(condition == null){
		r += prefix + v.name;
		prefix = ", ";
		}else{
			if(eval("v."+condition) == filter){
				r += prefix + v.name;
				prefix = ", ";
				}
			}
    }	
	return r;
  }


function retrive_links(clips){
		
	//clean clips
	if(clips.indexOf('*') !=-1)
		clips = clips.replace(/<b>\*\*<\/b>/gi,'');
	
	var url = '';
	var quality = [/<\/a> SD/gi, />480P/gi, />720P/gi, />1080/gi, /<b>/gi];
	var count = [ 0 , 0 , 0 , 0 ];
 	
 	for (var j=0;j<5;j++){
		if(clips.match(quality[j]) != null)
		count[j]= clips.match(quality[j]).length;
	} 


	//New Style	
	if(service.fullhd == "1" && count [3] == count[4] )
		url = filter_links(clips, count[4], quality[3].toString().replace('/','"').replace('/gi',''));

	if(url == '' && service.hd == "1" && count [2] == count[4] )
		url = filter_links(clips, count[4], quality[2].toString().replace('/','"').replace('/gi',''));
	
	if(url == '' && count [1] == count[4])
		url = filter_links(clips, count[4], quality[1].toString().replace('/','"').replace('/gi',''));
	
	//SD FIX + Excepcoes
	if(url == '' && count [0] > 0)
		url = filter_links(clips, 0, quality[0].toString().replace('/','').replace('/gi','').replace('\\',''));
		
	//last try
	if(url == '')
		url = filter_links(clips, 0, 'old');
	
	if(url == '')
		showtime.trace('\nParsing error in: ' + clips+'\n')

	return url.replace('<b></b>','');
}




function filter_links(clips, nbr, quality){
	
	var url = '';
	for (var j=1;j<parseInt(nbr)+1;j++){
		url += clips.slice(clips.lastIndexOf('http://',clips.indexOf(quality))+7,clips.indexOf(quality)) + "<b>" + clips.slice(clips.lastIndexOf('<b>',clips.indexOf(quality))+3,clips.indexOf('</b>')) + "</b>";
		clips = clips.slice(clips.indexOf(quality)+3);
	}
	
	//old style

	var regexs = [/SD/g , /Low-Res/g , /Medium-Res/g, /Trailer/g, /Med-Res/g, /Teaser/g]
	for (var i=0;i<regexs.length;i++){
		nbr=clips.match(regexs[i]);
		if(nbr != null){
			// review /\/
			regexs[i] = regexs[i].toString().replace(/\//gi,'').replace('gi','').replace('g','');
			clips=clips.slice(clips.lastIndexOf('http://',clips.indexOf(regexs[i])));
			for (var j=0;j<nbr.length;j++){
				url += clips.slice(clips.indexOf('http://')+7,clips.indexOf('"',clips.indexOf('http://'))) + "<b>" + clips.slice(clips.indexOf('>',clips.indexOf('http://'))+1,clips.indexOf('</a>')) + "</b>";
				clips = clips.slice(clips.indexOf('</a>')+4);
			}
			if(url != '')
				i=regexs.length;
		}
	}
	return url;
}

//MISC

function cleanString(string) {
	for each(var charr in CHAR_LIST)
		string = string.replace(charr[0], charr[1]);

	return string;
}

function getValue(text, start_string, end_string, start, start_offset , end_offset)
{

	if(start == null)
		start = 'start';
		
	if(start_offset == null)
		start_offset = 0;		
	if(start_offset == 'all')
		start_offset = -start_string.length;
	
	if(end_offset == null)
		end_offset = 0;
	
	switch(start){
		case 'start':
			if (text.indexOf(start_string)!=-1 && 
				text.indexOf(end_string, text.indexOf(start_string) + start_string.length)!=-1) {
				var begin_temp = text.indexOf(start_string) + start_string.toString().length + start_offset;
				var end_temp = text.indexOf(end_string, begin_temp) + end_offset;				
				return text.slice(begin_temp, end_temp);
			}
			break;
		
		case 'end':
			if (text.indexOf(start_string)!=-1 && 
				text.indexOf(end_string, text.lastIndexOf(start_string) + start_string.length)!=-1) {
				var begin_temp = text.lastIndexOf(start_string) + start_string.length + start_offset;
				var end_temp = text.indexOf(end_string, begin_temp) + end_offset;				
				return text.slice(begin_temp, end_temp);
			}
			break;
			
		case 'endRef':
				if (text.indexOf(start_string)!=-1 && 
					text.indexOf(end_string)!=-1) {
					var end_temp = text.lastIndexOf(end_string) -1 + end_offset;				
					var begin_temp = text.lastIndexOf(start_string, end_temp) + start_string.length + start_offset;
					return text.slice(begin_temp, end_temp +1);
				}
				break;
		
		default:
			break;	
	}
	if(debug == '1')
		showtime.trace('Get Value error!');
	return '';
}

plugin.addURI( PREFIX + "start", startPage);
})(this);
