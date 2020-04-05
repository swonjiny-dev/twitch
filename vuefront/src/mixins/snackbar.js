export const snackbar = {
    methods: {
        alarmMessage(msg){
            this.$emit('alarmSnack' , msg);
        },
        errorMessage(msg){
            this.$emit('errorSnack' , msg);
        }
    },
}