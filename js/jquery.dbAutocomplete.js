(function($)
{
    // Things left to do
    // TODO: block unnecessary API calls on non-type key press
    // TODO: mouse hover select

	$.fn.dbAutocomplete = function(options)
	{
        var self = this;

        //var keys = [9, 13, 17, 18, 19, 20, 16, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];

        // Set options
        self.options = $.extend({
            source: 'https://www.deskbookers.com/en-gb/sa2.json',
            name: 'autocomplete dropdown-menu',
            minchars: 1,
            css: {
                top:   self.offset().top + self.outerHeight() - 2 + 'px',
                left:  self.offset().left + 'px',
                width: self.outerWidth()  + 'px',
                position: "absolute"
            }
        }, options || {});


        // set variables
        self.list = '';
        self.delay = function(){};
        self.selected = 0;
        self.attr('autocomplete', "off");

        // create list
        self.list = $('<ul />', {'class': self.options.name, css: self.options.css}).appendTo('body');


        // actions
        var actions = function () {
            return {
                // keypress actions
                init:function(which){
                    if (which == 40) {
                        this.select();
                        if (self.selected < self.list.children().length - 1) {
                            self.selected++;
                        } else {
                            self.selected = 0;
                        }
                    } else if (which == 38) {
                        if (self.selected > 0) {
                            self.selected--;
                        } else {
                            self.selected = self.list.children().length - 1;
                        }
                        this.select();
                    } else if (which == 13) {
                        this.assign();
                    } else if (which == 27) {
                        this.clear();
                    }
                },
                // clear list
                clear: function () {
                    self.list.empty();
                    self.list.hide();
                },
                // append suggestions
                append: function (data) {
                    this.clear();

                    var li = [];

                    // assign no results element
                    if (data.length < 1) {
                        li.push('<li>No results found</li>');
                    }

                    $.each(data, function(i, e){
                        li.push('<li>'+ e.full+'</li>');
                    });

                    $(li.join('')).appendTo(self.list);

                    self.list.show();
                },
                // select suggestion
                select: function () {
                    self.list.children().removeClass('active');
                    self.list.children().eq(self.selected).addClass('active');
                },
                // assign suggestion
                assign: function () {
                    self.val($.trim(self.list.children().eq(self.selected).text()));
                    this.clear();
                }
            };
        }();

        // on keypress
        self.on({
            keyup: function(e)
            {
                clearTimeout(self.delay);
                var value = $.trim(self.val());

                // check if input more than minchars
                if (value.length < self.options.minchars) {
                    actions.clear();
                    return false;
                }

                // check special keys for action
                if (e.which == 40 || e.which == 38 || e.which == 13 || e.which == 27) {
                    e.preventDefault();
                    actions.init(e.which);
                    return false;
                }

                // get data results
                self.delay = setTimeout(function() {
                    $.ajax({
                        method: 'GET',
                        url: self.options.source,
                        dataType: "json",
                        data: {
                            q:value
                        },
                        success: function (response) {
                            actions.append(response);
                        }
                    });
                }, 100);
            }
        });
    };

})(jQuery);



