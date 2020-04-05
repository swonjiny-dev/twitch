<template>
    <!-- <div ref="player"  :id="this.channel+'stream'"></div> -->
    <iframe
        :src="this.src"
        :height="this.height"
        :width="this.width"
        frameborder="0"
        :id="this.channel+'stream'"
        :ref="this.channel+'stream'">
    </iframe> 
</template>

<script>
// 주석부분은 iframe 방식의 player 플러그인 사용부분이다.
// import Vue from 'vue';
// import LoadScript from 'vue-plugin-load-script';
// Vue.use(LoadScript);

export default {
    name : "twitch-play",
    props : {
        width: {
            type: String,
            default: '340',
        },
        height: {
            type: String,
            default: '340',
        },
        channel: {
            type: String,
        },
        layout: {
            type: String,
            default: 'video',
        },
        theme: {
            type: String,
            default: 'dark',
        },

    },
    data() {
        return {
            // src : `https://player.twitch.tv/?${this.channel}`
           src : `http://player.twitch.tv?channel=${this.channel}`
           
        }
    },

    
    // beforeCreate() {
    //     Vue.loadScript("https://embed.twitch.tv/embed/v1.js")
    // .then(()=>{
    //     const embed = new Twitch.Embed(this.$refs.player, {
    //         width : this.width,
    //         height : this.height,
    //         channel : this.channel,
    //         layout : this.layout,
    //         autoplay: false
    //   });
    //   embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    //     var player = embed.getPlayer();
    //     player.play();
    //   });
    // }).catch((e) => {
    //     console.error(e);
    //     // 에러처리로직 추가예정
    // });
    // },
}
</script>

<style>

</style>