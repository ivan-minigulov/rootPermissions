<template>
    <div class="field">
        <div class="title">{{ title }}</div>
        <div class="container-option">
            <div v-for="(item, index) in items" :key="index">
                <Option
                    :class="item?.title ? 'option-part' : 'opion-action'"
                    :name="item?.title ? item.title : item"
                    :payload="item"
                    :parent="data"
                    :modals="modals"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Option from "./Option.vue";

export default {
    name: "Field",
    props: ["data", "title", "items", "modals"],
    methods: {},
    components: { Option },
};
</script>

<style lang="scss" scoped>
.field {
    height: 100%;
    width: max-content;
    display: grid;
    grid-template-rows: 40px 1fr;
    .title {
        font-size: 14px;
        font-weight: bolder;
        height: 100%;
        width: 100%;
        white-space: nowrap;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;

        padding: 0 10px 5px 10px;
        box-sizing: border-box;
    }
    .container-option {
        height: 100%;
        width: 100%;
        border-right: 0.3px solid rgba(25, 25, 25, 0.2);
        border-top: 0.3px solid rgba(25, 25, 25, 0.2);
        overflow-y: auto;
        .option-part {
            height: max-content;
            cursor: pointer;
            &:hover {
                background-color: #162133;
                color: azure;
            }
        }
        .opion-action {
            height: max-content;
            cursor: default;
        }
    }
}
</style>
