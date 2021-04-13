<template>
    <div id="app">
        <component :is="layout">
            <router-view />
        </component>
    </div>
</template>
<style lang="scss">
    body {
        font-family: 'Ruslan Display', cursive;
    }

    input,
    textarea,
    button {
        font-family: 'Ruslan Display', cursive;
        outline: none;
    }

    .container {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-image: url('./assets/images/bg.jpg');
        background-size: cover;
        background-attachment: fixed;
        background-repeat: no-repeat;

        .link {
            text-decoration: none;
            color: #0DD208;
            display: block;
            margin-top: 1em;

            @media (max-width: 768px) {
                font-size: 12px;
            }
        }

        .sm-container {
            width: 50%;
            margin: 50px auto;
            padding: 1em;
            display: flex;
            justify-content: center;
            flex-direction: column;

            @media (max-width: 768px) {
                input {
                    font-size: 12px;
                }
            }
        }

        .md-container {
            width: 80%;
            margin: 50px auto;
            padding: 1em;
            background-color: #B67D5A;
            display: flex;
            flex-direction: column;
            text-align: center;
        }

        form {
            background-color: #D8D8D8;
            padding: 1em;

            .form-group {
                display: flex;
                flex-direction: column;
                margin-top: 1em;
            }

            input, button {
               padding: .5em 1em;
               outline: none;
            }

            button {
                margin-top: 1em;
                cursor: pointer;
                border: none;
                background-color: #0DD208;
                color: #fff;
                transition: .2s;

                &:hover {
                    background-color: darken(#0DD208, 20%);
                }
            }

            .invalid {
                color: #f00;
                border: 1px solid #f00;
            }

            .error-message {
                color: #f00;
                padding: .5em 0;
            }
        }
    }

    .mini-game-container {
        width: 90%;
        min-height: 600px;
        margin: 1em auto;
        background-color: #683717;
        position: relative;
        user-select: none;

        .mini-game-result {
            width: 100%;
            color: #FF0000;
            position: absolute;
            bottom: 0;
            text-align: center;

            @media (max-width: 768px) {
                font-size: 16px;
            }
        }
    }
</style>
<script>
const MainLayout = () => import('@/views/layouts/MainLayout');
const EmptyLayout = () => import('@/views/layouts/EmptyLayout');

export default {
    computed:{
        layout() {
           if(this.$route.meta.layout) {
                return `${this.$route.meta.layout}-layout`;
            }
        }
    },
    components: {
        MainLayout, EmptyLayout
    }
}
</script>