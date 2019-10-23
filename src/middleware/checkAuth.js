import store from "@/store";

export default function auth({ next, router }) {
  if (!store.getters.isAuthenticate) {
    return router.push({ name: "login" });
  }
  return next();
}
