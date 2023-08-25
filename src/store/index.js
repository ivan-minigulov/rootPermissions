import { createStore } from "vuex";
import { getActionsInitially, updateRootPermission } from "../utils/functions";

export default createStore({
    state: {
        modals: [],
        rootPermission: {},
    },
    getters: {
        modals: (state) => state.modals,
        rootPermission: (state) => state.rootPermission,
    },
    mutations: {
        SET_MODAL_INITIALLY: (state, payload) => {
            getActionsInitially(payload, state.rootPermission);
            state.modals.push(payload);
        },
        SET_MODAL: (state, { modalPayload, parentPayload = null }) => {
            if (!state.modals.includes(modalPayload)) {
                const indexParent = state.modals.indexOf(parentPayload);
                if (indexParent !== -1) {
                    state.modals.splice(indexParent + 1, state.modals.length);
                }
                state.modals.push(modalPayload);
            }
        },
        DELETE_MODAL: (state, response) => {
            state.modals.splice(response, 1);
        },
        SET_ROOT_PERMISSION: (state, root) => {
            state.rootPermission = root;
        },
        UPDATE_ROOT_PERMISSION: (state, { payload, action = null }) => {
            updateRootPermission(state.modals, payload, action);
        },
    },
    actions: {
        modalAdd: ({ commit }, modalData) => {
            commit("SET_MODAL", modalData);
        },
        modalClose: ({ commit, state }, modalKey = state.modals.length - 1) => {
            commit("DELETE_MODAL", modalKey);
        },
        setRootPermission: ({ commit }, root) => {
            commit("SET_ROOT_PERMISSION", root);
        },
        updateRootPermission: ({ commit }, payload) => {
            commit("UPDATE_ROOT_PERMISSION", payload);
        },
        setModalInitially: ({ commit }, payload) => {
            commit("SET_MODAL_INITIALLY", payload);
        },
    },
});
