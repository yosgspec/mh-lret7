import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/Index.vue";
import Readme from "@/views/Readme.vue";

Vue.use(VueRouter);

const routes=[
	{
		path: "/",
		name: "Index",
		component: Index
	},
	{
		path: "/readme/",
		name: "Readme",
		component: Readme
	}
];

const router=new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
