/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

(function() {
    tinymce.create('tinymce.plugins.BBCodePlugin', {
        init: function(ed) {
            var self = this, dialect = ed.getParam('bbcode_dialect', 'punbb').toLowerCase();

            ed.on('beforeSetContent', function(e) {
                e.content = self['_' + dialect + '_bbcode2html'](e.content);
            });

            ed.on('postProcess', function(e) {
                if (e.set) {
                    e.content = self['_' + dialect + '_bbcode2html'](e.content);
                }

                if (e.get) {
                    e.content = self['_' + dialect + '_html2bbcode'](e.content);
                }
            });
        },

        getInfo: function() {
            return {
                longname: 'BBCode Plugin',
                author: 'Ephox Corp',
                authorurl: 'http://www.tinymce.com',
                infourl: 'http://www.tinymce.com/wiki.php/Plugin:bbcode'
            };
        },

        // Private methods

        // HTML -> BBCode in PunBB dialect
        _punbb_html2bbcode: function(s) {
            s = tinymce.trim(s);

            function rep(re, str) {
                s = s.replace(re, str);
            }

            // example: <strong> to [b]
            rep(/<a.*?href=\"(.*?)\".*?>(.*?)<\/a>/gi, "[url=$1]$2[/url]");
            rep(/<font.*?color=\"(.*?)\".*?class=\"codeStyle\".*?>(.*?)<\/font>/gi, "[code][color=$1]$2[/color][/code]");
            rep(/<font.*?color=\"(.*?)\".*?class=\"quoteStyle\".*?>(.*?)<\/font>/gi, "[quote][color=$1]$2[/color][/quote]");
            rep(/<font.*?class=\"codeStyle\".*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, "[code][color=$1]$2[/color][/code]");
            rep(/<font.*?class=\"quoteStyle\".*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, "[quote][color=$1]$2[/color][/quote]");
            rep(/<span style=\"color: ?(.*?);\">(.*?)<\/span>/gi, "[color=$1]$2[/color]");
            rep(/<font.*?color=\"(.*?)\".*?>(.*?)<\/font>/gi, "[color=$1]$2[/color]");
            rep(/<span style=\"font-size:(.*?);\">(.*?)<\/span>/gi, "[size=$1]$2[/size]");
            rep(/<font>(.*?)<\/font>/gi, "$1");
            rep(/<img.*?src=\"(.*?)\".*?\/>/gi, "[img]$1[/img]");
            rep(/<span class=\"codeStyle\">(.*?)<\/span>/gi, "[code]$1[/code]");
            rep(/<span class=\"quoteStyle\">(.*?)<\/span>/gi, "[quote]$1[/quote]");
            rep(/<strong class=\"codeStyle\">(.*?)<\/strong>/gi, "[code][b]$1[/b][/code]");
            rep(/<strong class=\"quoteStyle\">(.*?)<\/strong>/gi, "[quote][b]$1[/b][/quote]");
            rep(/<em class=\"codeStyle\">(.*?)<\/em>/gi, "[code][i]$1[/i][/code]");
            rep(/<em class=\"quoteStyle\">(.*?)<\/em>/gi, "[quote][i]$1[/i][/quote]");
            rep(/<u class=\"codeStyle\">(.*?)<\/u>/gi, "[code][u]$1[/u][/code]");
            rep(/<u class=\"quoteStyle\">(.*?)<\/u>/gi, "[quote][u]$1[/u][/quote]");
            rep(/<\/(strong|b)>/gi, "[/b]");
            rep(/<(strong|b)>/gi, "[b]");
            rep(/<\/(em|i)>/gi, "[/i]");
            rep(/<(em|i)>/gi, "[i]");
            rep(/<\/u>/gi, "[/u]");
            rep(/<span style=\"text-decoration: ?underline;\">(.*?)<\/span>/gi, "[u]$1[/u]");
            rep(/<u>/gi, "[u]");
            rep(/<blockquote[^>]*>/gi, "[quote]");
            rep(/<\/blockquote>/gi, "[/quote]");
            rep(/<br \/>/gi, "\n");
            rep(/<br\/>/gi, "\n");
            rep(/<br>/gi, "\n");
            rep(/<p>/gi, "");
            rep(/<\/p>/gi, "\n");
            rep(/&nbsp;|\u00a0/gi, " ");
            rep(/&quot;/gi, "\"");
            rep(/&lt;/gi, "<");
            rep(/&gt;/gi, ">");
            rep(/&amp;/gi, "&");

            return s;
        },

        // BBCode -> HTML from PunBB dialect
        _punbb_bbcode2html: function(s) {
            s = tinymce.trim(s);

            function rep(re, str) {
                s = s.replace(re, str);
            }

            // example: [b] to <strong>
            rep(/\n/gi, "<br />");
            rep(/\[b\]/gi, "<strong>");
            rep(/\[\/b\]/gi, "</strong>");
            rep(/\[i\]/gi, "<em>");
            rep(/\[\/i\]/gi, "</em>");
            rep(/\[u\]/gi, "<u>");
            rep(/\[\/u\]/gi, "</u>");
            rep(/\[url=([^\]]+)\](.*?)\[\/url\]/gi, "<a href=\"$1\">$2</a>");
            rep(/\[url\](.*?)\[\/url\]/gi, "<a href=\"$1\">$1</a>");
            rep(/\[img\](.*?)\[\/img\]/gi, "<img src=\"$1\" />");
            rep(/\[color=(.*?)\](.*?)\[\/color\]/gi, "<font color=\"$1\">$2</font>");
            rep(/\[code\](.*?)\[\/code\]/gi, "<span class=\"codeStyle\">$1</span>&nbsp;");
            rep(/\[quote.*?\](.*?)\[\/quote\]/gi, "<span class=\"quoteStyle\">$1</span>&nbsp;");

            return s;
        },

        // HTML -> BBCode in SMF dialect
        _smf_html2bbcode: function(s) {
            s = tinymce.trim(s);

            function rep(re, str) {
                s = s.replace(re, str);
            }

            // example: <strong> to [b]
            rep(/<iframe.*?src=\"http:\/\/www.youtube.com\/embed\/(.*?)\".*?>/gi,
                "[youtube]$1[/youtube]");
            rep(/<span style=\"color:(.*?);\">([\s\S]*?)<\/span>/gi, "[color=$1]$2[/color]");
            rep(/<span style=\"font-size:(.*?);\">([\s\S]*?)<\/span>/gi, "[size=$1]$2[/size]");
            rep(/<font face=\"(.*?)\">([\s\S]*?)<\/font>/gi, "[font=$1]$2[/font]");
            rep(/<pre class=\"prettyprint\">([\s\S]*?)<\/pre>/gi, "[code]$1[/code]");
            rep(/<div style=\"text-align:\s?left;\">([\s\S]*?)<\/div>/gi, "[left]$1[/left]");
            rep(/<div style=\"text-align:\s?center;\">([\s\S]*?)<\/div>/gi, "[center]$1[/center]");
            rep(/<div style=\"text-align:\s?right;\">([\s\S]*?)<\/div>/gi, "[right]$1[/right]");
            rep(/<div dir=\"rtl\">([\s\S]*?)<\/div>/gi, "[rtl]$1[/rtl]");
            rep(/<div dir=\"ltr\">([\s\S]*?)<\/div>/gi, "[ltr]$1[/ltr]");
            rep(
              /<blockquote>[\s\S]*?<div class=\"says\">[\s\S]*?<a href=\"(.*?)\">([\s\S]+)\s([\s\S]*?)<\/a>[\s\S]*?<\/div>[\s\S]*?<div class=\"quote\">([\s\S]*?)<\/div>[\s\S]*?<\/blockquote>/gi,
              "[quote author=$2 link=$1 date=$3]$4[/quote]");
            rep(/<blockquote>[\s\S]*?<div class=\"says\">([\s\S]+)\s([\s\S]*?)<\/div>[\s\S]*?<div class=\"quote\">([\s\S]*?)<\/div>[\s\S]*?<\/blockquote>/gi,
                "[quote author=$1 date=$2]$3[/quote]");
            rep(/<blockquote>[\s\S]*?<div class=\"says\">[\s\S]*?<a href=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?<\/div>[\s\S]*?<div class=\"quote\">([\s\S]*?)<\/div>[\s\S]*?<\/blockquote>/gi,
                "[quote author=$2 link=$1]$3[/quote]");
            rep(/<blockquote>[\s\S]*?<div class=\"says\">([\s\S]*?)<\/div>[\s\S]*?<div class=\"quote\">([\s\S]*?)<\/div>[\s\S]*?<\/blockquote>/gi,
                "[quote author=$1]$2[/quote]");
            rep(/<blockquote[^>]*>[\s\S]*?<div class=\"quote\">/gi, "[quote]");
            rep(/<\/div>[\s\S]*?<\/blockquote>/gi, "[/quote]");
            rep(
              /<a.*?href=\"(.*?)\?maxwidth=1200\&amp;maxheight=1500\" data-gallery=\"embedded\".*?>[\s\S]*?<img.*?src=\".*?\?maxwidth=674\" alt=\"(.*?)\" style=\"width:\s?(.*?);height:\s?(.*?);?\".*?>[\s\S]*?<\/a>/gi,
              "[img alt=$2 width=$3 height=$4]$1[/img]");
            rep(
              /<a.*?href=\"(.*?)\?maxwidth=1200\&amp;maxheight=1500\" data-gallery=\"embedded\".*?>[\s\S]*?<img.*?src=\".*?\?maxwidth=674\" alt=\"(.*?)\" style=\"height:\s?(.*?);?\".*?>[\s\S]*?<\/a>/gi,
              "[img alt=$2 height=$3]$1[/img]");
            rep(
              /<a.*?href=\"(.*?)\?maxwidth=1200\&amp;maxheight=1500\" data-gallery=\"embedded\".*?>[\s\S]*?<img.*?src=\".*?\?maxwidth=674\" alt=\"(.*?)\" style=\"width:\s?(.*?);?\".*?>[\s\S]*?<\/a>/gi,
              "[img alt=$2 width=$3]$1[/img]");
            rep(
              /<a href=\"(.*?)\?maxwidth=1200\&amp;maxheight=1500\" data-gallery=\"embedded\".*?>[\s\S]*?<img.*?src=\".*?\?maxwidth=674\" alt=\"(.*?)\".*?>[\s\S]*?<\/a>/gi,
              "[img alt=$2]$1[/img]");
            rep(/<img.*?src=\"(.*?)\".*?\/>/gi, "[img]$1[/img]");
            rep(/<\/(strong|b)>/gi, "[/b]");
            rep(/<(strong|b)>/gi, "[b]");
            rep(/<\/(em|i)>/gi, "[/i]");
            rep(/<(em|i)>/gi, "[i]");
            rep(/<\/u>/gi, "[/u]");
            rep(/<u>/gi, "[u]");
            rep(/<\/(s|strike|del)>/gi, "[/s]");
            rep(/<(s|strike|del)>/gi, "[s]");
            rep(/<span style=\"text-decoration:\s?underline;\">(.*?)<\/span>/gi, "[u]$1[/u]");
            //rep(/<\/ul>/gi, "[/list]");
            //rep(/<ul>/gi, "[list]");
            rep(/<\/li>/gi, "[/li]");
            rep(/<li>/gi, "[li]");
            rep(/<\/sup>/gi, "[/sup]");
            rep(/<sup>/gi, "[sup]");
            rep(/<\/sub>/gi, "[/sub]");
            rep(/<sub>/gi, "[sub]");
            rep(/<\/table>/gi, "[/table]");
            rep(/<table>/gi, "[table]");
            rep(/<\/tr>/gi, "[/tr]");
            rep(/<tr>/gi, "[tr]");
            rep(/<\/td>/gi, "[/td]");
            rep(/<td>/gi, "[td]");
            rep(/<br \/>/gi, "\n");
            rep(/<br\/>/gi, "\n");
            rep(/<br>/gi, "\n");
            rep(/<hr \/>/gi, "[hr]");
            rep(/<hr\/>/gi, "[hr]");
            rep(/<hr>/gi, "[hr]");
            rep(/<p>/gi, "");
            rep(/<\/p>/gi, "\n");
            rep(/<a.*?href=\"mailto:(.*?)\".*?>.*?<\/a>/gi, "[email]$1[/email]");
            rep(/<a.*?href=\"(.*?)\".*?>(.*?)<\/a>/gi, "[url=$1]$2[/url]");
            rep(/&nbsp;|\u00a0/gi, " ");
            rep(/&quot;/gi, "\"");
            rep(/&lt;/gi, "<");
            rep(/&gt;/gi, ">");
            rep(/&amp;/gi, "&");

            return s;
        },

        // BBCode -> HTML from SMF dialect
        _smf_bbcode2html: function(s) {
            s = tinymce.trim(s);

            function rep(re, str) {
                s = s.replace(re, str);
            }

            // example: [b] to <b>
            rep(/\n/gi, "<br />");
            rep(/\[hr\]/gi, "<hr />");
            rep(/\[b\]/gi, "<strong>");
            rep(/\[\/b\]/gi, "</strong>");
            rep(/\[i\]/gi, "<em>");
            rep(/\[\/i\]/gi, "</em>");
            rep(/\[u\]/gi, "<u>");
            rep(/\[\/u\]/gi, "</u>");
            rep(/\[s\]/gi, "<del>");
            rep(/\[\/s\]/gi, "</del>");
            //rep(/\[ul\]/gi, "<ul>");
            //rep(/\[\/ul\]/gi, "</ul>");
            //rep(/\[list\]/gi, "<ul>");
            //rep(/\[\/list\]/gi, "</ul>");
            rep(/\[li\]/gi, "<li>");
            rep(/\[\/li\]/gi, "</li>");
            rep(/\[\*\]/gi, "<li>");
            rep(/\[\/\*\]/gi, "</li>");
            rep(/\[sup\]/gi, "<sup>");
            rep(/\[\/sup\]/gi, "</sup>");
            rep(/\[sub\]/gi, "<sub>");
            rep(/\[\/sub\]/gi, "</sub>");
            rep(/\[table\]/gi, "<table>");
            rep(/\[\/table\]/gi, "</table>");
            rep(/\[tr\]/gi, "<tr>");
            rep(/\[\/tr\]/gi, "</tr>");
            rep(/\[td\]/gi, "<td>");
            rep(/\[\/td\]/gi, "</td>");
            rep(/\[url=([^\]]+)\](.*?)\[\/url\]/gi, "<a href=\"$1\" target=\"_blank\" rel=\"nofollow\">$2</a>");
            rep(/\[url\](.*?)\[\/url\]/gi, "<a href=\"$1\" target=\"_blank\" rel=\"nofollow\">$1</a>");
            rep(/\[youtube\](.*?)\[\/youtube\]/gi,
                "<iframe src=\"http://www.youtube.com/embed/$1\" frameborder=\"0\" style=\"width:100%;min-height:300px;\" />");
            rep(/\[email\](.*?)\[\/email\]/gi, "<a href=\"mailto:$1\">$1</a>");
            rep(/\[left\](.*?)\[\/left\]/gi, "<div style=\"text-align:left;\">$1</div>");
            rep(/\[center\](.*?)\[\/center\]/gi, "<div style=\"text-align:center;\">$1</div>");
            rep(/\[right\](.*?)\[\/right\]/gi, "<div style=\"text-align:right;\">$1</div>");
            rep(/\[rtl\](.*?)\[\/rtl\]/gi, "<div dir=\"rtl\">$1</div>");
            rep(/\[ltr\](.*?)\[\/ltr\]/gi, "<div dir=\"ltr\">$1</div>");
            rep(/\[abbr=([^\]]+)\](.*?)\[\/abbr\]/gi, "<abbr title=\"$1\">$2</abbr>");
            rep(/\[font=([^\]]+)\](.*?)\[\/font\]/gi, "<font face=\"$1\">$2</font>");
            rep(/\[color=(.*?)\](.*?)\[\/color\]/gi, "<span style=\"color:$1;\">$2</span>");
            rep(/\[size=(.*?)\](.*?)\[\/size\]/gi, "<span style=\"font-size:$1;\">$2</span>");
            rep(/\[code\](.*?)\[\/code\]/gi, "<pre class=\"prettyprint\">$1</pre>");
            rep(/\[quote\sauthor=(.+)\slink=(.+)\sdate=([^\]]+)\](.*?)\[\/quote\]/gi,
                "<blockquote><div class=\"says\"><a href=\"$2\">$1 $3</a></div><div class=\"quote\">$4</div></blockquote>");
            rep(/\[quote\sauthor=(.+)\sdate=([^\]]+)\](.*?)\[\/quote\]/gi,
                "<blockquote><div class=\"says\">$1 $2</div><div class=\"quote\">$3</div></blockquote>");
            rep(/\[quote\sauthor=(.+)\slink=([^\]]+)\](.*?)\[\/quote\]/gi,
                "<blockquote><div class=\"says\"><a href=\"$2\">$1</a></div><div class=\"quote\">$3</div></blockquote>");
            rep(/\[quote\sauthor=([^\]]+)\](.*?)\[\/quote\]/gi,
                "<blockquote><div class=\"says\">$1</div><div class=\"quote\">$2</div></blockquote>");
            rep(/\[quote.*?\](.*?)\[\/quote\]/gi, "<blockquote><div class=\"quote\">$1</div></blockquote>");
            rep(/\[img\salt=(.+)\swidth=(.+)\sheight=([^\]]+)\](.*?)\[\/img\]/gi,
                "<a href=\"$4?maxwidth=1200&maxheight=1500\" data-gallery=\"embedded\">" +
                "<img src=\"$4?maxwidth=674\" alt=\"$1\" style=\"width:$2;height:$3;\" /></a>");
            rep(/\[img\salt=(.+)\sheight=([^\]]+)\](.*?)\[\/img\]/gi,
                "<a href=\"$3?maxwidth=1200&maxheight=1500\" data-gallery=\"embedded\">" +
                "<img src=\"$3?maxwidth=674\" alt=\"$1\" style=\"height:$2;\" /></a>");
            rep(/\[img\salt=(.+)\swidth=([^\]]+)\](.*?)\[\/img\]/gi,
                "<a href=\"$3?maxwidth=1200&maxheight=1500\" data-gallery=\"embedded\">" +
                "<img src=\"$3?maxwidth=674\" alt=\"$1\" style=\"width:$2;\" /></a>");
            rep(/\[img\salt=([^\]]+)\](.*?)\[\/img\]/gi,
                "<a href=\"$2?maxwidth=1200&maxheight=1500\" data-gallery=\"embedded\">" +
                "<img src=\"$2?maxwidth=674\" alt=\"$1\" /></a>");
            rep(/\[img\](.*?)\[\/img\]/gi, "<img src=\"$1\" />");

            return s;
        }
    });

    // Register plugin
    tinymce.PluginManager.add('bbcode', tinymce.plugins.BBCodePlugin);
})();