<component-wrapper>
    <yield/>

    <script>
        var
            self = this,
            ChannelManager = require('./channel-manager.js'),
            Events = require('./events.js'),
            channelInstance = ChannelManager.subscribe(opts.channel)
        ;

        myApp = this;

        // events
        this.on('mount', function(e){
            console.log('component-wrapper init',opts.id);
        });

        this.on('unmount', function () {

        });
    </script>
</component-wrapper>