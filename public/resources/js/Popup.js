/**
 * Created with IntelliJ IDEA.
 * User: Himanshu Jain
 * Date: 2/12/15
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */

var PopUpUtil = function () {
    var _self = this;
    _self.root = null;
    _self.rootClass = 'popup-root';
    _self.shadowClass = 'popup-shadow';
    _self.contentClass = 'popup-content';
    _self.actionClass = 'popup-action';
    _self.closeClass = "popup-close";
    _self.removeClass = "popup-remove";
    _self.events = {
        REMOVE: 'removePop',
        HIDE: 'hidePop'
    }
    /*
     * create popup for elements existing in DOM
     */
    _self.setRootRef = function (root) {
        _self.root = root;
    }

    _self.getRootRef = function () {
        return _self.root;
    }

    _self.getContentRef = function () {
        var x = _self.root.find('.' + _self.contentClass);
        return x
    }

    /**
     *@param dimension: css rules, must be in valid json form
     */
    _self.setContentBoxProperties = function (dimension) {
        if (!(typeof dimension == 'undefined' || dimension == null)) {
            _self.getContentRef().css(dimension);
        }
    }

    /*
     * Create popup out of thin air
     */
    _self.createPopUp = function (settings, targetEle) {
        if (typeof targetEle == 'undefined' || targetEle == null || targetEle == '') {
            targetEle = 'body';
        }
        var ele = $("<div></div>").prependTo(targetEle);
        ele.addClass(_self.rootClass);
        var shdw = $('<div></div>').addClass(_self.shadowClass);
        if (typeof settings == "object" && typeof settings.shadow !== "undefined" && settings.shadow === false) {

        } else {
            ele.append(shdw);
        }
        var cntnt = $('<div></div>').addClass(_self.contentClass);
        ele.append(cntnt);
        _self.root = ele;
        _self.init(settings);
        return _self.root;
    }

    //use this when elements are available in dom, internally called by createPopUP method
    _self.init = function (settings) {
        var closeType, title, boxSize, theme , haveTitle;
        if ((typeof settings) == 'object') {
            closeType = settings.closeType;
            title = settings.title;
            boxSize = settings.boxSize;
            theme = (typeof settings.theme == 'string') ? settings.theme : '';
            haveTitle = settings.haveTitle || true;
        }
        try {
            if (_self.root == null) {
                throw("Exception : Initialzed plugin without setting root element");
            }

            _self.setTheme(theme);

            //search for CONTENT section in content layout
            var cntnt = _self.root.find('.' + _self.contentClass + ">[data-role=content]");
            if (cntnt.length == 0) {
                _self.addContentElement(_self.getContentRef());
            }

            //search for TITLE section in content layout
            var ttl = _self.root.find('.' + _self.contentClass + ">[data-role=title]");
            if (ttl.length == 0 && haveTitle != 'false') {
                _self.addTitle(_self.getContentRef(), title, closeType);
            }

            //search for Action section in content layout
            var ttl = _self.root.find('.' + _self.contentClass + ">[data-role=action]");
            if (ttl.length == 0) {
                _self.addActionContainer();
            }

            _self.shadowBindClick(closeType);

            //set dimension of content layout
            _self.setContentBoxProperties(boxSize);
            _self.root.bind(_self.events.HIDE, _self.close);
            _self.root.bind(_self.events.REMOVE, _self.remove);
            _self.root.on('click', '.' + _self.closeClass, _self.close);
            _self.root.on('click', '.' + _self.removeClass, _self.remove);

        } catch (e) {
            /*console.log(e);*/
        }
    }

    //Hide pop up when user clicks on shadow area
    _self.shadowBindClick = function (closeType) {
        if (closeType == 'remove') {
            _self.root.find('.' + _self.shadowClass).click(_self.remove);
        } else {
            _self.root.find('.' + _self.shadowClass).click(_self.close);
        }
    }

    //set theme for popup
    _self.setTheme = function (theme) {
        _self.getContentRef().addClass(theme);
    }

    _self.shadowUnbindClick = function () {
        _self.root.find('.' + _self.shadowClass).unbind('click');
    }

    //Create TITLE element in content layout
    _self.addTitle = function (ele, title, iconType) {
        if (String(typeof title) == 'undefined') {
            title = "";
        }
        var ttl = $('<div data-role=title></div>');
        ttl.html("<span class='title-string'>" + title + "</span>");
        if (iconType == 'remove') {
            ttl.append(_self.addRemoveIcon());
        } else {
            ttl.append(_self.addCloseIcon());
        }
        ele.prepend(ttl);
    }

    //Create CONTENT element in content layout
    _self.addContentElement = function (ele) {
        var cntnt = $('<div data-role=content></div>');
        cntnt.html(ele.html());
        //cntnt.append()(_self.root.find('.'+_self.contentClass).html());
        ele.html(cntnt);
    }

    //Create ACTIONS or button container in content layout
    _self.addActionContainer = function () {
        var cntnt = $('<div data-role=action></div>');
        //cntnt.append()(_self.root.find('.'+_self.contentClass).html());
        _self.getContentRef().append(cntnt);
    }

    _self.addActionButton = function (btn) {
        _self.getContentRef().find('[data-role=action]').append(btn);
    }

    _self.removeActionButtons = function () {
        _self.getContentRef().find('[data-role=action]').html("");
    }

    //add content to content element
    _self.addContent = function (content) {
        var ele = _self.root.find('.' + _self.contentClass + '>[data-role=content]');
        ele.append(content);

    }

    //set content to content element, overrides any content already available
    _self.setContent = function (content) {
        var ele = _self.root.find('.' + _self.contentClass + '>[data-role=content]');
        ele.html(content);

    }
    _self.addCloseIcon = function () {
        var close = $("<span class='icon-close " + _self.closeClass + " '></span>");
        close.click(function () {
            _self.close();
            $('body').removeClass('no-scroll');
        });
        return close
    }

    _self.addRemoveIcon = function () {
        var remove = $("<span class='icon-close " + _self.closeClass + " cont-rht'></span>");
        remove.click(function () {
            _self.remove();
            $('body').removeClass('no-scroll');
        });
        return remove
    }
    /**
     *set trigger element to open popup
     *@param openRef: jquery reference of trigger element
     */
    _self.openers = function (openRef) {
        openRef.live('click', function () {
            _self.show();
        });
    }

    _self.fixZIndex = function () {
        var mx = _self.root.css('z-index');
        var modif = false;
        $('.popup-root:visible').not(_self.root).each(function () {
            if ($(this).css('z-index') >= mx) {
                mx = $(this).css('z-index');
                modif = true;
            }
        });
        (modif) ? _self.root.css('z-index', Number(mx) + 1) : '';
    }

    _self.show = function () {
        _self.showShadow();
        _self.showContent();
        _self.fixZIndex();
    }

    _self.showShadow = function () {
        _self.root.css({'height': $(document).height()}).fadeIn();
        _self.getContentRef().hide();
    }
    _self.hideShadow = function () {
        _self.close();
    }

    _self.showContent = function () {
        var windowSize = $(window).height(); // height of browser window
        var popUpHeight = _self.getContentRef().height(); // height of popup window

        _self.fixZIndex();  //when multiple popups are opened

        if (windowSize < popUpHeight) {// when browser window is smaller than pop up height
            _self.getContentRef().fadeIn().css({'top': $(document).scrollTop()});
        } else {
            _self.getContentRef().fadeIn().css({'top': $(document).scrollTop(), 'margin-top': (windowSize - popUpHeight) / 2.5 + 'px'});
        }

    }

    _self.showContentOnly = function () {
        _self.root.css({'height': 0}).show();
        _self.getContentRef().fadeIn().css({'top': $(document).scrollTop()});
    }

    _self.hideContent = function () {
        _self.hideShadow();
    }

    _self.remove = function () {
        _self.root.remove();
    }

    _self.close = function () {
        _self.root.hide();
    }
    //Event

}
/*
 * HK.alert({title:"custom",theme:HK.POPUP.THEME.ALERT,content:"Sample alert"});
 * HK.alert("Sample alert");
 */
HK.alert = function () {
    /**
     *@param content: text to be displayed
     *@param type: type of alert to be displayed
     */
    return function (settings, type) {
        if (typeof settings == undefined || settings == null) {
            settings = 'Nothing specified';
        }
        var conf = {title: 'Alert', closeType: 'remove', theme: 'popup-theme', content: '', boxSize: {'min-height': '100px', 'height': 'auto'}};
        if (typeof settings == 'string') {
            content = settings;
        }
        if (typeof settings == 'object') {
            content = settings.content;
            $.extend(conf, settings);
        }
        var pop = new PopUpUtil();
        pop.createPopUp(conf);

        pop.shadow = function () {
            pop.showShadow();
            pop.shadowUnbindClick();
        };
        pop.removeShadow = function () {
            pop.shadowBindClick();
            pop.close();
        }

        pop.removeActionButtons();
        if (type == "error") {
            pop.getContentRef().addClass('err');
        } else {
            pop.getContentRef().removeClass('err');
        }
        pop.setContent(content);
        pop.show();
        return pop;
    }

}();

