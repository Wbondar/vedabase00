/*
 * Depends on: 
 * http://vk.com/js/api/share.js?90
 */

(function() {
    jQuery(document).ready(function() {
        // Setup page.
        var selectedParagraph;

        jQuery('body').append("<div id='popup' class='popup hidden'><p>You shouldn't see this.</p></div>");
        var popUp = jQuery('#popup');

        jQuery('body').append("<span class='share hidden' ><a id='share' href='#'><i class='fa fa-bars'></i></a></span>");
        var shareAnchorContainer = jQuery('.share');
        var shareAnchor = jQuery('#share');

        doneAnchor = jQuery("<a id='done' href='#done'>Done.</a>");

        // Define functions.
        var hide = function(objectToHide) {
            objectToHide.addClass('hidden');
        };

        var popUpHide = function() {
            hide(popUp);
            popUp.animate({ "left": "-=300px" }, "0" );
        };

        var overlayHide = function() {
            jQuery("#pm-overlay").css({'display': 'none'});
            jQuery("body").animate({scrollLeft: 0}, 150);
        };

        var show = function(objectToShow) {
            objectToShow.removeClass('hidden');
        };

        var popUpShow = function() {
            if (selectedParagraph) {
                show(popUp);
                popUp.animate({ "left": shareAnchor.offset().left }, 0 );
                popUp.css({
                    top: selectedParagraph.offset().top - 1,
                });
            }
        };

        var overlayShow = function() {
            jQuery("#pm-overlay").css({'display': 'block'});
            jQuery("html,body").animate({scrollLeft: "+=300"}, 350);
        };

        var deselect = function(objectToDeselect) {
            objectToDeselect.removeClass('highlighted');
            jQuery('body').removeClass('popup-active');
            selectedParagraph = null;
            overlayHide();
            popUpHide();
        };

        /*http://habrahabr.ru/post/156185/*/
        var Share = {
            vkontakte: function(purl, ptitle, pimg, text) {
                url  = 'http://vkontakte.ru/share.php?';
                url += 'url='          + encodeURIComponent(purl);
                url += '&title='       + encodeURIComponent(ptitle);
                url += '&description=' + encodeURIComponent(text);
                url += '&image='       + encodeURIComponent(pimg);
                url += '&noparse=true';
                /*Share.popup(url);*/
                return url;
            },
            odnoklassniki: function(purl, text) {
                url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
                url += '&st.comments=' + encodeURIComponent(text);
                url += '&st._surl='    + encodeURIComponent(purl);
                /*Share.popup(url);*/
                return url;
            },
            facebook: function(purl, ptitle, pimg, text) {
                url  = 'http://www.facebook.com/sharer.php?s=100';
                url += '&p[title]='     + encodeURIComponent(ptitle);
                url += '&p[summary]='   + encodeURIComponent(text);
                url += '&p[url]='       + encodeURIComponent(purl);
                url += '&p[images][0]=' + encodeURIComponent(pimg);
                /*Share.popup(url);*/
                return url;
            },
            twitter: function(purl, ptitle) {
                url  = 'http://twitter.com/share?';
                url += 'text='      + encodeURIComponent(ptitle);
                url += '&url='      + encodeURIComponent(purl);
                url += '&counturl=' + encodeURIComponent(purl);
                /*Share.popup(url);*/
                return url;
            },
            mailru: function(purl, ptitle, pimg, text) {
                url  = 'http://connect.mail.ru/share?';
                url += 'url='          + encodeURIComponent(purl);
                url += '&title='       + encodeURIComponent(ptitle);
                url += '&description=' + encodeURIComponent(text);
                url += '&imageurl='    + encodeURIComponent(pimg);
                return url;
            },
            plusgoogle: function (purl)
            {
                url  = 'https://plus.google.com/share?';
                url += 'url=' + encodeURIComponent(purl);
                return url;
            },

            popup: function(url) {
                window.open(url,'','toolbar=0,status=0,width=626,height=436');
            }
        };

        var generatePopUpContent = function (paragraph)
        {
            /* Move anchor to different location
             * in order to keep it's event handler alive
             * when content of the pop-up will be cleared.
             */
            console.assert("Done anchor is missing.", !doneAnchor);
            jQuery('body').after(doneAnchor);
            hide(doneAnchor);

            /* Remove content of the pop-up,
             * in order to avoid duplications.
             */
            console.assert("Pop-up is missing.", !popUp);
            popUp.contents().replaceWith("");

            /* 
             * Generate content of the pop-up.
             */
            console.assert("Paragraph is missing at generating content of the pop-up.", !paragraph);
            popUp.append
            (
              "<ul>\
                <li><a href='" + Share.vkontakte(document.URL + '#' + paragraph.attr('id'), document.title, 'http://preacher.hari.ru/images/iskcon-logo.jpg', paragraph.text( )) + "'>Share VK.</a></li>\
                <li><a href='" + Share.facebook(document.URL + '#' + paragraph.attr('id'), document.title, 'http://preacher.hari.ru/images/iskcon-logo.jpg', paragraph.text( )) + "'>Share Facebook.</a></li>\
                <li><a href='" + Share.twitter(document.URL + '#' + paragraph.attr('id'), document.title) + "'>Share Twitter.</a></li>\
                <li><a href='" + Share.plusgoogle(document.URL + '#' + paragraph.attr('id')) + "'>Share Google+.</a></li>\
                </ul>"
            );
            show(doneAnchor);
            popUp.append(doneAnchor);
        }

        var select = function (objectToSelect) {
            if (selectedParagraph) {
                deselect(selectedParagraph);
            }
            objectToSelect.addClass('highlighted');
            selectedParagraph = objectToSelect;

            jQuery('body').addClass('popup-active');

            overlayShow();
            generatePopUpContent(objectToSelect);
            popUpShow();
        };

        // Define event handlers.
        shareAnchor.on('click', function() {
            var paragraphId = jQuery(this).attr('href');
            var paragraph = jQuery(paragraphId);

            select(paragraph);

            return false;
        });
        jQuery("#pm-overlay").on('click', function() {
            deselect(selectedParagraph);
            return false;
        });

        doneAnchor.on('click', function() {
            deselect(selectedParagraph);
            return false;
        });

        jQuery('div.record').hover(function() {
            if (!jQuery('body').hasClass('popup-active') & !jQuery(this).hasClass('highlighted')) {
                jQuery(this).find(".ri").append(shareAnchorContainer);
                shareAnchor.attr('href', '#' + jQuery(this).attr('id'));
                show(shareAnchor);
                show(shareAnchorContainer);
            }
        }, function() {});

        jQuery(window).resize(function() {
            popUpShow();
        });
    });
})();
