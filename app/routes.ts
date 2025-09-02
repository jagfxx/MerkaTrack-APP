import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("lists", "lists/lists.tsx"),
    route("lists/:id", "lists/[id]/page.tsx"),
    route("stats", "stats/stats.tsx"),
    route("expenses", "expenses/expenses.tsx"),
    route("settings", "settings/settings.tsx"),
] satisfies RouteConfig;
