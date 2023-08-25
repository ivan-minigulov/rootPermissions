<template>
    <div class="option-container" :class="selectedComp">
        <div class="wrap-checkbox">
            <div class="checkbox">
                <i
                    v-if="!getCheck"
                    @click="updateRootPermission"
                    class="bi bi-square checkoff"
                    style="font-size: 16px; background-color: transparent"
                ></i>
                <i
                    v-if="getCheck"
                    @click="updateRootPermission"
                    class="bi bi-check2-square checkon"
                    style="font-size: 16px; background-color: transparent"
                ></i>
            </div>
        </div>
        <div class="wrap-name" @click="pushModal">
            <div class="name">
                <span>{{ name }}</span>
            </div>
            <div class="arrow-wrap">
                <span class="arrow" v-if="typeof payload !== 'string'"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: "",
        };
    },
    props: ["name", "payload", "parent", "modals"],
    methods: {
        pushModal() {
            if (typeof this.payload !== "string") {
                this.$store.dispatch("modalAdd", {
                    modalPayload: this.payload,
                    parentPayload: this.parent,
                });
            }
        },
        updateRootPermission() {
            if (typeof this.payload === "object") {
                this.$store.dispatch("updateRootPermission", {
                    payload: this.payload,
                    action: null,
                });
            } else {
                this.$store.dispatch("updateRootPermission", {
                    payload: this.parent,
                    action: this.payload,
                });
            }
        },
    },
    computed: {
        selectedComp() {
            return this.modals?.includes(this.payload) ? "selected" : "";
        },
        getCheck() {
            return (
                (typeof this.payload === "object" && this.payload.check) ||
                (typeof this.payload === "string" &&
                    this.parent.action[this.payload])
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.selected {
    background-color: #162133;
    color: azure;
}
.option-container {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 7px;
    .wrap-checkbox {
        white-space: nowrap;
        padding: 7px 0px 7px 10px;
        margin-left: 5px;
        .checkbox {
            cursor: pointer;
            .checkoff {
                color: #748797;
                &:hover {
                    color: #1dd0a8;
                }
            }
            .checkon {
                color: #1dd0a8;
                &:hover {
                    color: #748797;
                }
            }
        }
    }
    .wrap-name {
        white-space: nowrap;
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 7px;
        padding: 7px 7px 7px 0px;
        .name {
            white-space: nowrap;
            font-family: "Inter";
            font-size: 18px;
            letter-spacing: 0.3px;
            font-weight: 500;
        }
        .arrow-wrap {
            padding: 0 6px;

            .arrow {
                cursor: pointer;
                font-size: 16px;
                border: solid #748797;
                border-width: 0 2px 2px 0;
                display: inline-block;
                padding: 2.5px;
                transform: translate(0, -1.5px) rotate(-45deg);
                -webkit-transform: translate(0, -1.5px) rotate(-45deg);
            }
        }
    }
}
</style>
