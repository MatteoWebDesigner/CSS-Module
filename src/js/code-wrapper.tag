<code-wrapper>
    <div class={ t_collapse: !isOpen }>
        <yield/>
    </div>

    <style scoped>
        :scope { display: block }
    </style>

    <script>
        var
            self = this,
            ChannelManager = require('./channel-manager.js'),
            Events = require('./events.js'),
            Filters = require('./filters.js'),
            channelInstance = ChannelManager.subscribe(opts.channel),
            isOpenBool = opts.open === 'true' | false;
        ;

        this.Filters = Filters;

        this.isOpen = isOpenBool;

        this.message = 'Loading...';
        this.stateChange = function (tag) {
          self.message = tag + ' ready.'
          self.update()
        }

        this.init = function (data) {
            if (opts.id == data.id) {
                self.isOpen = data.status;
                self.update();
            }
        };

        // events
        myApp.on('mounted', this.stateChange);
        myApp.on('init', this.init);

        channelInstance.on(
            Events.TOGGLE_CHANGE,
            function(data) {
                if (opts.id == data.id) {
                    self.isOpen = data.status;
                    self.update();
                }
            }
        );

        this.on('mount', function(e){
            console.log('code-wrapper init',opts.id);
        });

        this.on('unmount', function () {
            //channelInstance.off('*');
        });
    </script>
</code-wrapper>