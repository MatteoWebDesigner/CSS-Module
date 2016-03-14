<toggle-button>
    <span class="btn btn-default btn-xs" onclick="{ toggle }">
        <span if={ !toggleState } >show code</span>
        <span if={ toggleState } >hide code</span>
    </span>

    <style scoped>
        :scope { display: block }
    </style>

    <script>
        var
            self = this,
            ChannelManager = require('./channel-manager.js'),
            Events = require('./events.js'),
            channelInstance = ChannelManager.subscribe(opts.channel);

        this.toggleState = false;

        this.toggle = function (e) {
            this.toggleState = !this.toggleState;

            channelInstance.trigger(
                Events.TOGGLE_CHANGE,
                {
                    id: opts.id,
                    status: self.toggleState
                }
            );
        };

        // events
        this.one('mount', function(e){
            myApp.trigger('mounted', 'toogle-button');
            myApp.trigger('init', {
                id: opts.id,
                status: self.toggleState
            });

            console.log('toogle-button init',opts.id);
        });

        this.one('unmount', function () {
            //channelInstance.off('*');
        });
    </script>
</toggle-button>