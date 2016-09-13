(function($) {
    $.fn.html5lightbox = function(k) {
        var l = this;
        l.options = jQuery.extend({
            autoplay: true,
            html5player: true,
            overlaybgcolor: "#000000",
            overlayopacity: 0.9,
            bgcolor: "#ffffff",
            bordersize: 8,
            barheight: 36,
            loadingwidth: 64,
            loadingheight: 64,
            resizespeed: 400,
            fadespeed: 400,
            skinfolder: "skins/",
            loadingimage: "lightbox-loading.gif",
            nextimage: "lightbox-next.png",
            previmage: "lightbox-prev.png",
            closeimage: "lightbox-close.png",
            playvideoimage: "lightbox-playvideo.png",
            titlecss: "{color:#333333; font-size:16px; font-family:Armata,sans-serif,Arial; overflow:hidden; white-space:nowrap;}",
            errorwidth: 280,
            errorheight: 48,
            errorcss: "{text-align:center; color:#ff0000; font-size:14px; font-family:Arial, sans-serif;}",
            supportesckey: true,
            supportarrowkeys: true,
            version: "1.8",
            stamp: false,
            freemark: "html5box.com",
            freelink: "",
            watermark: "",
            watermarklink: ""
        },
        k);
        if ((typeof html5lightbox_options != 'undefined') && html5lightbox_options) jQuery.extend(l.options, html5lightbox_options);
        l.options.htmlfolder = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
        if ((l.options.skinfolder.charAt(0) != "/") && (l.options.skinfolder.substring(0, 5) != "http:") && (l.options.skinfolder.substring(0, 6) != "https:")) l.options.skinfolder = l.options.jsfolder + l.options.skinfolder;
        l.options.types = ["IMAGE", "FLASH", "VIDEO", "youku", "VIMEO", "PDF", "MP3", "WEB"];
        l.elemArray = new Array();
        l.options.curElem = -1;
        l.options.flashInstalled = false;
        try {
            if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) l.options.flashInstalled = true
        } catch(e) {
            if (navigator.mimeTypes["application/x-shockwave-flash"]) l.options.flashInstalled = true
        }
        l.options.html5VideoSupported = ( !! document.createElement('video').canPlayType);
        l.options.isChrome = (navigator.userAgent.match(/Chrome/i) != null);
        l.options.isFirefox = (navigator.userAgent.match(/Firefox/i) != null);
        l.options.isOpera = (navigator.userAgent.match(/Opera/i) != null);
        l.options.isSafari = (navigator.userAgent.match(/Safari/i) != null);
        l.options.isIE = (navigator.userAgent.match(/MSIE/i) != null) && !l.options.isOpera;
        l.options.isIE9 = l.options.isIE && l.options.html5VideoSupported;
        l.options.isIE678 = l.options.isIE && !l.options.isIE9;
        l.options.isIE6 = (navigator.userAgent.match(/MSIE 6/i) != null) && !l.options.isOpera;
        l.options.isAndroid = (navigator.userAgent.match(/Android/i) != null);
        l.options.isIPad = (navigator.userAgent.match(/iPad/i) != null);
        l.options.isIPhone = ((navigator.userAgent.match(/iPod/i) != null) || (navigator.userAgent.match(/iPhone/i) != null));
        l.options.isMobile = (l.options.isAndroid || l.options.isIPad || l.options.isIPhone);
        l.options.isIOSLess5 = l.options.isIPad && l.options.isIPhone && ((navigator.userAgent.match(/OS 4/i) != null) || (navigator.userAgent.match(/OS 3/i) != null));
        l.options.supportCSSPositionFixed = !l.options.isIE6 && !l.options.isIOSLess5;
        l.options.resizeTimeout = -1;
        var l = this;
        l.init = function() {
            l.showing = false;
            l.readData();
            l.createMarkup();
            l.supportKeyboard()
        };
        var m = 0,
        ELEM_HREF = 1,
        ELEM_TITLE = 2,
        ELEM_GROUP = 3,
        ELEM_WIDTH = 4,
        ELEM_HEIGHT = 5,
        ELEM_HREF_WEBM = 6,
        ELEM_HREF_OGG = 7;
        l.readData = function() {
            l.each(function() {
                if (this.nodeName.toLowerCase() != 'a') return;
                var a = $(this);
                var b = l.checkType(a.attr('href'));
                if (b < 0) return;
                l.elemArray.push(new Array(b, a.attr('href'), a.attr('title'), a.data('group'), a.data('width'), a.data('height'), a.data('webm'), a.data('ogg')))
            })
        };
        l.createMarkup = function() {
            var a = ('https:' == document.location.protocol ? 'https': 'http') + "://fonts.apis.com/css?family=Armata";
            var b = document.createElement("link");
            b.setAttribute("rel", "stylesheet");
            b.setAttribute("type", "text/css");
            b.setAttribute("href", a);
            document.getElementsByTagName("head")[0].appendChild(b);
            var c = "#html5-text " + l.options.titlecss;
            c += ".html5-error " + l.options.errorcss;
            $("head").append("<style type='text/css'>" + c + "</style>");
            l.$lightbox = jQuery("<div id='html5-lightbox' style='display:none;top:0px;left:0px;width:100%;height:100%;z-index:9999999;'><div id='html5-lightbox-overlay' style='display:block;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:" + l.options.overlaybgcolor + ";opacity:" + l.options.overlayopacity + ";filter:alpha(opacity=" + Math.round(l.options.overlayopacity * 100) + ");'></div><div id='html5-lightbox-box' style='display:block;position:relative;margin:0px auto;overflow:hidden;'><div id='html5-elem-box' style='display:block;position:relative;margin:0px auto;text-align:center;'><div id='html5-elem-wrap' style='display:block;position:relative;margin:0px auto;text-align:center;background-color:" + l.options.bgcolor + ";'><div id='html5-loading' style='display:none;position:absolute;top:0px;left:0px;text-align:center;width:100%;height:100%;background:url(\"" + l.options.skinfolder + l.options.loadingimage + "\") no-repeat center center;'></div><div id='html5-error' class='html5-error' style='display:none;position:absolute;padding:" + l.options.bordersize + "px;text-align:center;width:" + l.options.errorwidth + "px;height:" + l.options.errorheight + "px;'>The requested content cannot be loaded.<br />Please try again later.</div><div id='html5-image' style='display:none;position:absolute;top:0px;left:0px;padding:" + l.options.bordersize + "px;text-align:center;'></div></div><div id='html5-next' style='display:none;cursor:pointer;position:absolute;right:" + l.options.bordersize + "px;top:40%;'><img src='" + l.options.skinfolder + l.options.nextimage + "'></div><div id='html5-prev' style='display:none;cursor:pointer;position:absolute;left:" + l.options.bordersize + "px;top:40%;'><img src='" + l.options.skinfolder + l.options.previmage + "'></div></div><div id='html5-elem-data-box' style='display:none;position:relative;width:100%;margin:0px auto;height:" + l.options.barheight + "px;background-color:" + l.options.bgcolor + ";'><div id='html5-text' style='display:block;float:left;overflow:hidden;margin-left:" + l.options.bordersize + "px;'></div><div id='html5-close' style='display:block;cursor:pointer;float:right;margin-right:" + l.options.bordersize + "px;'><img src='" + l.options.skinfolder + l.options.closeimage + "'></div></div><div id='html5-watermark' style='display:none;position:absolute;left:" + String(l.options.bordersize + 2) + "px;top:" + String(l.options.bordersize + 2) + "px;'></div></div></div>");
            l.$lightbox.css({
                position: (l.options.supportCSSPositionFixed ? 'fixed': 'absolute')
            });
            l.$lightbox.appendTo("body");
            l.$lightboxBox = $("#html5-lightbox-box", l.$lightbox);
            l.$elem = $("#html5-elem-box", l.$lightbox);
            l.$elemWrap = $("#html5-elem-wrap", l.$lightbox);
            l.$loading = $("#html5-loading", l.$lightbox);
            l.$error = $("#html5-error", l.$lightbox);
            l.$image = $("#html5-image", l.$lightbox);
            l.$elemData = $("#html5-elem-data-box", l.$lightbox);
            l.$text = $("#html5-text", l.$lightbox);
            l.$next = $("#html5-next", l.$lightbox);
            l.$prev = $("#html5-prev", l.$lightbox);
            l.$close = $("#html5-close", l.$lightbox);
            l.$watermark = $("#html5-watermark", l.$lightbox);
            if (l.options.stamp) {
                l.$watermark.html("<a href='" + l.options.freelink + "' style='text-decoration:none;'><div style='display:block;width:120px;height:20px;text-align:center;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;filter:alpha(opacity=60);opacity:0.6;background-color:#333333;color:#ffffff;font:12px Armata,sans-serif,Arial;'><div style='line-height:20px;'>" + l.options.freemark + "</div></div></a>")
            } else if (l.options.watermark) {
                var d = "<img src='" + l.options.watermark + "' style='border:none;' />";
                if (l.options.watermarklink) d = "<a href='" + l.options.watermarklink + "' target='_blank'>" + d + "</a>";
                l.$watermark.html(d)
            }
            $("#html5-lightbox-overlay", l.$lightbox).click(l.finish);
            l.$close.click(l.finish);
            l.$next.click(function() {
                l.gotoSlide( - 1)
            });
            l.$prev.click(function() {
                l.gotoSlide( - 2)
            });
            $(window).resize(function() {
                if (!l.options.isMobile) {
                    clearTimeout(l.options.resizeTimeout);
                    l.options.resizeTimeout = setTimeout(function() {
                        l.resizeWindow()
                    },
                    500)
                }
            });
            $(window).scroll(function() {
                l.scrollBox()
            });
            $(window).bind('orientationchange',
            function(e) {
                if (l.options.isMobile) l.resizeWindow()
            })
        };
        l.calcNextPrevElem = function() {
            l.options.nextElem = -1;
            l.options.prevElem = -1;
            var j, curGroup = l.elemArray[l.options.curElem][ELEM_GROUP];
            if ((curGroup != undefined) && (curGroup != null)) {
                for (j = l.options.curElem + 1; j < l.elemArray.length; j++) {
                    if (l.elemArray[j][ELEM_GROUP] == curGroup) {
                        l.options.nextElem = j;
                        break
                    }
                }
                if (l.options.nextElem < 0) {
                    for (j = 0; j < l.options.curElem; j++) {
                        if (l.elemArray[j][ELEM_GROUP] == curGroup) {
                            l.options.nextElem = j;
                            break
                        }
                    }
                }
                if (l.options.nextElem >= 0) {
                    for (j = l.options.curElem - 1; j >= 0; j--) {
                        if (l.elemArray[j][ELEM_GROUP] == curGroup) {
                            l.options.prevElem = j;
                            break
                        }
                    }
                    if (l.options.prevElem < 0) {
                        for (j = l.elemArray.length - 1; j > l.options.curElem; j--) {
                            if (l.elemArray[j][ELEM_GROUP] == curGroup) {
                                l.options.prevElem = j;
                                break
                            }
                        }
                    }
                }
            }
        };
        l.clickHandler = function() {
            if (l.elemArray.length <= 0) return true;
            var a = $(this);
            l.hideObjects();
            for (var i = 0; i < l.elemArray.length; i++) {
                if (l.elemArray[i][ELEM_HREF] == a.attr("href")) break
            }
            if (i == l.elemArray.length) return true;
            l.options.curElem = i;
            l.options.nextElem = -1;
            l.options.prevElem = -1;
            l.calcNextPrevElem();
            l.$next.hide();
            l.$prev.hide();
            l.reset();
            l.$lightbox.show();
            if (!l.options.supportCSSPositionFixed) l.$lightbox.css("top", $(window).scrollTop());
            var b = l.options.loadingwidth + 2 * l.options.bordersize;
            var c = l.options.loadingheight + 2 * l.options.bordersize;
            var d = Math.round($(window).height() / 2 - (c + l.options.barheight) / 2);
            l.$lightboxBox.css({
                "margin-top": d,
                "width": b,
                "height": c
            });
            l.$elemWrap.css({
                "width": b,
                "height": c
            });
            l.loadCurElem();
            return false
        };
        l.loadElem = function(a) {
            l.showing = true;
            l.$elem.unbind("mouseenter").unbind("mouseleave").unbind("mousemove");
            l.$next.hide();
            l.$prev.hide();
            l.$loading.show();
            switch (a[m]) {
            case 0:
                var b = new Image();
                $(b).load(function() {
                    l.showImage(a, b.width, b.height)
                });
                $(b).error(function() {
                    l.showError()
                });
                b.src = a[ELEM_HREF];
                break;
            case 1:
                l.showSWF(a);
                break;
            case 2:
                l.showVideo(a);
                break;
            case 3:
            case 4:
                l.showyoukuVimeo(a);
                break;
            case 5:
                l.showPDF(a);
                break;
            case 6:
                l.showMP3(a);
                break;
            case 7:
                l.showWeb(a);
                break
            }
        };
        l.loadCurElem = function() {
            l.loadElem(l.elemArray[l.options.curElem])
        };
        l.showError = function() {
            l.$loading.hide();
            l.resizeLightbox(l.options.errorwidth, l.options.errorheight, true,
            function() {
                l.$error.show();
                l.$elem.fadeIn(l.options.fadespeed,
                function() {
                    l.showData()
                })
            })
        };
        l.calcTextWidth = function(a) {
            var b = a - 36;
            if ((l.options.prevElem > 0) || (l.options.nextElem > 0)) b -= 36;
            return b
        };
        l.showImage = function(a, b, c) {
            var d, elemH;
            if (a[ELEM_WIDTH]) {
                d = a[ELEM_WIDTH]
            } else {
                d = b;
                a[ELEM_WIDTH] = b
            }
            if (a[ELEM_HEIGHT]) {
                elemH = a[ELEM_HEIGHT]
            } else {
                elemH = c;
                a[ELEM_HEIGHT] = c
            }
            var e = l.calcElemSize({
                w: d,
                h: elemH
            });
            l.resizeLightbox(e.w, e.h, true,
            function() {
                l.$text.css({
                    width: l.calcTextWidth(e.w)
                });
                l.$text.html(a[ELEM_TITLE]);
                l.$image.show().css({
                    width: e.w,
                    height: e.h
                });
                l.$image.html("<img src='" + a[ELEM_HREF] + "' width='" + e.w + "' height='" + e.h + "' />");
                l.$elem.fadeIn(l.options.fadespeed,
                function() {
                    l.showData()
                })
            })
        };
        l.showSWF = function(a) {
            var b = (a[ELEM_WIDTH]) ? a[ELEM_WIDTH] : 480;
            var c = (a[ELEM_HEIGHT]) ? a[ELEM_HEIGHT] : 270;
            var d = l.calcElemSize({
                w: b,
                h: c
            });
            b = d.w;
            c = d.h;
            l.resizeLightbox(b, c, true,
            function() {
                l.$text.css({
                    width: l.calcTextWidth(b)
                });
                l.$text.html(a[ELEM_TITLE]);
                l.$image.html("<div id='html5lightbox-swf' style='display:block;width:" + b + "px;height:" + c + "px;'></div>").show();
                l.embedFlash($("#html5lightbox-swf"), b, c, a[ELEM_HREF], 'window', {
                    width: b,
                    height: c
                });
                l.$elem.show();
                l.showData()
            })
        };
        l.showVideo = function(d) {
            var e = (d[ELEM_WIDTH]) ? d[ELEM_WIDTH] : 480;
            var f = (d[ELEM_HEIGHT]) ? d[ELEM_HEIGHT] : 270;
            var g = l.calcElemSize({
                w: e,
                h: f
            });
            e = g.w;
            f = g.h;
            l.resizeLightbox(e, f, true,
            function() {
                l.$text.css({
                    width: l.calcTextWidth(e)
                });
                l.$text.html(d[ELEM_TITLE]);
                l.$image.html("<div id='html5lightbox-video' style='display:block;width:" + e + "px;height:" + f + "px;'></div>").show();
                var a = false;
                if (l.options.isMobile) {
                    a = true
                } else if ((l.options.html5player || !l.options.flashInstalled) && l.options.html5VideoSupported) {
                    if ((!l.options.isFirefox) || (l.options.isFirefox && (d[ELEM_HREF_OGG] || d[ELEM_HREF_WEBM]))) a = true
                }
                if (a) {
                    var b = d[ELEM_HREF];
                    if (l.options.isFirefox || !b) b = d[ELEM_HREF_WEBM] ? d[ELEM_HREF_WEBM] : d[ELEM_HREF_OGG];
                    l.embedHTML5Video($("#html5lightbox-video"), e, f, b, l.options.autoplay)
                } else {
                    var c = d[ELEM_HREF];
                    if ((c.charAt(0) != "/") && (c.substring(0, 5) != "http:") && (c.substring(0, 6) != "https:")) c = l.options.htmlfolder + c;
                    l.embedFlash($("#html5lightbox-video"), e, f, l.options.jsfolder + "html5boxplayer.swf", 'transparent', {
                        width: e,
                        height: f,
                        videofile: c,
                        autoplay: (l.options.autoplay ? "1": "0"),
                        errorcss: ".html5box-error" + l.options.errorcss,
                        id: 0
                    })
                }
                l.$elem.show();
                l.showData()
            })
        };
        l.prepareyoukuHref = function(a) {
            var b = '';
            var c = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#\&\?]*).*/;
            var d = a.match(c);
            if (d && d[7] && (d[7].length == 11)) b = d[7];
            return 'http://www.youku.com/embed/' + b
        };
        l.showyoukuVimeo = function(b) {
            var c = (b[ELEM_WIDTH]) ? b[ELEM_WIDTH] : 480;
            var d = (b[ELEM_HEIGHT]) ? b[ELEM_HEIGHT] : 270;
            var e = l.calcElemSize({
                w: c,
                h: d
            });
            c = e.w;
            d = e.h;
            l.resizeLightbox(c, d, true,
            function() {
                l.$text.css({
                    width: l.calcTextWidth(c)
                });
                l.$text.html(b[ELEM_TITLE]);
                l.$image.html("<div id='html5lightbox-video' style='display:block;width:" + c + "px;height:" + d + "px;'></div>").show();
                var a = b[ELEM_HREF];
                if (b[m] == 3) a = l.prepareyoukuHref(a);
                if (l.options.autoplay) {
                    if (a.indexOf("?") < 0) a += "?autoplay=1";
                    else a += "&autoplay=1"
                }
                if (b[m] == 3) {
                    if (a.indexOf('?') < 0) a += '?wmode=transparent&rel=0';
                    else a += '&wmode=transparent&rel=0'
                }
                $("#html5lightbox-video").html("<iframe width='" + c + "' height='" + d + "' src='" + a + "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
                l.$elem.show();
                l.showData()
            })
        };
        l.showPDF = function(a) {};
        l.showMP3 = function(a) {};
        l.showWeb = function(a) {
            var b = (a[ELEM_WIDTH]) ? a[ELEM_WIDTH] : $(window).width();
            var c = (a[ELEM_HEIGHT]) ? a[ELEM_HEIGHT] : $(window).height();
            var d = l.calcElemSize({
                w: b,
                h: c
            });
            b = d.w;
            c = d.h;
            l.resizeLightbox(b, c, true,
            function() {
                l.$text.css({
                    width: l.calcTextWidth(b)
                });
                l.$text.html(a[ELEM_TITLE]);
                l.$image.html("<div id='html5lightbox-web' style='display:block;width:" + b + "px;height:" + c + "px;'></div>").show();
                $("#html5lightbox-web").html("<iframe width='" + b + "' height='" + c + "' src='" + a[ELEM_HREF] + "' frameborder='0'></iframe>");
                l.$elem.show();
                l.showData()
            })
        };
        l.scrollBox = function() {
            if (!l.options.supportCSSPositionFixed) l.$lightbox.css("top", $(window).scrollTop())
        };
        l.resizeWindow = function() {
            var a = Math.round($(window).height() / 2 - (l.$lightboxBox.height() + l.options.barheight) / 2);
            l.$lightboxBox.animate({
                "margin-top": a
            },
            l.options.resizespeed)
        };
        l.calcElemSize = function(a) {
            var b = $(window).height() - l.options.barheight - 2 * l.options.bordersize;
            if (a.h > b) {
                a.w = Math.round(a.w * b / a.h);
                a.h = b
            }
            var c = $(window).width() - 2 * l.options.bordersize;
            if (a.w > c) {
                a.h = Math.round(a.h * c / a.w);
                a.w = c
            }
            return a
        };
        l.showData = function() {
            l.$elemData.show();
            l.$lightboxBox.animate({
                height: l.$lightboxBox.height() + l.options.barheight
            },
            {
                queue: true,
                duration: l.options.resizespeed
            })
        };
        l.resizeLightbox = function(a, b, c, d) {
            var e = (c) ? l.options.resizespeed: 0;
            var f = a + 2 * l.options.bordersize;
            var g = b + 2 * l.options.bordersize;
            var h = Math.round($(window).height() / 2 - (g + l.options.barheight) / 2);
            if ((f == l.$elemWrap.width()) && (g == l.$elemWrap.height())) e = 0;
            l.$loading.hide();
            l.$watermark.hide();
            l.$lightboxBox.animate({
                "margin-top": h
            },
            e,
            function() {
                l.$lightboxBox.css({
                    "width": f,
                    "height": g
                });
                l.$elemWrap.animate({
                    width: f
                },
                e).animate({
                    height: g
                },
                e,
                function() {
                    l.$loading.show();
                    l.$watermark.show();
                    l.$elem.bind("mouseenter mousemove",
                    function() {
                        if ((l.options.prevElem >= 0) || (l.options.nextElem >= 0)) {
                            l.$next.fadeIn();
                            l.$prev.fadeIn()
                        }
                    });
                    l.$elem.bind("mouseleave",
                    function() {
                        l.$next.fadeOut();
                        l.$prev.fadeOut()
                    });
                    d()
                })
            })
        };
        l.reset = function() {
            if (l.options.stamp) l.$watermark.hide();
            l.showing = false;
            l.$image.empty();
            l.$text.empty();
            l.$error.hide();
            l.$loading.hide();
            l.$image.hide();
            l.$elemData.hide()
        };
        l.finish = function() {
            l.reset();
            l.$lightbox.hide();
            l.showObjects()
        };
        l.pauseSlide = function() {};
        l.playSlide = function() {};
        l.gotoSlide = function(a) {
            if (a == -1) {
                if (l.options.nextElem < 0) return;
                l.options.curElem = l.options.nextElem
            } else if (a == -2) {
                if (l.options.prevElem < 0) return;
                l.options.curElem = l.options.prevElem
            }
            l.calcNextPrevElem();
            l.reset();
            l.loadCurElem()
        };
        l.supportKeyboard = function() {
            $(document).keyup(function(e) {
                if (!l.showing) return;
                if (l.options.supportesckey && e.keyCode == 27) {
                    l.finish()
                } else if (l.options.supportarrowkeys) {
                    if (e.keyCode == 39) l.gotoSlide( - 1);
                    else if (e.keyCode == 37) l.gotoSlide( - 2)
                }
            })
        };
        l.enableSwipe = function() {};
        l.hideObjects = function() {
            $('select, embed, object').css({
                'visibility': 'hidden'
            })
        };
        l.showObjects = function() {
            $('select, embed, object').css({
                'visibility': 'visible'
            })
        };
        l.embedHTML5Video = function(a, w, h, b, c) {
            a.html("<div style='position:absolute;display:block;width:" + w + "px;height:" + h + "px;'><video width=" + w + " height=" + h + ((c) ? " autoplay": "") + " controls='controls' src='" + b + "'></div>");
            if (l.options.isAndroid) {
                var d = $("<div style='position:absolute;display:block;cursor:pointer;width:" + w + "px;height:" + h + "px;background:url(\"" + l.options.skinfolder + l.options.playvideoimage + "\") no-repeat center center;'></div>").appendTo(a);
                d.unbind('click').click(function() {
                    $("video", $(this).parent())[0].play()
                })
            }
        };
        l.embedFlash = function(a, w, h, b, c, d) {
            if (l.options.flashInstalled) {
                var e = {
                    pluginspage: "http://www.adobe.com/go/getflashplayer",
                    quality: "high",
                    allowFullScreen: "true",
                    allowScriptAccess: "always",
                    type: "application/x-shockwave-flash"
                };
                e.width = w;
                e.height = h;
                e.src = b;
                e.flashVars = $.param(d);
                e.wmode = c;
                var f = "";
                for (var g in e) f += g + "=" + e[g] + " ";
                a.html("<embed " + f + "/>")
            } else {
                a.html("<div class='html5lightbox-flash-error' style='display:block; position:relative;text-align:center; width:" + w + "px; left:0px; top:" + Math.round(h / 2 - 10) + "px;'><div class='html5-error'><div>The required Adobe Flash Player plugin is not installed</div><br /><div style='display:block;position:relative;text-align:center;width:112px;height:33px;margin:0px auto;'><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' width='112' height='33'></img></a></div></div>")
            }
        };
        l.checkType = function(a) {
            if (!a) return - 1;
            if (a.match(/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i)) return 0;
            if (a.match(/[^\.]\.(swf)\s*$/i)) return 1;
            if (a.match(/\.(flv|mp4|m4v|ogv|ogg|webm)(.*)?$/i)) return 2;
            if ((a.match(/\:\/\/.*(youku\.com)/i)) || (a.match(/\:\/\/.*(youtu\.be)/i))) return 3;
            if (a.match(/\:\/\/.*(vimeo\.com)/i)) return 4;
            if (a.match(/[^\.]\.(pdf)\s*$/i)) return 5;
            if (a.match(/[^\.]\.(mp3)\s*$/i)) return 6;
            return 7
        };
        l.showLightbox = function(a, b, c, d, e, f, g) {
            l.$next.hide();
            l.$prev.hide();
            l.reset();
            l.$lightbox.show();
            if (!l.options.supportCSSPositionFixed) l.$lightbox.css("top", $(window).scrollTop());
            var h = l.options.loadingwidth + 2 * l.options.bordersize;
            var i = l.options.loadingheight + 2 * l.options.bordersize;
            var j = Math.round($(window).height() / 2 - (i + l.options.barheight) / 2);
            l.$lightboxBox.css({
                "margin-top": j,
                "width": h,
                "height": i
            });
            l.$elemWrap.css({
                "width": h,
                "height": i
            });
            l.loadElem(new Array(a, b, c, null, d, e, f, g))
        };
        l.addItem = function(a, b, c, d, e, f, g) {
            type = l.checkType(a);
            l.elemArray.push(new Array(type, a, b, c, d, e, f, g))
        };
        l.showItem = function(a) {
            if (l.elemArray.length <= 0) return true;
            l.hideObjects();
            for (var i = 0; i < l.elemArray.length; i++) {
                if (l.elemArray[i][ELEM_HREF] == a) break
            }
            if (i == l.elemArray.length) return true;
            l.options.curElem = i;
            l.options.nextElem = -1;
            l.options.prevElem = -1;
            l.calcNextPrevElem();
            l.$next.hide();
            l.$prev.hide();
            l.reset();
            l.$lightbox.show();
            if (!l.options.supportCSSPositionFixed) l.$lightbox.css("top", $(window).scrollTop());
            var b = l.options.loadingwidth + 2 * l.options.bordersize;
            var c = l.options.loadingheight + 2 * l.options.bordersize;
            var d = Math.round($(window).height() / 2 - (c + l.options.barheight) / 2);
            l.$lightboxBox.css({
                "margin-top": d,
                "width": b,
                "height": c
            });
            l.$elemWrap.css({
                "width": b,
                "height": c
            });
            l.loadCurElem();
            return false
        };
        l.init();
        return l.unbind('click').click(l.clickHandler)
    }
})(jQuery);
function ASTimer(a, b, c) {
    var d = 50;
    var e = null;
    var f = 0;
    var g = false;
    var h = false;
    this.pause = function() {
        if (h) {
            g = true;
            clearInterval(e)
        }
    };
    this.resume = function() {
        if (h && g) {
            g = false;
            e = setInterval(function() {
                f += d;
                if (f > a) {
                    clearInterval(e);
                    if (b) b()
                }
                if (c) c(f / a)
            },
            d)
        }
    };
    this.stop = function() {
        clearInterval(e);
        if (c) c( - 1);
        f = 0;
        g = false;
        h = false
    };
    this.start = function() {
        f = 0;
        g = false;
        h = true;
        e = setInterval(function() {
            f += d;
            if (f > a) {
                clearInterval(e);
                if (b) b()
            }
            if (c) c(f / a)
        },
        d)
    }
}
var ASPlatforms = {
    flashInstalled: function() {
        var a = false;
        try {
            if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) a = true
        } catch(e) {
            if (navigator.mimeTypes["application/x-shockwave-flash"]) a = true
        }
        return a
    },
    html5VideoSupported: function() {
        return ( !! document.createElement('video').canPlayType)
    },
    isChrome: function() {
        return (navigator.userAgent.match(/Chrome/i) != null)
    },
    isFirefox: function() {
        return (navigator.userAgent.match(/Firefox/i) != null)
    },
    isOpera: function() {
        return (navigator.userAgent.match(/Opera/i) != null)
    },
    isSafari: function() {
        return (navigator.userAgent.match(/Safari/i) != null)
    },
    isAndroid: function() {
        return (navigator.userAgent.match(/Android/i) != null)
    },
    isIPad: function() {
        return (navigator.userAgent.match(/iPad/i) != null)
    },
    isIPhone: function() {
        return ((navigator.userAgent.match(/iPod/i) != null) || (navigator.userAgent.match(/iPhone/i) != null))
    },
    isIOS: function() {
        return this.isIPad() || this.isIPhone()
    },
    isIE9: function() {
        return (navigator.userAgent.match(/MSIE/i) != null) && this.html5VideoSupported() && !this.isOpera()
    },
    isIE8: function() {
        return (navigator.userAgent.match(/MSIE 8/i) != null) && !this.isOpera()
    },
    isIE7: function() {
        return (navigator.userAgent.match(/MSIE 7/i) != null) && !this.isOpera()
    },
    isIE6: function() {
        return (navigator.userAgent.match(/MSIE 6/i) != null) && !this.isOpera()
    },
    isIE678: function() {
        return this.isIE6() || this.isIE7() || this.isIE8()
    },
    css33dTransformSupported: function() {
        return ! this.isIE6() && !this.isIE7() && !this.isIE8() && !this.isIE9() && !this.isOpera()
    },
    applyBrowserStyles: function(a, b) {
        var c = {};
        for (var d in a) {
            c[d] = a[d];
            c['-webkit-' + d] = (b) ? '-webkit-' + a[d] : a[d];
            c['-moz-' + d] = (b) ? '-moz-' + a[d] : a[d];
            c['-ms-' + d] = (b) ? '-ms-' + a[d] : a[d];
            c['-o-' + d] = (b) ? '-o-' + a[d] : a[d]
        }
        return c
    }
}; (function($) {
    $.fn.html5zoo = function(G) {
        var H = 0,
        ELEM_SRC = 1,
        ELEM_TITLE = 2,
        ELEM_DESCRIPTION = 3,
        ELEM_LINK = 4,
        ELEM_TARGET = 5,
        ELEM_VIDEO = 6,
        ELEM_THUMBNAIL = 7,
        ELEM_LIGHTBOX = 8,
        ELEM_LIGHTBOXWIDTH = 9,
        ELEM_LIGHTBOXHEIGHT = 10;
        var I = 1,
        TYPE_SWF = 2,
        TYPE_MP3 = 3,
        TYPE_PDF = 4,
        TYPE_VIDEO_FLASH = 5,
        TYPE_VIDEO_MP4 = 6,
        TYPE_VIDEO_OGG = 7,
        TYPE_VIDEO_WEBM = 8,
        TYPE_VIDEO_youku = 9,
        TYPE_VIDEO_VIMEO = 10;
        var J = function(a, b, c) {
            this.container = a;
            this.options = b;
            this.id = c;
            this.transitionTimeout = null;
            this.arrowTimeout = null;
            this.lightboxArray = [];
            this.elemArray = [];
            this.container.children().hide();
            this.container.css({
                "display": "block",
                "position": "relative"
            });
            this.initData(this.init)
        };
        J.prototype = {
            initData: function(a) {
                this.readTags();
                a(this)
            },
            readTags: function() {
                var m = this;
                $('.html5zoo-slides', this.container).find('li').each(function() {
                    var a = $('img', $(this));
                    if (a.length > 0) {
                        var b = (a.data("src") && (a.data("src").length > 0)) ? a.data("src") : '';
                        var c = (a.attr("src") && (a.attr("src").length > 0)) ? a.attr("src") : b;
                        var d = (a.attr("alt") && (a.attr("alt").length > 0)) ? a.attr("alt") : '';
                        var e = (a.data("description") && (a.data("description").length > 0)) ? a.data("description") : '';
                        var f = (a.parent() && a.parent().is("a")) ? a.parent().attr("href") : '';
                        var g = (a.parent() && a.parent().is("a")) ? a.parent().attr("target") : '';
                        var h = (a.parent() && a.parent().is("a")) ? a.parent().hasClass("html5lightbox") : false;
                        var i = (a.parent() && h) ? a.parent().data("width") : 0;
                        var j = (a.parent() && h) ? a.parent().data("height") : 0;
                        var k = [];
                        if ($('video', $(this)).length > 0) {
                            $('video', $(this)).each(function() {
                                k.push({
                                    href: $(this).attr('src'),
                                    type: m.checkVideoType($(this).attr('src'))
                                })
                            })
                        }
                        var l = new Array(m.elemArray.length, c, d, e, f, g, k, "", h, i, j);
                        m.elemArray.push(l);
                        if (h) m.lightboxArray.push(l)
                    }
                });
                $('.html5zoo-thumbnails', this.container).find('li').each(function(a) {
                    var b = $('img', $(this));
                    if ((b.length > 0) && (m.elemArray.length > a)) {
                        var c = (b.data("src") && (b.data("src").length > 0)) ? b.data("src") : '';
                        var d = (b.attr("src") && (b.attr("src").length > 0)) ? b.attr("src") : c;
                        m.elemArray[a][ELEM_THUMBNAIL] = d
                    }
                });
                if (this.options.shownumbering) {
                    for (var i = 0; i < this.elemArray.length; i++) {
                        var n = this.options.numberingformat.replace("%NUM", i + 1).replace("%TOTAL", this.elemArray.length);
                        this.elemArray[i][ELEM_TITLE] = n + this.elemArray[i][ELEM_TITLE]
                    }
                }
            },
            init: function(a) {
                if (a.elemArray.length <= 0) return;
                a.isAnimating = false;
                a.isPaused = !a.options.autoplay;
                a.tempPaused = false;
                a.initVideoApi();
                a.createMarkup();
                a.createStyle();
                a.createNav();
                a.createArrows();
                a.createBottomShadow();
                a.createBackgroundImage();
                a.createText();
                a.createSliderTimeout();
                a.createWatermark();
                a.createRibbon();
                a.createGoogleFonts();
                a.initHtml5Lightbox();
                a.curElem = -1;
                a.prevElem = -1;
                a.nextElem = -1;
                a.firstslide = true;
                a.loopCount = 0;
                a.pauseCarousel = false;
                var b = 0;
                var c = a.getParams();
                var d = parseInt(c["firstslideid"]);
                if (!isNaN(d) && (d >= 1) && (d <= a.elemArray.length)) b = d - 1;
                else if (a.options.randomplay) b = Math.floor(Math.random() * a.elemArray.length);
                a.slideRun(b)
            },
            getParams: function() {
                var a = {};
                var b = window.location.search.substring(1).split("&");
                for (var i = 0; i < b.length; i++) {
                    var c = b[i].split("=");
                    if (c && (c.length == 2)) a[c[0].toLowerCase()] = unescape(c[1])
                }
                return a
            },
            initHtml5Lightbox: function() {
                var i;
                if (this.lightboxArray.length > 0) {
                    var a = (this.options.skinsfoldername.length > 0) ? (this.options.skinsfoldername + '/') : '';
                    this.html5Lightbox = $([]).html5lightbox({
                        jsfolder: this.options.jsfolder,
                        skinfolder: a
                    });
                    for (i = 0; i < this.lightboxArray.length; i++) {
                        this.html5Lightbox.addItem(this.lightboxArray[i][ELEM_LINK], this.lightboxArray[i][ELEM_TITLE], 'html5zoo' + this.id, this.lightboxArray[i][ELEM_LIGHTBOXWIDTH], this.lightboxArray[i][ELEM_LIGHTBOXHEIGHT], null, null)
                    }
                }
            },
            createGoogleFonts: function() {
                if (this.options.previewmode) return;
                if (this.options.addfonts && this.options.fonts && this.options.fonts.length > 0) {}
            },
            createRibbon: function() {
                if (!this.options.showribbon || (this.options.ribbonimage.length <= 0)) return;
                $(".html5zoo-ribbon-" + this.id, this.container).html("<img src='" + this.options.skinsfolder + this.options.ribbonimage + "' style='border:none;' />")
            },
            createWatermark: function() {
                if (!this.options.showwatermark) return;
                if ((this.options.watermarkstyle == 'text') && (this.options.watermarktext.length <= 0)) return;
                if ((this.options.watermarkstyle == 'image') && (this.options.watermarkimage.length <= 0)) return;
                var a = '';
                if (this.options.watermarklink) {
                    a += "<a href='" + this.options.watermarklink + "' style='" + this.options.watermarklinkcss + "'";
                    if (this.options.watermarktarget) a += " target='" + this.options.watermarktarget + "'";
                    a += ">"
                }
                if (this.options.watermarkstyle == 'text') {
                    a += this.options.watermarktext
                } else if (this.options.watermarkstyle == 'image') {
                    a += "<img src='" + this.options.skinsfolder + this.options.watermarkimage + "' style='border:none;' />"
                }
                if (this.options.watermarklink) a += "</a>";
                $(".html5zoo-watermark-" + this.id, this.container).html(a)
            },
            initVideoApi: function() {
                var i, j, videos;
                var a = false,
                initVimeo = false;
                for (i = 0; i < this.elemArray.length; i++) {
                    videos = this.elemArray[i][ELEM_VIDEO];
                    for (j = 0; j < videos.length; j++) {
                        if (videos[j].type == TYPE_VIDEO_youku) a = true;
                        else if (videos[j].type == TYPE_VIDEO_VIMEO) initVimeo = true
                    }
                }
                if (a) {
                    var b = document.createElement('script');
                    b.src = ('https:' == document.location.protocol ? 'https': 'http') + "://www.youku.com/iframe_api";
                    var c = document.getElementsByTagName('script')[0];
                    c.parentNode.insertBefore(b, c)
                }
                if (initVimeo) {
                    var b = document.createElement('script');
                    b.src = this.options.jsfolder + "froogaloop2.min.js";
                    var c = document.getElementsByTagName('script')[0];
                    c.parentNode.insertBefore(b, c)
                }
            },
            createSliderTimeout: function() {
                var b = this;
                this.sliderTimeout = new ASTimer(this.options.slideinterval,
                function() {
                    b.slideRun( - 1)
                },
                ((this.options.showtimer) ? (function(a) {
                    b.updateTimer(a)
                }) : null));
                if (b.options.pauseonmouseover) {
                    $(".html5zoo-slider-" + this.id, this.container).hover(function() {
                        if (!b.isPaused) b.sliderTimeout.pause()
                    },
                    function() {
                        if (!b.isPaused) b.sliderTimeout.resume()
                    })
                }
                if (b.options.showtimer) $(".html5zoo-timer-" + b.id, b.container).css({
                    display: 'block',
                    position: 'absolute',
                    left: '0px',
                    top: ((b.options.timerposition == 'bottom') ? '': '0px'),
                    bottom: ((b.options.timerposition == 'bottom') ? '0px': ''),
                    width: '0%',
                    height: b.options.timerheight + 'px',
                    'background-color': b.options.timercolor,
                    opacity: b.options.timeropacity,
                    filter: 'alpha(opacity=' + Math.round(100 * b.options.timeropacity) + ')'
                })
            },
            updateTimer: function(a) {
                w = Math.round(a * 100) + 1;
                if (w > 100) w = 100;
                if (w < 0) w = 0;
                $(".html5zoo-timer-" + this.id, this.container).css({
                    width: w + '%'
                })
            },
            createMarkup: function() {
                this.$wrapper = jQuery("<div class='html5zoo-wrapper-" + this.id + "'><div class='html5zoo-background-image-" + this.id + "'></div><div class='html5zoo-bottom-shadow-" + this.id + "'></div><div class='html5zoo-slider-" + this.id + "'><div class='html5zoo-box-" + this.id + "'><div class='html5zoo-swipe-box-" + this.id + "'><div class='html5zoo-space-" + this.id + "'></div><div class='html5zoo-img-box-" + this.id + "'></div></div></div><div class='html5zoo-text-wrapper-" + this.id + "'></div><div class='html5zoo-play-" + this.id + "'></div><div class='html5zoo-video-wrapper-" + this.id + "'></div><div class='html5zoo-ribbon-" + this.id + "'></div><div class='html5zoo-arrow-left-" + this.id + "'></div><div class='html5zoo-arrow-right-" + this.id + "'></div><div class='html5zoo-timer-" + this.id + "'></div><div class='html5zoo-watermark-" + this.id + "'></div></div><div class='html5zoo-nav-" + this.id + "'><div class='html5zoo-nav-container-" + this.id + "'></div></div></div>");
                this.$wrapper.appendTo(this.container);
                var a = this;
                if (this.options.enabletouchswipe) {
                    $(".html5zoo-swipe-box-" + this.id, this.container).touchSwipe({
                        swipeLeft: function() {
                            a.slideRun( - 1)
                        },
                        swipeRight: function() {
                            a.slideRun( - 2)
                        }
                    })
                }
                $(".html5zoo-play-" + this.id, this.container).click(function() {
                    a.playVideo(true)
                })
            },
            playVideo: function(a) {
                var b = this.elemArray[this.curElem][ELEM_VIDEO];
                if (b.length <= 0) return;
                this.sliderTimeout.stop();
                this.tempPaused = true;
                var c = b[0].href;
                var d = b[0].type;
                if (d == TYPE_VIDEO_youku) this.playyoukuVideo(c, a);
                else if (d == TYPE_VIDEO_VIMEO) this.playVimeoVideo(c, a)
            },
            playVimeoVideo: function(b, c) {
                var d = $(".html5zoo-video-wrapper-" + this.id, this.container);
                d.css({
                    display: 'block',
                    width: '100%',
                    height: '100%'
                });
                if (this.options.previewmode) {
                    d.html("<div class='html5zoo-error-" + this.id + "'>To view Vimeo video, publish the slider then open it in your web browser</div>");
                    return
                } else {
                    var e = b + ((b.indexOf("?") < 0) ? '?': '&') + 'autoplay=' + (c ? '1': '0') + '&api=1&player_id=html5zoo_vimeo_' + this.id;
                    d.html("<iframe id='html5zoo_vimeo_" + this.id + "' width='" + this.options.width + "' height='" + this.options.height + "' src='" + e + "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
                    var f = $('#html5zoo_vimeo_' + this.id)[0];
                    var g = $f(f);
                    var h = this;
                    g.addEvent('ready',
                    function() {
                        g.addEvent('finish',
                        function(a) {
                            h.tempPaused = false;
                            if (!h.isPaused) h.slideRun( - 1)
                        })
                    })
                }
            },
            playyoukuVideo: function(b, c) {
                var d = $(".html5zoo-video-wrapper-" + this.id, this.container);
                d.css({
                    display: 'block',
                    width: '100%',
                    height: '100%'
                });
                if (this.options.previewmode) {
                    d.html("<div class='html5zoo-error-" + this.id + "'>To view youku video, publish the slider then open it in your web browser</div>");
                    return
                }
                var e = this;
                if (!ASyoukuIframeAPIReady) {
                    ASyoukuTimeout += 100;
                    if (ASyoukuTimeout < 3000) {
                        setTimeout(function() {
                            e.playyoukuVideo(b, c)
                        },
                        100);
                        return
                    }
                }
                if (ASyoukuIframeAPIReady && !ASPlatforms.isIE6() && !ASPlatforms.isIE7() && !ASPlatforms.isIOS()) {
                    d.html("<div id='html5zoo-video-" + this.id + "' style='display:block;'></div>");
                    var f = b.match(/(\?v=|\/\d\/|\/embed\/|\/v\/|\.be\/)([a-zA-Z0-9\-\_]+)/)[2];
                    new YT.Player('html5zoo-video-' + this.id, {
                        width: e.options.width,
                        height: e.options.height,
                        videoId: f,
                        playerVars: {
                            'autoplay': 1,
                            'rel': 0,
                            'autohide': 1,
                            'wmode': 'transparent'
                        },
                        events: {
                            'onReady': function(a) {
                                a.target.playVideo()
                            },
                            'onStateChange': function(a) {
                                if (a.data == YT.PlayerState.ENDED) {
                                    e.tempPaused = false;
                                    if (!e.isPaused) e.slideRun( - 1)
                                }
                            }
                        }
                    })
                } else {
                    var g = b + ((b.indexOf("?") < 0) ? '?': '&') + "autoplay=1&wmode=transparent&rel=0&autohide=1";
                    d.html("<iframe width='" + e.options.width + "' height='" + e.options.height + "' src='" + g + "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>")
                }
            },
            checkVideoType: function(a) {
                if (!a) return - 1;
                if (a.match(/\.(flv)(.*)?$/i)) return TYPE_VIDEO_FLASH;
                if (a.match(/\.(mp4|m4v)(.*)?$/i)) return TYPE_VIDEO_MP4;
                if (a.match(/\.(ogv|ogg)(.*)?$/i)) return TYPE_VIDEO_OGG;
                if (a.match(/\.(webm)(.*)?$/i)) return TYPE_VIDEO_WEBM;
                if ((a.match(/\:\/\/.*(youku\.com)/i)) || (a.match(/\:\/\/.*(youtu\.be)/i))) return TYPE_VIDEO_youku;
                if (a.match(/\:\/\/.*(vimeo\.com)/i)) return TYPE_VIDEO_VIMEO;
                return 0
            },
            createText: function() {
                if (this.options.textstyle == 'none') return;
                var m = this;
                var n = $(".html5zoo-text-wrapper-" + this.id, this.container);
                if (this.options.textstyle == 'static') {
                    n.html("<div class='html5zoo-text-" + this.id + "'><div class='html5zoo-text-bg-" + this.id + "'></div><div class='html5zoo-title-" + this.id + "'></div><div class='html5zoo-description-" + this.id + "'></div></div>");
                    n.css({
                        display: ((this.options.textautohide) ? 'none': 'block'),
                        overflow: 'hidden',
                        width: '100%',
                        height: 'auto',
                        position: 'absolute'
                    });
                    if (this.options.textautohide) {
                        $(".html5zoo-slider-" + this.id, this.container).hover(function() {
                            $(".html5zoo-text-wrapper-" + m.id, m.container).fadeIn()
                        },
                        function() {
                            $(".html5zoo-text-wrapper-" + m.id, m.container).fadeOut()
                        })
                    }
                    switch (this.options.textpositionstatic) {
                    case 'top':
                        n.css({
                            left:
                            '0px',
                            top: '0px',
                            'margin-top': this.options.textpositionmarginstatic + 'px'
                        });
                        break;
                    case 'bottom':
                        n.css({
                            left:
                            '0px',
                            bottom: '0px',
                            'margin-bottom': this.options.textpositionmarginstatic + 'px'
                        });
                        break;
                    case 'topoutside':
                        n.css({
                            left:
                            '0px',
                            bottom: '100%',
                            'margin-bottom': this.options.textpositionmarginstatic + 'px'
                        });
                        break;
                    case 'bottomoutside':
                        n.css({
                            left:
                            '0px',
                            top: '100%',
                            'margin-top': this.options.textpositionmarginstatic + 'px'
                        });
                        break
                    }
                } else {
                    n.html("<div class='html5zoo-text-holding-" + this.id + "' style='visibility:hidden;" + this.options.textcss + "'><div class='html5zoo-text-bg-" + this.id + "'></div><div class='html5zoo-title-" + this.id + "'></div><div class='html5zoo-description-" + this.id + "'></div></div><div class='html5zoo-text-" + this.id + "' style='position:absolute;top:0%;left:0%;" + (ASPlatforms.isIE678() ? "opacity:inherit;filter:inherit;": "") + "'><div class='html5zoo-text-bg-" + this.id + "'></div><div class='html5zoo-title-" + this.id + "'></div><div class='html5zoo-description-" + this.id + "'></div></div>");
                    n.css({
                        display: 'none',
                        overflow: 'hidden',
                        position: 'absolute'
                    })
                }
                $("head").append("<style type='text/css'>.html5zoo-text-" + this.id + " {" + this.options.textcss + "} .html5zoo-text-bg-" + this.id + " {" + this.options.textbgcss + "} .html5zoo-title-" + this.id + " {" + this.options.titlecss + "} .html5zoo-description-" + this.id + " {" + this.options.descriptioncss + "} </style>");
                this.container.bind('html5zoo.switchtext',
                function(f, g, h) {
                    var i = $(".html5zoo-text-wrapper-" + m.id, m.container);
                    var j = $(".html5zoo-text-bg-" + m.id, m.container);
                    var k = $(".html5zoo-title-" + m.id, m.container);
                    var l = $(".html5zoo-description-" + m.id, m.container);
                    if (m.options.textstyle == 'static') {
                        k.html(m.elemArray[h][ELEM_TITLE]);
                        l.html(m.elemArray[h][ELEM_DESCRIPTION]);
                        if (!m.elemArray[h][ELEM_TITLE] && !m.elemArray[h][ELEM_DESCRIPTION]) j.hide();
                        else j.show()
                    } else if (m.options.textstyle == 'dynamic') {
                        if (!m.elemArray[h][ELEM_TITLE] && !m.elemArray[h][ELEM_DESCRIPTION]) i.fadeOut();
                        else {
                            i.fadeOut(function() {
                                var a = 'bottomleft';
                                var b = m.options.textpositiondynamic;
                                if (b) {
                                    b = b.split(",");
                                    a = b[Math.floor(Math.random() * b.length)];
                                    a = $.trim(a.toLowerCase())
                                }
                                switch (a) {
                                case 'topleft':
                                    i.css({
                                        left:
                                        '0px',
                                        right: '',
                                        top: '0px',
                                        bottom: ''
                                    });
                                    i.css({
                                        margin: m.options.textpositionmargintop + 'px ' + m.options.textpositionmarginleft + 'px'
                                    });
                                    break;
                                case 'topright':
                                    i.css({
                                        left:
                                        '',
                                        right: '0px',
                                        top: '0px',
                                        bottom: ''
                                    });
                                    i.css({
                                        margin: m.options.textpositionmargintop + 'px ' + m.options.textpositionmarginright + 'px'
                                    });
                                    break;
                                case 'bottomleft':
                                    i.css({
                                        left:
                                        '0px',
                                        right: '',
                                        top: '',
                                        bottom: '0px'
                                    });
                                    i.css({
                                        margin: m.options.textpositionmarginbottom + 'px ' + m.options.textpositionmarginleft + 'px'
                                    });
                                    break;
                                case 'bottomright':
                                    i.css({
                                        left:
                                        '',
                                        right: '0px',
                                        top: '',
                                        bottom: '0px'
                                    });
                                    i.css({
                                        margin: m.options.textpositionmarginbottom + 'px ' + m.options.textpositionmarginright + 'px'
                                    });
                                    break
                                }
                                k.html(m.elemArray[h][ELEM_TITLE]);
                                l.html(m.elemArray[h][ELEM_DESCRIPTION]);
                                var c = null;
                                var d = m.options.texteffect;
                                if (d) {
                                    d = d.split(",");
                                    c = d[Math.floor(Math.random() * d.length)];
                                    c = $.trim(c.toLowerCase())
                                }
                                var e = $(".html5zoo-text-" + m.id, m.container);
                                switch (c) {
                                case 'fade':
                                    e.hide();
                                    i.show();
                                    e.delay(500).fadeIn(m.options.texteffectduration);
                                    break;
                                case 'slide':
                                    e.css({
                                        left:
                                        '-100%',
                                        opacity: 0,
                                        display: 'block'
                                    });
                                    i.show();
                                    e.delay(500).animate({
                                        left: '0%',
                                        opacity: 1
                                    },
                                    m.options.texteffectduration, m.options.texteffecteasing);
                                    break;
                                default:
                                    e.delay(500).show()
                                }
                            })
                        }
                    }
                })
            },
            createStyle: function() {
                $(".html5zoo-space-" + this.id, this.container).html("<img style='width:100%;max-width:100%;' src='" + this.elemArray[0][ELEM_SRC] + "' />");
                if (this.options.isresponsive) this.container.css({
                    "max-width": this.options.width,
                    "max-height": this.options.height
                });
                else this.container.css({
                    "width": this.options.width,
                    "height": this.options.height
                });
                var a = ".html5zoo-wrapper-" + this.id + " {display:block;position:relative;width:100%;height:auto;}";
                a += ".html5zoo-slider-" + this.id + " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;";
                if (this.options.border > 0) a += "margin-left:-" + this.options.border + "px;border-width:" + this.options.border + "px;border-style:solid;border-color:" + this.options.bordercolor + ";";
                if (this.options.borderradius > 0) a += "border-radius:" + this.options.borderradius + "px;-moz-border-radius:" + this.options.borderradius + "px;-webkit-border-radius:" + this.options.borderradius + "px;";
                if (this.options.showshadow) {
                    var b = "0px 0px " + this.options.shadowsize + "px " + this.options.shadowcolor;
                    a += "box-shadow:" + b + ";-moz-box-shadow:" + b + ";-webkit-box-shadow:" + b + ";";
                    if (ASPlatforms.isIE678() || ASPlatforms.isIE9) {
                        a += "filter:progid:DXImageTransform.Microsoft.Shadow(color=" + this.options.shadowcolor + ",direction=135,strength=" + this.options.shadowsize + ");"
                    }
                }
                a += "}";
                a += ".html5zoo-box-" + this.id + " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;}";
                a += ".html5zoo-swipe-box-" + this.id + " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;}";
                a += ".html5zoo-space-" + this.id + " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;visibility:hidden;line-height:0px;font-size:0px;}";
                a += ".html5zoo-img-box-" + this.id + " {display:block;position:absolute;left:0px;top:0px;width:100%;height:100%;}";
                a += ".html5zoo-play-" + this.id + " {display:none;position:absolute;left:50%;top:50%;cursor:pointer;width:" + this.options.playvideoimagewidth + "px;height:" + this.options.playvideoimageheight + "px;margin-top:-" + Math.round(this.options.playvideoimageheight / 2) + "px;margin-left:" + '-' + Math.round(this.options.playvideoimagewidth / 2) + "px; background:url('" + this.options.skinsfolder + this.options.playvideoimage + "') no-repeat left top;}";
                a += ".html5zoo-video-wrapper-" + this.id + " {display:none;position:absolute;left:0px;top:0px;background-color:#000;text-align:center;}";
                a += ".html5zoo-error-" + this.id + " {display:block;position:relative;margin:0 auto;width:80%;top:50%;color:#fff;font:16px Arial,Tahoma,Helvetica,sans-serif;}";
                if (this.options.showwatermark) {
                    if (((this.options.watermarkstyle == 'text') && (this.options.watermarktext.length > 0)) || ((this.options.watermarkstyle == 'image') && (this.options.watermarkimage.length > 0))) {
                        a += ".html5zoo-watermark-" + this.id + " {" + this.options.watermarkpositioncss;
                        if ((this.options.watermarkstyle == 'text') && (this.options.watermarktext.length > 0)) a += this.options.watermarktextcss;
                        if (this.options.watermarklink) a += "cursor:pointer;";
                        a += "}"
                    }
                }
                if (this.options.showribbon) {
                    a += ".html5zoo-ribbon-" + this.id + " {display:block;position:absolute;";
                    switch (this.options.ribbonposition) {
                    case 'topleft':
                        a += "left:" + this.options.ribbonimagex + "px;top:" + this.options.ribbonimagey + "px;";
                        break;
                    case 'topright':
                        a += "right:" + this.options.ribbonimagex + "px;top:" + this.options.ribbonimagey + "px;";
                        break;
                    case 'bottomleft':
                        a += "left:" + this.options.ribbonimagex + "px;bottom:" + this.options.ribbonimagey + "px;";
                        break;
                    case 'bottomright':
                        a += "right:" + this.options.ribbonimagex + "px;bottom:" + this.options.ribbonimagey + "px;";
                        break;
                    case 'top':
                        a += "width:100%;height:auto;margin:0 auto;top:" + this.options.ribbonimagey + "px;";
                    case 'bottom':
                        a += "width:100%;height:auto;text-align:center;bottom:" + this.options.ribbonimagey + "px;"
                    }
                    a += "}"
                }
                a += ".html5zoo-video-wrapper-" + this.id + " video {max-width:100%;height:auto;}";
                a += ".html5zoo-video-wrapper-" + this.id + " iframe, .html5zoo-video-wrapper-" + this.id + " object, .html5zoo-video-wrapper-" + this.id + " embed {position:absolute;top:0;left:0;width:100%;height:100%;}";
                if ((this.options.navstyle == "thumbnails") && (this.options.navthumbstyle != 'imageonly')) {
                    a += ".html5zoo-nav-thumbnail-tite-" + this.id + " {" + this.options.navthumbtitlecss + "}";
                    a += ".html5zoo-nav-thumbnail-tite-" + this.id + ":hover {" + this.options.navthumbtitlehovercss + "}";
                    if (this.options.navthumbstyle == 'imageandtitledescription') a += ".html5zoo-nav-thumbnail-description-" + this.id + " {" + this.options.navthumbdescriptioncss + "}"
                }
                $("head").append("<style type='text/css'>" + a + "</style>")
            },
            createBottomShadow: function() {
                if (!this.options.showbottomshadow) return;
                var a = $(".html5zoo-bottom-shadow-" + this.id, this.container);
                var l = (100 - this.options.bottomshadowimagewidth) / 2;
                a.css({
                    display: 'block',
                    position: 'absolute',
                    left: l + '%',
                    top: this.options.bottomshadowimagetop + '%',
                    width: this.options.bottomshadowimagewidth + '%',
                    height: 'auto'
                });
                a.html("<img src='" + this.options.skinsfolder + this.options.bottomshadowimage + "' style='display:block;position:relative;width:100%;height:auto;' />")
            },
            createBackgroundImage: function() {
                if (!this.options.showbackgroundimage || !this.options.backgroundimage) return;
                var a = $(".html5zoo-background-image-" + this.id, this.container);
                var l = (100 - this.options.backgroundimagewidth) / 2;
                a.css({
                    display: 'block',
                    position: 'absolute',
                    left: l + '%',
                    top: this.options.backgroundimagetop + '%',
                    width: this.options.backgroundimagewidth + '%',
                    height: 'auto'
                });
                a.html("<img src='" + this.options.skinsfolder + this.options.backgroundimage + "' style='display:block;position:relative;width:100%;height:auto;' />")
            },
            createArrows: function() {
                if (this.options.arrowstyle == 'none') return;
                var a = this;
                var b = $(".html5zoo-arrow-left-" + this.id, this.container);
                var c = $(".html5zoo-arrow-right-" + this.id, this.container);
                b.css({
                    overflow: 'hidden',
                    position: 'absolute',
                    cursor: 'pointer',
                    width: this.options.arrowwidth + 'px',
                    height: this.options.arrowheight + 'px',
                    left: this.options.arrowmargin + 'px',
                    top: this.options.arrowtop + '%',
                    'margin-top': '-' + this.options.arrowheight / 2 + 'px',
                    background: "url('" + this.options.skinsfolder + this.options.arrowimage + "') no-repeat left top"
                });
                if (ASPlatforms.isIE678()) b.css({
                    opacity: 'inherit',
                    filter: 'inherit'
                });
                b.hover(function() {
                    $(this).css({
                        'background-position': 'left bottom'
                    })
                },
                function() {
                    $(this).css({
                        'background-position': 'left top'
                    })
                });
                b.click(function() {
                    a.slideRun( - 2)
                });
                c.css({
                    overflow: 'hidden',
                    position: 'absolute',
                    cursor: 'pointer',
                    width: this.options.arrowwidth + 'px',
                    height: this.options.arrowheight + 'px',
                    right: this.options.arrowmargin + 'px',
                    top: this.options.arrowtop + '%',
                    'margin-top': '-' + this.options.arrowheight / 2 + 'px',
                    background: "url('" + this.options.skinsfolder + this.options.arrowimage + "') no-repeat right top"
                });
                if (ASPlatforms.isIE678()) c.css({
                    opacity: 'inherit',
                    filter: 'inherit'
                });
                c.hover(function() {
                    $(this).css({
                        'background-position': 'right bottom'
                    })
                },
                function() {
                    $(this).css({
                        'background-position': 'right top'
                    })
                });
                c.click(function() {
                    a.slideRun( - 1)
                });
                if (this.options.arrowstyle == 'always') {
                    b.css({
                        display: 'block'
                    });
                    c.css({
                        display: 'block'
                    })
                } else {
                    b.css({
                        display: 'none'
                    });
                    c.css({
                        display: 'none'
                    });
                    $(".html5zoo-slider-" + this.id, this.container).hover(function() {
                        clearTimeout(a.arrowTimeout);
                        if (ASPlatforms.isIE678()) {
                            $(".html5zoo-arrow-left-" + a.id, a.container).show();
                            $(".html5zoo-arrow-right-" + a.id, a.container).show()
                        } else {
                            $(".html5zoo-arrow-left-" + a.id, a.container).fadeIn();
                            $(".html5zoo-arrow-right-" + a.id, a.container).fadeIn()
                        }
                    },
                    function() {
                        a.arrowTimeout = setTimeout(function() {
                            if (ASPlatforms.isIE678()) {
                                $(".html5zoo-arrow-left-" + a.id, a.container).hide();
                                $(".html5zoo-arrow-right-" + a.id, a.container).hide()
                            } else {
                                $(".html5zoo-arrow-left-" + a.id, a.container).fadeOut();
                                $(".html5zoo-arrow-right-" + a.id, a.container).fadeOut()
                            }
                        },
                        a.options.arrowhideonmouseleave)
                    })
                }
            },
            carMoveLeft: function() {
                var a = $(".html5zoo-nav-container-" + this.id, this.container);
                var b = $(".html5zoo-bullet-wrapper-" + this.id, this.container);
                if (a.width() >= b.width()) return;
                if (this.options.navshowpreview) $(".html5zoo-nav-preview-" + this.id, this.container).hide();
                var c = a.width() + this.options.navspacing;
                var l = (isNaN(parseInt(b.css("margin-left"))) ? 0 : parseInt(b.css("margin-left"))) - c;
                if (l <= (a.width() - b.width())) l = (a.width() - b.width());
                if (l >= 0) l = 0;
                b.animate({
                    "margin-left": l
                },
                {
                    queue: false,
                    duration: 500,
                    easing: "easeOutCirc"
                });
                if (this.options.navthumbnavigationstyle != 'auto') this.updateCarouselLeftRightArrow(l)
            },
            carMoveRight: function() {
                var a = $(".html5zoo-nav-container-" + this.id, this.container);
                var b = $(".html5zoo-bullet-wrapper-" + this.id, this.container);
                if (a.width() >= b.width()) return;
                if (this.options.navshowpreview) $(".html5zoo-nav-preview-" + this.id, this.container).hide();
                var c = a.width() + this.options.navspacing;
                var l = (isNaN(parseInt(b.css("margin-left"))) ? 0 : parseInt(b.css("margin-left"))) + c;
                if (l <= (a.width() - b.width())) l = (a.width() - b.width());
                if (l >= 0) l = 0;
                b.animate({
                    "margin-left": l
                },
                {
                    queue: false,
                    duration: 500,
                    easing: "easeOutCirc"
                });
                if (this.options.navthumbnavigationstyle != 'auto') this.updateCarouselLeftRightArrow(l)
            },
            carMoveBottom: function() {
                var a = $(".html5zoo-nav-container-" + this.id, this.container);
                var b = $(".html5zoo-bullet-wrapper-" + this.id, this.container);
                if (a.height() >= b.height()) return;
                if (this.options.navshowpreview) $(".html5zoo-nav-preview-" + this.id, this.container).hide();
                var c = a.height() + this.options.navspacing;
                var l = (isNaN(parseInt(b.css("margin-top"))) ? 0 : parseInt(b.css("margin-top"))) + c;
                if (l <= (a.height() - b.height())) l = (a.height() - b.height());
                if (l >= 0) l = 0;
                b.animate({
                    "margin-top": l
                },
                {
                    queue: false,
                    duration: 500,
                    easing: "easeOutCirc"
                });
                if (this.options.navthumbnavigationstyle != 'auto') this.updateCarouselLeftRightArrow(l)
            },
            carMoveTop: function() {
                var a = $(".html5zoo-nav-container-" + this.id, this.container);
                var b = $(".html5zoo-bullet-wrapper-" + this.id, this.container);
                if (a.height() >= b.height()) return;
                if (this.options.navshowpreview) $(".html5zoo-nav-preview-" + this.id, this.container).hide();
                var c = a.height() + this.options.navspacing;
                var l = (isNaN(parseInt(b.css("margin-top"))) ? 0 : parseInt(b.css("margin-top"))) - c;
                if (l <= (a.height() - b.height())) l = (a.height() - b.height());
                if (l >= 0) l = 0;
                b.animate({
                    "margin-top": l
                },
                {
                    queue: false,
                    duration: 500,
                    easing: "easeOutCirc"
                });
                if (this.options.navthumbnavigationstyle != 'auto') this.updateCarouselLeftRightArrow(l)
            },
            updateCarouselLeftRightArrow: function(l) {
                var a = $(".html5zoo-nav-container-" + this.id, this.container);
                var b = $(".html5zoo-bullet-wrapper-" + this.id, this.container);
                if (this.options.navdirection == 'vertical') {
                    if (l == 0) {
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).css({
                            'background-position': 'left bottom',
                            cursor: ''
                        });
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).data('disabled', true)
                    } else {
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).css({
                            'background-position': 'left top',
                            cursor: 'pointer'
                        });
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).data('disabled', false)
                    }
                    if ((l == (a.height() - b.height()))) {
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).css({
                            'background-position': 'right bottom',
                            cursor: ''
                        });
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).data('disabled', true)
                    } else {
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).css({
                            'background-position': 'right top',
                            cursor: 'pointer'
                        });
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).data('disabled', false)
                    }
                } else {
                    if (l == 0) {
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).css({
                            'background-position': 'left bottom',
                            cursor: ''
                        });
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).data('disabled', true)
                    } else {
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).css({
                            'background-position': 'left top',
                            cursor: 'pointer'
                        });
                        $(".html5zoo-car-left-arrow-" + this.id, this.container).data('disabled', false)
                    }
                    if ((l == (a.width() - b.width()))) {
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).css({
                            'background-position': 'right bottom',
                            cursor: ''
                        });
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).data('disabled', true)
                    } else {
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).css({
                            'background-position': 'right top',
                            cursor: 'pointer'
                        });
                        $(".html5zoo-car-right-arrow-" + this.id, this.container).data('disabled', false)
                    }
                }
            },
            createNav: function() {
                if ((this.options.navstyle == 'none') && (!this.options.navshowbuttons)) return;
                var f = this;
                var i;
                var g = $(".html5zoo-nav-" + this.id, this.container);
                var h = $(".html5zoo-nav-container-" + this.id, this.container);
                var j = $("<div class='html5zoo-bullet-wrapper-" + this.id + "' style='display:block;position:relative;'></div>");
                if (this.options.navstyle == 'thumbnails') {
                    this.options.navimagewidth = this.options.navwidth - this.options.navborder * 2;
                    this.options.navimageheight = this.options.navheight - this.options.navborder * 2;
                    if (this.options.navthumbstyle == 'imageandtitle') this.options.navheight += this.options.navthumbtitleheight;
                    else if (this.options.navthumbstyle == 'imageandtitledescription') this.options.navwidth += this.options.navthumbtitlewidth
                }
                if (this.options.navdirection == 'vertical') {
                    var k = (this.options.navstyle == 'none') ? 0 : this.elemArray.length * this.options.navheight + (this.elemArray.length - 1) * this.options.navspacing;
                    if (this.options.navshowbuttons) {
                        if (this.options.navshowarrow) {
                            k += (k > 0) ? this.options.navspacing: 0;
                            k += 2 * this.options.navheight + this.options.navspacing
                        }
                        if (this.options.navshowplaypause && !this.options.navshowplaypausestandalone) {
                            k += (k > 0) ? this.options.navspacing: 0;
                            k += this.options.navheight
                        }
                    }
                    j.css({
                        height: k + "px",
                        width: "auto"
                    })
                } else {
                    var k = (this.options.navstyle == 'none') ? 0 : this.elemArray.length * this.options.navwidth + (this.elemArray.length - 1) * this.options.navspacing;
                    if (this.options.navshowbuttons) {
                        if (this.options.navshowarrow) {
                            k += (k > 0) ? this.options.navspacing: 0;
                            k += 2 * this.options.navwidth + this.options.navspacing
                        }
                        if (this.options.navshowplaypause && !this.options.navshowplaypausestandalone) {
                            k += (k > 0) ? this.options.navspacing: 0;
                            k += this.options.navwidth
                        }
                    }
                    j.css({
                        width: k + "px",
                        height: "auto"
                    })
                }
                h.append(j);
                var o = 0;
                var q = (this.options.navdirection == 'vertical') ? this.options.navwidth: this.options.navheight;
                if ((this.options.navstyle == 'thumbnails') && this.options.navshowfeaturedarrow) {
                    q += (this.options.navdirection == 'vertical') ? this.options.navfeaturedarrowimagewidth: this.options.navfeaturedarrowimageheight;
                    o = (this.options.navdirection == 'vertical') ? this.options.navfeaturedarrowimagewidth: this.options.navfeaturedarrowimageheight
                }
                var s = ('navmarginx' in this.options) ? this.options.navmarginx: this.options.navmargin;
                var t = ('navmarginy' in this.options) ? this.options.navmarginy: this.options.navmargin;
                g.css({
                    display: 'block',
                    position: 'absolute',
                    height: 'auto'
                });
                switch (this.options.navposition) {
                case 'top':
                    j.css({
                        "margin-left":
                        'auto',
                        "margin-right": 'auto',
                        'height': q + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'width': '100%',
                        top: '0%',
                        left: '0px',
                        'margin-top': t + 'px'
                    });
                    break;
                case 'topleft':
                    j.css({
                        'height':
                        q + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'max-width': '100%',
                        top: '0px',
                        left: '0px',
                        'margin-top': t + 'px',
                        'margin-left': s + 'px'
                    });
                    break;
                case 'topright':
                    j.css({
                        'height':
                        q + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'max-width': '100%',
                        top: '0px',
                        right: '0px',
                        'margin-top': t + 'px',
                        'margin-right': s + 'px'
                    });
                    break;
                case 'bottom':
                    j.css({
                        "margin-left":
                        'auto',
                        "margin-right": 'auto',
                        'margin-top': o + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'width': '100%',
                        top: '100%',
                        left: '0px',
                        'margin-top': String(t - o) + 'px'
                    });
                    break;
                case 'bottomleft':
                    j.css({
                        'margin-top':
                        o + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'max-width': '100%',
                        bottom: '0px',
                        left: '0px',
                        'margin-bottom': t + 'px',
                        'margin-top': String(t - o) + 'px',
                        'margin-left': s + 'px'
                    });
                    break;
                case 'bottomright':
                    j.css({
                        'margin-top':
                        o + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'max-width': '100%',
                        bottom: '0px',
                        right: '0px',
                        'margin-bottom': t + 'px',
                        'margin-top': String(t - o) + 'px',
                        'margin-right': s + 'px'
                    });
                    break;
                case 'left':
                    j.css({
                        'width':
                        q + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'height': '100%',
                        width: q + 'px',
                        top: '0%',
                        left: '0%',
                        'margin-left': s + 'px'
                    });
                    h.css({
                        display: 'block',
                        position: 'absolute',
                        top: '0px',
                        bottom: '0px',
                        left: '0px',
                        right: '0px',
                        height: 'auto'
                    });
                    break;
                case 'right':
                    j.css({
                        'margin-left':
                        o + 'px'
                    });
                    g.css({
                        overflow: 'hidden',
                        'height': '100%',
                        width: q + 'px',
                        top: '0%',
                        left: '100%',
                        'margin-left': String(s - o) + 'px'
                    });
                    h.css({
                        display: 'block',
                        position: 'absolute',
                        top: '0px',
                        bottom: '0px',
                        left: '0px',
                        right: '0px',
                        height: 'auto'
                    });
                    break
                }
                if (this.options.navstyle != 'none') {
                    var u;
                    for (i = 0; i < this.elemArray.length; i++) {
                        u = this.createNavBullet(i);
                        j.append(u)
                    }
                    g.mouseenter(function() {
                        f.pauseCarousel = true
                    });
                    g.mouseleave(function() {
                        f.pauseCarousel = false
                    });
                    if (f.options.navthumbnavigationstyle == 'auto') {
                        g.mousemove(function(e) {
                            if (f.options.navdirection == 'vertical') {
                                if (g.height() >= j.height()) return;
                                var d = e.pageY - g.offset().top;
                                if (d < 10) d = 0;
                                if (d > g.height() - 10) d = g.height();
                                var r = d / g.height();
                                var l = (g.height() - j.height()) * r;
                                j.animate({
                                    "margin-top": l
                                },
                                {
                                    queue: false,
                                    duration: 20,
                                    easing: "easeOutCubic"
                                })
                            } else {
                                if (g.width() >= j.width()) return;
                                var d = e.pageX - g.offset().left;
                                if (d < 10) d = 0;
                                if (d > g.width() - 10) d = g.width();
                                var r = d / g.width();
                                var l = (g.width() - j.width()) * r;
                                j.animate({
                                    "margin-left": l
                                },
                                {
                                    queue: false,
                                    duration: 20,
                                    easing: "easeOutCubic"
                                })
                            }
                        })
                    } else {
                        if (((f.options.navdirection == 'vertical') && (j.height() > h.height())) || ((f.options.navdirection == 'horizontal') && (j.width() > h.width()))) {
                            var m = f.options.navthumbnavigationarrowimagewidth + f.options.navspacing;
                            if (f.options.navdirection == "horizontal") {
                                var n = Math.floor(((g.width() - 2 * m) + f.options.navspacing) / (f.options.navwidth + f.options.navspacing));
                                m = Math.floor((g.width() - n * f.options.navwidth - (n - 1) * f.options.navspacing) / 2)
                            }
                            if (f.options.navdirection == 'vertical') h.css({
                                'margin-top': m + 'px',
                                'margin-bottom': m + 'px',
                                overflow: 'hidden'
                            });
                            else h.css({
                                'margin-left': m + 'px',
                                'margin-right': m + 'px',
                                overflow: 'hidden'
                            });
                            var v = $("<div class='html5zoo-car-left-arrow-" + f.id + "' style='display:none;'></div>");
                            var w = $("<div class='html5zoo-car-right-arrow-" + f.id + "' style='display:none;'></div>");
                            g.append(v);
                            g.append(w);
                            v.css({
                                overflow: 'hidden',
                                position: 'absolute',
                                cursor: 'pointer',
                                width: f.options.navthumbnavigationarrowimagewidth + 'px',
                                height: f.options.navthumbnavigationarrowimageheight + 'px',
                                background: "url('" + f.options.skinsfolder + f.options.navthumbnavigationarrowimage + "') no-repeat left top"
                            });
                            w.css({
                                overflow: 'hidden',
                                position: 'absolute',
                                cursor: 'pointer',
                                width: f.options.navthumbnavigationarrowimagewidth + 'px',
                                height: f.options.navthumbnavigationarrowimageheight + 'px',
                                background: "url('" + f.options.skinsfolder + f.options.navthumbnavigationarrowimage + "') no-repeat right top"
                            });
                            var p = (f.options.navdirection == 'vertical') ? (f.options.navwidth / 2 - f.options.navthumbnavigationarrowimagewidth / 2) : (f.options.navheight / 2 - f.options.navthumbnavigationarrowimageheight / 2);
                            if ((f.options.navposition == 'bottomleft') || (f.options.navposition == 'bottomright') || (f.options.navposition == 'bottom') || (f.options.navposition == 'right')) p += o;
                            if (f.options.navdirection == 'vertical') {
                                v.css({
                                    top: '0px',
                                    left: '0px',
                                    'margin-left': p + 'px'
                                });
                                w.css({
                                    bottom: '0px',
                                    left: '0px',
                                    'margin-left': p + 'px'
                                })
                            } else {
                                v.css({
                                    left: '0px',
                                    top: '0px',
                                    'margin-top': p + 'px'
                                });
                                w.css({
                                    right: '0px',
                                    top: '0px',
                                    'margin-top': p + 'px'
                                })
                            }
                            if (ASPlatforms.isIE678()) v.css({
                                opacity: 'inherit',
                                filter: 'inherit'
                            });
                            v.hover(function() {
                                if (!$(this).data('disabled')) $(this).css({
                                    'background-position': 'left center'
                                })
                            },
                            function() {
                                if (!$(this).data('disabled')) $(this).css({
                                    'background-position': 'left top'
                                })
                            });
                            v.click(function() {
                                if (f.options.navdirection == 'vertical') f.carMoveBottom();
                                else f.carMoveRight()
                            });
                            if (ASPlatforms.isIE678()) w.css({
                                opacity: 'inherit',
                                filter: 'inherit'
                            });
                            w.hover(function() {
                                if (!$(this).data('disabled')) $(this).css({
                                    'background-position': 'right center'
                                })
                            },
                            function() {
                                if (!$(this).data('disabled')) $(this).css({
                                    'background-position': 'right top'
                                })
                            });
                            w.click(function() {
                                if (f.options.navdirection == 'vertical') f.carMoveTop();
                                else f.carMoveLeft()
                            });
                            v.css({
                                display: 'block',
                                'background-position': 'left bottom',
                                cursor: ''
                            });
                            v.data('disabled', true);
                            w.css({
                                display: 'block'
                            })
                        }
                    }
                    if (f.options.navdirection == 'vertical') {
                        g.touchSwipe({
                            swipeTop: function(a) {
                                f.carMoveTop()
                            },
                            swipeBottom: function() {
                                f.carMoveBottom()
                            }
                        })
                    } else {
                        g.touchSwipe({
                            swipeLeft: function(a) {
                                f.carMoveLeft()
                            },
                            swipeRight: function() {
                                f.carMoveRight()
                            }
                        })
                    }
                    this.container.bind('html5zoo.switch',
                    function(a, b, c) {
                        $(".html5zoo-bullet-" + f.id + "-" + b, f.container)["bulletNormal" + f.id]();
                        $(".html5zoo-bullet-" + f.id + "-" + c, f.container)["bulletSelected" + f.id]()
                    });
                    if (this.options.navshowpreview) {
                        var x = $("<div class='html5zoo-nav-preview-" + this.id + "' style='display:none;position:absolute;width:" + this.options.navpreviewwidth + "px;height:" + this.options.navpreviewheight + "px;background-color:" + this.options.navpreviewbordercolor + ";padding:" + f.options.navpreviewborder + "px;'></div>");
                        var y = $("<div class='html5zoo-nav-preview-arrow-" + this.id + "' style='display:block;position:absolute;width:" + this.options.navpreviewarrowwidth + "px;height:" + this.options.navpreviewarrowheight + "px;background:url(\"" + this.options.skinsfolder + this.options.navpreviewarrowimage + "\") no-repeat center center;' ></div>");
                        switch (this.options.navpreviewposition) {
                        case 'bottom':
                            y.css({
                                left:
                                '50%',
                                bottom: '100%',
                                'margin-left': '-' + Math.round(this.options.navpreviewarrowwidth / 2) + 'px'
                            });
                            break;
                        case 'top':
                            y.css({
                                left:
                                '50%',
                                top: '100%',
                                'margin-left': '-' + Math.round(this.options.navpreviewarrowwidth / 2) + 'px'
                            });
                            break;
                        case 'left':
                            y.css({
                                top:
                                '50%',
                                left: '100%',
                                'margin-top': '-' + Math.round(this.options.navpreviewarrowheight / 2) + 'px'
                            });
                            break;
                        case 'right':
                            y.css({
                                top:
                                '50%',
                                right: '100%',
                                'margin-top': '-' + Math.round(this.options.navpreviewarrowheight / 2) + 'px'
                            });
                            break
                        }
                        var z = $("<div class='html5zoo-nav-preview-images-" + this.id + "' style='display:block;position:relative;width:100%;height:100%;overflow:hidden;' />");
                        x.append(y);
                        x.append(z);
                        if (this.options.navshowplayvideo) {
                            var A = $("<div class='html5zoo-nav-preview-play-" + this.id + "' style='display:none;position:absolute;left:0;top:0;width:100%;height:100%;background:url(\"" + this.options.skinsfolder + this.options.navplayvideoimage + "\") no-repeat center center;' ></div>");
                            x.append(A)
                        }
                        $(".html5zoo-wrapper-" + this.id, this.container).append(x)
                    }
                    if (this.options.navshowfeaturedarrow) {
                        j.append("<div class='html5zoo-nav-featuredarrow-" + this.id + "' style='display:none;position:absolute;width:" + this.options.navfeaturedarrowimagewidth + "px;height:" + this.options.navfeaturedarrowimageheight + "px;background:url(\"" + this.options.skinsfolder + this.options.navfeaturedarrowimage + "\") no-repeat center center;'></div>")
                    }
                }
                if (this.options.navshowbuttons) {
                    var B = (this.options.navdirection == 'vertical') ? 'top': 'left';
                    var C = (this.options.navstyle == 'none') ? 0 : this.options.navspacing;
                    if (this.options.navshowarrow) {
                        var D = $("<div class='html5zoo-nav-left-" + this.id + "' style='position:relative;float:" + B + ";margin-" + B + ":" + C + "px;width:" + this.options.navwidth + "px;height:" + this.options.navheight + "px;cursor:pointer;'></div>");
                        j.append(D);
                        if (this.options.navbuttonradius) D.css(ASPlatforms.applyBrowserStyles({
                            'border-radius': this.options.navbuttonradius + 'px'
                        }));
                        if (this.options.navbuttoncolor) D.css({
                            'background-color': this.options.navbuttoncolor
                        });
                        if (this.options.navarrowimage) D.css({
                            'background-image': "url('" + this.options.skinsfolder + this.options.navarrowimage + "')",
                            'background-repeat': 'no-repeat',
                            'background-position': 'left top'
                        });
                        D.hover(function() {
                            if (f.options.navbuttonhighlightcolor) $(this).css({
                                'background-color': f.options.navbuttonhighlightcolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'left bottom'
                            })
                        },
                        function() {
                            if (f.options.navbuttoncolor) $(this).css({
                                'background-color': f.options.navbuttoncolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'left top'
                            })
                        });
                        D.click(function() {
                            f.slideRun( - 2)
                        });
                        C = this.options.navspacing
                    }
                    if (this.options.navshowplaypause) {
                        var E, $navPause;
                        if (this.options.navshowplaypausestandalone) {
                            E = $("<div class='html5zoo-nav-play-" + this.id + "' style='position:absolute;width:" + this.options.navshowplaypausestandalonewidth + "px;height:" + this.options.navshowplaypausestandaloneheight + "px;'></div>");
                            this.$wrapper.append(E);
                            $navPause = $("<div class='html5zoo-nav-pause-" + this.id + "' style='position:absolute;width:" + this.options.navshowplaypausestandalonewidth + "px;height:" + this.options.navshowplaypausestandaloneheight + "px;'></div>");
                            this.$wrapper.append($navPause);
                            switch (this.options.navshowplaypausestandaloneposition) {
                            case 'topleft':
                                E.css({
                                    top:
                                    0,
                                    left: 0,
                                    'margin-left': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-top': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                $navPause.css({
                                    top: 0,
                                    left: 0,
                                    'margin-left': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-top': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                break;
                            case 'topright':
                                E.css({
                                    top:
                                    0,
                                    right: 0,
                                    'margin-right': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-top': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                $navPause.css({
                                    top: 0,
                                    right: 0,
                                    'margin-right': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-top': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                break;
                            case 'bottomleft':
                                E.css({
                                    bottom:
                                    0,
                                    left: 0,
                                    'margin-left': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-bottom': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                $navPause.css({
                                    bottom: 0,
                                    left: 0,
                                    'margin-left': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-bottom': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                break;
                            case 'bottomright':
                                E.css({
                                    bottom:
                                    0,
                                    right: 0,
                                    'margin-right': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-bottom': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                $navPause.css({
                                    bottom: 0,
                                    right: 0,
                                    'margin-right': this.options.navshowplaypausestandalonemarginx + 'px',
                                    'margin-bottom': this.options.navshowplaypausestandalonemarginy + 'px'
                                });
                                break;
                            case 'center':
                                E.css({
                                    top:
                                    '50%',
                                    left: '50%',
                                    'margin-left': '-' + Math.round(this.options.navshowplaypausestandalonewidth / 2) + 'px',
                                    'margin-top': '-' + Math.round(this.options.navshowplaypausestandaloneheight / 2) + 'px'
                                });
                                $navPause.css({
                                    top: '50%',
                                    left: '50%',
                                    'margin-left': '-' + Math.round(this.options.navshowplaypausestandalonewidth / 2) + 'px',
                                    'margin-top': '-' + Math.round(this.options.navshowplaypausestandaloneheight / 2) + 'px'
                                });
                                break
                            }
                        } else {
                            E = $("<div class='html5zoo-nav-play-" + this.id + "' style='position:relative;float:" + B + ";margin-" + B + ":" + C + "px;width:" + this.options.navwidth + "px;height:" + this.options.navheight + "px;cursor:pointer;'></div>");
                            j.append(E);
                            $navPause = $("<div class='html5zoo-nav-pause-" + this.id + "' style='position:relative;float:" + B + ";margin-" + B + ":" + C + "px;width:" + this.options.navwidth + "px;height:" + this.options.navheight + "px;cursor:pointer;'></div>");
                            j.append($navPause)
                        }
                        if (this.options.navbuttonradius) E.css(ASPlatforms.applyBrowserStyles({
                            'border-radius': this.options.navbuttonradius + 'px'
                        }));
                        if (this.options.navbuttoncolor) E.css({
                            'background-color': this.options.navbuttoncolor
                        });
                        if (this.options.navarrowimage) E.css({
                            'background-image': "url('" + this.options.skinsfolder + this.options.navplaypauseimage + "')",
                            'background-repeat': 'no-repeat',
                            'background-position': 'left top'
                        });
                        E.hover(function() {
                            if (f.options.navbuttonhighlightcolor) $(this).css({
                                'background-color': f.options.navbuttonhighlightcolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'left bottom'
                            })
                        },
                        function() {
                            if (f.options.navbuttoncolor) $(this).css({
                                'background-color': f.options.navbuttoncolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'left top'
                            })
                        });
                        E.click(function() {
                            f.isPaused = false;
                            f.loopCount = 0;
                            if (!f.tempPaused) f.sliderTimeout.start();
                            $(this).css({
                                display: 'none'
                            });
                            $(".html5zoo-nav-pause-" + f.id, f.container).css({
                                display: 'block'
                            })
                        });
                        if (this.options.navbuttonradius) $navPause.css(ASPlatforms.applyBrowserStyles({
                            'border-radius': this.options.navbuttonradius + 'px'
                        }));
                        if (this.options.navbuttoncolor) $navPause.css({
                            'background-color': this.options.navbuttoncolor
                        });
                        if (this.options.navarrowimage) $navPause.css({
                            'background-image': "url('" + this.options.skinsfolder + this.options.navplaypauseimage + "')",
                            'background-repeat': 'no-repeat',
                            'background-position': 'right top'
                        });
                        $navPause.hover(function() {
                            if (f.options.navbuttonhighlightcolor) $(this).css({
                                'background-color': f.options.navbuttonhighlightcolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'right bottom'
                            })
                        },
                        function() {
                            if (f.options.navbuttoncolor) $(this).css({
                                'background-color': f.options.navbuttoncolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'right top'
                            })
                        });
                        $navPause.click(function() {
                            f.isPaused = true;
                            f.sliderTimeout.stop();
                            $(this).css({
                                display: 'none'
                            });
                            $(".html5zoo-nav-play-" + f.id, f.container).css({
                                display: 'block'
                            })
                        });
                        if (this.options.navshowplaypausestandalone && this.options.navshowplaypausestandaloneautohide) {
                            E.css({
                                display: 'none'
                            });
                            $navPause.css({
                                display: 'none'
                            });
                            this.$wrapper.hover(function() {
                                if (f.isPaused) {
                                    E.fadeIn();
                                    $navPause.css({
                                        display: 'none'
                                    })
                                } else {
                                    E.css({
                                        display: 'none'
                                    });
                                    $navPause.fadeIn()
                                }
                            },
                            function() {
                                E.fadeOut();
                                $navPause.fadeOut()
                            })
                        } else {
                            E.css({
                                display: ((f.isPaused) ? 'block': 'none')
                            });
                            $navPause.css({
                                display: ((f.isPaused) ? 'none': 'block')
                            })
                        }
                    }
                    if (this.options.navshowarrow) {
                        var F = $("<div class='html5zoo-nav-right-" + this.id + "' style='position:relative;float:" + B + ";margin-" + B + ":" + C + "px;width:" + this.options.navwidth + "px;height:" + this.options.navheight + "px;cursor:pointer;'></div>");
                        j.append(F);
                        if (this.options.navbuttonradius) F.css(ASPlatforms.applyBrowserStyles({
                            'border-radius': this.options.navbuttonradius + 'px'
                        }));
                        if (this.options.navbuttoncolor) F.css({
                            'background-color': this.options.navbuttoncolor
                        });
                        if (this.options.navarrowimage) F.css({
                            'background-image': "url('" + this.options.skinsfolder + this.options.navarrowimage + "')",
                            'background-repeat': 'no-repeat',
                            'background-position': 'right top'
                        });
                        F.hover(function() {
                            if (f.options.navbuttonhighlightcolor) $(this).css({
                                'background-color': f.options.navbuttonhighlightcolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'right bottom'
                            })
                        },
                        function() {
                            if (f.options.navbuttoncolor) $(this).css({
                                'background-color': f.options.navbuttoncolor
                            });
                            if (f.options.navarrowimage) $(this).css({
                                'background-position': 'right top'
                            })
                        });
                        F.click(function() {
                            f.slideRun( - 1)
                        })
                    }
                }
            },
            createNavBullet: function(r) {
                var s = this;
                var f = (this.options.navdirection == 'vertical') ? 'top': 'left';
                var u = (this.options.navdirection == 'vertical') ? 'bottom': 'right';
                var v = (r == this.elemArray.length - 1) ? 0 : this.options.navspacing;
                var w = (this.options.navstyle == 'thumbnails') ? this.options.navwidth - this.options.navborder * 2 : this.options.navwidth;
                var h = (this.options.navstyle == 'thumbnails') ? this.options.navheight - this.options.navborder * 2 : this.options.navheight;
                var x = $("<div class='html5zoo-bullet-" + this.id + "-" + r + "' style='position:relative;float:" + f + ";margin-" + u + ":" + v + "px;width:" + w + "px;height:" + h + "px;cursor:pointer;'></div>");
                x.data('index', r);
                x.hover(function() {
                    if ($(this).data('index') != s.curElem) $(this)["bulletHighlight" + s.id]();
                    var d = $(this).data('index');
                    if (s.options.navswitchonmouseover) {
                        if (d != s.curElem) s.slideRun(d)
                    }
                    if (s.options.navshowpreview) {
                        var e = $(".html5zoo-nav-preview-" + s.id, s.container);
                        var f = $(".html5zoo-nav-preview-images-" + s.id, e);
                        if (s.options.navshowplayvideo) {
                            var g = $(".html5zoo-nav-preview-play-" + s.id, e);
                            if (s.elemArray[d][ELEM_VIDEO].length > 0) g.show();
                            else g.hide()
                        }
                        var h = $(".html5zoo-nav-" + s.id, s.container);
                        var i = $(".html5zoo-bullet-wrapper-" + s.id, s.container);
                        var j = $(this).position();
                        var k = h.position();
                        var m = i.position();
                        j.left += k.left + m.left;
                        j.left += (isNaN(parseInt(i.css('margin-left'))) ? 0 : parseInt(i.css('margin-left')));
                        j.left += (isNaN(parseInt(h.css('margin-left'))) ? 0 : parseInt(h.css('margin-left')));
                        j.top += k.top + m.top;
                        j.top += (isNaN(parseInt(i.css('margin-top'))) ? 0 : parseInt(i.css('margin-top')));
                        j.top += (isNaN(parseInt(h.css('margin-top'))) ? 0 : parseInt(h.css('margin-top')));
                        if (s.options.navdirection == 'vertical') {
                            var n = $(".html5zoo-nav-container-" + s.id, s.container);
                            j.top += (isNaN(parseInt(n.css('margin-top'))) ? 0 : parseInt(n.css('margin-top')))
                        }
                        var t, l = j.left + s.options.navwidth / 2 - s.options.navpreviewwidth / 2 - s.options.navpreviewborder;
                        var o, tv = j.top + s.options.navheight / 2 - s.options.navpreviewheight / 2 - s.options.navpreviewborder;
                        var p = {};
                        switch (s.options.navpreviewposition) {
                        case 'bottom':
                            t = j.top + s.options.navheight + s.options.navpreviewarrowheight;
                            p = {
                                left: l + 'px',
                                top: t + 'px'
                            };
                            break;
                        case 'top':
                            t = j.top - s.options.navpreviewheight - 2 * s.options.navpreviewborder - s.options.navpreviewarrowheight;
                            p = {
                                left: l + 'px',
                                top: t + 'px'
                            };
                            break;
                        case 'left':
                            o = j.left - s.options.navpreviewwidth - 2 * s.options.navpreviewborder - s.options.navpreviewarrowwidth;
                            p = {
                                left: o + 'px',
                                top: tv + 'px'
                            };
                            break;
                        case 'right':
                            o = j.left + s.options.navwidth + s.options.navpreviewarrowwidth;
                            p = {
                                left: o + 'px',
                                top: tv + 'px'
                            };
                            break
                        }
                        var q = new Image();
                        $(q).load(function() {
                            var a;
                            if (this.width / this.height <= s.options.navpreviewwidth / s.options.navpreviewheight) a = "width:" + s.options.navpreviewwidth + "px;height:auto;margin-top:-" + Math.floor((this.height / this.width) * s.options.navpreviewwidth / 2 - s.options.navpreviewheight / 2) + "px";
                            else a = "width:auto;height:" + s.options.navpreviewheight + "px;margin-left:-" + Math.floor((this.width / this.height) * s.options.navpreviewheight / 2 - s.options.navpreviewwidth / 2) + "px";
                            var b = $(".html5zoo-nav-preview-img-" + s.id, f);
                            if (s.options.navdirection == 'vertical') {
                                var c = $("<div class='html5zoo-nav-preview-img-" + s.id + "' style='display:block;position:absolute;overflow:hidden;width:" + s.options.navpreviewwidth + "px;height:" + s.options.navpreviewheight + "px;left:0px;top:" + s.options.navpreviewheight + "px;'><img src='" + s.elemArray[d][ELEM_THUMBNAIL] + "' style='display:block;position:absolute;left:0px;top:0px;" + a + "' /></div>");
                                f.append(c);
                                if (b.length > 0) {
                                    b.animate({
                                        top: '-' + s.options.navpreviewheight + 'px'
                                    },
                                    function() {
                                        b.remove()
                                    })
                                }
                                if (e.is(":visible")) {
                                    c.animate({
                                        top: '0px'
                                    });
                                    e.stop(true, true).animate(p)
                                } else {
                                    c.css({
                                        top: '0px'
                                    });
                                    e.stop(true, true).css(p).fadeIn()
                                }
                            } else {
                                var c = $("<div class='html5zoo-nav-preview-img-" + s.id + "' style='display:block;position:absolute;overflow:hidden;width:" + s.options.navpreviewwidth + "px;height:" + s.options.navpreviewheight + "px;left:" + s.options.navpreviewheight + "px;top:0px;'><img src='" + s.elemArray[d][ELEM_THUMBNAIL] + "' style='display:block;position:absolute;left:0px;top:0px;" + a + "' /></div>");
                                f.append(c);
                                if (b.length > 0) {
                                    b.animate({
                                        left: '-' + s.options.navpreviewwidth + 'px'
                                    },
                                    function() {
                                        b.remove()
                                    })
                                }
                                if (e.is(":visible")) {
                                    c.animate({
                                        left: '0px'
                                    });
                                    e.stop(true, true).animate(p)
                                } else {
                                    c.css({
                                        left: '0px'
                                    });
                                    e.stop(true, true).css(p).fadeIn()
                                }
                            }
                        });
                        q.src = s.elemArray[d][ELEM_THUMBNAIL]
                    }
                },
                function() {
                    if ($(this).data('index') != s.curElem) $(this)["bulletNormal" + s.id]();
                    if (s.options.navshowpreview) {
                        var a = $(".html5zoo-nav-preview-" + s.id, s.container);
                        a.delay(500).fadeOut()
                    }
                });
                x.click(function() {
                    s.slideRun($(this).data('index'))
                });
                if (this.options.navstyle == 'bullets') {
                    x.css({
                        background: "url('" + this.options.skinsfolder + this.options.navimage + "') no-repeat left top"
                    });
                    $.fn["bulletNormal" + this.id] = function() {
                        $(this).css({
                            'background-position': 'left top'
                        })
                    };
                    $.fn["bulletHighlight" + this.id] = $.fn["bulletSelected" + this.id] = function() {
                        $(this).css({
                            'background-position': 'left bottom'
                        })
                    }
                } else if (this.options.navstyle == 'numbering') {
                    x.text(r + 1);
                    x.css({
                        'background-color': this.options.navcolor,
                        color: this.options.navfontcolor,
                        'font-size': this.options.navfontsize,
                        'font-family': this.options.navfont,
                        'text-align': 'center',
                        'line-height': this.options.navheight + 'px'
                    });
                    x.css(ASPlatforms.applyBrowserStyles({
                        'border-radius': this.options.navradius + 'px'
                    }));
                    if (this.options.navbuttonshowbgimage && this.options.navbuttonbgimage) {
                        x.css({
                            background: "url('" + this.options.skinsfolder + this.options.navbuttonbgimage + "') no-repeat center top"
                        })
                    }
                    $.fn["bulletNormal" + this.id] = function() {
                        $(this).css({
                            'background-color': s.options.navcolor,
                            'color': s.options.navfontcolor
                        });
                        if (s.options.navbuttonshowbgimage && s.options.navbuttonbgimage) $(this).css({
                            'background-position': 'center top'
                        })
                    };
                    $.fn["bulletHighlight" + this.id] = $.fn["bulletSelected" + this.id] = function() {
                        $(this).css({
                            'background-color': s.options.navhighlightcolor,
                            'color': s.options.navfonthighlightcolor
                        });
                        if (s.options.navbuttonshowbgimage && s.options.navbuttonbgimage) $(this).css({
                            'background-position': 'center bottom'
                        })
                    }
                } else if (this.options.navstyle == 'thumbnails') {
                    x.css({
                        padding: this.options.navborder + 'px',
                        'background-color': this.options.navbordercolor
                    });
                    x.css({
                        opacity: this.options.navopacity,
                        filter: "alpha(opacity=" + Math.round(100 * this.options.navopacity) + ")"
                    });
                    var y = new Image();
                    var s = this;
                    $(y).load(function() {
                        var a;
                        if (this.width / this.height <= s.options.navimagewidth / s.options.navimageheight) a = "max-width:none !important;width:100%;height:auto;margin-top:-" + Math.floor((this.height / this.width) * s.options.navimagewidth / 2 - s.options.navimageheight / 2) + "px";
                        else a = "max-width:none !important;width:auto;height:100%;margin-left:-" + Math.floor((this.width / this.height) * s.options.navimageheight / 2 - s.options.navimagewidth / 2) + "px";
                        x.append("<div style='display:block;position:absolute;width:" + s.options.navimagewidth + "px;height:" + s.options.navimageheight + "px;overflow:hidden;'><img src='" + s.elemArray[r][ELEM_THUMBNAIL] + "' style='" + a + "' /></div>");
                        if ((s.options.navshowplayvideo) && (s.elemArray[r][ELEM_VIDEO].length > 0)) {
                            x.append("<div style='display:block;position:absolute;margin-left:0;margin-top:0;width:" + s.options.navimagewidth + "px;height:" + s.options.navimageheight + "px;background:url(\"" + s.options.skinsfolder + s.options.navplayvideoimage + "\") no-repeat center center;' ></div>")
                        }
                        if (s.options.navthumbstyle != 'imageonly') {
                            var b = "<div style='display:block;position:absolute;overflow:hidden;";
                            if (s.options.navthumbstyle == 'imageandtitle') b += "margin-left:0px;margin-top:" + s.options.navimageheight + "px;width:" + s.options.navimagewidth + "px;height:" + s.options.navthumbtitleheight + "px;";
                            else if (s.options.navthumbstyle == 'imageandtitledescription') b += "margin-left:" + s.options.navimagewidth + "px;margin-top:0px;width:" + s.options.navthumbtitlewidth + "px;height:" + s.options.navimageheight + "px;";
                            b += "'><div class='html5zoo-nav-thumbnail-tite-" + s.id + "'>" + s.elemArray[r][ELEM_TITLE] + "</div>";
                            if (s.options.navthumbstyle == 'imageandtitledescription') b += "<div class='html5zoo-nav-thumbnail-description-" + s.id + "'>" + s.elemArray[r][ELEM_DESCRIPTION] + "</div>";
                            b += "</div>";
                            x.append(b)
                        }
                    });
                    y.src = this.elemArray[r][ELEM_THUMBNAIL];
                    $.fn["bulletNormal" + this.id] = function() {
                        $(this).css({
                            opacity: s.options.navopacity,
                            filter: "alpha(opacity=" + Math.round(100 * s.options.navopacity) + ")"
                        })
                    };
                    $.fn["bulletHighlight" + this.id] = function() {
                        $(this).css({
                            opacity: 1,
                            filter: "alpha(opacity=100)"
                        })
                    };
                    $.fn["bulletSelected" + this.id] = function() {
                        $(this).css({
                            opacity: 1,
                            filter: "alpha(opacity=100)"
                        });
                        if (s.options.navshowfeaturedarrow) {
                            var a = $(".html5zoo-nav-featuredarrow-" + s.id, s.container);
                            var b = $(this).position();
                            var c = $(".html5zoo-nav-container-" + s.id, s.container);
                            var d = $(".html5zoo-bullet-wrapper-" + s.id, s.container);
                            if (s.options.navdirection == 'horizontal') {
                                var t, l = b.left + s.options.navwidth / 2 - s.options.navfeaturedarrowimagewidth / 2;
                                if ((s.options.navposition == 'top') || (s.options.navposition == 'topleft') || (s.options.navposition == 'topright')) t = b.top + s.options.navheight;
                                else t = b.top - s.options.navfeaturedarrowimageheight;
                                a.css({
                                    top: t + 'px'
                                });
                                if (a.is(":visible")) {
                                    a.stop(true, true).animate({
                                        left: l + 'px'
                                    })
                                } else {
                                    a.css({
                                        display: 'block',
                                        left: l + 'px'
                                    })
                                }
                                if ((c.width() < d.width()) && !s.pauseCarousel) {
                                    var m = Math.abs(isNaN(parseInt(d.css("margin-left"))) ? 0 : parseInt(d.css("margin-left")));
                                    if ((b.left < m) || ((b.left + s.options.navwidth) > m + c.width())) {
                                        var e = -b.left;
                                        if (e <= (c.width() - d.width())) e = (c.width() - d.width());
                                        if (e >= 0) e = 0;
                                        d.animate({
                                            "margin-left": e + 'px'
                                        },
                                        {
                                            queue: false,
                                            duration: 500,
                                            easing: "easeOutCirc"
                                        });
                                        s.updateCarouselLeftRightArrow(e)
                                    }
                                }
                            } else {
                                var l, t = b.top + s.options.navheight / 2 - s.options.navfeaturedarrowimageheight / 2;
                                if (s.options.navposition == 'left') l = b.left + s.options.navwidth;
                                else l = b.left - s.options.navfeaturedarrowimagewidth;
                                a.css({
                                    left: l + 'px'
                                });
                                if (a.is(":visible")) {
                                    a.stop(true, true).animate({
                                        top: t + 'px'
                                    })
                                } else {
                                    a.css({
                                        display: 'block',
                                        top: t + 'px'
                                    })
                                }
                                if ((c.height() < d.height()) && !s.pauseCarousel) {
                                    var m = Math.abs(isNaN(parseInt(d.css("margin-top"))) ? 0 : parseInt(d.css("margin-top")));
                                    if ((b.top < m) || ((b.top + s.options.navheight) > m + c.height())) {
                                        var e = -b.top;
                                        if (e <= (c.height() - d.height())) e = (c.height() - d.height());
                                        if (e >= 0) e = 0;
                                        d.animate({
                                            "margin-top": e + 'px'
                                        },
                                        {
                                            queue: false,
                                            duration: 500,
                                            easing: "easeOutCirc"
                                        });
                                        s.updateCarouselLeftRightArrow(e)
                                    }
                                }
                            }
                        }
                    }
                }
                return x
            },
            slideRun: function(a) {
                savedCur = this.curElem;
                this.calcIndex(a);
                if (savedCur == this.curElem) return;
                if (this.isAnimating) {
                    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
                    $(".html5zoo-img-box-" + this.id, this.container).unbind('transitionFinished').html("<div class='html5zoo-img-" + this.id + " ' style='display:block;position:absolute;left:0px;top:0px;width:100%;height:auto;'><img style='position:absolute;max-width:100%;height:auto;left:0%;top:0%;' src='" + this.elemArray[savedCur][ELEM_SRC] + "' /></div>");
                    this.isAnimating = false
                }
                this.sliderTimeout.stop();
                this.tempPaused = false;
                this.container.trigger('html5zoo.switch', [savedCur, this.curElem]);
                $(".html5zoo-video-wrapper-" + this.id, this.container).find("iframe").each(function() {
                    $(this).attr('src', '')
                });
                if (this.options.autoplayvideo && (this.elemArray[this.curElem][ELEM_VIDEO].length > 0)) {
                    this.playVideo(true)
                } else {
                    $(".html5zoo-video-wrapper-" + this.id, this.container).css({
                        display: 'none'
                    }).empty();
                    this.container.trigger('html5zoo.switchtext', [savedCur, this.curElem]);
                    var b = true;
                    if (a == -2) b = false;
                    else if (a == 1) b = true;
                    else if (a >= 0) b = (this.curElem > savedCur) ? true: false;
                    this.showImage(b)
                } (new Image()).src = this.elemArray[this.prevElem][ELEM_SRC]; (new Image()).src = this.elemArray[this.nextElem][ELEM_SRC];
                if (!this.options.randomplay && (this.options.loop > 0)) {
                    if (this.curElem == this.elemArray.length - 1) {
                        this.loopCount++;
                        if (this.options.loop <= this.loopCount) this.isPaused = true
                    }
                }
                if ((!this.isPaused) && (!this.tempPaused) && (this.elemArray.length > 1)) {
                    this.sliderTimeout.start()
                }
            },
            showImage: function(g) {
                var h = this;
                var i = new Image();
                $(i).load(function() {
                    var b = 100;
                    var c = $(".html5zoo-img-box-" + h.id, h.container);
                    var d = $(".html5zoo-img-" + h.id, h.container);
                    var e = $("<div class='html5zoo-img-" + h.id + " ' style='display:block;position:absolute;left:0px;top:0px;width:100%;height:auto;'><img style='position:absolute;" + (ASPlatforms.isIE678() ? "opacity:inherit;filter:inherit;": "") + "max-width:" + b + "%;height:auto;left:" + (100 - b) / 2 + "%;top:0%;' src='" + h.elemArray[h.curElem][ELEM_SRC] + "' /></div>");
                    if (d.length > 0) d.before(e);
                    else c.append(e);
                    var f = (h.firstslide && !h.options.transitiononfirstslide) ? '': h.options.transition;
                    h.firstslide = false;
                    h.isAnimating = true;
                    c.html5zooTransition(h.id, d, e, {
                        effect: f,
                        direction: g,
                        duration: h.options.transitionduration,
                        easing: h.options.transitioneasing,
                        crossfade: h.options.crossfade,
                        fade: h.options.fade,
                        slide: h.options.slide,
                        slice: h.options.slice,
                        blinds: h.options.blinds,
                        threed: h.options.threed,
                        threedhorizontal: h.options.threedhorizontal,
                        blocks: h.options.blocks,
                        shuffle: h.options.shuffle
                    },
                    function() {
                        h.isAnimating = false
                    },
                    function(a) {
                        h.transitionTimeout = a
                    });
                    if (h.elemArray[h.curElem][ELEM_LINK]) {
                        c.css({
                            cursor: 'pointer'
                        });
                        c.unbind('click').bind('click',
                        function() {
                            if (h.elemArray[h.curElem][ELEM_LIGHTBOX]) {
                                h.html5Lightbox.showItem(h.elemArray[h.curElem][ELEM_LINK])
                            } else {
                                var a = (h.elemArray[h.curElem][ELEM_TARGET]) ? h.elemArray[h.curElem][ELEM_TARGET] : '_self';
                                window.open(h.elemArray[h.curElem][ELEM_LINK], a)
                            }
                        })
                    } else {
                        c.css({
                            cursor: ''
                        });
                        c.unbind('click')
                    }
                    $(".html5zoo-play-" + h.id, h.container).css({
                        display: ((h.elemArray[h.curElem][ELEM_VIDEO].length > 0) ? 'block': 'none')
                    })
                });
                i.src = this.elemArray[this.curElem][ELEM_SRC]
            },
            calcIndex: function(a) {
                var r;
                if (a == -2) {
                    this.nextElem = this.curElem;
                    this.curElem = this.prevElem;
                    this.prevElem = ((this.curElem - 1) < 0) ? (this.elemArray.length - 1) : (this.curElem - 1);
                    if (this.options.randomplay) {
                        r = Math.floor(Math.random() * this.elemArray.length);
                        if (r != this.curElem) this.prevElem = r
                    }
                } else if (a == -1) {
                    this.prevElem = this.curElem;
                    this.curElem = this.nextElem;
                    this.nextElem = ((this.curElem + 1) >= this.elemArray.length) ? 0 : (this.curElem + 1);
                    if (this.options.randomplay) {
                        r = Math.floor(Math.random() * this.elemArray.length);
                        if (r != this.curElem) this.nextElem = r
                    }
                } else if (a >= 0) {
                    this.curElem = a;
                    this.prevElem = ((this.curElem - 1) < 0) ? (this.elemArray.length - 1) : (this.curElem - 1);
                    this.nextElem = ((this.curElem + 1) >= this.elemArray.length) ? 0 : (this.curElem + 1);
                    if (this.options.randomplay) {
                        r = Math.floor(Math.random() * this.elemArray.length);
                        if (r != this.curElem) this.prevElem = r;
                        r = Math.floor(Math.random() * this.elemArray.length);
                        if (r != this.curElem) this.nextElem = r
                    }
                }
            }
        };
        G = G || {};
        for (var K in G) {
            if (K.toLowerCase() !== K) {
                G[K.toLowerCase()] = G[K];
                delete G[K]
            }
        }
        this.each(function() {
            this.options = $.extend({},
            G);
            var c = this;
            $.each($(this).data(),
            function(a, b) {
                c.options[a.toLowerCase()] = b
            });
            var d = {};
            var e = window.location.search.substring(1).split("&");
            for (var i = 0; i < e.length; i++) {
                var f = e[i].split("=");
                if (f && (f.length == 2)) {
                    var g = f[0].toLowerCase();
                    var h = unescape(f[1]).toLowerCase();
                    if (h == "true") d[g] = true;
                    else if (h == "false") d[g] = false;
                    else d[g] = h
                }
            }
            this.options = $.extend(this.options, d);
            var j = {
                previewmode: false,
                isresponsive: true,
                autoplay: false,
                pauseonmouseover: true,
                slideinterval: 5000,
                randomplay: false,
                loop: 0,
                skinsfoldername: 'skins',
                showtimer: true,
                timerposition: 'bottom',
                timercolor: '#ffffff',
                timeropacity: 0.6,
                timerheight: 2,
                autoplayvideo: false,
                playvideoimage: 'play-video.png',
                playvideoimagewidth: 64,
                playvideoimageheight: 64,
                enabletouchswipe: true,
                border: 6,
                bordercolor: '#ffffff',
                borderradius: 0,
                showshadow: true,
                shadowsize: 5,
                shadowcolor: '#aaaaaa',
                showbottomshadow: false,
                bottomshadowimage: 'bottom-shadow.png',
                bottomshadowimagewidth: 140,
                bottomshadowimagetop: 90,
                showbackgroundimage: false,
                backgroundimage: 'background.png',
                backgroundimagewidth: 120,
                backgroundimagetop: -10,
                arrowstyle: 'mouseover',
                arrowimage: 'arrows.png',
                arrowwidth: 32,
                arrowheight: 32,
                arrowmargin: 0,
                arrowhideonmouseleave: 1000,
                arrowtop: 50,
                showribbon: false,
                ribbonimage: 'ribbon_topleft-0.png',
                ribbonposition: 'topleft',
                ribbonimagex: -11,
                ribbonimagey: -11,
                textstyle: 'static',
                textpositionstatic: 'bottom',
                textautohide: false,
                textpositionmarginstatic: 0,
                textpositiondynamic: 'topleft,topright,bottomleft,bottomright',
                textpositionmarginleft: 24,
                textpositionmarginright: 24,
                textpositionmargintop: 24,
                textpositionmarginbottom: 24,
                texteffect: 'slide',
                texteffecteasing: 'easeOutCubic',
                texteffectduration: 600,
                addfonts: true,
                fonts: "Inder",
                textcss: 'display:block; padding:12px; text-align:left;',
                textbgcss: 'display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#333333; opacity:0.6; filter:alpha(opacity=60);',
                titlecss: 'display:block; position:relative; font:bold 14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#fff;',
                descriptioncss: 'display:block; position:relative; font:12px Anaheim,Arial,Tahoma,Helvetica,sans-serif; color:#fff;',
                shownumbering: false,
                numberingformat: "%NUM/%TOTAL ",
                navstyle: 'thumbnails',
                navswitchonmouseover: false,
                navdirection: 'horizontal',
                navposition: 'bottom',
                navmargin: 24,
                navwidth: 64,
                navheight: 60,
                navspacing: 8,
                navshowpreview: true,
                navpreviewposition: 'top',
                navpreviewarrowimage: 'preview-arrow.png',
                navpreviewarrowwidth: 20,
                navpreviewarrowheight: 10,
                navpreviewwidth: 120,
                navpreviewheight: 60,
                navpreviewborder: 8,
                navpreviewbordercolor: '#ffff00',
                navimage: 'bullets.png',
                navradius: 0,
                navcolor: '',
                navhighlightcolor: '',
                navfont: 'Lucida Console, Arial',
                navfontcolor: '#666666',
                navfonthighlightcolor: '#666666',
                navfontsize: 12,
                navbuttonshowbgimage: true,
                navbuttonbgimage: 'navbuttonbgimage.png',
                navshowbuttons: false,
                navbuttonradius: 2,
                navbuttoncolor: '#999999',
                navbuttonhighlightcolor: '#333333',
                navshowplaypause: true,
                navshowarrow: true,
                navplaypauseimage: 'nav-play-pause.png',
                navarrowimage: 'nav-arrows.png',
                navshowplaypausestandalone: false,
                navshowplaypausestandaloneautohide: false,
                navshowplaypausestandaloneposition: 'bottomright',
                navshowplaypausestandalonemarginx: 24,
                navshowplaypausestandalonemarginy: 24,
                navshowplaypausestandalonewidth: 32,
                navshowplaypausestandaloneheight: 32,
                navopacity: 0.8,
                navborder: 2,
                navbordercolor: '#ff6600',
                navshowfeaturedarrow: true,
                navfeaturedarrowimage: 'featured-arrow.png',
                navfeaturedarrowimagewidth: 20,
                navfeaturedarrowimageheight: 10,
                navthumbstyle: 'imageonly',
                navthumbtitleheight: 20,
                navthumbtitlewidth: 120,
                navthumbtitlecss: 'display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;',
                navthumbtitlehovercss: 'text-decoration:underline;',
                navthumbdescriptioncss: 'display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;',
                navthumbnavigationstyle: 'arrow',
                navthumbnavigationarrowimage: 'carousel-arrows-32-32-0.png',
                navthumbnavigationarrowimagewidth: 32,
                navthumbnavigationarrowimageheight: 32,
                navshowplayvideo: true,
                navplayvideoimage: 'play-32-32-0.png',
                transitiononfirstslide: false,
                transition: 'slide',
                transitionduration: 1000,
                transitioneasing: 'easeOutQuad',
                fade: {
                    duration: 1000,
                    easing: 'easeOutQuad'
                },
                crossfade: {
                    duration: 1000,
                    easing: 'easeOutQuad'
                },
                slide: {
                    duration: 1000,
                    easing: 'easeOutElastic'
                },
                slice: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    effects: "up,down,updown",
                    slicecount: 8
                },
                blinds: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    slicecount: 4
                },
                threed: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    slicecount: 4,
                    fallback: 'slice',
                    bgcolor: '#222222',
                    perspective: 1000,
                    perspectiveorigin: 'right',
                    scatter: 5
                },
                threedhorizontal: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    slicecount: 3,
                    fallback: 'slice',
                    bgcolor: '#222222',
                    perspective: 1000,
                    perspectiveorigin: 'bottom',
                    scatter: 5
                },
                blocks: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    effects: 'topleft, bottomright, top, bottom, random',
                    rowcount: 4,
                    columncount: 3
                },
                shuffle: {
                    duration: 1500,
                    easing: 'easeOutQuad',
                    rowcount: 4,
                    columncount: 3
                },
                versionmark: 'AMFree',
                showwatermarkdefault: true,
                watermarkstyledefault: 'text',
                watermarktextdefault: '',
                watermarkimagedefault: '',
                watermarklinkdefault: 'http://childcloud.cn',
                watermarktargetdefault: '_blank',
                watermarkpositioncssdefault: 'display:block;position:absolute;bottom:6px;right:6px;',
                watermarktextcssdefault: 'font:12px Arial,Tahoma,Helvetica,sans-serif;color:#666;padding:2px 4px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;background-color:#fff;opacity:0.9;filter:alpha(opacity=90);',
                watermarklinkcssdefault: 'text-decoration:none;font:12px Arial,Tahoma,Helvetica,sans-serif;color:#333;'
            };
            this.options = $.extend(j, this.options);
            if (this.options.versionmark != ('AMCom')) {
                this.options.showwatermark = (window.location.href.indexOf('://amazingslider.com') >= 0) ? false: this.options.showwatermarkdefault;
                this.options.watermarkstyle = this.options.watermarkstyledefault;
                this.options.watermarktext = this.options.watermarktextdefault;
                this.options.watermarkimage = this.options.watermarkimagedefault;
                this.options.watermarklink = this.options.watermarklinkdefault;
                this.options.watermarktarget = this.options.watermarktargetdefault;
                this.options.watermarkpositioncss = this.options.watermarkpositioncssdefault;
                this.options.watermarktextcss = this.options.watermarktextcssdefault;
                this.options.watermarklinkcss = this.options.watermarklinkcssdefault
            }
            if (typeof html5zoo_previewmode != 'undefined') this.options.previewmode = html5zoo_previewmode;
            this.options.htmlfolder = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
            if (this.options.skinsfoldername.length > 0) this.options.skinsfolder = this.options.jsfolder + this.options.skinsfoldername + '/';
            else this.options.skinsfolder = this.options.jsfolder;
            new J($(this), this.options, html5zooId++)
        })
    }
})(jQuery); (function($) {
    $.fn.html5zooTransition = function(a, b, c, d, e, f) {
        var g = this;
        var h = d.effect;
        var i = d.duration;
        var j = d.easing;
        var k = d.direction;
        var l = null;
        if (h) {
            h = h.split(",");
            l = h[Math.floor(Math.random() * h.length)];
            l = $.trim(l.toLowerCase())
        }
        if (((l == 'threed') || (l == 'threedhorizontal')) && (!ASPlatforms.css33dTransformSupported())) {
            l = d[l].fallback
        }
        if (l && d[l]) {
            if (d[l].duration) i = d[l].duration;
            if (d[l].easing) j = d[l].easing
        }
        if (l == "fade") {
            g.css({
                overflow: 'hidden'
            });
            c.show();
            b.fadeOut(i, j,
            function() {
                b.remove();
                e()
            })
        } else if (l == "crossfade") {
            g.css({
                overflow: 'hidden'
            });
            c.hide();
            b.fadeOut(i / 2, j,
            function() {
                c.fadeIn(i / 2, j,
                function() {
                    b.remove();
                    e()
                })
            })
        } else if (l == 'slide') {
            g.css({
                overflow: 'hidden'
            });
            if (k) {
                c.css({
                    left: '100%'
                });
                c.animate({
                    left: '0%'
                },
                i, j);
                b.animate({
                    left: '-100%'
                },
                i, j,
                function() {
                    b.remove();
                    e()
                })
            } else {
                c.css({
                    left: '-100%'
                });
                c.animate({
                    left: '0%'
                },
                i, j);
                b.animate({
                    left: '100%'
                },
                i, j,
                function() {
                    b.remove();
                    e()
                })
            }
        } else if (l == 'slice') {
            g.css({
                overflow: 'hidden'
            });
            g.sliceTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['slice']), e, f)
        } else if (l == 'blinds') {
            g.css({
                overflow: 'hidden'
            });
            g.blindsTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['blinds']), e, f)
        } else if (l == 'threed') {
            g.css({
                overflow: 'visible'
            });
            g.threedTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['threed']), e, f)
        } else if (l == 'threedhorizontal') {
            g.css({
                overflow: 'visible'
            });
            g.threedHorizontalTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['threedhorizontal']), e, f)
        } else if (l == 'blocks') {
            g.css({
                overflow: 'hidden'
            });
            g.blocksTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['blocks']), e, f)
        } else if (l == 'shuffle') {
            g.css({
                overflow: 'visible'
            });
            g.shuffleTransition(a, b, c, $.extend({
                duration: i,
                easing: j,
                direction: k
            },
            d['shuffle']), e, f)
        } else {
            c.show();
            b.remove();
            e()
        }
    };
    $.fn.sliceTransition = function(b, c, d, e, f, g) {
        var i, index;
        var h = this;
        var w = h.width();
        var j = Math.ceil(w / e.slicecount);
        d.hide();
        for (i = 0; i < e.slicecount; i++) {
            var k = $("<div class='html5zoo-img-slice-" + b + " ' style='display:block;position:absolute;left:" + i * j + "px;top:0%;width:" + j + "px;height:100%;overflow:hidden;'></div>");
            var l = $('img', d).clone().css({
                'max-width': '',
                left: '-' + j * i + 'px'
            });
            l.attr('style', l.attr('style') + '; max-width:' + w + 'px !important;');
            k.append(l);
            h.append(k)
        }
        var m = $('.html5zoo-img-slice-' + b, h);
        if (!e.direction) m = $($.makeArray(m).reverse());
        var n = e.effects.split(",");
        var o = n[Math.floor(Math.random() * n.length)];
        o = $.trim(o.toLowerCase());
        h.unbind('transitionFinished').bind('transitionFinished',
        function() {
            h.unbind('transitionFinished');
            c.remove();
            d.show();
            m.remove();
            f()
        });
        var p = e.duration / 2;
        var q = e.duration / 2 / e.slicecount;
        index = 0;
        m.each(function() {
            var a = $(this);
            switch (o) {
            case 'up':
                a.css({
                    top:
                    '',
                    bottom: '0%',
                    height: '0%'
                });
                break;
            case 'down':
                a.css({
                    top:
                    '0%',
                    height: '0%'
                });
                break;
            case 'updown':
                if (index % 2 == 0) a.css({
                    top: '0%',
                    height: '0%'
                });
                else a.css({
                    top: '',
                    bottom: '0%',
                    height: '0%'
                });
                break
            }
            setTimeout(function() {
                a.animate({
                    height: '100%'
                },
                p, e.easing)
            },
            q * index);
            index++
        });
        var r = setTimeout(function() {
            h.trigger('transitionFinished')
        },
        e.duration);
        g(r)
    };
    $.fn.blindsTransition = function(c, d, e, f, g, h) {
        var i, index;
        var j = this;
        var w = j.width();
        var k = Math.ceil(w / f.slicecount);
        e.hide();
        for (i = 0; i < f.slicecount; i++) {
            var l = $("<div class='html5zoo-img-slice-wrapper-" + c + " ' style='display:block;position:absolute;left:" + i * k + "px;top:0%;width:" + k + "px;height:100%;overflow:hidden;'></div>");
            var m = $("<div class='html5zoo-img-slice-" + c + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>");
            var n = $('img', e).clone().css({
                'max-width': '',
                left: '-' + k * i + 'px'
            });
            n.attr('style', n.attr('style') + '; max-width:' + w + 'px !important;');
            m.append(n);
            l.append(m);
            j.append(l)
        }
        var o = $('.html5zoo-img-slice-' + c, j);
        if (!f.direction) o = $($.makeArray(o).reverse());
        j.unbind('transitionFinished').bind('transitionFinished',
        function() {
            j.unbind('transitionFinished');
            d.remove();
            e.show();
            $('.html5zoo-img-slice-wrapper-' + c, j).remove();
            g()
        });
        index = 0;
        o.each(function() {
            var a = $(this);
            var b;
            if (!f.direction) {
                a.css({
                    left: '',
                    right: '-100%'
                });
                b = {
                    right: '0%'
                }
            } else {
                a.css({
                    left: '-100%'
                });
                b = {
                    left: '0%'
                }
            }
            a.animate(b, f.duration * (index + 1) / f.slicecount, f.easing);
            index++
        });
        var p = setTimeout(function() {
            j.trigger('transitionFinished')
        },
        f.duration);
        h(p)
    };
    $.fn.threedTransition = function(d, e, f, g, j, k) {
        var i, index;
        var l = this;
        var w = l.width(),
        h = l.height(),
        dist = h / 2;
        var m = Math.ceil(w / g.slicecount);
        var n = $("<div class='html5zoo-img-cube-wrapper-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;'></div>");
        l.append(n);
        n.css(ASPlatforms.applyBrowserStyles({
            'transform-style': 'preserve-3d',
            'perspective': g.perspective,
            'perspective-origin': g.perspectiveorigin + ' center'
        }));
        f.hide();
        for (i = 0; i < g.slicecount; i++) {
            var o = $('img', f).clone().css({
                'max-width': '',
                left: '-' + m * i + 'px'
            });
            o.attr('style', o.attr('style') + '; max-width:' + w + 'px !important;');
            var p = $("<div class='html5zoo-img-slice-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            p.append(o);
            var q = $('img', e).clone().css({
                'max-width': '',
                left: '-' + m * i + 'px'
            });
            q.attr('style', q.attr('style') + '; max-width:' + w + 'px !important;');
            var r = $("<div class='html5zoo-img-slice-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            r.append(q);
            var s = $("<div class='html5zoo-img-slice-left-" + d + " ' style='display:block;position:absolute;left:2px;top:2px;width:" + (h - 1) + "px;height:" + (h - 1) + "px;overflow:hidden;outline:2px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            var t = $("<div class='html5zoo-img-slice-right-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:" + (h - 1) + "px;height:" + (h - 1) + "px;overflow:hidden;outline:2px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            var u = $("<div class='html5zoo-img-cube-" + d + " ' style='display:block;position:absolute;left:" + i * m + "px;top:0%;width:" + m + "px;height:100%;'></div>");
            u.append(s);
            u.append(t);
            u.append(p);
            u.append(r);
            n.append(u);
            s.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateY(-90deg) translateZ(' + dist + 'px)'
            }));
            t.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateY(90deg) translateZ(' + (m - dist) + 'px)'
            }));
            r.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'translateZ(' + dist + 'px)'
            }));
            p.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateX(' + ((g.direction) ? '90': '-90') + 'deg) translateZ(' + dist + 'px)'
            }))
        }
        var v = $('.html5zoo-img-cube-' + d, l);
        l.unbind('transitionFinished').bind('transitionFinished',
        function() {
            l.unbind('transitionFinished');
            e.remove();
            f.show();
            setTimeout(function() {
                n.remove()
            },
            100);
            j()
        });
        var x = g.duration / 2 / g.slicecount;
        var y = g.duration / 2;
        v.each(function() {
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden'
            }));
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transition-property': 'transform'
            },
            true));
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transform': 'translateZ(-' + dist + 'px)'
            }))
        });
        e.hide();
        index = 0;
        v.each(function() {
            var a = $(this);
            var b = (g.slicecount - 1) / 2;
            var c = Math.round((index - b) * g.scatter * w / 100);
            setTimeout(function() {
                a.css(ASPlatforms.applyBrowserStyles({
                    'transform-style': 'preserve-3d',
                    'backface-visibility': 'hidden'
                }));
                a.css(ASPlatforms.applyBrowserStyles({
                    'transition-property': 'transform'
                },
                true));
                a.css(ASPlatforms.applyBrowserStyles({
                    'transition-duration': y + 'ms',
                    'transform': 'translateZ(-' + dist + 'px) rotateX(' + ((g.direction) ? '-89.99': '89.99') + 'deg)'
                }));
                a.animate({
                    left: '+=' + c + 'px'
                },
                y / 2 - 50,
                function() {
                    a.animate({
                        left: '-=' + c + 'px'
                    },
                    y / 2 - 50)
                })
            },
            x * index + 100);
            index++
        });
        var z = setTimeout(function() {
            l.trigger('transitionFinished')
        },
        g.duration);
        k(z)
    };
    $.fn.threedHorizontalTransition = function(d, e, f, g, j, k) {
        var i, index;
        var l = this;
        var w = l.width(),
        h = l.height(),
        dist = w / 2;
        var m = Math.ceil(h / g.slicecount);
        var n = $("<div class='html5zoo-img-cube-wrapper-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;'></div>");
        l.append(n);
        n.css(ASPlatforms.applyBrowserStyles({
            'transform-style': 'preserve-3d',
            'perspective': g.perspective,
            'perspective-origin': 'center ' + g.perspectiveorigin
        }));
        f.hide();
        for (i = 0; i < g.slicecount; i++) {
            var o = $('img', f).clone().css({
                'max-height': '',
                top: '-' + m * i + 'px'
            });
            o.attr('style', o.attr('style') + '; max-height:' + h + 'px !important;');
            var p = $("<div class='html5zoo-img-slice-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            p.append(o);
            var q = $('img', e).clone().css({
                'max-height': '',
                top: '-' + m * i + 'px'
            });
            q.attr('style', q.attr('style') + '; max-height:' + h + 'px !important;');
            var r = $("<div class='html5zoo-img-slice-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            r.append(q);
            var s = $("<div class='html5zoo-img-slice-left-" + d + " ' style='display:block;position:absolute;left:2px;top:2px;width:" + (w - 1) + "px;height:" + (w - 1) + "px;overflow:hidden;outline:2px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            var t = $("<div class='html5zoo-img-slice-right-" + d + " ' style='display:block;position:absolute;left:0%;top:0%;width:" + (w - 1) + "px;height:" + (w - 1) + "px;overflow:hidden;outline:2px solid transparent;background-color:" + g.bgcolor + ";'></div>");
            var u = $("<div class='html5zoo-img-cube-" + d + " ' style='display:block;position:absolute;left:0%;top:" + i * m + "px;width:100%;height:" + m + "px;'></div>");
            u.append(s);
            u.append(t);
            u.append(p);
            u.append(r);
            n.append(u);
            s.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateX(90deg) translateZ(' + dist + 'px)'
            }));
            t.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateX(-90deg) translateZ(' + (m - dist) + 'px)'
            }));
            r.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'translateZ(' + dist + 'px)'
            }));
            p.css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'transform': 'rotateY(' + ((g.direction) ? '-90': '90') + 'deg) translateZ(' + dist + 'px)'
            }))
        }
        var v = $('.html5zoo-img-cube-' + d, l);
        l.unbind('transitionFinished').bind('transitionFinished',
        function() {
            l.unbind('transitionFinished');
            e.remove();
            f.show();
            setTimeout(function() {
                n.remove()
            },
            100);
            j()
        });
        var x = g.duration / 2 / g.slicecount;
        var y = g.duration / 2;
        v.each(function() {
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden'
            }));
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transition-property': 'transform'
            },
            true));
            $(this).css(ASPlatforms.applyBrowserStyles({
                'transform': 'translateZ(-' + dist + 'px)'
            }))
        });
        e.hide();
        index = 0;
        v.each(function() {
            var a = $(this);
            var b = (g.slicecount - 1) / 2;
            var c = Math.round((index - b) * g.scatter * h / 100);
            setTimeout(function() {
                a.css(ASPlatforms.applyBrowserStyles({
                    'transform-style': 'preserve-3d',
                    'backface-visibility': 'hidden'
                }));
                a.css(ASPlatforms.applyBrowserStyles({
                    'transition-property': 'transform'
                },
                true));
                a.css(ASPlatforms.applyBrowserStyles({
                    'transition-duration': y + 'ms',
                    'transform': 'translateZ(-' + dist + 'px) rotateY(' + ((g.direction) ? '89.99': '-89.99') + 'deg)'
                }));
                a.animate({
                    top: '+=' + c + 'px'
                },
                y / 2 - 50,
                function() {
                    a.animate({
                        top: '-=' + c + 'px'
                    },
                    y / 2 - 50)
                })
            },
            x * index + 100);
            index++
        });
        var z = setTimeout(function() {
            l.trigger('transitionFinished')
        },
        g.duration);
        k(z)
    };
    $.fn.blocksTransition = function(c, d, e, f, g, k) {
        var i, j, index;
        var l = this;
        var w = l.width(),
        h = l.height();
        var m = Math.ceil(w / f.columncount);
        var n = Math.ceil(h / f.rowcount);
        var o = f.effects.split(",");
        var p = o[Math.floor(Math.random() * o.length)];
        p = $.trim(p.toLowerCase());
        e.hide();
        for (i = 0; i < f.rowcount; i++) {
            for (j = 0; j < f.columncount; j++) {
                var q = $("<div class='html5zoo-img-block-wrapper-" + c + " ' style='display:block;position:absolute;left:" + j * m + "px;top:" + i * n + "px;width:" + m + "px;height:" + n + "px;overflow:hidden;'></div>");
                var r = $("<div class='html5zoo-img-block-" + c + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>");
                var s = $('img', e).clone().css({
                    'max-width': '',
                    'max-height': '',
                    left: '-' + m * j + 'px',
                    top: '-' + n * i + 'px'
                });
                s.attr('style', s.attr('style') + '; max-width:' + w + 'px !important;max-height:' + h + 'px !important;');
                r.append(s);
                q.append(r);
                l.append(q)
            }
        }
        var t = $('.html5zoo-img-block-' + c, l);
        l.unbind('transitionFinished').bind('transitionFinished',
        function() {
            l.unbind('transitionFinished');
            d.remove();
            e.show();
            $('.html5zoo-img-block-wrapper-' + c, l).remove();
            g()
        });
        if ((p == 'bottomright') || (p == 'bottom')) t = $($.makeArray(t).reverse());
        else if (p == 'random') t = $($.makeArray(t).sort(function() {
            return 0.5 - Math.random()
        }));
        index = 0;
        t.each(function() {
            var a = $(this);
            var b, col;
            b = Math.floor(index / f.columncount);
            col = index % f.columncount;
            a.hide();
            switch (p) {
            case 'topleft':
            case 'bottomright':
                a.delay(f.duration * (b + col) / (f.rowcount + f.columncount)).fadeIn();
                break;
            case 'top':
            case 'bottom':
            case 'random':
                a.delay(f.duration * index / (f.rowcount * f.columncount)).fadeIn();
                break
            }
            index++
        });
        var u = setTimeout(function() {
            l.trigger('transitionFinished')
        },
        f.duration);
        k(u)
    };
    $.fn.shuffleTransition = function(f, g, k, l, m, n) {
        var i, j, index;
        var o = this;
        var w = o.width(),
        h = o.height();
        var p = Math.ceil(w / l.columncount);
        var q = Math.ceil(h / l.rowcount);
        for (i = 0; i < l.rowcount; i++) {
            for (j = 0; j < l.columncount; j++) {
                var r = $("<div class='html5zoo-img-block-wrapper-next-" + f + " ' style='display:block;position:absolute;left:" + j * p + "px;top:" + i * q + "px;width:" + p + "px;height:" + q + "px;overflow:hidden;'></div>");
                var s = $("<div class='html5zoo-img-block-next-" + f + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>");
                var t = $('img', k).clone().css({
                    'max-width': '',
                    'max-height': '',
                    left: '-' + p * j + 'px',
                    top: '-' + q * i + 'px'
                });
                t.attr('style', t.attr('style') + '; max-width:' + w + 'px !important;max-height:' + h + 'px !important;');
                s.append(t);
                r.append(s);
                o.append(r);
                var u = $("<div class='html5zoo-img-block-wrapper-prev-" + f + " ' style='display:block;position:absolute;left:" + j * p + "px;top:" + i * q + "px;width:" + p + "px;height:" + q + "px;overflow:hidden;'></div>");
                var v = $("<div class='html5zoo-img-block-prev-" + f + " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>");
                var x = $('img', g).clone().css({
                    'max-width': '',
                    'max-height': '',
                    left: '-' + p * j + 'px',
                    top: '-' + q * i + 'px'
                });
                x.attr('style', x.attr('style') + '; max-width:' + w + 'px !important;max-height:' + h + 'px !important;');
                v.append(x);
                u.append(v);
                o.append(u)
            }
        }
        k.hide();
        g.hide();
        var y = $('.html5zoo-img-block-wrapper-next-' + f, o);
        var z = $('.html5zoo-img-block-wrapper-prev-' + f, o);
        o.unbind('transitionFinished').bind('transitionFinished',
        function() {
            o.unbind('transitionFinished');
            g.remove();
            k.show();
            $('.html5zoo-img-block-wrapper-next-' + f, o).remove();
            $('.html5zoo-img-block-wrapper-prev-' + f, o).remove();
            m()
        });
        var A = o.offset();
        var B = -A.left;
        var C = $(window).width() - A.left - o.width() / l.columncount;
        var D = -A.top * 100 / o.height();
        var E = $(window).height() - A.top - o.height() / l.rowcount;
        index = 0;
        z.each(function() {
            var a = $(this);
            var b = Math.random() * (C - B) + B;
            var c = Math.random() * (E - D) + D;
            a.animate({
                left: b + 'px',
                top: c + 'px',
                opacity: 0
            },
            l.duration, l.easing);
            index++
        });
        index = 0;
        y.each(function() {
            var a = $(this);
            var b = Math.floor(index / l.columncount);
            var c = index % l.columncount;
            var d = Math.random() * (C - B) + B;
            var e = Math.random() * (E - D) + D;
            a.css({
                left: d + 'px',
                top: e + 'px',
                opacity: 0
            },
            l.duration, l.easing);
            a.animate({
                left: c * p + 'px',
                top: b * q + 'px',
                opacity: 1
            },
            l.duration, l.easing);
            index++
        });
        var F = setTimeout(function() {
            o.trigger('transitionFinished')
        },
        l.duration);
        n(F)
    }
})(jQuery); (function($) {
    $.fn.touchSwipe = function(d) {
        var f = {
            swipeLeft: null,
            swipeRight: null,
            swipeTop: null,
            swipeBottom: null
        };
        if (d) $.extend(f, d);
        return this.each(function() {
            var b = -1,
            startY = -1;
            var c = -1,
            curY = -1;
            function touchStart(a) {
                var e = a.originalEvent;
                if (e.targetTouches.length >= 1) {
                    b = e.targetTouches[0].pageX;
                    startY = e.targetTouches[0].pageY
                } else {
                    touchCancel(a)
                }
            };
            function touchMove(a) {
                var e = a.originalEvent;
                if (e.targetTouches.length >= 1) {
                    c = e.targetTouches[0].pageX;
                    curY = e.targetTouches[0].pageY
                } else {
                    touchCancel(a)
                }
            };
            function touchEnd(a) {
                if ((c > 0) || (curY > 0)) {
                    triggerHandler();
                    touchCancel(a)
                } else {
                    touchCancel(a)
                }
            };
            function touchCancel(a) {
                b = -1;
                startY = -1;
                c = -1;
                curY = -1
            };
            function triggerHandler() {
                if (c > b) {
                    if (f.swipeRight) f.swipeRight.call()
                } else {
                    if (f.swipeLeft) f.swipeLeft.call()
                }
                if (curY > startY) {
                    if (f.swipeBottom) f.swipeBottom.call()
                } else {
                    if (f.swipeTop) f.swipeTop.call()
                }
            };
            try {
                $(this).bind('touchstart', touchStart);
                $(this).bind('touchmove', touchMove);
                $(this).bind('touchend', touchEnd);
                $(this).bind('touchcancel', touchCancel)
            } catch(e) {}
        })
    }
})(jQuery);
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return - c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return - c / 2 * ((--t) * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return - c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return - c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x, t, b, c, d) {
        return - c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
    }
});
if (typeof ASyoukuIframeAPIReady === 'undefined') {
    var ASyoukuIframeAPIReady = false;
    var ASyoukuTimeout = 0;
    function onyoukuIframeAPIReady() {
        ASyoukuIframeAPIReady = true
    }
}
if (typeof html5zooId === 'undefined') {
    var html5zooId = 0
}