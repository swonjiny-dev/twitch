<template>
    <iframe frameborder="0"
        :id="this.channel+'chat'"
        :ref="this.channel+'chat'"
        :src="this.src"
        height="340"
        width="340">
    </iframe>
</template>

<script>
export default {
    props : {
        channel: {
            type: String,
        },
    },
    data() {
        return {
            src : `https://www.twitch.tv/embed/${this.channel}/chat`
        }
    },
}
</script>

<style>

</style>