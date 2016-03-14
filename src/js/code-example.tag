<code-example>
    <yield/>

    <script>
        var ChannelManager = require('./channel-manager.js'),
            Events = require('./events.js'),
            channelInstance = ChannelManager.subscribe(opts.channel),
            elmString,
            codeDOM
        ;

        this.init = function () {
            codeDOM = this.root.querySelector('pre code');
            elmString = codeDOM.innerHTML;

            // convert < to &lt;
            elmString = elmString.replace(/\</g, '&lt;');
            elmString = elmString.replace(/\>/g, '&gt;');

            // inject back
            codeDOM.innerHTML = elmString;

            channelInstance.trigger(
                Events.CODE_READY,
                {
                    id: opts.id,
                    dom: codeDOM
                }
            )
        };

        this.on('mount', this.init);
    </script>
</code-example>