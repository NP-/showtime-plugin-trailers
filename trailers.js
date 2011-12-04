/**
 *  Trailers plugin for showtime version 0.23  by NP
 *
 * 	Change Log:
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

//showtime TMDb API key 
var apikey = "d0fd11e3f0bf829c781c3c6c017e8662";


			   
//settings 

  var service =
    plugin.createService("Trailers", PREFIX + "start", "tv", true,
			   plugin.path + "movies.png");
  
  var settings  = plugin.createSettings("Trailers",
					  plugin.path + "movies.png",
					 "Trailers");

  settings.createInfo("info",
			     plugin.path + "movies.png",
			     "By default the movie information is obtained via IMDb. When this fails it will only provide the links. \n"+
			     "Trailer sources include: Apple Trailers, Yahoo Movies and numerous studio sources, be sure to visit them as they host the trailers, this plugin merely provide easy to view direct links. ... \n"+
				 "Plugin developed by NP \n");


settings.createBool("tmdb", "The Movie Data base", true, function(v) {
    service.tmdb = v;
  });


settings.createBool("hd", "HD", false, function(v) {
    service.hd = v;
  });


settings.createBool("fullhd", "Full HD", false, function(v) {
    service.fullhd = v;
  });

settings.createBool("trailer-welt", "Trailer Welt", false, function(v) {
    service.welt = v;
  });

  
//store
	var bookmarks = plugin.createStore('bookmarks', true);

	if(!bookmarks.movies)
		bookmarks.movies = '';


//http header fix
plugin.addHTTPAuth("http:\/\/trailers\.apple\.com\/.*", function(authreq) {
    authreq.setHeader("User-Agent", "QuickTime");
  });




function startPage(page) {      
	
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

	if(bookmarks.movies.length>10)
		page.appendItem(PREFIX + "bookmarks", "directory", {
			title: "Bookmarks"
			});
	if(service.welt == "1")
		page.appendItem(PREFIX + "trailer-welt", "directory", {
			title: "Trailer Welt",
			icon: 'http://www.trailer-welt.de/menu/logo.gif'
		});



  page.loading = false;	
}  

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
	
	if(service.tmdb == "1"){ var movie = tmdbInfo(imdb); }else{ var movie = imdbInfo(imdb); }
	
		
	page.metadata.title = movie.Title;
	page.metadata.logo = plugin.path + "movies.png";
	
	if(movie.Year)
		page.metadata.title= movie.Title + " " + movie.Year.toString();

	if(movie.icon == "N/A" || !movie.icon){
		page.metadata.icon = 'http://www.latinoreview.com/img/poster_not_available.jpg';
		}else{ page.metadata.icon =  movie.icon; }
	
	if(movie.Genre)
		page.appendPassiveItem("label", movie.Genre);
	if(movie.rating)
		page.appendPassiveItem("rating", movie.rating);
	
	
	var args = ["divider", "Duration", "Actors", "Director", 
				"Writer", "Studios", "Country", "Released", "Rated", "divider"];
			
	for each (var arg in args) {
		try{
		var aux = eval('movie.'+arg);
			if(aux != "divider" && aux != "N/A" && aux != null && aux != "")
				page.appendPassiveItem("label", aux, {
				title: arg});
							
		}catch(np){ 
			if(arg == "divider")
				page.appendPassiveItem("divider")
			continue; 
			}
	
	}

	
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

//TMDb
function tmdbInfo(id) {
	
	
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
			regexs[i] = regexs[i].toString().replace(/\//g,'').replace('gi','').replace('g','');
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
	
	//SD FIX 
	if(url == '' && count [0] > 0)
		url = filter_links(clips, 0, quality[0].toString().replace('/','').replace('/gi','').replace('\\',''));
		
	//last try
	if(url == '')
		url = filter_links(clips, 0, 'old');
	
	if(url == '')
		showtime.trace('\nParsing error in: ' + clips+'\n')

	return url.replace('<b></b>','');
}


//bookmarks

plugin.addURI( PREFIX + "bookmarks", function(page) {
	page.type = "directory";
    page.contents = "video";
    page.metadata.logo = plugin.path + "movies.png";
	page.metadata.title = 'Bookmarks';

	
	if(bookmarks.movies){	
		var split = bookmarks.movies.split('\n');
		for each (var movie in split){
			if(movie.indexOf('\t') != -1)
				page.appendItem( PREFIX + 'present:'+ movie.slice(0, movie.indexOf('\t')) + ':' + 'search' , "video", { title:  movie.slice(movie.indexOf('\t')+1) });
			}
		}
		
	page.loading = false;	
});

function bookmark(id, title){
	
	if(bookmarked(id))
		return;
		
	bookmarks.movies = bookmarks.movies + id + "\t" + title + "\n";
}

function bookmark_remove(id, title){
	
	if(!bookmarked(id, title))
		return;
	
	bookmarks.movies = bookmarks.movies.replace(id +"\t"+title+"\n", '');
}
function bookmarked(id, title){
	
	if(bookmarks.movies && bookmarks.movies.indexOf(id) !=-1)
		return true;
	else
		return false; 

}




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

plugin.addURI( PREFIX + "start", startPage);
})(this);
