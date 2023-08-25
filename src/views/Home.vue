<template>
    <div class="home-container">
        <div class="navbar">
            <span
                >Для проверки работоспособности выберите только все
                action2</span
            >
        </div>
        <div class="home-wrap">
            <div class="home-wrap-interaction-api">
                <div class="wrap-button">
                    <button @click="createPermission" class="button green">
                        Обновить права
                    </button>
                </div>
                <div class="wrap-response">
                    <div :class="getClassResponse">
                        {{ getResponse }}
                    </div>
                </div>
            </div>
            <div class="home-wrap-content">
                <div
                    class="home-wrap-content-container"
                    id="home-wrap-content-container"
                >
                    <div class="home-content-container">
                        <div class="home-content-container-option">
                            <div
                                v-for="(item, index) in modals"
                                :key="index"
                                class="home-option-field"
                            >
                                <Field
                                    :data="item"
                                    :title="item.title"
                                    :items="
                                        item.items
                                            ? Object.values(item.items)
                                            : Object.keys(item.action)
                                    "
                                    :modals="modals"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="home-content-container-header"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "@/api/api";
import Field from "../components/Field.vue";
import { mapState } from "vuex";
import { cloneObject } from "../utils/functions";

export default {
    name: "Home",
    data() {
        return {
            checkAchion2: null,
        };
    },
    computed: {
        ...mapState(["modals"]),
        getClassResponse() {
            return this.checkAchion2 === null
                ? "response initial"
                : this.checkAchion2 === false
                ? "response fail"
                : "response success";
        },
        getResponse() {
            return this.checkAchion2 === null
                ? "Нажмите обновить права"
                : this.checkAchion2 === false
                ? "Результат проверки: отрицательный!"
                : "Результат проверки: успешно!";
        },
    },
    methods: {
        getTemplates() {
            API.getTemplates().then((data) => {
                const payload = {
                    title: null,
                    items: cloneObject(data.data.rootPermissionTitles),
                };
                this.$store.dispatch(
                    "setRootPermission",
                    cloneObject(data.data.rootPermission)
                );
                this.$store.dispatch("setModalInitially", payload);
            });
        },
        createPermission() {
            this.checkAchion2 = API.createPermission(
                this.$store.state.rootPermission
            );
        },
        scrollHomeContainer() {
            const homeContainer = document.getElementById(
                "home-wrap-content-container"
            );
            homeContainer.scroll({
                left: 2000,
                behavior: "smooth",
            });
        },
    },
    mounted() {
        this.getTemplates();
        this.scrollHomeContainer();
    },
    updated() {
        this.scrollHomeContainer();
    },
    components: { Field },
};
</script>

<style lang="scss">
* {
    &::-webkit-scrollbar {
        width: 20px;
        height: 20px;
        background-color: transparent;
        border-top: 0.3px solid rgba(25, 25, 25, 0.2);
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgb(130, 149, 170);
        border-radius: 10px;
        border: 7.5px solid transparent;
        background-clip: content-box;
    }
}
.home-container {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: rgb(242, 246, 246);
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: minmax(60px, auto) 1fr;

    .navbar {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 0.3px solid rgba(25, 25, 25, 0.2);
        color: darkslategrey;
        font-size: 16px;
        text-align: center;
        min-width: min-content;
    }
    .home-wrap {
        display: grid;
        grid-template-rows: minmax(80px, auto) 1fr;

        .home-wrap-interaction-api {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 7px;
            margin: 10px 10px 0px 10px;

            .wrap-button {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .wrap-response {
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                .response {
                    background-color: white;
                    border-radius: 10px;
                    padding: 10px 15px;
                    font-size: 16px;
                }
                .success {
                    border: 1px solid green;
                    color: green;
                }
                .initial {
                    border: 1px solid darkslategray;
                    color: darkslategray;
                }
                .fail {
                    border: 1px solid red;
                    color: red;
                }
            }
        }
        .home-wrap-content {
            display: flex;
            align-items: center;
            justify-content: center;

            .home-wrap-content-container {
                position: relative;
                width: 95%;
                height: 95%;
                border-radius: 3px;
                background-color: white;
                box-shadow: 0 0 10px rgb(219, 218, 218);
                overflow-x: scroll;
                overflow-y: hidden;
                .home-content-container {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    .home-content-container-option {
                        display: flex;
                        width: 100%;
                        height: 100%;
                        .home-option-field {
                            height: 100%;
                        }
                    }
                }

                .home-content-container-header {
                    width: 100%;
                    height: 40px;
                    border-bottom: 0.3px solid rgba(25, 25, 25, 0.2);
                }
            }
        }
    }
}
</style>
