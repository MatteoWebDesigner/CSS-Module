<copy-button>
    <span class="btn btn-default btn-xs">
        copy code
    </span>

    <style scoped>
        :scope { display: block }
    </style>

    <script>
        var
            self = this,
            ChannelManager = require('./channel-manager.js'),
            Events = require('./events.js'),
            channelInstance = ChannelManager.subscribe(opts.channel),
            clipboard;

        this.init = function (data) { // you need to wait the code to be ready
            if (opts.id == data.id) {
                clipboard = new Clipboard(self.root, {
                    target: function(trigger) {
                        return data.dom;
                    }
                });
            }
        };

        // events
        channelInstance.on(
            Events.CODE_READY,
            this.init
        )
    </script>
</copy-button>